import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Quotes & Orders | WordbitX CRM',
  description: 'Prepare quotations and follow the path from proposal to order in a consistent commercial workflow.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="quotes-orders" />;
}
