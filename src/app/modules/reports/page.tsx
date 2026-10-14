import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Reports & Analytics | WordbitX CRM',
  description: 'Explore demo dashboards for pipeline and revenue activity.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="reports" />;
}
