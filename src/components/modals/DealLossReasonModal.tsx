import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Deal } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';

interface Props {
  isOpen: boolean;
  deal: Deal | null;
  onClose: () => void;
}

export const DealLossReasonModal: React.FC<Props> = ({ isOpen, deal, onClose }) => {
  const { updateDealStage } = useCrm();

  const [reasonCategory, setReasonCategory] = useState('Competitor Selected');
  const [notes, setNotes] = useState('');

  if (!isOpen || !deal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = notes ? `${reasonCategory}: ${notes}` : reasonCategory;
    updateDealStage(deal.id, 'closed_lost', finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Record Deal Outcome: Closed Lost</h3>
              <p className="text-[11px] text-slate-400">Specify reason to maintain pipeline loss audit data</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <div className="text-slate-200 font-semibold mb-1">{deal.title}</div>
            <div className="text-[11px] text-slate-400">{deal.company}</div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Primary Loss Category *</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Competitor Selected">Competitor Selected (Salesforce / HubSpot)</option>
              <option value="Budget Frozen by CFO">Budget Frozen by CFO / Lack of Funding</option>
              <option value="Timing Postponed to 2027">Timing Postponed / Project Deferred</option>
              <option value="Missing Critical Feature">Missing Critical Feature / Custom Gap</option>
              <option value="Security or Legal Block">Security or Legal Compliance Block</option>
              <option value="Internal Sponsor Left">Internal Champion or Sponsor Left Company</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Debrief Details & Lessons Learned</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Competitor pricing delta, missing integrations, or future re-engagement window..."
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
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
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded cursor-pointer transition-colors shadow-sm"
            >
              Mark Closed Lost
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
