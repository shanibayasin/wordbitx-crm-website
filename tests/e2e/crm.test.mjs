import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, afterEach, before, test } from 'node:test';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const port = 3123 + (process.pid % 1000);
const baseUrl = `http://127.0.0.1:${port}`;
const nextCli = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const testLogin = {
  email: 'crm-e2e@example.invalid',
  password: 'e2e-demo-passphrase-47',
};
const routeNames = [
  'overview',
  'leads',
  'customers',
  'deals',
  'quotes-orders',
  'calls',
  'invoices',
  'tasks',
  'tickets',
  'reports',
  'team',
  'settings',
];

const publicModuleRoutes = [
  'leads',
  'customers',
  'deals',
  'quotes-orders',
  'invoices',
  'calls',
  'tasks',
  'tickets',
  'reports',
  'team',
];

let server;
let browser;
let serverOutput = '';
const pages = new Set();

before(async () => {
  server = spawn(
    process.execPath,
    [nextCli, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
    {
      cwd: root,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: '1',
        DEMO_LOGIN_EMAIL: testLogin.email,
        DEMO_LOGIN_PASSWORD: testLogin.password,
        DEMO_AUTH_SECRET: 'e2e-only-session-signing-secret-2c0d',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );

  server.stdout.setEncoding('utf8').on('data', (chunk) => {
    serverOutput += chunk;
  });
  server.stderr.setEncoding('utf8').on('data', (chunk) => {
    serverOutput += chunk;
  });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js production server exited early:\n${serverOutput}`);
    }

    try {
      const response = await fetch(`${baseUrl}/dashboard/overview`);
      if (response.ok) break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  if (Date.now() >= deadline) {
    throw new Error(`Next.js production server did not become ready:\n${serverOutput}`);
  }

  browser = await chromium.launch({ headless: true });
}, { timeout: 90_000 });

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill();
  }
});

afterEach(async () => {
  await Promise.all([...pages].map((page) => page.close()));
  pages.clear();
});

async function openPage(options = {}) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    ...options,
  });
  pages.add(page);
  return page;
}

async function signIn(page) {
  await page.goto(`${baseUrl}/sign-in`);
  await page.getByLabel('Work email').fill(testLogin.email);
  await page.getByLabel('Password').fill(testLogin.password);
  await Promise.all([
    page.waitForURL('**/dashboard/overview'),
    page.getByRole('button', { name: 'Sign in' }).click(),
  ]);
}

test('public module detail pages render and homepage cards link to the public route', async () => {
  const page = await openPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text());
  });

  for (const route of publicModuleRoutes) {
    const response = await page.goto(`${baseUrl}/modules/${route}`);
    assert.equal(response?.status(), 200, `${route} public module page should return HTTP 200`);
    assert.equal(new URL(page.url()).pathname, `/modules/${route}`);
    await page.getByRole('heading', { level: 1 }).first().waitFor({ state: 'visible' });
  }

  const home = await openPage();
  await home.goto(baseUrl);
  const featureLinks = await home.locator('a.feature-card').evaluateAll((links) =>
    links.map((link) => ({ href: link.getAttribute('href'), label: link.textContent?.trim() || '' }))
  );

  assert.ok(
    featureLinks.every((item) => item.href?.startsWith('/modules/')),
    `homepage module cards must point to public module detail pages: ${JSON.stringify(featureLinks)}`
  );

  assert.deepEqual(pageErrors, [], 'public module pages should not throw client errors');
});

test('sign-in and start free trial links open their public account pages', async () => {
  const page = await openPage();
  const homeResponse = await page.goto(baseUrl);
  assert.equal(homeResponse?.status(), 200);

  await Promise.all([
    page.waitForURL('**/sign-in'),
    page.getByRole('link', { name: 'Sign in', exact: true }).first().click(),
  ]);
  assert.equal(new URL(page.url()).pathname, '/sign-in');
  await page.getByRole('heading', { name: 'Welcome back to your workspace.' }).waitFor({ state: 'visible' });
  await page.getByLabel('Work email').waitFor({ state: 'visible' });

  await Promise.all([
    page.waitForURL('**/register'),
    page.getByRole('link', { name: 'Start free trial' }).click(),
  ]);
  assert.equal(new URL(page.url()).pathname, '/register');
  await page.getByRole('heading', { name: 'Start with your company, then make it yours.' }).waitFor({ state: 'visible' });
  await page.getByLabel('Company name').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Create secure workspace' }).waitFor({ state: 'visible' });
});

test('dashboard requires the configured demo credentials', async () => {
  const page = await openPage();
  await page.goto(`${baseUrl}/dashboard/overview`);
  assert.equal(new URL(page.url()).pathname, '/sign-in');

  await page.getByLabel('Work email').fill(testLogin.email);
  await page.getByLabel('Password').fill('incorrect-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('status').getByText('Email or password is incorrect.').waitFor({ state: 'visible' });
  assert.equal(new URL(page.url()).pathname, '/sign-in');

  await page.getByLabel('Password').fill(testLogin.password);
  await Promise.all([
    page.waitForURL('**/dashboard/overview'),
    page.getByRole('button', { name: 'Sign in' }).click(),
  ]);
  await page.locator('main h1').waitFor({ state: 'visible' });

  await page.getByRole('button', { name: /Alex/ }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.waitForURL('**/sign-in');
  await page.goto(`${baseUrl}/dashboard/overview`);
  assert.equal(new URL(page.url()).pathname, '/sign-in');
});

test('all 12 dashboard section URLs render their CRM page', async () => {
  const page = await openPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text());
  });

  await signIn(page);
  for (const route of routeNames) {
    const response = await page.goto(`${baseUrl}/dashboard/${route}`);
    assert.equal(response?.status(), 200, `${route} should return HTTP 200`);
    assert.equal(new URL(page.url()).pathname, `/dashboard/${route}`);
    await page.locator('main h1').first().waitFor({ state: 'visible' });
    const theme = await page.evaluate(() => {
      const heading = document.querySelector('.dashboard-content-area h1');
      const surface = document.querySelector('.dashboard-content-area [class*="rounded-xl"][class*="bg-slate-900"]');
      return {
        headingColor: heading ? getComputedStyle(heading).color : null,
        surfaceColor: surface ? getComputedStyle(surface).backgroundColor : null,
      };
    });
    assert.equal(theme.headingColor, 'rgb(20, 35, 31)', `${route} heading should use the shared dashboard ink`);
    assert.equal(theme.surfaceColor, 'rgb(255, 255, 255)', `${route} panels should use the shared light surface`);
  }

  assert.deepEqual(pageErrors, [], 'section routes should not throw client errors');
});

test('public marketing homepage navigates to valid sections and stays responsive', async () => {
  const page = await openPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') pageErrors.push(message.text());
  });

  await page.addInitScript(() => {
    localStorage.setItem(
      'wordbitx_leads',
      JSON.stringify([{ id: 'private-sentinel', name: 'Private Browser Record' }])
    );
  });
  const response = await page.goto(baseUrl);
  assert.equal(response?.status(), 200);
  await page.getByRole('heading', {
    name: 'One CRM for Sales, Clients, Teams & Call Center Operations.',
  }).waitFor({ state: 'visible' });
  await page.getByText('DEMO DATA').first().waitFor({ state: 'visible' });
  await page.getByText('Executive Revenue Dashboard', { exact: false }).waitFor({ state: 'visible' });
  const pricingCards = page.locator('.pricing-card');
  assert.equal(await pricingCards.count(), 3);
  assert.deepEqual(
    await pricingCards.locator('h3').allTextContents(),
    ['Starter', 'Business', 'Enterprise']
  );
  assert.equal(await pricingCards.nth(0).getByRole('link', { name: 'Start free' }).getAttribute('href'), '/register');
  assert.equal(await pricingCards.nth(1).getByRole('link', { name: 'Request pricing' }).getAttribute('href'), '/#contact');
  assert.equal(await pricingCards.nth(2).getByRole('link', { name: 'Talk to sales' }).getAttribute('href'), '/#contact');
  assert.equal(await page.getByText('Private Browser Record', { exact: false }).count(), 0);
  assert.deepEqual(
    await page.evaluate(() => JSON.parse(localStorage.getItem('wordbitx_leads') || '[]')),
    [{ id: 'private-sentinel', name: 'Private Browser Record' }],
    'the marketing dashboard preview must not read or overwrite CRM browser data'
  );

  const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll((anchors) =>
    anchors
      .map((anchor) => anchor.getAttribute('href').slice(1))
      .filter((id) => !document.getElementById(id))
  );
  assert.deepEqual(invalidAnchors, [], 'homepage links should target existing sections');
  await page.getByRole('link', { name: /Explore the demo/ }).first().waitFor({ state: 'visible' });
  assert.equal(
    await page.getByRole('link', { name: /Explore the demo/ }).first().getAttribute('href'),
    '/dashboard/overview'
  );

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    assert.ok(dimensions.document <= dimensions.viewport, `homepage overflow: ${JSON.stringify(dimensions)}`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const pricingColumns = await page.locator('.pricing-grid').evaluate((grid) =>
    getComputedStyle(grid).gridTemplateColumns.split(' ').length
  );
  assert.equal(pricingColumns, 1, 'pricing cards should stack on mobile');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('link', { name: 'Pricing' }).click();
  await page.waitForURL('**/#pricing');
  await page.getByRole('heading', {
    name: 'A CRM foundation that can grow with your organization.',
  }).waitFor({ state: 'visible' });

  assert.deepEqual(pageErrors, [], 'homepage should not throw browser console errors');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseUrl);
  await page.screenshot({ path: path.join(tmpdir(), 'wordbitx-marketing-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseUrl);
  await page.screenshot({ path: path.join(tmpdir(), 'wordbitx-marketing-mobile.png'), fullPage: true });
});

test('sidebar navigation and command search update the URL and open the selected record', async () => {
  const page = await openPage();
  await signIn(page);

  await page.getByRole('navigation').getByRole('button', { name: /Leads & Prospects/ }).click();
  await page.waitForURL('**/dashboard/leads');
  await page.locator('main h1').first().waitFor({ state: 'visible' });
  await page.goBack();
  await page.waitForURL('**/dashboard/overview');

  await page.keyboard.press('Control+k');
  await page.getByPlaceholder('Search leads, deals, recordings, invoices...').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Search leads, deals, calls, or invoices/ }).click();
  await page.getByPlaceholder('Search leads, deals, recordings, invoices...').fill('Elena Rostova');
  await page.getByRole('button', { name: /Elena Rostova/ }).first().click();
  await page.waitForURL('**/dashboard/leads');
  await page.getByRole('heading', { name: 'Elena Rostova' }).waitFor({ state: 'visible' });
});

test('lead creation validates required fields and persists a submitted record locally', async () => {
  const page = await openPage();
  await signIn(page);
  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ New Inbound Lead' }).click();

  await page.getByRole('heading', { name: 'Create Inbound / Prospect Lead' }).waitFor();
  const form = page.locator('form').last();
  assert.equal(await form.evaluate((element) => element.checkValidity()), false);

  await page.getByPlaceholder('e.g. Rachel Adams').fill('Browser Test Lead');
  await page.getByPlaceholder('e.g. Horizon Labs').fill('Browser Test Company');
  await page.getByPlaceholder('rachel@horizon.io').fill('crm-test@example.invalid');
  await page.getByRole('button', { name: 'Save New Lead' }).click();

  await page.getByRole('heading', { name: 'Create Inbound / Prospect Lead' }).waitFor({ state: 'detached' });
  const leads = await page.evaluate(() => JSON.parse(localStorage.getItem('wordbitx_leads') || '[]'));
  assert.ok(leads.some((lead) => lead.name === 'Browser Test Lead'));
});

test('task form validation and successful creation persist task state', async () => {
  const page = await openPage();
  await signIn(page);
  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ Create Action Task' }).click();
  await page.getByRole('heading', { name: 'Create Sales Follow-Up Task' }).waitFor();

  const form = page.locator('form').last();
  assert.equal(await form.evaluate((element) => element.checkValidity()), false);
  await page.getByPlaceholder('e.g. Call CFO to confirm wire transfer').fill('Browser Test Task');
  await page.getByRole('button', { name: 'Save Task' }).click();

  await page.getByRole('heading', { name: 'Create Sales Follow-Up Task' }).waitFor({ state: 'detached' });
  const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('wordbitx_tasks') || '[]'));
  assert.ok(tasks.some((task) => task.title === 'Browser Test Task'));
});

test('invoice issue and full-payment forms validate and persist financial state locally', async () => {
  const page = await openPage();
  await signIn(page);
  await page.goto(`${baseUrl}/dashboard/invoices`);
  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ New Client Invoice' }).click();
  await page.getByRole('heading', { name: 'Issue Client Invoice' }).waitFor();

  const issueForm = page.locator('form').last();
  assert.equal(await issueForm.evaluate((element) => element.checkValidity()), false);
  await page.getByPlaceholder('e.g. Apex Cloud Systems').fill('Browser Test Billing');
  await page.getByPlaceholder('billing@apex.io').fill('billing-test@example.invalid');
  await page.getByRole('button', { name: 'Issue Invoice' }).click();
  await page.getByRole('heading', { name: 'Issue Client Invoice' }).waitFor({ state: 'detached' });

  const initialInvoices = await page.evaluate(() => JSON.parse(localStorage.getItem('wordbitx_invoices') || '[]'));
  const invoice = initialInvoices.find((record) => record.clientCompany === 'Browser Test Billing');
  assert.ok(invoice, 'new invoice should be saved in localStorage');

  const invoiceRow = page.locator('tbody tr').filter({ hasText: 'Browser Test Billing' });
  await invoiceRow.getByRole('button', { name: 'Pay' }).click();
  await page.getByRole('heading', { name: 'Record Invoice Payment' }).waitFor();
  const paymentForm = page.locator('form').last();
  assert.equal(await paymentForm.evaluate((element) => element.checkValidity()), false);
  await page.getByRole('button', { name: 'Pay Full' }).click();
  await page.getByPlaceholder('e.g. WIRE-891024-NY').fill('BROWSER-TEST-REF');
  await page.getByRole('button', { name: 'Post Payment' }).click();
  await page.getByRole('heading', { name: 'Record Invoice Payment' }).waitFor({ state: 'detached' });

  const savedInvoices = await page.evaluate(() => JSON.parse(localStorage.getItem('wordbitx_invoices') || '[]'));
  const paidInvoice = savedInvoices.find((record) => record.id === invoice.id);
  assert.equal(paidInvoice.status, 'Paid');
  assert.equal(paidInvoice.balanceDue, 0);
  assert.equal(paidInvoice.paidAmount, invoice.totalAmount);
});

test('currency preference hydrates from and persists to browser localStorage', async () => {
  const page = await openPage();
  await page.addInitScript(() => {
    localStorage.setItem('wordbitx_currency', JSON.stringify('EUR'));
  });
  await signIn(page);
  await page.getByText('Reporting in EUR', { exact: true }).waitFor({ state: 'visible' });

  await page.getByRole('button', { name: /EUR/ }).first().click();
  await page.getByRole('button', { name: /US Dollar/ }).click();
  assert.equal(
    await page.evaluate(() => JSON.parse(localStorage.getItem('wordbitx_currency') || 'null')),
    'USD'
  );
});

test('key create and invitation modals open and required forms reject empty submission', async () => {
  const page = await openPage();
  await signIn(page);
  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ New Sales Deal' }).click();
  await page.getByRole('heading', { name: 'Create New Sales Opportunity' }).waitFor();
  assert.equal(await page.locator('form').last().evaluate((element) => element.checkValidity()), false);
  await page.getByRole('button', { name: 'Cancel' }).last().click();

  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ Create Price Quote' }).click();
  await page.getByRole('heading', { name: 'Draft Commercial Quotation' }).waitFor();
  await page.getByRole('button', { name: 'Cancel' }).last().click();

  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ Log Call & Recording' }).click();
  await page.getByRole('heading', { name: 'Log Telephony Call Record' }).waitFor();
  assert.equal(await page.getByRole('heading', { name: 'Log Telephony Call Record' }).count(), 1);
  assert.equal(await page.locator('form').last().evaluate((element) => element.checkValidity()), false);
  await page.getByRole('button', { name: 'Cancel' }).last().click();

  await page.getByRole('button', { name: 'Create New Record' }).click();
  await page.getByRole('button', { name: '+ New Support Ticket' }).click();
  await page.getByRole('heading', { name: 'Create Support Incident Ticket' }).waitFor();
  assert.equal(await page.locator('form').last().evaluate((element) => element.checkValidity()), false);
  await page.getByRole('button', { name: 'Cancel' }).last().click();

  await page.getByRole('navigation').getByRole('button', { name: /Team & RBAC/ }).click();
  await page.waitForURL('**/dashboard/team');
  await page.getByRole('button', { name: /Invite Team Colleague/ }).click();
  await page.getByRole('heading', { name: 'Invite Team Colleague' }).waitFor();
  assert.equal(await page.locator('form').last().evaluate((element) => element.checkValidity()), false);

  await page.goto(`${baseUrl}/dashboard/calls`);
  await page.getByRole('button', { name: 'Log Telephony Call' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Log Telephony Call Record' }).count(), 1);
});

test('desktop and mobile render the light workspace without horizontal page overflow', async () => {
  const page = await openPage({ viewport: { width: 1440, height: 900 } });
  await signIn(page);
  await page.locator('aside').waitFor({ state: 'visible' });

  const desktop = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    sidebar: getComputedStyle(document.querySelector('aside')).backgroundColor,
    body: getComputedStyle(document.body).backgroundColor,
  }));
  assert.ok(desktop.document <= desktop.viewport, `desktop overflow: ${JSON.stringify(desktop)}`);
  assert.match(desktop.sidebar, /rgb\(248, 250, 252\)|rgb\(255, 255, 255\)/);
  await page.screenshot({ path: path.join(tmpdir(), 'wordbitx-crm-desktop.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.locator('main').waitFor({ state: 'visible' });
  const mobile = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    main: document.querySelector('main').getBoundingClientRect().width,
  }));
  assert.ok(mobile.document <= mobile.viewport, `mobile overflow: ${JSON.stringify(mobile)}`);
  assert.ok(mobile.main >= 320, `mobile content area is too narrow: ${JSON.stringify(mobile)}`);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('navigation', { name: 'CRM sections' }).waitFor({ state: 'visible' });
  await page.getByRole('navigation').getByRole('button', { name: /Leads & Prospects/ }).click();
  await page.waitForURL('**/dashboard/leads');
  await page.getByRole('navigation', { name: 'CRM sections' }).waitFor({ state: 'hidden' });
  await page.screenshot({ path: path.join(tmpdir(), 'wordbitx-crm-mobile.png'), fullPage: true });
});
