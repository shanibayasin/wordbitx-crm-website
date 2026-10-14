import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Lead Management | WordbitX CRM',
  description: 'Capture prospects, track qualification and keep every next step visible in one organized lead workspace.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="leads" />;
}
