import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Deals & Sales Pipeline | WordbitX CRM',
  description: 'Move opportunities through clear stages and review pipeline information in one organized sales workspace.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="deals" />;
}
