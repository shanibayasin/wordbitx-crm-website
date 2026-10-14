import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase, disconnectFromDatabase, validateMongoUri } from '../../src/lib/mongodb.ts';
import {
  Customer,
  Invoice,
  Lead,
  Membership,
  Organization,
  Payment,
  User,
} from '../../src/models/index.ts';
import { findByIdInOrganization, findManyInOrganization } from '../../src/services/tenantRecords.ts';

let mongo: MongoMemoryServer;
let uri: string;

before(async () => {
  process.env.NODE_ENV = 'test';
  mongo = await MongoMemoryServer.create({
    binary: { version: '8.2.6' },
    instance: {
      dbName: `wordbitx_test_${process.pid}`,
      launchTimeout: 60_000,
    },
  });
  uri = mongo.getUri(`wordbitx_test_${process.pid}`);
  await connectToDatabase(uri);
  await Promise.all(Object.values({
    Organization, User, Membership, Customer, Lead, Invoice, Payment,
  }).map((model) => model.init()));
});

after(async () => {
  await disconnectFromDatabase();
  await mongo?.stop();
});

test('rejects missing, malformed, and non-test database configuration in tests', () => {
  assert.throws(() => validateMongoUri(undefined, 'test'), /MONGODB_URI is required/);
  assert.throws(() => validateMongoUri('not-a-uri', 'test'), /URI is invalid/);
  assert.throws(
    () => validateMongoUri('mongodb://localhost/production', 'test'),
    /must start with "wordbitx_test_"/,
  );
  assert.throws(
    () => validateMongoUri('mongodb://localhost/wordbitx_test_not-for-prod', 'production'),
    /cannot be used outside the test environment/,
  );
});

test('persists tenant records and never returns another organization record by known id', async () => {
  const [organizationA, organizationB, user] = await Promise.all([
    Organization.create({ name: 'Test A', slug: `test-a-${process.pid}`, defaultCurrency: 'USD' }),
    Organization.create({ name: 'Test B', slug: `test-b-${process.pid}`, defaultCurrency: 'EUR' }),
    User.create({ email: `db-test-${process.pid}@example.invalid`, displayName: 'Test User' }),
  ]);
  const lead = await Lead.create({
    organizationId: organizationA._id,
    createdBy: user._id,
    name: 'Isolated Lead',
    company: 'Example',
    currency: 'USD',
    ownerId: user._id,
  });

  assert.equal((await findByIdInOrganization(Lead, lead._id, organizationA._id))?.id, lead.id);
  assert.equal(await findByIdInOrganization(Lead, lead._id, organizationB._id), null);
  assert.equal((await findManyInOrganization(Lead, organizationB._id)).length, 0);

  await disconnectFromDatabase();
  await connectToDatabase(uri);
  assert.equal(await Lead.exists({ _id: lead._id, organizationId: organizationA._id }) !== null, true);
});

test('enforces membership uniqueness and requires tenant and creator on CRM records', async () => {
  const organization = await Organization.create({
    name: 'Membership Org',
    slug: `membership-${process.pid}`,
    defaultCurrency: 'USD',
  });
  const user = await User.create({
    email: `member-${process.pid}@example.invalid`,
    displayName: 'Member',
  });
  await Membership.create({
    organizationId: organization._id,
    userId: user._id,
    role: 'Sales Manager',
    status: 'Active',
  });
  await assert.rejects(
    Membership.create({
      organizationId: organization._id,
      userId: user._id,
      role: 'Sales Manager',
      status: 'Active',
    }),
    { code: 11000 },
  );
  await assert.rejects(
    Lead.create({
      createdBy: user._id,
      name: 'No Tenant',
      company: 'Example',
      currency: 'USD',
      ownerId: user._id,
    }),
    /organizationId/,
  );
});

test('validates invoice currency snapshots and stores payments as separate tenant records', async () => {
  const organization = await Organization.create({
    name: 'Billing Org',
    slug: `billing-${process.pid}`,
    defaultCurrency: 'USD',
  });
  const user = await User.create({
    email: `billing-${process.pid}@example.invalid`,
    displayName: 'Billing User',
  });
  const customer = await Customer.create({
    organizationId: organization._id,
    createdBy: user._id,
    name: 'Test Customer',
    company: 'Example Ltd',
    totalSpentCurrency: 'USD',
    ownerId: user._id,
  });
  const invoice = await Invoice.create({
    organizationId: organization._id,
    createdBy: user._id,
    invoiceNumber: `INV-${process.pid}`,
    customerId: customer._id,
    issueDate: new Date('2026-01-01T00:00:00Z'),
    dueDate: new Date('2026-02-01T00:00:00Z'),
    items: [{ description: 'Service snapshot', quantity: 3, unitPrice: '0.1' }],
    subtotal: '0.3',
    taxAmount: 0,
    totalAmount: '0.3',
    paidAmount: 0,
    balanceDue: '0.3',
    currency: 'EUR',
    exchangeRate: {
      baseCurrency: 'EUR',
      quoteCurrency: 'USD',
      rate: '1.1',
      source: 'test-provider',
      fetchedAt: new Date('2026-01-01T00:00:00Z'),
    },
  });
  const payment = await Payment.create({
    organizationId: organization._id,
    createdBy: user._id,
    invoiceId: invoice._id,
    amount: '0.1',
    currency: 'EUR',
    paidAt: new Date('2026-01-10T00:00:00Z'),
    method: 'Wire Transfer',
    recordedBy: user._id,
  });

  assert.equal(payment.invoiceId.toString(), invoice._id.toString());
  assert.equal(payment.amount?.toString(), '0.1');
  assert.equal(invoice.totalAmount?.toString(), '0.3');
  assert.equal(invoice.exchangeRate?.rate?.toString(), '1.1');

  const invalidPayment = new Payment({
    ...payment.toObject(),
    amount: '-0.1',
  });
  await assert.rejects(invalidPayment.validate(), { name: 'ValidationError' });

  const invalidCurrencyInvoice = new Invoice({
    ...invoice.toObject(),
    invoiceNumber: `INV-INVALID-${process.pid}`,
    currency: 'CAD',
  });
  await assert.rejects(invalidCurrencyInvoice.validate(), { name: 'ValidationError' });
});

test('organization scope cannot be overridden by an untrusted filter', async () => {
  const [organizationA, organizationB, user] = await Promise.all([
    Organization.create({ name: 'Scope A', slug: `scope-a-${process.pid}`, defaultCurrency: 'USD' }),
    Organization.create({ name: 'Scope B', slug: `scope-b-${process.pid}`, defaultCurrency: 'USD' }),
    User.create({ email: `scope-${process.pid}@example.invalid`, displayName: 'Scope User' }),
  ]);
  await Lead.create({
    organizationId: organizationA._id,
    createdBy: user._id,
    name: 'Must not leak',
    company: 'Example',
    currency: 'USD',
    ownerId: user._id,
  });

  const conflictingFilter = JSON.parse(JSON.stringify({ organizationId: organizationA._id }));
  const results = await findManyInOrganization(Lead, organizationB._id, conflictingFilter);
  assert.equal(results.length, 0);
});
