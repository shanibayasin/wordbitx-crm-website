import {
Briefcase,
Layers,
Trash2,
X
} from 'lucide-react';
import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Deal,DealStage } from '../../types/crm';

interface Props {
  deal: Deal | null;
  onClose: () => void;
}

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'technical_review', label: 'Tech Review' },
  { id: 'proposal_sent', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
];

export const DealDetailModal: React.FC<Props> = ({ deal, onClose }) => {
  const { updateDealStage, deleteDeal, formatCurrency } = useCrm();
  if (!deal) return null;

  const handleStageSelect = (stage: DealStage) => {
    updateDealStage(deal.id, stage);
  };

  const handleDelete = () => {
    if (confirm(`Remove deal ${deal.title}?`)) {
      deleteDeal(deal.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">
                {deal.company}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] text-slate-400">ID: {deal.id}</span>
            </div>
            <h3 className="text-base font-bold text-white">{deal.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Key Deal Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/50 rounded-lg border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5">Deal Value</div>
              <div className="text-base font-bold font-mono text-indigo-300">
                {formatCurrency(deal.amountInUSD, {
                  originalCurrency: deal.currency,
                  originalAmount: deal.amount,
                  showOriginal: true,
                })}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5">Win Probability</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {deal.probability}%
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5">Expected Close</div>
              <div className="text-xs font-mono font-medium text-slate-200 mt-1">
                {deal.expectedClose}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5">Owner</div>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
                {deal.owner}
              </div>
            </div>
          </div>

          {/* Interactive Pipeline Stage Selector */}
          <div>
            <div className="text-xs font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Pipeline Stage Progression (Click to advance)</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1.5 bg-slate-950 rounded-lg border border-slate-800">
              {STAGES.map((s, idx) => {
                const isCurrent = (deal.stage === s.id);
                const isWon = s.id === 'closed_won';
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleStageSelect(s.id)}
                    className={`px-2 py-2 text-center rounded text-[11px] font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? isWon
                          ? 'bg-emerald-600 text-white font-bold shadow-md'
                          : 'bg-indigo-600 text-white font-bold shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="text-[9px] font-mono opacity-70 mb-0.5">0{idx + 1}</div>
                    <div className="truncate">{s.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Included Products & Scope */}
          <div>
            <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <span>Contracted Software Tiers & Add-ons</span>
            </div>
            <div className="space-y-1.5">
              {deal.products.map((prod, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-950/40 rounded border border-slate-850 flex items-center justify-between text-xs text-slate-300"
                >
                  <span className="font-medium text-slate-200">{prod}</span>
                  <span className="text-[11px] text-slate-400 font-mono">WordbitX Standard Terms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Point of Contact & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-200 mb-1.5">Key Stakeholder</div>
              <div className="p-3 bg-slate-950/40 rounded border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-200">{deal.contactName}</div>
                <div className="text-slate-400 text-[11px]">{deal.contactEmail}</div>
                <div className="text-[11px] text-slate-400">{deal.company}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-200 mb-1.5">Deal Intelligence Summary</div>
              <div className="p-3 bg-slate-950/40 rounded border border-slate-800 text-[11px] text-slate-300 leading-relaxed min-h-[70px]">
                {deal.notes}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Deal
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
