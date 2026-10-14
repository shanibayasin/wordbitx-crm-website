import React, { useState } from 'react';
import { X, ArrowRight, Building, Briefcase, CheckCircle2 } from 'lucide-react';
import { Lead } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';

interface Props {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
}

export const LeadConvertModal: React.FC<Props> = ({ isOpen, lead, onClose }) => {
  const { convertLead, formatCurrency, setCurrentModule } = useCrm();

  const [createCustomer, setCreateCustomer] = useState(true);
  const [createDeal, setCreateDeal] = useState(true);
  const [dealAmount, setDealAmount] = useState(lead?.dealEstimate || 50000);

  if (!isOpen || !lead) return null;

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    convertLead(lead.id, {
      createCustomer,
      createDeal,
      dealAmount,
    });
    onClose();
    if (createDeal) {
      setCurrentModule('deals');
    } else if (createCustomer) {
      setCurrentModule('customers');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Qualify & Convert Lead</h3>
              <p className="text-[11px] text-slate-400">
                Promote {lead.name} from prospect to enterprise records
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConvert} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0">
              {lead.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white">{lead.name} · {lead.title}</div>
              <div className="text-[11px] text-slate-400 truncate">{lead.company} · {lead.email}</div>
              <div className="text-[11px] text-indigo-300 font-mono mt-0.5">
                Valuation estimate: {formatCurrency(lead.dealEstimate)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={createCustomer}
                onChange={(e) => setCreateCustomer(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-indigo-600 rounded cursor-pointer"
              />
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Create Account / Customer Profile</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Establishes &ldquo;{lead.company}&rdquo; in the Customer directory with verified contact credentials and transaction history.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-950/40 rounded-lg border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={createDeal}
                onChange={(e) => setCreateDeal(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-indigo-600 rounded cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Initialize Pipeline Opportunity Deal</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug mt-0.5 mb-2">
                  Adds opportunity to the Sales Kanban board in Qualified stage.
                </div>
                {createDeal && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Opportunity Amount ($)</label>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={dealAmount}
                      onChange={(e) => setDealAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!createCustomer && !createDeal}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded cursor-pointer transition-colors shadow-sm"
            >
              <span>Execute Conversion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
