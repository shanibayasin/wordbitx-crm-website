import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Tickets & Support | WordbitX CRM',
  description: 'Track support requests, their status and the team’s response work.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="tickets" />;
}
