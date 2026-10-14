'use client';

import Link from 'next/link';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { OverviewPage } from '../../crm-pages/OverviewPage';
import { CrmProvider } from '../../context/CrmContext';

export function MarketingDashboardPreview() {
  return (
    <section className="real-dashboard-preview" aria-label="Live CRM dashboard preview">
      <div className="real-dashboard-topbar">
        <div className="real-dashboard-brand">
          <span className="real-dashboard-mark">W</span>
          <span>WordbitX <small>WORKSPACE</small></span>
        </div>
        <span className="real-dashboard-demo">DEMO DATA</span>
        <Link className="real-dashboard-open" href="/dashboard/overview">
          Open dashboard <ArrowRight size={14} />
        </Link>
      </div>
      <div className="real-dashboard-viewport">
        <CrmProvider demoMode>
          <div className="real-dashboard-content" inert>
            <OverviewPage previewMode />
          </div>
        </CrmProvider>
      </div>
      <div className="real-dashboard-caption">
        <span><LayoutDashboard size={14} /> Actual CRM overview</span>
        <span>Seeded demo data · not connected to a customer account</span>
      </div>
    </section>
  );
}
