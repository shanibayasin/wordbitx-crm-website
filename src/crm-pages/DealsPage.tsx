import {
ArrowLeft,
ArrowRight,
LayoutGrid,
List,
Plus,
Search
} from 'lucide-react';
import React,{ useState } from 'react';
import { DealLossReasonModal } from '../components/modals/DealLossReasonModal';
import { useCrm } from '../context/CrmContext';
import { Deal,DealStage } from '../types/crm';

const PIPELINE_COLUMNS: { id: DealStage; title: string; color: string }[] = [
  { id: 'discovery', title: 'Discovery', color: 'border-slate-700' },
  { id: 'qualified', title: 'Qualified', color: 'border-blue-500/50' },
  { id: 'technical_review', title: 'Tech Review', color: 'border-purple-500/50' },
  { id: 'proposal_sent', title: 'Proposal Sent', color: 'border-amber-500/50' },
  { id: 'negotiation', title: 'Negotiation', color: 'border-indigo-500/50' },
  { id: 'closed_won', title: 'Closed Won', color: 'border-emerald-500/50' },
  { id: 'closed_lost', title: 'Closed Lost', color: 'border-rose-500/50' },
];

export const DealsPage: React.FC = () => {
  const {
    deals,
    updateDealStage,
    formatCurrency,
    setActiveDealModal,
    setIsCreateDealOpen,
  } = useCrm();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [dealForLossModal, setDealForLossModal] = useState<Deal | null>(null);

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = ownerFilter === 'All' || d.owner === ownerFilter;
    return matchesSearch && matchesOwner;
  });

  const getStageTotalUSD = (stage: DealStage) => {
    return filteredDeals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + d.amountInUSD, 0);
  };

  const stageOrder: DealStage[] = [
    'discovery',
    'qualified',
    'technical_review',
    'proposal_sent',
    'negotiation',
    'closed_won',
  ];

  const moveDeal = (deal: Deal, direction: 'prev' | 'next') => {
    const currentIndex = stageOrder.indexOf(deal.stage);
    if (direction === 'prev' && currentIndex > 0) {
      updateDealStage(deal.id, stageOrder[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < stageOrder.length - 1) {
      updateDealStage(deal.id, stageOrder[currentIndex + 1]);
    }
  };

  const owners = Array.from(new Set(deals.map((d) => d.owner)));

  // Weighted total calculation
  const totalWeightedUSD = filteredDeals
    .filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost')
    .reduce((s, d) => s + (d.amountInUSD * d.probability) / 100, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Sales Pipeline & Deals Kanban</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Weighted: {formatCurrency(totalWeightedUSD)}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage progression, deal velocity, multi-currency transaction preservation, and revenue forecasting
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table Grid View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateDealOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals by name, company, or owner..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Executive Owner:</span>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Reps</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 pb-4 overflow-x-auto">
          {PIPELINE_COLUMNS.map((col) => {
            const colDeals = filteredDeals.filter((d) => d.stage === col.id);
            const colTotalUSD = getStageTotalUSD(col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-900/60 rounded-xl border border-slate-800/90 flex flex-col min-w-[210px] max-h-[78vh]"
              >
                {/* Column Header */}
                <div className={`p-3 border-b ${col.color} bg-slate-950/40 rounded-t-xl`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white tracking-tight truncate">
                      {col.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {colDeals.length}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-indigo-300 tabular-nums">
                    {formatCurrency(colTotalUSD)}
                  </div>
                </div>

                {/* Column Cards */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[160px]">
                  {colDeals.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-600 font-mono">
                      No deals in stage
                    </div>
                  ) : (
                    colDeals.map((deal) => {
                      const currentIdx = stageOrder.indexOf(deal.stage);
                      return (
                        <div
                          key={deal.id}
                          className="p-3 bg-slate-950/90 hover:bg-slate-900 border border-slate-800/80 rounded-lg shadow-sm transition-all text-xs group cursor-pointer"
                          onClick={() => setActiveDealModal(deal)}
                        >
                          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-0.5 truncate">
                            {deal.company}
                          </div>
                          <div className="font-semibold text-slate-100 group-hover:text-indigo-300 leading-snug line-clamp-2 mb-2">
                            {deal.title}
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold font-mono text-white tabular-nums">
                              {formatCurrency(deal.amountInUSD, {
                                originalCurrency: deal.currency,
                                originalAmount: deal.amount,
                                showOriginal: deal.currency !== 'USD',
                              })}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              {deal.probability}% win
                            </span>
                          </div>

                          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>

                          {deal.lossReason && (
                            <div className="p-1.5 bg-rose-950/40 border border-rose-900/40 rounded text-[10px] text-rose-300 mb-2 leading-tight">
                              Loss: {deal.lossReason}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-850">
                            <span className="truncate max-w-[90px]">{deal.owner}</span>
                            <span className="font-mono">{deal.expectedClose.slice(5)}</span>
                          </div>

                          {/* Quick Stage Controls */}
                          {deal.stage !== 'closed_lost' && (
                            <div
                              className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between opacity-80 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                disabled={currentIdx <= 0}
                                onClick={() => moveDeal(deal, 'prev')}
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                                title="Move back"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDealForLossModal(deal)}
                                className="text-[10px] font-mono text-rose-400 hover:underline cursor-pointer"
                              >
                                Lost ✕
                              </button>

                              <button
                                type="button"
                                disabled={currentIdx >= stageOrder.length - 1}
                                onClick={() => moveDeal(deal, 'next')}
                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                                title="Move forward"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Grid View */
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Opportunity & Account</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 font-mono text-right">Value (USD)</th>
                  <th className="py-3 px-4 font-mono text-center">Probability</th>
                  <th className="py-3 px-4 font-mono text-right">Weighted Forecast</th>
                  <th className="py-3 px-4">Target Close</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setActiveDealModal(deal)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {deal.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {deal.company} {deal.currency !== 'USD' && `· Invoiced in ${deal.currency}`}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 font-medium capitalize">
                        {deal.stage.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                      {formatCurrency(deal.amountInUSD)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-center tabular-nums text-slate-200">
                      {deal.probability}%
                    </td>

                    <td className="py-3.5 px-4 font-mono text-right text-indigo-300 font-semibold tabular-nums">
                      {formatCurrency((deal.amountInUSD * deal.probability) / 100)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {deal.expectedClose}
                    </td>

                    <td className="py-3.5 px-4 text-slate-200">
                      {deal.owner}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDealModal(deal);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loss Reason Modal */}
      <DealLossReasonModal
        isOpen={!!dealForLossModal}
        deal={dealForLossModal}
        onClose={() => setDealForLossModal(null)}
      />
    </div>
  );
};
