import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Customer Management | WordbitX CRM',
  description: 'Keep account details, contacts and customer context together so your team can find the information it needs.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="customers" />;
}
