import { notFound } from 'next/navigation';
import { CRMPageRouter } from '../../../components/layout/CRMPageRouter';
import { getModuleFromSlug, MODULE_SLUGS } from '../../../lib/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(MODULE_SLUGS).map((section) => ({ section }));
}

export default async function DashboardSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const crmModule = getModuleFromSlug(section);

  if (!crmModule) {
    notFound();
  }

  return <CRMPageRouter module={crmModule} />;
}
