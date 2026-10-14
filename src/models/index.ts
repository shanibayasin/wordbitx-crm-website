import { model, models, Schema, Types } from 'mongoose';

const organizationOwned = {
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
};

const timestamps = { timestamps: true, strict: 'throw' as const };

const organizationSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, lowercase: true, trim: true, unique: true },
  defaultCurrency: { type: String, required: true, enum: ['USD', 'EUR', 'GBP', 'PKR', 'JPY', 'AUD'] },
}, timestamps);

const userSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  displayName: { type: String, required: true, trim: true, maxlength: 160 },
  passwordHash: { type: String, select: false },
  status: { type: String, required: true, enum: ['Active', 'Suspended'], default: 'Active' },
}, timestamps);

const membershipSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Sales Manager', 'Account Executive', 'SDR Lead', 'Billing Specialist', 'Support Agent'],
  },
  status: { type: String, required: true, enum: ['Active', 'Invited', 'Suspended'], default: 'Invited' },
  department: { type: String, trim: true, maxlength: 100 },
  joinedAt: Date,
}, timestamps);
membershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

const invitationSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, required: true, enum: ['Admin', 'Sales Manager', 'Account Executive', 'SDR Lead', 'Billing Specialist', 'Support Agent'] },
  tokenHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true },
  acceptedAt: Date,
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, timestamps);
invitationSchema.index({ organizationId: 1, email: 1, acceptedAt: 1 });

const tenantSchema = (definition: Record<string, unknown>, indexes: Array<[Record<string, 1 | -1>, Record<string, unknown>?]> = []) => {
  const schema = new Schema({ ...organizationOwned, ...definition }, timestamps);
  for (const [fields, options] of indexes) schema.index(fields, options);
  return schema;
};

const currency = ['USD', 'EUR', 'GBP', 'PKR', 'JPY', 'AUD'];
const nonNegativeDecimal = {
  type: Schema.Types.Decimal128,
  required: true,
  validate: {
    validator: (value: { toString(): string }) => /^(?:\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value.toString()),
    message: 'Value must be a non-negative decimal.',
  },
};
const currencySnapshotSchema = new Schema({
  baseCurrency: { type: String, required: true, enum: currency },
  quoteCurrency: { type: String, required: true, enum: currency },
  rate: nonNegativeDecimal,
  source: { type: String, required: true, trim: true, maxlength: 120 },
  fetchedAt: { type: Date, required: true },
}, { _id: false, strict: 'throw' });

const leadSchema = tenantSchema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  title: { type: String, trim: true, maxlength: 160 },
  company: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 40 },
  source: { type: String, trim: true },
  status: { type: String, required: true, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Disqualified', 'Converted'], default: 'New' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  score: { type: Number, min: 0, max: 100, default: 0 },
  dealEstimate: { ...nonNegativeDecimal, required: false, default: '0' },
  currency: { type: String, required: true, enum: currency },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, maxlength: 20_000 },
  industry: String,
  location: String,
  convertedCustomerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  convertedDealId: { type: Schema.Types.ObjectId, ref: 'Deal' },
}, [[{ organizationId: 1, status: 1 }], [{ organizationId: 1, email: 1 }]]);

const customerSchema = tenantSchema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  company: { type: String, required: true, trim: true, maxlength: 200 },
  email: { type: String, lowercase: true, trim: true },
  phone: String,
  industry: String,
  location: String,
  status: { type: String, required: true, enum: ['Active', 'Onboarding', 'At Risk', 'Inactive'], default: 'Onboarding' },
  totalSpent: { ...nonNegativeDecimal, required: false, default: '0' },
  totalSpentCurrency: { type: String, required: true, enum: currency },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  website: String,
  notes: { type: String, maxlength: 20_000 },
  originalLeadId: { type: Schema.Types.ObjectId, ref: 'Lead' },
});

const dealSchema = tenantSchema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  company: { type: String, required: true, trim: true, maxlength: 200 },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  amount: nonNegativeDecimal,
  currency: { type: String, required: true, enum: currency },
  amountInBaseCurrency: { ...nonNegativeDecimal, required: false },
  exchangeRate: currencySnapshotSchema,
  stage: { type: String, required: true, enum: ['discovery', 'qualified', 'technical_review', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'] },
  probability: { type: Number, min: 0, max: 100, default: 0 },
  expectedClose: Date,
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contactName: String,
  contactEmail: String,
  notes: { type: String, maxlength: 20_000 },
  productIds: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    validate: (products: unknown[]) => products.length <= 500,
  },
  lossReason: String,
}, [[{ organizationId: 1, stage: 1 }]]);

