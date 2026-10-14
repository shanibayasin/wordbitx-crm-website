'use client';

import type { ComponentType } from 'react';
import type { CRMModule } from '../../types/crm';
import { CallsPage } from '../../crm-pages/CallsPage';
import { CustomersPage } from '../../crm-pages/CustomersPage';
import { DealsPage } from '../../crm-pages/DealsPage';
import { InvoicesPage } from '../../crm-pages/InvoicesPage';
import { LeadsPage } from '../../crm-pages/LeadsPage';
import { OverviewPage } from '../../crm-pages/OverviewPage';
import { QuotesOrdersPage } from '../../crm-pages/QuotesOrdersPage';
import { ReportsPage } from '../../crm-pages/ReportsPage';
import { SettingsPage } from '../../crm-pages/SettingsPage';
import { TasksPage } from '../../crm-pages/TasksPage';
import { TeamPage } from '../../crm-pages/TeamPage';
import { TicketsPage } from '../../crm-pages/TicketsPage';

const PAGES: Record<CRMModule, ComponentType> = {
  overview: OverviewPage,
  leads: LeadsPage,
  customers: CustomersPage,
  deals: DealsPage,
  quotes_orders: QuotesOrdersPage,
  calls: CallsPage,
  invoices: InvoicesPage,
  tasks: TasksPage,
  tickets: TicketsPage,
  reports: ReportsPage,
  team: TeamPage,
  settings: SettingsPage,
};

export function CRMPageRouter({ module }: { module: CRMModule }) {
  const Page = PAGES[module];
  return <Page />;
}
