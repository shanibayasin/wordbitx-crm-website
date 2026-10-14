import type { Metadata } from 'next';
import { ModuleDetailPage } from '../../../components/marketing/ModuleDetailPage';

export const metadata: Metadata = {
  title: 'Team & Permissions | WordbitX CRM',
  description: 'Preview team roles and permission settings; server enforcement is in development.',
};

export default function Page() {
  return <ModuleDetailPage moduleSlug="team" />;
}