const productSchema = tenantSchema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  sku: { type: String, required: true, trim: true, uppercase: true },
  category: { type: String, required: true },
  unitPrice: nonNegativeDecimal,
  currency: { type: String, required: true, enum: currency },
  taxRate: { type: Number, min: 0, max: 100, default: 0 },
  active: { type: Boolean, default: true },
  description: { type: String, maxlength: 20_000 },
}, [[{ organizationId: 1, sku: 1 }, { unique: true }]]);

const lineItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  quantity: { type: Number, required: true, min: Number.MIN_VALUE },
  unitPrice: nonNegativeDecimal,
  taxRate: { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false, strict: 'throw' });

const boundedLineItems = () => ({
  type: [lineItemSchema],
  required: true,
  validate: {
    validator: (items: unknown[]) => items.length > 0 && items.length <= 500,
    message: 'Documents must contain between 1 and 500 line items.',
  },
});

const quotationSchema = tenantSchema({
  quoteNumber: { type: String, required: true, trim: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  issueDate: { type: Date, required: true },
  expiryDate: Date,
  status: { type: String, required: true, enum: ['Draft', 'Sent', 'Accepted', 'Declined', 'Converted'], default: 'Draft' },
  items: boundedLineItems(),
  subtotal: nonNegativeDecimal,
  taxAmount: nonNegativeDecimal,
  discountAmount: { ...nonNegativeDecimal, required: false, default: '0' },
  grandTotal: nonNegativeDecimal,
  currency: { type: String, required: true, enum: currency },
  exchangeRate: currencySnapshotSchema,
  notes: { type: String, maxlength: 20_000 },
  convertedOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  convertedInvoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
}, [[{ organizationId: 1, quoteNumber: 1 }, { unique: true }]]);

const orderSchema = tenantSchema({
  orderNumber: { type: String, required: true, trim: true },
  quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, required: true, enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], default: 'Pending' },
  items: boundedLineItems(),
  total: nonNegativeDecimal,
  currency: { type: String, required: true, enum: currency },
  exchangeRate: currencySnapshotSchema,
}, [[{ organizationId: 1, orderNumber: 1 }, { unique: true }]]);

const invoiceSchema = tenantSchema({
  invoiceNumber: { type: String, required: true, trim: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, required: true, enum: ['Paid', 'Pending', 'Partially Paid', 'Overdue', 'Draft'], default: 'Draft' },
  items: boundedLineItems(),
  subtotal: nonNegativeDecimal,
  taxAmount: nonNegativeDecimal,
  discountAmount: { ...nonNegativeDecimal, required: false, default: '0' },
  totalAmount: nonNegativeDecimal,
  paidAmount: { ...nonNegativeDecimal, required: false, default: '0' },
  balanceDue: nonNegativeDecimal,
  currency: { type: String, required: true, enum: currency },
  exchangeRate: currencySnapshotSchema,
  notes: { type: String, maxlength: 20_000 },
}, [[{ organizationId: 1, invoiceNumber: 1 }, { unique: true }]]);

const paymentSchema = tenantSchema({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { ...nonNegativeDecimal, required: true, validate: {
    validator: (value: { toString(): string }) => /^(?!0(?:\.0+)?$)(?:\d+)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value.toString()),
    message: 'Payment amount must be greater than zero.',
  } },
  currency: { type: String, required: true, enum: currency },
  exchangeRate: currencySnapshotSchema,
  paidAt: { type: Date, required: true },
  method: { type: String, required: true, enum: ['Wire Transfer', 'Credit Card', 'ACH', 'Bank Deposit'] },
  reference: { type: String, trim: true, maxlength: 200 },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, maxlength: 10_000 },
}, [[{ organizationId: 1, invoiceId: 1, paidAt: -1 }]]);

const taskSchema = tenantSchema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, maxlength: 20_000 },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo' },
  dueDate: Date,
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  relatedType: { type: String, enum: ['lead', 'deal', 'customer', 'ticket'] },
  relatedId: Schema.Types.ObjectId,
  completedAt: Date,
}, [[{ organizationId: 1, status: 1, dueDate: 1 }]]);

const meetingSchema = tenantSchema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  attendeeIds: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    validate: (attendees: unknown[]) => attendees.length <= 100,
  },
  clientCompany: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  meetingLink: String,
  notes: { type: String, maxlength: 20_000 },
});

