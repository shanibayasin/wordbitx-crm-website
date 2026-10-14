# WordbitX CRM

This is the isolated Next.js App Router migration copy of the original Vite CRM.
The original Vite application remains in the sibling `wordbitx-crm` directory.

## Local development

Requires Node.js 20.9 or later.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Production verification commands:

```powershell
npm run typecheck
npm run lint
npm run build
```

## Browser regression tests

After a successful production build, run the Playwright suite:

```powershell
npm run test:e2e
```

The suite starts the local production server and tests section URLs, sidebar and
command-search navigation, form validation, lead/task/invoice/payment changes
in browser storage, currency hydration, key modals, and desktop/mobile layout.
If the Playwright Chromium build is not installed, run `npx playwright install
chromium` before the suite.

## MongoDB foundation tests

The server-only Mongoose connection, organization-scoped model foundation, and
tenant query helpers are not yet connected to the CRM UI or API routes. Run the
database integration suite with:

```powershell
npm run test:db
```

It starts a disposable local MongoDB test process and uses only a database name
prefixed with `wordbitx_test_`. No external database URI is required. The test
guard rejects test-database names outside the test environment. MongoDB data is
ephemeral and is discarded when the test process ends.

## Migration scope

All twelve CRM sections are available under `/dashboard/*`, using the existing
CRM page components, shared sidebar, top bar, command search, and modal flows.
CRM state and demo records continue to use browser `localStorage`; this phase
does not yet provide application-level MongoDB persistence, server-side
authentication or authorization, persistent call recording storage, or
live exchange-rate services. The Mongoose models and scoped query helpers are
foundation code only. Do not use this migration copy with production customer
data.
