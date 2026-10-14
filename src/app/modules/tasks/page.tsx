import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Tasks & Follow-ups | WordbitX CRM',
  description: 'Organize reminders, owners and next actions across your work.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="tasks" />;
}
