import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import App from '../../App';
import { CrmProvider } from '../../context/CrmContext';
import { DEMO_SESSION_COOKIE, isValidDemoSessionToken } from '../../lib/demoAuth';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!isValidDemoSessionToken(sessionToken)) {
    redirect('/sign-in');
  }

  return (
    <CrmProvider>
      <App>{children}</App>
    </CrmProvider>
  );
}
