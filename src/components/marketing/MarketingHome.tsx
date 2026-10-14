'use client';

import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
  UserRoundPlus,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { MarketingDashboardPreview } from './MarketingDashboardPreview';

const dashboardUrl = '/dashboard/overview';

export const marketingNavigation = [
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

const workflow = [
  ['01', 'Capture a lead', 'Bring a prospect into the workspace.'],
  ['02', 'Qualify the opportunity', 'Record fit, context and follow-up.'],
  ['03', 'Manage the deal', 'Keep stage and ownership in view.'],
  ['04', 'Create a quote or order', 'Carry the proposal into the next step.'],
  ['05', 'Track payment', 'Follow invoice and payment status.'],
  ['06', 'Review performance', 'Use reports to see the demo data clearly.'],
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
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
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
              <span><CheckCircle2 size={15} /> Sales &amp; service workspace</span>
              <span><CheckCircle2 size={15} /> Flexible team workflows</span>
              <span><CheckCircle2 size={15} /> Demo data included</span>
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

      <section className="features-section section-container" id="product">
        <div className="section-heading">
          <span className="eyebrow">THE WORD BITX WORKSPACE</span>
          <h2>Everything your team needs,<br /><span>in one workspace.</span></h2>
          <p>Connected modules make day-to-day customer operations easier to follow. Explore them in the demo workspace.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, description, href }) => (
            <Link className="feature-card" href={href} key={title}>
              <span className="feature-icon"><Icon size={18} strokeWidth={1.8} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="feature-link">Explore module <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="workflow-section" aria-labelledby="workflow-heading">
        <div className="section-container">
          <div className="section-heading section-heading-left">
            <span className="eyebrow">A CLEARER WAY TO WORK</span>
            <h2 id="workflow-heading">From first hello to<br /><span>the next opportunity.</span></h2>
            <p>Follow the customer journey without losing sight of the work between each milestone.</p>
          </div>
          <ol className="workflow-grid">
            {workflow.map(([number, title, description], index) => (
              <li className="workflow-step" key={number}>
                <span className="workflow-number">{number}</span>
                {index < workflow.length - 1 && <span className="workflow-connector" aria-hidden="true"><ArrowRight size={14} /></span>}
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="showcase-section section-container">
        <div className="showcase-intro">
          <span className="eyebrow">MADE FOR THE DETAILS</span>
          <h2>See the whole picture.<br /><span>Stay close to the work.</span></h2>
          <p>Move from a high-level pipeline view into the records, tasks and reporting that keep the team aligned.</p>
          <Link className="text-link" href={dashboardUrl}>Explore the workspace <ArrowRight size={15} /></Link>
        </div>
        <div className="showcase-cards">
          <Link className="showcase-card showcase-pipeline-card" href="/modules/deals">
            <div className="showcase-card-header"><span className="showcase-mini-icon"><BriefcaseBusiness size={16} /></span><span className="showcase-demo-tag">DEMO DATA</span></div>
            <h3>Pipeline at a glance</h3>
            <p>Stages keep opportunities moving forward.</p>
            <div className="showcase-stage-list">
              {[
                ['Discovery', '6'],
                ['Qualified', '4'],
                ['Proposal', '3'],
                ['Negotiation', '2'],
              ].map(([stage, count], index) => (
                <div className="showcase-stage" key={stage}>
                  <span className={`stage-dot stage-dot-${index}`} />
                  <span>{stage}</span><strong>{count}</strong>
                </div>
              ))}
            </div>
          </Link>
          <Link className="showcase-card showcase-record-card" href="/modules/leads">
            <div className="showcase-card-header"><span className="showcase-mini-icon"><UserRoundPlus size={16} /></span><span className="showcase-demo-tag">DEMO DATA</span></div>
            <h3>Customer context, connected</h3>
            <p>Keep prospect and account details close to the conversation.</p>
            <div className="record-preview">
              <span className="record-avatar">AR</span>
              <span><strong>Account record</strong><small>Contact · activity · notes</small></span>
              <ArrowRight size={15} />
            </div>
            <div className="record-tags"><span>Lead</span><span>Customer</span><span>Activity</span></div>
          </Link>
          <Link className="showcase-card showcase-task-card" href="/modules/tasks">
            <div className="showcase-card-header"><span className="showcase-mini-icon"><ClipboardCheck size={16} /></span><span className="showcase-demo-tag">DEMO DATA</span></div>
            <h3>Follow-ups with an owner</h3>
            <p>Turn a conversation into a clear next action.</p>
            <div className="showcase-task-list">
              <span><i><Check size={10} /></i>Share the proposal <small>Today</small></span>
              <span><i />Schedule a check-in <small>Tomorrow</small></span>
            </div>
          </Link>
          <Link className="showcase-card showcase-insight-card" href="/modules/reports">
            <div className="showcase-card-header"><span className="showcase-mini-icon"><BarChart3 size={16} /></span><span className="showcase-demo-tag">DEMO DATA</span></div>
            <h3>Insights that feel connected</h3>
            <p>Review pipeline and activity in a single reporting view.</p>
            <div className="insight-bars" aria-label="Illustrative monthly activity chart">
              {[34, 50, 42, 67, 58, 82, 72, 95, 76, 100, 87, 112].map((height, index) => (
                <i key={index} style={{ height }} />
              ))}
            </div>
            <div className="insight-axis"><span>MONTHLY ACTIVITY</span><span>ILLUSTRATIVE</span></div>
          </Link>
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

      <section className="integrations-section section-container" id="integrations">
        <div className="integrations-mark"><MessageSquareText size={20} /></div>
        <div className="integrations-copy">
          <span className="eyebrow">INTEGRATIONS</span>
          <h2>Designed to grow<br /><span>with your toolkit.</span></h2>
          <p>Connected third-party integrations are not part of this migration phase. We’ll introduce them here once they’re implemented and verified.</p>
        </div>
        <div className="integrations-status"><span className="status-dot" /> Integration support is in development</div>
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
