'use client';

import {
  ArrowUpRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  LayoutDashboard,
  PhoneCall,
  Search,
  Settings,
  TrendingUp,
  Users,
} from 'lucide-react';
import { OverviewPage } from '../../crm-pages/OverviewPage';
import { CrmProvider } from '../../context/CrmContext';

export function MarketingDashboardPreview() {
  return (
    <section className="real-dashboard-preview" aria-label="Live CRM dashboard preview">
      <div className="real-dashboard-viewport">
        <div className="real-dashboard-window">
          <aside className="preview-sidebar" aria-hidden="true">
            <div className="preview-sidebar-brand">
              <span className="real-dashboard-mark">W</span>
              <strong>WordbitX</strong>
            </div>
            <nav className="preview-sidebar-nav">
              <span className="is-active"><LayoutDashboard size={15} /> Dashboard</span>
              <span><Users size={15} /> Leads</span>
              <span><Users size={15} /> Customers</span>
              <span><BriefcaseBusiness size={15} /> Deals</span>
              <span><PhoneCall size={15} /> Calls</span>
              <span><CheckSquare size={15} /> Tasks</span>
              <span><BarChart3 size={15} /> Reports</span>
              <span><Settings size={15} /> Settings</span>
            </nav>
          </aside>

          <div className="preview-dashboard-main">
            <header className="preview-dashboard-topbar" aria-hidden="true">
              <div className="preview-search">
                <Search size={15} />
                <span>Search anything...</span>
              </div>
              <div className="preview-notification">
                <Bell size={16} />
                <i />
              </div>
              <div className="preview-user">
                <span className="preview-user-avatar">SK</span>
                <span><strong>Sarah Khan</strong><small>Admin</small></span>
                <ChevronDown size={13} />
              </div>
            </header>
            <div className="preview-dashboard-content">
              <CrmProvider demoMode>
                <div className="real-dashboard-content" inert>
                  <OverviewPage previewMode />
                </div>
              </CrmProvider>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-insight-card" aria-hidden="true">
        <span><TrendingUp size={17} /></span>
        <span><strong>+12%</strong><small>More conversions<br />this month</small></span>
        <ArrowUpRight className="preview-insight-arrow" size={14} />
      </div>
      <div className="preview-calls-card" aria-hidden="true">
        <span><PhoneCall size={17} /></span>
        <span><strong>Live calls</strong><small>32 today</small></span>
        <CalendarDays size={14} />
      </div>
    </section>
  );
}
