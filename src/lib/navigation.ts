import type { CRMModule } from '../types/crm';

export const MODULE_SLUGS: Record<CRMModule, string> = {
  overview: 'overview',
  leads: 'leads',
  customers: 'customers',
  deals: 'deals',
  quotes_orders: 'quotes-orders',
  calls: 'calls',
  invoices: 'invoices',
  tasks: 'tasks',
  tickets: 'tickets',
  reports: 'reports',
  team: 'team',
  settings: 'settings',
};

const SLUG_MODULES = Object.fromEntries(
  Object.entries(MODULE_SLUGS).map(([module, slug]) => [slug, module])
) as Record<string, CRMModule>;

export const getModuleFromSlug = (slug: string): CRMModule | undefined =>
  SLUG_MODULES[slug];

export const getModuleFromPathname = (pathname: string): CRMModule | undefined => {
  const section = pathname.split('/').filter(Boolean).at(-1);
  return section ? getModuleFromSlug(section) : undefined;
};

export const getModulePath = (module: CRMModule): string =>
  `/dashboard/${MODULE_SLUGS[module]}`;
