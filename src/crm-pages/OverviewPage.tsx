import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Briefcase,
  Calendar,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Headphones,
  Layers,
  PhoneCall,
  Receipt,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Video,
  Wallet,
} from 'lucide-react';
import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { DealStage } from '../types/crm';

export const OverviewPage: React.FC<{ previewMode?: boolean }> = ({ previewMode = false }) => {
  const {
    deals,
    leads,
    customers,
    calls,
    invoices,
    tasks,
    meetings,
    tickets,
    activities,
    formatCurrency,
    convertAmount,
    currency,
    setCurrentModule,
    setIsCreateDealOpen,
    setIsCreateLeadOpen,
    setIsCreateTaskOpen,
    setIsLogCallOpen,
    setIsCreateInvoiceOpen,
  } = useCrm();

  const [dateFilter, setDateFilter] = useState<'Today' | '7D' | '30D' | 'Q3' | 'YTD'>('30D');

  // Dynamic calculations from underlying state
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'Qualified' || l.status === 'Proposal').length;

  const openDeals = deals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const wonDeals = deals.filter((d) => d.stage === 'closed_won');
  const lostDeals = deals.filter((d) => d.stage === 'closed_lost');

  const totalPipelineUSD = openDeals.reduce((sum, d) => sum + d.amountInUSD, 0);
  const totalWonRevenueUSD = wonDeals.reduce((sum, d) => sum + d.amountInUSD, 0);
  const weightedPipelineUSD = openDeals.reduce((sum, d) => sum + (d.amountInUSD * d.probability) / 100, 0);

  const outstandingInvoices = invoices.filter((i) => i.status === 'Pending' || i.status === 'Partially Paid' || i.status === 'Overdue');
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const totalOutstandingUSD = outstandingInvoices.reduce((sum, i) => sum + convertAmount(i.balanceDue, i.currency, 'USD'), 0);
  const totalOverdueUSD = overdueInvoices.reduce((sum, i) => sum + convertAmount(i.balanceDue, i.currency, 'USD'), 0);

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const callsWithRecordings = calls.filter((c) => c.recordingStatus === 'Available').length;

  // Pipeline stage breakdown
  const stages: { stage: DealStage; label: string; count: number; valueUSD: number }[] = [
    {
      stage: 'discovery',
      label: 'Discovery',
      count: deals.filter((d) => d.stage === 'discovery').length,
      valueUSD: deals.filter((d) => d.stage === 'discovery').reduce((s, d) => s + d.amountInUSD, 0),
    },
    {
      stage: 'qualified',
      label: 'Qualified',
      count: deals.filter((d) => d.stage === 'qualified').length,
      valueUSD: deals.filter((d) => d.stage === 'qualified').reduce((s, d) => s + d.amountInUSD, 0),
    },
    {
      stage: 'technical_review',
      label: 'Tech Review',
      count: deals.filter((d) => d.stage === 'technical_review').length,
      valueUSD: deals.filter((d) => d.stage === 'technical_review').reduce((s, d) => s + d.amountInUSD, 0),
    },
    {
      stage: 'proposal_sent',
      label: 'Proposal',
      count: deals.filter((d) => d.stage === 'proposal_sent').length,
      valueUSD: deals.filter((d) => d.stage === 'proposal_sent').reduce((s, d) => s + d.amountInUSD, 0),
    },
    {
      stage: 'negotiation',
      label: 'Negotiation',
      count: deals.filter((d) => d.stage === 'negotiation').length,
      valueUSD: deals.filter((d) => d.stage === 'negotiation').reduce((s, d) => s + d.amountInUSD, 0),
    },
    {
      stage: 'closed_won',
      label: 'Closed Won',
      count: deals.filter((d) => d.stage === 'closed_won').length,
      valueUSD: deals.filter((d) => d.stage === 'closed_won').reduce((s, d) => s + d.amountInUSD, 0),
    },
  ];

  const maxStageVal = Math.max(...stages.map((s) => s.valueUSD), 1);
  const pipelineChartPoints = stages.map((stage, index) => ({
    x: 30 + index * 98,
    y: 150 - (stage.valueUSD / maxStageVal) * 105,
  }));
  const pipelineChartPath = pipelineChartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(' ');
  const pipelineSparklinePath = stages
    .map((stage, index) => `${index * 18},${27 - (stage.valueUSD / maxStageVal) * 22}`)
    .join(' ');
  const firstChartPoint = pipelineChartPoints[0];
  const lastChartPoint = pipelineChartPoints[pipelineChartPoints.length - 1];
  const pipelineAreaPath = `${pipelineChartPath} ${lastChartPoint.x},150 ${firstChartPoint.x},150`;
  const distributionTotal = totalPipelineUSD + totalWonRevenueUSD + totalOutstandingUSD;
  const distributionCircumference = 326.73;
  const distributionParts = [
    { label: 'Open pipeline', value: totalPipelineUSD, color: '#0ca986' },
    { label: 'Closed won', value: totalWonRevenueUSD, color: '#0a3f34' },
    { label: 'Outstanding invoices', value: totalOutstandingUSD, color: '#a8dccc' },
  ].map((part) => ({
    ...part,
    share: distributionTotal > 0 ? part.value / distributionTotal : 0,
  }));
  const activeDeals = [...openDeals]
    .sort((firstDeal, secondDeal) => secondDeal.amountInUSD - firstDeal.amountInUSD)
    .slice(0, 4);
  const openSupportTickets = tickets.filter((ticket) => ticket.status === 'Open').length;

  // Conversion Funnel calculations
  const totalProspectsCount = totalLeads || 1;
  const qualifiedPct = Math.round((qualifiedLeads / totalProspectsCount) * 100);
  const dealCreatedPct = Math.round((deals.length / totalProspectsCount) * 100);
  const wonPct = Math.round((wonDeals.length / totalProspectsCount) * 100);

  return (
    <div className="overview-page space-y-3 animate-fade-in">
      {/* Top Header & Fast Action Toolbar */}
      <div className="overview-heading-row flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="overview-eyebrow"><Activity size={12} /> REVENUE &amp; OPERATIONS</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
            <span>{previewMode ? 'Executive Revenue Dashboard' : 'Executive Overview'}</span>
            <span className="overview-currency-tag">Reporting in {currency}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor sales performance, customer relationships, follow-ups and service operations from one workspace.
          </p>
        </div>

        <div className="overview-toolbar-actions flex flex-wrap items-center gap-2">
          {/* Timeframe Filter */}
          <div className="overview-period-filter flex items-center bg-white border border-slate-200 rounded-lg p-1 text-xs">
            {(['Today', '7D', '30D', 'Q3', 'YTD'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setDateFilter(period)}
                className={`overview-period-button px-2.5 py-1 text-xs rounded cursor-pointer transition-colors ${
                  dateFilter === period
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {{ Today: 'Today', '7D': 'Last 7 days', '30D': 'Last 30 days', Q3: 'This quarter', YTD: 'Year to date' }[period]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsCreateLeadOpen(true)}
            className="overview-quick-action flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            <span>Lead</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateDealOpen(true)}
            className="overview-quick-action flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
            <span>Deal</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateTaskOpen(true)}
            className="overview-quick-action flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLogCallOpen(true)}
            className="overview-quick-action flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>Call</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateInvoiceOpen(true)}
            className="overview-quick-action flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors cursor-pointer shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoice</span>
          </button>
        </div>
      </div>

      {/* Row 1: Executive KPI Metrics Grid */}
      <div className="overview-kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <article className="overview-kpi-card overview-kpi-primary">
          <div className="overview-kpi-heading">
            <span><CircleDollarSign size={14} /> Open pipeline</span>
            <small>{openDeals.length} active deals</small>
          </div>
          <strong>{formatCurrency(totalPipelineUSD)}</strong>
          <div className="overview-kpi-foot">
            <span>Weighted forecast</span>
            <b>{formatCurrency(weightedPipelineUSD)}</b>
            <svg viewBox="0 0 100 30" aria-hidden="true"><polyline points={pipelineSparklinePath} /></svg>
          </div>
        </article>

        <article className="overview-kpi-card">
          <div className="overview-kpi-heading">
            <span><TrendingUp size={14} /> Closed-won revenue</span>
            <small>{wonDeals.length} won deals</small>
          </div>
          <strong>{formatCurrency(totalWonRevenueUSD)}</strong>
          <div className="overview-kpi-foot">
            <span>Win rate</span>
            <b>{Math.round((wonDeals.length / Math.max(1, wonDeals.length + lostDeals.length)) * 100)}%</b>
            <span className="overview-kpi-note">{lostDeals.length} lost</span>
          </div>
        </article>

        <article className="overview-kpi-card">
          <div className="overview-kpi-heading">
            <span><Receipt size={14} /> Outstanding invoices</span>
            <small>{outstandingInvoices.length} invoices</small>
          </div>
          <strong>{formatCurrency(totalOutstandingUSD)}</strong>
          <div className="overview-kpi-foot">
            <span>Overdue amount</span>
            <b className="overview-value-alert">{formatCurrency(totalOverdueUSD)}</b>
            <span className="overview-kpi-note">{overdueInvoices.length} overdue</span>
          </div>
        </article>

        <article className="overview-kpi-card">
          <div className="overview-kpi-heading">
            <span><Users size={14} /> Customer &amp; lead overview</span>
            <small>{customers.length} accounts</small>
          </div>
          <strong>{totalLeads} leads</strong>
          <div className="overview-kpi-foot">
            <span>{qualifiedLeads} qualified</span>
            <b>{newLeads} new</b>
            <span className="overview-kpi-note">{customers.filter((customer) => customer.status === 'Active').length} active customers</span>
          </div>
        </article>
      </div>

      <section className="overview-status-strip" aria-label="Operational status">
        <div className="overview-status-item"><CalendarDays size={15} /><span><small>UPCOMING MEETINGS</small><strong>{meetings.length} scheduled</strong></span></div>
        <div className="overview-status-item"><CheckSquare size={15} /><span><small>OPEN TASKS</small><strong>{pendingTasks.length} to follow up</strong></span></div>
        <div className="overview-status-item"><AlertTriangle size={15} /><span><small>OVERDUE INVOICES</small><strong>{overdueInvoices.length} need attention</strong></span></div>
        <div className="overview-status-item"><Headphones size={15} /><span><small>OPEN SUPPORT</small><strong>{openSupportTickets} tickets</strong></span></div>
        <div className="overview-status-item"><PhoneCall size={15} /><span><small>CALL RECORDINGS</small><strong>{callsWithRecordings} available</strong></span></div>
      </section>

      <section className="overview-revenue-grid" aria-label="Revenue analytics">
        <article className="overview-panel overview-revenue-panel">
          <div className="overview-panel-heading">
            <div>
              <h2><TrendingUp size={15} /> Revenue performance &amp; forecast</h2>
              <p>Pipeline value by stage, based on current CRM records.</p>
            </div>
            <span className="overview-chart-badge"><Activity size={12} /> LIVE DATA</span>
          </div>
          <div className="overview-line-chart">
            <div className="overview-chart-y-labels"><span>{formatCurrency(maxStageVal)}</span><span>{formatCurrency(maxStageVal / 2)}</span><span>$0</span></div>
            <svg viewBox="0 0 560 170" role="img" aria-label="Pipeline value by sales stage">
              <defs>
                <linearGradient id="overview-chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#12ad8a" stopOpacity=".22" />
                  <stop offset="100%" stopColor="#12ad8a" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[45, 98, 150].map((lineY) => <line key={lineY} x1="24" x2="526" y1={lineY} y2={lineY} className="overview-chart-gridline" />)}
              <polygon points={pipelineAreaPath} fill="url(#overview-chart-fill)" transform="translate(0 0)" />
              <polyline points={pipelineChartPath} className="overview-chart-line" />
              {pipelineChartPoints.map((point, index) => <circle key={stages[index].stage} cx={point.x} cy={point.y} r="3.5" className="overview-chart-point" />)}
            </svg>
          </div>
          <div className="overview-chart-x-labels">
            {stages.map((stage) => <span key={stage.stage}>{stage.label}</span>)}
          </div>
          <div className="overview-panel-foot"><span><i className="overview-legend-dot" /> Current pipeline</span><strong>{formatCurrency(totalPipelineUSD + totalWonRevenueUSD)} total value</strong></div>
        </article>

        <article className="overview-panel overview-distribution-panel">
          <div className="overview-panel-heading">
            <div>
              <h2><CircleDollarSign size={15} /> Revenue distribution</h2>
              <p>Across pipeline, closed deals and receivables.</p>
            </div>
            <span className="overview-info-icon" title="Values normalized to USD"><BarChart3 size={14} /></span>
          </div>
          <div className="overview-donut-layout">
            <div className="overview-donut-wrap">
              <svg viewBox="0 0 160 160" role="img" aria-label="Revenue distribution by source">
                <circle cx="80" cy="80" r="52" className="overview-donut-track" />
                <circle cx="80" cy="80" r="52" stroke={distributionParts[0].color} strokeDasharray={`${distributionParts[0].share * distributionCircumference} ${distributionCircumference}`} strokeDashoffset="0" className="overview-donut-segment" />
                <circle cx="80" cy="80" r="52" stroke={distributionParts[1].color} strokeDasharray={`${distributionParts[1].share * distributionCircumference} ${distributionCircumference}`} strokeDashoffset={-distributionParts[0].share * distributionCircumference} className="overview-donut-segment" />
                <circle cx="80" cy="80" r="52" stroke={distributionParts[2].color} strokeDasharray={`${distributionParts[2].share * distributionCircumference} ${distributionCircumference}`} strokeDashoffset={-(distributionParts[0].share + distributionParts[1].share) * distributionCircumference} className="overview-donut-segment" />
              </svg>
              <div><small>TOTAL VALUE</small><strong>{formatCurrency(distributionTotal)}</strong></div>
            </div>
            <div className="overview-distribution-legend">
              {distributionParts.map((part) => (
                <div key={part.label}>
                  <span><i style={{ backgroundColor: part.color }} />{part.label}</span>
                  <strong>{formatCurrency(part.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* Row 2: Lead Funnel & Pipeline Funnel Split */}
      <div className="overview-funnel-grid grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Pipeline By Stage */}
        <div className="overview-panel overview-funnel-panel p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>Pipeline Breakdown By Stage</span>
              </h2>
              <button
                type="button"
                onClick={() => setCurrentModule('deals')}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
              >
                Kanban <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {stages.map((stg) => {
                const pct = (stg.valueUSD / maxStageVal) * 100;
                return (
                  <div key={stg.stage} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300 font-medium">{stg.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {stg.count} {stg.count === 1 ? 'deal' : 'deals'}
                        </span>
                        <span className="font-mono font-bold text-slate-800 tabular-nums">
                          {formatCurrency(stg.valueUSD)}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          stg.stage === 'closed_won' ? 'bg-emerald-600' : 'bg-emerald-700'
                        }`}
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total Value Across All Stages:</span>
            <span className="font-mono font-bold text-white">
              {formatCurrency(totalPipelineUSD + totalWonRevenueUSD)}
            </span>
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="overview-panel overview-funnel-panel p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-700" />
                <span>Lead Conversion & Velocity Funnel</span>
              </h2>
              <button
                type="button"
                onClick={() => setCurrentModule('leads')}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
              >
                Leads <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Stage 1 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">1. Raw Inbound / Outreach Prospects</span>
                  <span className="font-mono font-bold text-white">{totalLeads} Leads (100%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-indigo-500 rounded-full w-full" />
                </div>
              </div>

              {/* Stage 2 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">2. Sales Qualified Leads (SQL)</span>
                  <span className="font-mono font-bold text-indigo-300">
                    {qualifiedLeads} Leads ({qualifiedPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-400 rounded-full"
                    style={{ width: `${Math.max(10, qualifiedPct)}%` }}
                  />
                </div>
              </div>

              {/* Stage 3 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">3. Converted to Pipeline Opportunity</span>
                  <span className="font-mono font-bold text-amber-300">
                    {deals.length} Opportunities ({dealCreatedPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.max(8, dealCreatedPct)}%` }}
                  />
                </div>
              </div>

              {/* Stage 4 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">4. Signed Enterprise Contracts</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {wonDeals.length} Accounts ({wonPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.max(6, wonPct)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Overall Inbound-to-Customer Yield:</span>
            <span className="font-mono font-bold text-emerald-400">{wonPct}% Conversion</span>
          </div>
        </div>
      </div>

      <section className="overview-lower-grid" aria-label="Pipeline and invoices">
        <article className="overview-panel overview-data-panel">
          <div className="overview-panel-heading">
            <div>
              <h2><Briefcase size={15} /> Active high-value opportunities</h2>
              <p>Open deals ranked by current value.</p>
            </div>
            <button type="button" onClick={() => setCurrentModule('deals')} className="overview-panel-link">
              View all deals <ArrowRight size={13} />
            </button>
          </div>
          <div className="overview-data-table">
            <div className="overview-table-heading"><span>DEAL &amp; ORGANIZATION</span><span>VALUE</span><span>STAGE</span><span>OWNER</span></div>
            {activeDeals.map((deal) => (
              <button className="overview-data-row" key={deal.id} type="button" onClick={() => setCurrentModule('deals')}>
                <span className="overview-deal-name"><b>{deal.company}</b><small>{deal.title}</small></span>
                <strong>{formatCurrency(deal.amountInUSD)}</strong>
                <span className="overview-stage-tag">{stages.find((stage) => stage.stage === deal.stage)?.label ?? deal.stage}</span>
                <span>{deal.owner}</span>
              </button>
            ))}
            {activeDeals.length === 0 && <p className="overview-empty-state">No active opportunities to display.</p>}
          </div>
          <div className="overview-panel-foot"><span>{activeDeals.length} of {openDeals.length} active deals shown</span><strong>{formatCurrency(totalPipelineUSD)} pipeline</strong></div>
        </article>

        <article className="overview-panel overview-data-panel overview-invoice-panel">
          <div className="overview-panel-heading">
            <div>
              <h2><Wallet size={15} /> Outstanding invoices</h2>
              <p>Balances that may need a follow-up.</p>
            </div>
            <button type="button" onClick={() => setCurrentModule('invoices')} className="overview-panel-link">
              All invoices <ArrowRight size={13} />
            </button>
          </div>
          <div className="overview-invoice-list">
            {outstandingInvoices.slice(0, 4).map((invoice) => (
              <button className="overview-invoice-row" key={invoice.id} type="button" onClick={() => setCurrentModule('invoices')}>
                <span className="overview-invoice-icon"><FileText size={14} /></span>
                <span className="overview-invoice-name"><b>{invoice.invoiceNumber}</b><small>{invoice.clientCompany}</small></span>
                <span className="overview-invoice-balance"><b>{formatCurrency(convertAmount(invoice.balanceDue, invoice.currency, 'USD'))}</b><small className={invoice.status === 'Overdue' ? 'is-overdue' : ''}>{invoice.status}</small></span>
              </button>
            ))}
            {outstandingInvoices.length === 0 && <p className="overview-empty-state">All invoices are up to date.</p>}
          </div>
          <div className="overview-panel-foot"><span>{overdueInvoices.length} overdue</span><strong>{formatCurrency(totalOutstandingUSD)} outstanding</strong></div>
        </article>
      </section>

      {/* Upcoming Meetings & High Priority Follow-Ups */}
      <div className="overview-activity-grid grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Scheduled Client Meetings (1 Column) */}
        <div className="overview-panel overview-activity-card p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Upcoming Client Meetings</span>
              </h2>
              <button
                type="button"
                onClick={() => setCurrentModule('tasks')}
                className="text-[11px] text-emerald-700 hover:text-emerald-900"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3">
              {meetings.slice(0, 3).map((m) => (
                <div key={m.id} className="overview-mini-card p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-900 truncate">{m.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{m.clientCompany}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-850 font-mono text-[10px] text-slate-500">
                    <span>{m.date} · {m.startTime}</span>
                    <a
                      href={m.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      <Video className="w-3 h-3 text-emerald-700" />
                      <span>Join</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Urgent Follow-Up Tasks (1 Column) */}
        <div className="overview-panel overview-activity-card p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>Action Items & Follow-ups</span>
              </h2>
              <button
                type="button"
                onClick={() => setCurrentModule('tasks')}
                className="text-[11px] text-emerald-700 hover:text-emerald-900"
              >
                All Tasks ({pendingTasks.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.slice(0, 3).map((t) => (
                <div key={t.id} className="overview-mini-card p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900 leading-snug truncate">{t.title}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                        t.priority === 'Urgent'
                          ? 'text-rose-400 bg-rose-950/50'
                          : 'text-amber-400 bg-amber-950/50'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{t.description}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-850 text-[10px] font-mono text-slate-500">
                    <span>Due: {t.dueDate}</span>
                    <span className="text-slate-300">{t.assignedTo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Telephony & Support Activity (1 Column) */}
        <div className="overview-panel overview-activity-card p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>Call Center & Support Health</span>
              </h2>
              <button
                type="button"
                onClick={() => setCurrentModule('calls')}
                className="text-[11px] text-emerald-700 hover:text-emerald-900"
              >
                Calls
              </button>
            </div>

            <div className="overview-mini-card p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-2 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded Calls:</span>
                <span className="font-mono font-bold text-slate-900">{callsWithRecordings} audio streams</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Open Incident Tickets:</span>
                <span className="font-mono font-bold text-amber-400">
                  {tickets.filter((t) => t.status === 'Open').length} tickets
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Sentiment:</span>
                <span className="font-mono font-bold text-emerald-400">76% Positive</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Latest Activity:
              <div className="font-semibold text-slate-200 mt-1">
                {activities[0]?.title || 'Audit event logged'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {activities[0]?.timestamp || 'Just now'} · {activities[0]?.user}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <span className="text-[10px] text-slate-500"><Clock3 className="inline h-3 w-3 mr-1" />Live CRM data synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
