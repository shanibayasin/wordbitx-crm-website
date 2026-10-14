'use client';

import type { ReactNode } from 'react';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Headphones,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  UserRoundPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { BrandMark, MarketingFooter, marketingNavigation } from './MarketingHome';

export type ModuleDetail = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  capabilities: { title: string; description: string; icon: LucideIcon }[];
  workflow: string[];
  benefits: string[];
  related: { slug: string; label: string }[];
  preview: ReactNode;
};

function MarketingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}

const modulePreviewRegistry: Record<string, ReactNode> = {
  leads: (
    <div className="module-preview-surface module-table-preview">
      <div className="module-preview-header">
        <span>Lead pipeline</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="table-preview table-preview-compact">
        <div className="table-row table-head">
          <span>Lead</span>
          <span>Source</span>
          <span>Status</span>
        </div>
        {[
          ['Ariana Brooks', 'Inbound Web', 'Qualified'],
          ['Nicolas Hart', 'Referral', 'Follow-up'],
          ['Lina Flores', 'LinkedIn', 'New'],
        ].map(([name, source, status]) => (
          <div className="table-row" key={name}>
            <span>{name}</span>
            <span>{source}</span>
            <span className={`status-pill status-pill-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  customers: (
    <div className="module-preview-surface module-two-column-preview">
      <div className="module-preview-header">
        <span>Customer records</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="customer-preview-grid">
        <div className="list-preview">
          {['Oak & Pine', 'Northwind', 'Meridian Labs'].map((name) => (
            <div className="list-item" key={name}>
              <span className="mini-avatar">{name.slice(0, 2).toUpperCase()}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
        <div className="card-preview">
          <div className="customer-card-header">
            <span className="mini-avatar large-avatar">OP</span>
            <div>
              <strong>Oak &amp; Pine</strong>
              <small>Customer profile</small>
            </div>
          </div>
          <div className="customer-metrics">
            <span><strong>12</strong><small>Contacts</small></span>
            <span><strong>3</strong><small>Open items</small></span>
          </div>
        </div>
      </div>
    </div>
  ),
  deals: (
    <div className="module-preview-surface module-pipeline-preview">
      <div className="module-preview-header">
        <span>Sales pipeline</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="pipeline-columns">
        {['Discovery', 'Proposal', 'Negotiation', 'Closed'].map((stage, index) => (
          <div className="pipeline-column" key={stage}>
            <div className="pipeline-stage-head">{stage}</div>
            {index === 0 && (
              <>
                <div className="deal-card">Northwind</div>
                <div className="deal-card">Harbor Labs</div>
              </>
            )}
            {index === 1 && <div className="deal-card highlight">Novum</div>}
            {index === 2 && <div className="deal-card">Aster Build</div>}
          </div>
        ))}
      </div>
    </div>
  ),
  'quotes-orders': (
    <div className="module-preview-surface module-table-preview">
      <div className="module-preview-header">
        <span>Quote history</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="table-preview table-preview-compact">
        <div className="table-row table-head">
          <span>Ref</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {[
          ['QT-2034', 'Northwind', '$8,400', 'Sent'],
          ['OR-1024', 'Meridian', '$12,600', 'Processing'],
          ['QT-2010', 'Oak & Pine', '$5,220', 'Accepted'],
        ].map(([reference, customer, amount, status]) => (
          <div className="table-row" key={reference}>
            <span>{reference}</span>
            <span>{customer}</span>
            <span>{amount}</span>
            <span className={`status-pill status-pill-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  invoices: (
    <div className="module-preview-surface module-table-preview">
      <div className="module-preview-header">
        <span>Invoice overview</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="table-preview table-preview-compact">
        <div className="table-row table-head">
          <span>Invoice</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {[
          ['INV-1040', 'Northwind', '$6,240', 'Pending'],
          ['INV-1037', 'Harbor Labs', '$3,980', 'Partially Paid'],
          ['INV-1034', 'Kinetic', '$9,140', 'Paid'],
        ].map(([reference, customer, amount, status]) => (
          <div className="table-row" key={reference}>
            <span>{reference}</span>
            <span>{customer}</span>
            <span>{amount}</span>
            <span className={`status-pill status-pill-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  calls: (
    <div className="module-preview-surface call-preview-box">
      <div className="module-preview-header">
        <span>Call log</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="call-list">
        {[
          ['Lina Flores', '11:24 AM', 'Follow-up scheduled'],
          ['Northwind', '9:10 AM', 'Connected'],
          ['Harbor Labs', 'Yesterday', 'Voicemail'],
        ].map(([name, time, outcome]) => (
          <div className="call-item" key={name + time}>
            <span className="call-dot" />
            <div>
              <strong>{name}</strong>
              <small>{time}</small>
            </div>
            <span className="call-state">{outcome}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  tasks: (
    <div className="module-preview-surface module-task-preview">
      <div className="module-preview-header">
        <span>Team tasks</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="task-list-preview">
        {[
          ['Share proposal with Northwind', 'Today'],
          ['Update handoff for Harbor Labs', 'Tomorrow'],
          ['Prepare follow-up notes', 'This week'],
        ].map(([task, date]) => (
          <div className="task-item" key={task}>
            <span className="task-check"><Check size={11} /></span>
            <div>
              <strong>{task}</strong>
              <small>{date}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  tickets: (
    <div className="module-preview-surface module-table-preview">
      <div className="module-preview-header">
        <span>Support queue</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="table-preview table-preview-compact">
        <div className="table-row table-head">
          <span>Ticket</span>
          <span>Subject</span>
          <span>Status</span>
        </div>
        {[
          ['TK-1102', 'Login access issue', 'Open'],
          ['TK-1098', 'Billing question', 'Pending'],
          ['TK-1091', 'Training follow-up', 'Resolved'],
        ].map(([reference, subject, status]) => (
          <div className="table-row" key={reference}>
            <span>{reference}</span>
            <span>{subject}</span>
            <span className={`status-pill status-pill-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  reports: (
    <div className="module-preview-surface report-preview-box">
      <div className="module-preview-header">
        <span>Activity overview</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="report-chart" aria-label="Illustrative sales chart">
        {[38, 58, 42, 70, 63, 88, 74].map((value, index) => (
          <span key={index} style={{ height: `${value}%` }} />
        ))}
      </div>
      <div className="report-summary">
        <div><strong>76</strong><small>Deals</small></div>
        <div><strong>$208k</strong><small>Pipeline</small></div>
        <div><strong>21</strong><small>Tasks</small></div>
      </div>
    </div>
  ),
  team: (
    <div className="module-preview-surface team-preview-box">
      <div className="module-preview-header">
        <span>Team workspace</span>
        <span className="demo-badge">DEMO DATA</span>
      </div>
      <div className="team-list-preview">
        {[
          ['Alex Morgan', 'Sales Manager'],
          ['Sam Chen', 'Account Executive'],
          ['Jamie Rivera', 'Support Agent'],
        ].map(([name, role]) => (
          <div className="team-item" key={name}>
            <span className="mini-avatar">{name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
            <div>
              <strong>{name}</strong>
              <small>{role}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export function ModuleDetailPage({ moduleSlug }: { moduleSlug: string }) {
  const moduleDetail = MODULE_DETAILS[moduleSlug];

  if (!moduleDetail) {
    throw new Error(`Unknown module detail: ${moduleSlug}`);
  }

  return (
    <main className="module-page">
      <MarketingHeader />

      <div className="section-container module-page-shell">
        <nav aria-label="Breadcrumb" className="module-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/#product">Modules</Link>
          <ChevronRight size={12} />
          <span>{moduleDetail.title}</span>
        </nav>
      </div>

      <section className="module-hero-section">
        <div className="section-container module-hero-grid">
          <div className="module-copy">
            <span className="eyebrow module-eyebrow">{moduleDetail.eyebrow}</span>
            <h1>{moduleDetail.title}</h1>
            <p>{moduleDetail.description}</p>
            <div className="module-actions">
              <Link className="marketing-button marketing-button-dark marketing-button-large" href={`/dashboard/${moduleDetail.slug}`}>
                Explore in CRM <ArrowRight size={17} />
              </Link>
              <Link className="marketing-button marketing-button-light marketing-button-large" href="/#product">
                Back to all modules
              </Link>
            </div>
            <div className="module-mini-meta">
              <span>Demo data included</span>
              <span>Public access</span>
            </div>
          </div>

          <div className="module-preview-panel">
            {moduleDetail.preview}
          </div>
        </div>
      </section>

      <section className="module-details-section section-container">
        <div className="section-heading section-heading-left module-heading-wrap">
          <span className="eyebrow">KEY CAPABILITIES</span>
          <h2>What this module helps your team do.</h2>
        </div>

        <div className="module-capability-grid">
          {moduleDetail.capabilities.map(({ title, description, icon: Icon }) => (
            <article className="module-capability-card" key={title}>
              <span className="feature-icon"><Icon size={18} strokeWidth={1.8} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="module-process-section">
        <div className="section-container">
          <div className="section-heading section-heading-left module-heading-wrap">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>A simple workflow for the next step.</h2>
          </div>

          <ol className="module-workflow-grid">
            {moduleDetail.workflow.map((step, index) => (
              <li className="module-workflow-item" key={`${step}-${index}`}>
                <div className="workflow-step-badge">0{index + 1}</div>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-container module-details-section">
        <div className="module-benefits-layout">
          <div className="section-heading section-heading-left module-heading-wrap">
            <span className="eyebrow">BENEFITS</span>
            <h2>Why teams keep this work in one place.</h2>
          </div>
          <ul className="module-benefits-list">
            {moduleDetail.benefits.map((benefit) => (
              <li key={benefit}><Check size={15} /> {benefit}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-container module-details-section">
        <div className="section-heading section-heading-left module-heading-wrap">
          <span className="eyebrow">RELATED MODULES</span>
          <h2>Explore the surrounding workflow.</h2>
        </div>
        <div className="module-related-grid">
          {moduleDetail.related.map(({ slug: relatedSlug, label }) => {
            const Icon = (() => {
              switch (relatedSlug) {
                case 'leads': return UserRoundPlus;
                case 'customers': return Users;
                case 'deals': return BriefcaseBusiness;
                case 'quotes-orders': return FileText;
                case 'invoices': return CircleDollarSign;
                case 'calls': return PhoneCall;
                case 'tasks': return ClipboardCheck;
                case 'tickets': return Headphones;
                case 'reports': return BarChart3;
                case 'team': return ShieldCheck;
                default: return MessageSquareText;
              }
            })();

            return (
              <Link className="module-related-card" href={`/modules/${relatedSlug}`} key={relatedSlug}>
                <span className="feature-icon"><Icon size={18} strokeWidth={1.8} /></span>
                <div>
                  <strong>{label}</strong>
                  <small>Open module page</small>
                </div>
                <ArrowRight size={14} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="module-final-cta">
        <div className="section-container">
          <div className="module-final-cta-inner">
            <span className="eyebrow">WORD BITX CRM</span>
            <h2>Bring your customer workflow into focus.</h2>
            <div className="module-actions">
              <Link className="marketing-button marketing-button-mint marketing-button-large" href={`/dashboard/${moduleDetail.slug}`}>
                Explore in CRM <ArrowRight size={17} />
              </Link>
              <Link className="marketing-button marketing-button-outline marketing-button-large" href="/#product">
                Explore other modules
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}

export const MODULE_DETAILS: Record<string, ModuleDetail> = {
  leads: {
    slug: 'leads',
    eyebrow: 'SALES WORKSPACE',
    title: 'Turn new prospects into clear next steps.',
    description: 'Capture prospects, track qualification and keep every next step visible in one organized lead workspace.',
    icon: UserRoundPlus,
    capabilities: [
      { title: 'Lead Records', description: 'Keep prospect details and qualification information organized.', icon: UserRoundPlus },
      { title: 'Lead Qualification', description: 'Track the current status of each opportunity.', icon: Check },
      { title: 'Follow-up Planning', description: 'Keep next actions and follow-ups visible.', icon: ClipboardCheck },
      { title: 'Ownership & Accountability', description: 'Make lead responsibility clear where supported.', icon: Users },
      { title: 'Lead Overview', description: 'Review lead information in a structured workspace.', icon: MessageSquareText },
    ],
    workflow: ['Capture a lead', 'Review and qualify', 'Plan the next follow-up'],
    benefits: ['Keep every prospect visible as it moves toward qualification', 'Ensure handoff and ownership are clear', 'Reduce missed follow-ups across the sales team'],
    related: [
      { slug: 'customers', label: 'Customer Management' },
      { slug: 'deals', label: 'Deals & Sales Pipeline' },
      { slug: 'tasks', label: 'Tasks & Follow-ups' },
    ],
    preview: modulePreviewRegistry.leads,
  },
  customers: {
    slug: 'customers',
    eyebrow: 'CUSTOMER RELATIONSHIPS',
    title: 'Keep every customer relationship connected.',
    description: 'Keep account details, contacts and customer context together so your team can find the information it needs.',
    icon: Users,
    capabilities: [
      { title: 'Customer Profiles', description: 'Organize customer account information.', icon: Users },
      { title: 'Contact Details', description: 'Keep contact information easy to access.', icon: MessageSquareText },
      { title: 'Relationship Context', description: 'Review available customer-related records.', icon: Check },
      { title: 'Customer Search', description: 'Find records through the existing supported search functionality.', icon: BarChart3 },
      { title: 'Connected Workflows', description: 'Navigate to related records where supported.', icon: ArrowRight },
    ],
    workflow: ['Create a customer record', 'Maintain account details', 'Review related activity'],
    benefits: ['Centralize customer detail in a single workspace', 'Keep account context close to the work', 'Move between customer and pipeline records without friction'],
    related: [
      { slug: 'leads', label: 'Lead Management' },
      { slug: 'deals', label: 'Deals & Sales Pipeline' },
      { slug: 'tickets', label: 'Tickets & Support' },
    ],
    preview: modulePreviewRegistry.customers,
  },
  deals: {
    slug: 'deals',
    eyebrow: 'SALES PIPELINE',
    title: 'See where every opportunity stands.',
    description: 'Move opportunities through clear stages and review pipeline information in one organized sales workspace.',
    icon: BriefcaseBusiness,
    capabilities: [
      { title: 'Deal Records', description: 'Keep opportunity details organized.', icon: BriefcaseBusiness },
      { title: 'Sales Stages', description: 'Track progress through the pipeline.', icon: Check },
      { title: 'Deal Values', description: 'Review recorded deal amounts.', icon: CircleDollarSign },
      { title: 'Opportunity Overview', description: 'See deal information in context.', icon: MessageSquareText },
      { title: 'Pipeline Visibility', description: 'Understand which stage needs attention.', icon: BarChart3 },
    ],
    workflow: ['Create a deal', 'Update its stage', 'Review progress and next actions'],
    benefits: ['Spot stalled opportunities sooner', 'Keep the sales pipeline easy to scan', 'Support better stage-to-stage handoff decisions'],
    related: [
      { slug: 'leads', label: 'Lead Management' },
      { slug: 'quotes-orders', label: 'Quotes & Orders' },
      { slug: 'reports', label: 'Reports & Analytics' },
    ],
    preview: modulePreviewRegistry.deals,
  },
  'quotes-orders': {
    slug: 'quotes-orders',
    eyebrow: 'COMMERCIAL WORKFLOWS',
    title: 'Keep quotations and orders organized.',
    description: 'Prepare quotations and follow the path from proposal to order in a consistent commercial workflow.',
    icon: FileText,
    capabilities: [
      { title: 'Quotation Records', description: 'Organize quote information.', icon: FileText },
      { title: 'Quote Status', description: 'Review the current state of a quotation.', icon: Check },
      { title: 'Order Records', description: 'Keep order details organized.', icon: ClipboardCheck },
      { title: 'Customer Context', description: 'Connect commercial records with customers where supported.', icon: Users },
      { title: 'Workflow Visibility', description: 'Review progress from proposal to order.', icon: ArrowRight },
    ],
    workflow: ['Prepare a quotation', 'Review its status', 'Track the related order'],
    benefits: ['Keep commercial records aligned with customer context', 'Reduce ambiguity between proposal and order stages', 'Improve clarity for the next commercial action'],
    related: [
      { slug: 'deals', label: 'Deals & Sales Pipeline' },
      { slug: 'customers', label: 'Customer Management' },
      { slug: 'invoices', label: 'Invoices & Payments' },
    ],
    preview: modulePreviewRegistry['quotes-orders'],
  },
  invoices: {
    slug: 'invoices',
    eyebrow: 'FINANCIAL WORKSPACE',
    title: 'Make invoice and payment status easier to follow.',
    description: 'Issue invoices and record payment progress in one organized workspace.',
    icon: CircleDollarSign,
    capabilities: [
      { title: 'Invoice Records', description: 'Keep invoice information organized.', icon: CircleDollarSign },
      { title: 'Invoice Status', description: 'Review current invoice states.', icon: Check },
      { title: 'Payment Tracking', description: 'Record and review payment progress where implemented.', icon: ClipboardCheck },
      { title: 'Financial Context', description: 'Keep recorded invoice information accessible.', icon: MessageSquareText },
      { title: 'Invoice Overview', description: 'Review outstanding or recorded amounts where supported.', icon: BarChart3 },
    ],
    workflow: ['Create or review an invoice', 'Record payment activity where supported', 'Check the updated status'],
    benefits: ['Keep billing data visible in the same workspace as the customer', 'Track payment progress without chasing information across tools', 'Speed up follow-ups on pending or overdue records'],
    related: [
      { slug: 'quotes-orders', label: 'Quotes & Orders' },
      { slug: 'customers', label: 'Customer Management' },
      { slug: 'reports', label: 'Reports & Analytics' },
    ],
    preview: modulePreviewRegistry.invoices,
  },
  calls: {
    slug: 'calls',
    eyebrow: 'CUSTOMER COMMUNICATION',
    title: 'Keep call activity and follow-ups in context.',
    description: 'Log calls, review call notes and explore the demo recording interface in the CRM workspace.',
    icon: PhoneCall,
    capabilities: [
      { title: 'Call Logs', description: 'Review recorded call entries.', icon: PhoneCall },
      { title: 'Call Notes', description: 'Keep available call notes organized.', icon: MessageSquareText },
      { title: 'Call Outcomes', description: 'Review recorded dispositions where supported.', icon: Check },
      { title: 'Follow-up Context', description: 'Connect calls to related work where supported.', icon: ClipboardCheck },
      { title: 'Recording Interface', description: 'Preview the existing demo recording interface.', icon: FileText },
    ],
    workflow: ['Record a call', 'Review notes and outcome', 'Plan a follow-up'],
    benefits: ['Keep conversation context close to customer records', 'Support better follow-up from a single workspace', 'See the recent communication trail without losing the next action'],
    related: [
      { slug: 'customers', label: 'Customer Management' },
      { slug: 'tasks', label: 'Tasks & Follow-ups' },
      { slug: 'reports', label: 'Reports & Analytics' },
    ],
    preview: modulePreviewRegistry.calls,
  },
  tasks: {
    slug: 'tasks',
    eyebrow: 'TEAM PRODUCTIVITY',
    title: 'Turn conversations into clear next actions.',
    description: 'Organize reminders, owners and next actions across your work.',
    icon: ClipboardCheck,
    capabilities: [
      { title: 'Task Records', description: 'Keep work items organized.', icon: ClipboardCheck },
      { title: 'Task Status', description: 'Review progress through available states.', icon: Check },
      { title: 'Ownership', description: 'Display assigned team members where supported.', icon: Users },
      { title: 'Due Dates', description: 'Keep scheduled work visible.', icon: MessageSquareText },
      { title: 'Follow-up Planning', description: 'Organize the next step in a workflow.', icon: ArrowRight },
    ],
    workflow: ['Create a task', 'Assign responsibility where supported', 'Review progress'],
    benefits: ['Make ownership visible across the team', 'Keep due dates and next steps organized', 'Reduce missed work between conversations and decisions'],
    related: [
      { slug: 'leads', label: 'Lead Management' },
      { slug: 'calls', label: 'Calls & Call Center' },
      { slug: 'team', label: 'Team & Permissions' },
    ],
    preview: modulePreviewRegistry.tasks,
  },
  tickets: {
    slug: 'tickets',
    eyebrow: 'CUSTOMER SUPPORT',
    title: 'Keep customer issues organized from start to follow-up.',
    description: 'Track support requests, their status and the team’s response work.',
    icon: Headphones,
    capabilities: [
      { title: 'Ticket Records', description: 'Organize customer support requests.', icon: Headphones },
      { title: 'Ticket Status', description: 'Review the current state of each ticket.', icon: Check },
      { title: 'Issue Context', description: 'Keep available issue details together.', icon: MessageSquareText },
      { title: 'Team Follow-up', description: 'Review support work and next actions where supported.', icon: Users },
      { title: 'Support Overview', description: 'Browse ticket information in a structured workspace.', icon: FileText },
    ],
    workflow: ['Record a ticket', 'Review its status', 'Track the next support action'],
    benefits: ['Bring support work into a single, readable queue', 'Keep issue context together so handoffs stay clear', 'Help teams act on the right customer request sooner'],
    related: [
      { slug: 'customers', label: 'Customer Management' },
      { slug: 'tasks', label: 'Tasks & Follow-ups' },
      { slug: 'reports', label: 'Reports & Analytics' },
    ],
    preview: modulePreviewRegistry.tickets,
  },
  reports: {
    slug: 'reports',
    eyebrow: 'BUSINESS VISIBILITY',
    title: 'Turn CRM activity into a clearer overview.',
    description: 'Explore demo dashboards for pipeline and revenue activity.',
    icon: BarChart3,
    capabilities: [
      { title: 'Pipeline Overview', description: 'Review available sales pipeline information.', icon: BarChart3 },
      { title: 'Revenue Views', description: 'Explore supported revenue summaries.', icon: CircleDollarSign },
      { title: 'Activity Reporting', description: 'Review available operational activity.', icon: ClipboardCheck },
      { title: 'Reporting Filters', description: 'Use filters that actually exist in the dashboard.', icon: Check },
      { title: 'Visual Summaries', description: 'Present available records through readable charts.', icon: MessageSquareText },
    ],
    workflow: ['Choose an available report', 'Review the displayed information', 'Identify areas that need attention'],
    benefits: ['See the broader picture without leaving the CRM', 'Spot operational patterns in a simple view', 'Support quicker team discussions around pipeline and activity'],
    related: [
      { slug: 'deals', label: 'Deals & Sales Pipeline' },
      { slug: 'invoices', label: 'Invoices & Payments' },
      { slug: 'team', label: 'Team & Permissions' },
    ],
    preview: modulePreviewRegistry.reports,
  },
  team: {
    slug: 'team',
    eyebrow: 'TEAM WORKSPACE',
    title: 'Make team responsibilities easier to understand.',
    description: 'Preview team roles and permission settings; server enforcement is in development.',
    icon: ShieldCheck,
    capabilities: [
      { title: 'Team Overview', description: 'Review the available team interface.', icon: ShieldCheck },
      { title: 'Role Preview', description: 'Understand the roles displayed in the UI.', icon: Users },
      { title: 'Permission Settings', description: 'Preview available permission controls.', icon: Check },
      { title: 'Membership Context', description: 'Show membership information where supported.', icon: MessageSquareText },
      { title: 'Access Management Roadmap', description: 'Clearly communicate what remains in development.', icon: ArrowRight },
    ],
    workflow: ['Review team members', 'Inspect available roles', 'Review permission settings'],
    benefits: ['Clarify responsibilities across the team', 'Give stakeholders a clear preview of access settings', 'Set expectations early when server enforcement is still in progress'],
    related: [
      { slug: 'tasks', label: 'Tasks & Follow-ups' },
      { slug: 'reports', label: 'Reports & Analytics' },
      { slug: 'customers', label: 'Customer Management' },
    ],
    preview: modulePreviewRegistry.team,
  },
};
