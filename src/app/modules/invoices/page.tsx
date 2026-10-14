import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Invoices & Payments | WordbitX CRM',
  description: 'Issue invoices and record payment progress in one organized workspace.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="invoices" />;
}
