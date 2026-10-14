import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Calls & Call Center | WordbitX CRM',
  description: 'Log calls, review call notes and explore the demo recording interface in the CRM workspace.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="calls" />;
}
