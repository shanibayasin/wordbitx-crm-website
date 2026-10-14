'use client';

import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  ClipboardCheck,
  Code2,
  FileText,
  Headphones,
  LayoutDashboard,
  Link2,
  ListFilter,
  LockKeyhole,
  Mail,
  Menu,
  MessageSquareText,
  PhoneCall,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  UserRoundPlus,
  ArrowDownRight,
  Zap,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { MarketingDashboardPreview } from './MarketingDashboardPreview';

const dashboardUrl = '/dashboard/overview';

export const marketingNavigation = [
  { label: 'Home', href: '/#top' },
  { label: 'Product', href: '/#product' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Security', href: '/#security' },
];

const features = [
  {
    icon: UserRoundPlus,
    title: 'Lead management',
    description: 'Capture prospects, track qualification and keep every next step visible.',
    href: '/modules/leads',
  },
  {
    icon: Users,
    title: 'Customer management',
    description: 'Keep account details, contacts and customer context together.',
    href: '/modules/customers',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Deals & sales pipeline',
    description: 'Move opportunities through clear stages and review weighted pipeline.',
    href: '/modules/deals',
  },
  {
    icon: FileText,
    title: 'Quotes & orders',
    description: 'Prepare quotations and follow the path from proposal to order.',
    href: '/modules/quotes-orders',
  },
  {
    icon: CircleDollarSign,
    title: 'Invoices & payments',
    description: 'Issue invoices and record payment progress in the workspace.',
    href: '/modules/invoices',
  },
  {
    icon: PhoneCall,
    title: 'Calls & call center',
    description: 'Log calls, review call notes and explore the demo recording interface.',
    href: '/modules/calls',
  },
  {
    icon: ClipboardCheck,
    title: 'Tasks & follow-ups',
    description: 'Organize reminders, owners and next actions across your work.',
    href: '/modules/tasks',
  },
  {
    icon: Headphones,
    title: 'Tickets & support',
    description: 'Track support requests, their status and the team’s response work.',
    href: '/modules/tickets',
  },
  {
    icon: BarChart3,
    title: 'Reports & analytics',
    description: 'Explore demo dashboards for pipeline and revenue activity.',
    href: '/modules/reports',
  },
  {
    icon: ShieldCheck,
    title: 'Team & permissions',
    description: 'Preview team roles and permission settings; server enforcement is in development.',
    href: '/modules/team',
  },
];

const integrationProviders = [
  { name: 'Twilio', description: 'Call, SMS and voice features for your team.', icon: PhoneCall, style: 'twilio' },
  { name: 'Vonage', description: 'Cloud communications and messaging.', icon: Zap, style: 'vonage' },
  { name: 'Gmail', description: 'Sync emails and keep your conversations organized.', icon: Mail, style: 'gmail' },
  { name: 'Outlook', description: 'Manage your inbox and contacts seamlessly.', icon: Mail, style: 'outlook' },
  { name: 'SIP / PBX', description: 'Advanced telephony for your business.', icon: PhoneCall, style: 'sip' },
  { name: 'WhatsApp', description: 'Chat, support and notifications in one place.', icon: MessageSquareText, style: 'whatsapp' },
  { name: 'SMTP', description: 'Reliable email delivery and tracking.', icon: Mail, style: 'smtp' },
  { name: 'Webhooks', description: 'Real-time data exchange with external systems.', icon: Share2, style: 'webhooks' },
];

const pricingPlans = [
  {
    name: 'Starter',
    description: 'A focused CRM foundation for small teams.',
    price: 'Talk to us',
    priceNote: 'Plan configuration is tailored to your team.',
    features: ['Lead and customer management', 'Sales pipeline', 'Tasks and activity history', 'Up to 5 team members'],
    action: 'Start free',
    href: '/register',
  },
  {
    name: 'Business',
    description: 'For revenue and support teams that need one system.',
    price: 'Talk to us',
    priceNote: 'Plan configuration is tailored to your team.',
    features: ['Everything in Starter', 'Support and call center workspace', 'Automation and reports', 'Role-based access'],
    action: 'Request pricing',
    href: '/#contact',
    featured: true,
  },
  {
    name: 'Enterprise',
    description: 'Configurable operations for larger organizations.',
    price: 'Custom',
    priceNote: 'Plan configuration is tailored to your team.',
    features: ['Everything in Business', 'Advanced permissions', 'Integration architecture', 'Custom implementation support'],
    action: 'Talk to sales',
    href: '/#contact',
  },
];

export function BrandMark() {
  return (
    <Link className="marketing-brand" href="/" aria-label="WordbitX CRM home">
      <span className="marketing-brand-mark" aria-hidden="true">W</span>
      <span className="marketing-brand-word">Wordbit<span>X</span></span>
      <span className="marketing-brand-tag">CRM</span>
    </Link>
  );
}

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="section-container footer-main">
        <div className="footer-brand-block">
          <BrandMark />
          <p>A connected workspace for customer operations — from first conversation to the next follow-up.</p>
        </div>
        <div className="footer-links">
          <div><strong>Product</strong><Link href="/#product">Features</Link><Link href="/dashboard/deals">Sales pipeline</Link><Link href="/dashboard/tasks">Tasks & follow-ups</Link></div>
          <div><strong>Explore</strong><Link href="/#solutions">Solutions</Link><Link href="/#integrations">Integrations</Link><Link href="/#pricing">Pricing</Link></div>
          <div><strong>Company</strong><Link href="/#security">Security status</Link><Link href={dashboardUrl}>Open workspace</Link></div>
        </div>
      </div>
      <div className="section-container footer-bottom">
        <span>© {new Date().getFullYear()} WordbitX CRM</span>
        <span>Marketing preview · CRM features shown with demo data</span>
      </div>
    </footer>
  );
}

function MarketingHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="marketing" id="top">
      <header className="marketing-header">
        <div className="marketing-header-inner">
          <BrandMark />
          <nav className={`marketing-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
            {marketingNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={item.label === 'Home' ? 'is-active' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mobile-nav-actions">
              <Link href="/sign-in" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link className="marketing-button marketing-button-dark" href="/register" onClick={() => setMenuOpen(false)}>
                Start free trial <ArrowRight size={15} />
              </Link>
            </div>
          </nav>
          <div className="header-actions">
            <Link className="header-signin" href="/sign-in">Sign in</Link>
            <Link className="marketing-button marketing-button-dark header-cta" href="/register">
              Start free trial <ArrowRight size={15} />
            </Link>
          </div>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy">
            <div className="hero-badge"><Sparkles size={14} /> One connected workspace for growing teams</div>
            <h1>One CRM for Sales,<br />Clients, Teams &amp;<br /><span>Call Center Operations.</span></h1>
            <p className="hero-description">
              Manage leads, customers, deals, calls, support and reporting from one focused workspace — built to give your team a complete picture of every relationship.
            </p>
            <div className="hero-actions">
              <Link className="marketing-button marketing-button-dark marketing-button-large" href={dashboardUrl}>
                Explore the demo <ArrowRight size={17} />
              </Link>
              <Link className="marketing-button marketing-button-light marketing-button-large" href="/dashboard/overview">
                View dashboard <span className="button-play">↗</span>
              </Link>
            </div>
            <div className="hero-trust">
              <span><PhoneCall size={15} /> Sales &amp; customer management</span>
              <span><Headphones size={15} /> Call center productivity</span>
              <span><Sparkles size={15} /> Automation &amp; workflow</span>
              <span><BarChart3 size={15} /> Reports &amp; analytics</span>
            </div>
            <p className="hero-footnote">The live CRM preview uses sample data. Authentication and server-enforced permissions are still in development.</p>
          </div>
          <div className="hero-visual" id="demo">
            <div className="hero-glow" />
            <MarketingDashboardPreview />
          </div>
        </div>
        <div className="hero-bottom-rule" />
      </section>

      <section className="capability-strip" id="solutions" aria-labelledby="capability-heading">
        <div className="section-container capability-inner">
          <div className="capability-intro">
            <span className="eyebrow">A CONNECTED WORKSPACE</span>
            <h2 id="capability-heading">Built for teams<br />that move faster.</h2>
          </div>
          <div className="capability-item"><span><Users size={18} /></span><strong>One connected<br />customer record</strong></div>
          <div className="capability-item"><span><BarChart3 size={18} /></span><strong>Clear sales pipeline<br />visibility</strong></div>
          <div className="capability-item"><span><ClipboardCheck size={18} /></span><strong>Organized team<br />follow-ups</strong></div>
          <div className="capability-item"><span><LayoutDashboard size={18} /></span><strong>Centralized<br />operations</strong></div>
        </div>
      </section>

      <section className="features-section" id="product" aria-labelledby="features-heading">
        <div className="features-inner">
          <div className="feature-decoration feature-decoration-right" aria-hidden="true">
            <span className="feature-decoration-badge"><Zap size={17} fill="currentColor" /><span><strong>Work Smarter</strong><small>Grow Faster</small></span></span>
            <ArrowDownRight size={29} strokeWidth={1.2} />
          </div>
          <div className="section-heading">
            <span className="eyebrow">THE WORD BITX WORKSPACE</span>
            <h2 id="features-heading">Everything your team needs,<br /><span>in one workspace.</span></h2>
            <p>Connected modules make day-to-day customer operations easier to follow.<br className="feature-heading-break" /> Explore them in the demo workspace.</p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, description, href }) => (
              <Link className="feature-card" href={href} key={title}>
                <span className="feature-icon"><Icon size={19} strokeWidth={1.8} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="feature-link">Explore module <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="operations-section" aria-label="Connected CRM operations">
        <div className="operations-inner section-container">
          <article className="operations-row operations-sales">
            <div className="operations-copy">
              <span className="operations-eyebrow"><i>01</i> SALES PIPELINE</span>
              <h2>Make revenue<br />movement <span>visible.</span></h2>
              <p>From a visual pipeline to closed business. Track every opportunity, understand weighted value, and keep each next step accountable.</p>
              <ul>
                <li><CheckCircle2 size={14} /> Track deals at every stage</li>
                <li><CheckCircle2 size={14} /> Forecast revenue with confidence</li>
                <li><CheckCircle2 size={14} /> Keep next steps visible</li>
              </ul>
              <Link className="operations-link" href="/modules/deals">Explore sales pipeline <ArrowRight size={14} /></Link>
            </div>
            <div className="operations-preview pipeline-preview" aria-label="Illustrative sales pipeline dashboard">
              <div className="operations-preview-heading">
                <span className="operations-preview-title"><BriefcaseBusiness size={15} /> Sales Pipeline</span>
                <span className="operations-view-link">View all <ArrowRight size={11} /></span>
              </div>
              <div className="pipeline-stage-tabs">
                {[
                  ['Lead', '28'],
                  ['Contacted', '18'],
                  ['Proposal', '12'],
                  ['Negotiation', '8'],
                  ['Closed', '24'],
                ].map(([stage, count], index) => (
                  <span className={index === 4 ? 'is-selected' : ''} key={stage}>{stage}<b>{count}</b></span>
                ))}
              </div>
              <div className="operations-table pipeline-table">
                <div className="operations-table-head"><span>Deal</span><span>Value</span><span>Stage</span><span>Probability</span></div>
                {[
                  ['AM', 'Acme Co.', 'Website Redesign', '$12,000', 'Proposal', '75%'],
                  ['BS', 'Bright Solutions', 'CRM Integration', '$8,500', 'Negotiation', '60%'],
                  ['SL', 'Summit Ltd', 'Marketing Platform', '$24,000', 'Qualified', '40%'],
                  ['NJ', 'NextGen Inc', 'Mobile App', '$5,200', 'Discovery', '20%'],
                ].map(([initials, company, title, value, stage, probability]) => (
                  <div className="operations-table-row" key={company}>
                    <span className="operations-person"><i>{initials}</i><span><strong>{company}</strong><small>{title}</small></span></span>
                    <strong>{value}</strong>
                    <span><em className={`operations-status status-${stage.toLowerCase()}`}>{stage}</em></span>
                    <span className="operations-probability">{probability}</span>
                  </div>
                ))}
              </div>
              <div className="pipeline-preview-total"><span><TrendingUp size={13} /> Total revenue</span><strong>$531,173 <small>+12%</small></strong></div>
            </div>
          </article>

          <article className="operations-row operations-reverse operations-calls">
            <div className="operations-copy">
              <span className="operations-eyebrow"><i>02</i> CALL CENTER DASHBOARD</span>
              <h2>Give every agent a <span>live operational view.</span></h2>
              <p>Track queues, agent availability, dispositions, callbacks and missed calls in a dedicated call-center workspace. See team activity and service health at a glance.</p>
              <ul>
                <li><CheckCircle2 size={14} /> Live agent status and activity</li>
                <li><CheckCircle2 size={14} /> Queue and call performance</li>
                <li><CheckCircle2 size={14} /> Missed calls and callback tracking</li>
              </ul>
              <Link className="operations-link" href="/modules/calls">Explore call center <ArrowRight size={14} /></Link>
            </div>
            <div className="operations-preview calls-preview" aria-label="Illustrative call center dashboard">
              <div className="operations-preview-heading">
                <span className="operations-preview-title"><Headphones size={15} /> Call Center Dashboard</span>
                <span className="operations-live"><i /> Live</span>
              </div>
              <div className="calls-preview-date"><CalendarDays size={12} /> Oct 6, 2025 – Oct 12, 2025 <ChevronDown size={11} /></div>
              <div className="calls-metric-grid">
                <div><span><PhoneCall size={13} /> Total Calls</span><strong>156</strong><small>↑ 23%</small></div>
                <div><span><CheckCircle2 size={13} /> Answered</span><strong>142</strong><small>↑ 18%</small></div>
                <div><span><X size={13} /> Missed</span><strong>14</strong><small className="is-down">↓ 6%</small></div>
                <div><span><Clock3 size={13} /> Avg. Wait Time</span><strong>00:48</strong><small>↓ 32%</small></div>
              </div>
              <div className="calls-analytics-grid">
                <div className="calls-chart-panel">
                  <strong>Call Volume</strong>
                  <div className="calls-chart">
                    <div className="calls-chart-y"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div>
                    <div className="calls-chart-plot" role="img" aria-label="Call volume trend across the week">
                      <svg viewBox="0 0 280 120" preserveAspectRatio="none" aria-hidden="true">
                        <defs><linearGradient id="calls-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#18b98a" stopOpacity=".28" /><stop offset="100%" stopColor="#18b98a" stopOpacity="0" /></linearGradient></defs>
                        <path d="M0 89 L40 72 L80 80 L120 58 L160 67 L200 42 L240 61 L280 72 L280 120 L0 120 Z" fill="url(#calls-chart-fill)" />
                        <polyline points="0,89 40,72 80,80 120,58 160,67 200,42 240,61 280,72" fill="none" stroke="#11a97e" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                        <g fill="white" stroke="#11a97e" strokeWidth="2"><circle cx="0" cy="89" r="3" /><circle cx="40" cy="72" r="3" /><circle cx="80" cy="80" r="3" /><circle cx="120" cy="58" r="3" /><circle cx="160" cy="67" r="3" /><circle cx="200" cy="42" r="3" /><circle cx="240" cy="61" r="3" /><circle cx="280" cy="72" r="3" /></g>
                      </svg>
                    </div>
                  </div>
                  <div className="calls-chart-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
                </div>
                <div className="calls-outcomes-panel">
                  <strong>Call Outcomes</strong>
                  <div className="calls-outcomes">
                    <div className="calls-donut"><span><b>142</b><small>Total Calls</small></span></div>
                    <ul><li><i /> Answered <b>91% (142)</b></li><li><i /> Missed <b>9% (14)</b></li><li><i /> Voicemail <b>4% (6)</b></li><li><i /> Callback <b>2% (4)</b></li></ul>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="operations-row operations-leads">
            <div className="operations-copy">
              <span className="operations-eyebrow"><i>03</i> LEAD MANAGEMENT</span>
              <h2>Turn every inquiry into an owned <span>next step.</span></h2>
              <p>Score, assign and manage leads with intelligent workflows. Keep your team focused with clear ownership and timely follow-ups.</p>
              <ul>
                <li><CheckCircle2 size={14} /> Capture and score leads automatically</li>
                <li><CheckCircle2 size={14} /> Assign to the right team member</li>
                <li><CheckCircle2 size={14} /> Track progress and follow-ups</li>
              </ul>
              <Link className="operations-link" href="/modules/leads">Explore lead management <ArrowRight size={14} /></Link>
            </div>
            <div className="operations-preview leads-preview" aria-label="Illustrative lead management table">
              <div className="operations-preview-heading">
                <span className="operations-preview-title"><UserRoundPlus size={15} /> Leads</span>
                <span className="leads-preview-controls"><span><Search size={11} /> Search leads...</span><span><ListFilter size={11} /> Filter</span></span>
              </div>
              <div className="leads-filter-tabs"><span className="is-selected">All (248)</span><span>New (56)</span><span>Contacted (78)</span><span>Qualified (42)</span><span>Proposal (28)</span><span>Closed (44)</span></div>
              <div className="operations-table leads-table">
                <div className="operations-table-head"><span>Name</span><span>Email</span><span>Phone</span><span>Source</span><span>Status</span></div>
                {[
                  ['AH', 'Ayesha Khan', 'ayesha@gmail.com', '+92 300 1234567', 'Website', 'New'],
                  ['BA', 'Bilal Ahmed', 'bilal@gmail.com', '+92 301 2345678', 'Facebook', 'Contacted'],
                  ['SM', 'Sara Malik', 'sara@gmail.com', '+92 302 3456789', 'Referral', 'Qualified'],
                  ['UR', 'Usman Raza', 'usman@gmail.com', '+92 303 4567890', 'LinkedIn', 'Proposal'],
                  ['HS', 'Hassan Shah', 'hassan@gmail.com', '+92 304 5678901', 'Website', 'New'],
                ].map(([initials, name, email, phone, source, status]) => (
                  <div className="operations-table-row" key={email}>
                    <span className="operations-person"><i>{initials}</i><span><strong>{name}</strong></span></span>
                    <span>{email}</span><span>{phone}</span><span>{source}</span><span><em className={`operations-status status-${status.toLowerCase()}`}>{status}</em></span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="operations-row operations-reverse operations-support">
            <div className="operations-copy">
              <span className="operations-eyebrow"><i>04</i> CUSTOMER SUPPORT</span>
              <h2>A complete history, not a <span>disconnected ticket.</span></h2>
              <p>Search tickets, view customer context, chat, call and project contact details — all in one place. Solve issues faster with conversation history, attachments and status tracking.</p>
              <ul>
                <li><CheckCircle2 size={14} /> Full conversation history</li>
                <li><CheckCircle2 size={14} /> Attachments and notes</li>
                <li><CheckCircle2 size={14} /> Status and priority tracking</li>
              </ul>
              <Link className="operations-link" href="/modules/tickets">Explore customer support <ArrowRight size={14} /></Link>
            </div>
            <div className="operations-preview support-preview" aria-label="Illustrative recent customer support tickets">
              <div className="operations-preview-heading">
                <span className="operations-preview-title"><Headphones size={15} /> Recent Support Tickets</span>
                <span className="operations-view-link">View all <ArrowRight size={11} /></span>
              </div>
              <div className="operations-table support-table">
                <div className="operations-table-head"><span>#</span><span>Subject</span><span>Customer</span><span>Priority</span><span>Status</span><span>Created</span></div>
                {[
                  ['#TK-1001', 'Login issue on mobile app', 'Ahmed Raza', 'High', 'Open', '2h ago'],
                  ['#TK-1002', 'Billing question', 'Global Tech', 'Medium', 'In Progress', '4h ago'],
                  ['#TK-1003', 'Feature request', 'Sarah Khan', 'Low', 'Resolved', '1d ago'],
                  ['#TK-1004', 'Website not working', 'Zain Ali', 'High', 'Open', '2d ago'],
                ].map(([number, subject, customer, priority, status, created]) => (
                  <div className="operations-table-row" key={number}>
                    <span className="support-ticket-id">{number}</span><strong>{subject}</strong><span>{customer}</span>
                    <span><em className={`operations-status status-${priority.toLowerCase()}`}>{priority}</em></span>
                    <span><em className={`operations-status status-${status.toLowerCase().replace(' ', '-')}`}>{status}</em></span>
                    <span>{created}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="security-section" id="security">
        <div className="section-container security-layout">
          <div className="security-copy">
            <span className="eyebrow">BUILT WITH CLARITY</span>
            <h2>Team workflows, with<br /><span>security still in progress.</span></h2>
            <p>WordbitX CRM includes a demo team area with roles and permission settings. The current migration is still a browser-based demo: server-side sign-in, organization-level data isolation and enforced role permissions are not implemented yet.</p>
            <ul className="security-list">
              <li><CheckCircle2 size={17} /> Team and role interface in the demo</li>
              <li><LockKeyhole size={17} /> Server-side access controls in development</li>
              <li><ShieldCheck size={17} /> No compliance or certification claims</li>
            </ul>
            <Link className="text-link" href="/modules/team">Explore the team module <ArrowRight size={15} /></Link>
          </div>
          <div className="security-preview">
            <div className="security-preview-top"><span className="security-preview-symbol"><ShieldCheck size={17} /></span><span>TEAM WORKSPACE</span><span className="security-preview-status">DEMO</span></div>
            <div className="security-preview-title"><strong>Roles & responsibilities</strong><small>Illustrative interface · not enforced server-side</small></div>
            {[
              ['AL', 'Alex Morgan', 'Sales Manager', 'Manager'],
              ['SC', 'Sam Chen', 'Account Executive', 'Member'],
              ['JR', 'Jamie Rivera', 'Support Agent', 'Member'],
            ].map(([initials, name, role, access]) => (
              <div className="security-member" key={name}>
                <span className="member-avatar">{initials}</span>
                <span className="member-details"><strong>{name}</strong><small>{role}</small></span>
                <span className="member-access">{access}</span>
              </div>
            ))}
            <div className="security-preview-note"><LockKeyhole size={14} /> Authentication and organization isolation are not yet active.</div>
          </div>
        </div>
      </section>

      <section className="integrations-section" id="integrations">
        <div className="integration-note integration-note-left" aria-hidden="true">
          <span className="integration-note-icon"><Link2 size={16} /></span>
          <span><strong>More integrations</strong><small>Coming soon...</small></span>
          <span className="integration-note-dot" />
        </div>
        <div className="integration-note integration-note-right" aria-hidden="true">
          <span className="integration-note-icon"><Code2 size={18} /></span>
          <span><strong>Provider setup</strong><small>Required to connect</small></span>
        </div>
        <div className="section-container integrations-inner">
          <div className="integration-heading">
            <span className="integration-badge"><Link2 size={15} /> INTEGRATION READY</span>
            <h2>Connect the systems your<br /><span>operation relies on.</span></h2>
            <p>WordbitX CRM is designed for telephony, email and workflow integrations. Provider examples below are illustrative; services are not connected until configured.</p>
          </div>
          <div className="integration-provider-grid">
            {integrationProviders.map(({ name, description, icon: Icon, style }) => (
              <article className={`integration-provider integration-provider-${style}`} key={name}>
                <span className="integration-provider-icon"><Icon size={25} strokeWidth={2.2} /></span>
                <span className="integration-provider-copy">
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
                <span className="integration-provider-arrow" aria-hidden="true"><ArrowRight size={15} /></span>
              </article>
            ))}
          </div>
          <Link className="integration-architecture-link" href="#contact">
            <Link2 size={15} /> Discuss integration options <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="section-container pricing-inner">
          <div className="pricing-heading">
            <span className="eyebrow">PLANS</span>
            <h2>A CRM foundation that can grow with your organization.</h2>
            <p>Choose the operating model that fits today, then expand roles, modules and configuration as your team evolves.</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article className={`pricing-card${plan.featured ? ' pricing-card-featured' : ''}`} key={plan.name}>
                {plan.featured && <span className="pricing-featured-badge">MOST COMPLETE</span>}
                <div className="pricing-card-content">
                  <div className="pricing-plan-heading">
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                  <div className="pricing-price-block">
                    <strong>{plan.price}</strong>
                    <span>{plan.priceNote}</span>
                  </div>
                  <ul className="pricing-feature-list">
                    {plan.features.map((feature) => (
                      <li key={feature}><Check size={15} aria-hidden="true" /><span>{feature}</span></li>
                    ))}
                  </ul>
                  <Link
                    className={`pricing-plan-action${plan.featured ? ' pricing-plan-action-featured' : ''}`}
                    href={plan.href}
                  >
                    {plan.action}
                    {plan.featured && <ArrowRight size={15} />}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" id="contact">
        <div className="final-cta-glow" />
        <div className="section-container final-cta-inner">
          <span className="eyebrow">WORD BITX CRM</span>
          <h2>Bring your customer<br /><span>operations together.</span></h2>
          <p>Keep sales, service and team workflows organized in one workspace.</p>
          <div className="hero-actions">
            <Link className="marketing-button marketing-button-mint marketing-button-large" href={dashboardUrl}>Explore the demo <ArrowRight size={17} /></Link>
            <Link className="marketing-button marketing-button-outline marketing-button-large" href={dashboardUrl}>Explore the product</Link>
          </div>
          <small>Current workspace uses demo data stored in your browser.</small>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}

export { MarketingHome };