const ticketSchema = tenantSchema({
  ticketNumber: { type: String, required: true, trim: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  subject: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, maxlength: 20_000 },
  category: { type: String, required: true, enum: ['Billing', 'Technical', 'Integration', 'Feature Request', 'Account Access'] },
  priority: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Urgent'] },
  status: { type: String, required: true, enum: ['Open', 'In Progress', 'Pending', 'Resolved', 'Closed'], default: 'Open' },
  assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
  slaHours: { type: Number, min: 0 },
}, [[{ organizationId: 1, ticketNumber: 1 }, { unique: true }]]);

const ticketMessageSchema = tenantSchema({
  ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isStaff: { type: Boolean, required: true },
  content: { type: String, required: true, maxlength: 20_000 },
}, [[{ organizationId: 1, ticketId: 1, createdAt: 1 }]]);

const callRecordingSchema = tenantSchema({
  direction: { type: String, required: true, enum: ['Incoming', 'Outgoing'] },
  outcome: { type: String, required: true, enum: ['Connected', 'Voicemail', 'Busy', 'Follow-up Scheduled', 'Gatekeeper'] },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  repId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, required: true },
  durationSeconds: { type: Number, min: 0 },
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Needs Attention'] },
  title: { type: String, maxlength: 300 },
  summary: { type: String, maxlength: 20_000 },
  consentObtained: { type: Boolean, required: true },
  storageKey: { type: String, select: false },
  storageProvider: { type: String, select: false },
  retentionUntil: Date,
  deletedAt: Date,
}, [[{ organizationId: 1, startedAt: -1 }]]);

const callTranscriptSegmentSchema = tenantSchema({
  callId: { type: Schema.Types.ObjectId, ref: 'CallRecording', required: true },
  timestampMs: { type: Number, required: true, min: 0 },
  speaker: { type: String, required: true, maxlength: 160 },
  text: { type: String, required: true, maxlength: 5_000 },
}, [[{ organizationId: 1, callId: 1, timestampMs: 1 }]]);

const currencyRateSchema = tenantSchema({
  baseCurrency: { type: String, required: true, enum: currency },
  quoteCurrency: { type: String, required: true, enum: currency },
  rate: nonNegativeDecimal,
  provider: { type: String, required: true, trim: true, maxlength: 120 },
  fetchedAt: { type: Date, required: true },
}, [[{ organizationId: 1, baseCurrency: 1, quoteCurrency: 1, fetchedAt: -1 }]]);

const auditLogSchema = tenantSchema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true, trim: true, maxlength: 160 },
  module: { type: String, required: true, maxlength: 80 },
  resourceId: Schema.Types.ObjectId,
  details: { type: Schema.Types.Mixed, default: {} },
  ipAddress: String,
}, [[{ organizationId: 1, createdAt: -1 }]]);

export const Organization = models.Organization ?? model('Organization', organizationSchema);
export const User = models.User ?? model('User', userSchema);
export const Membership = models.Membership ?? model('Membership', membershipSchema);
export const Invitation = models.Invitation ?? model('Invitation', invitationSchema);
export const Lead = models.Lead ?? model('Lead', leadSchema);
export const Customer = models.Customer ?? model('Customer', customerSchema);
export const Deal = models.Deal ?? model('Deal', dealSchema);
export const Product = models.Product ?? model('Product', productSchema);
export const Quotation = models.Quotation ?? model('Quotation', quotationSchema);
export const Order = models.Order ?? model('Order', orderSchema);
export const Invoice = models.Invoice ?? model('Invoice', invoiceSchema);
export const Payment = models.Payment ?? model('Payment', paymentSchema);
export const Task = models.Task ?? model('Task', taskSchema);
export const Meeting = models.Meeting ?? model('Meeting', meetingSchema);
export const Ticket = models.Ticket ?? model('Ticket', ticketSchema);
export const TicketMessage = models.TicketMessage ?? model('TicketMessage', ticketMessageSchema);
export const CallRecording = models.CallRecording ?? model('CallRecording', callRecordingSchema);
export const CallTranscriptSegment = models.CallTranscriptSegment ?? model('CallTranscriptSegment', callTranscriptSegmentSchema);
export const CurrencyRate = models.CurrencyRate ?? model('CurrencyRate', currencyRateSchema);
export const AuditLog = models.AuditLog ?? model('AuditLog', auditLogSchema);

export const isObjectId = (value: string): boolean => Types.ObjectId.isValid(value);
