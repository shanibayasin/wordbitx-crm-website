import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Briefcase,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';

interface Props {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<Props> = ({ lead, onClose }) => {
  const { updateLead, deleteLead, formatCurrency, setIsCreateDealOpen } = useCrm();
  const [notes, setNotes] = useState(lead?.notes || '');
  const [isSavedNotes, setIsSavedNotes] = useState(false);

  if (!lead) return null;

  const handleStatusChange = (newStatus: LeadStatus) => {
    updateLead(lead.id, { status: newStatus });
  };

  const handleSaveNotes = () => {
    updateLead(lead.id, { notes });
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to remove lead for ${lead.company}?`)) {
      deleteLead(lead.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-lg flex items-center justify-center shrink-0">
              {lead.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{lead.name}</h3>
                <span className="text-xs text-slate-400 font-medium">· {lead.title}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span className="text-slate-300 font-semibold">{lead.company}</span>
                <span>/</span>
                <span>{lead.industry}</span>
                <span>/</span>
                <span>{lead.location}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs">
          {/* Status & Valuation Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/40 rounded-lg border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">Status Lifecycle</div>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Disqualified">Disqualified</option>
              </select>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 mb-1">Lead Quality Score</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      lead.score > 80 ? 'bg-emerald-500' : lead.score > 50 ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-200">{lead.score}/100</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 mb-1">Est. Deal Value</div>
              <div className="font-mono font-bold text-sm text-indigo-300">
                {formatCurrency(lead.dealEstimate)}
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:text-indigo-400 underline truncate">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{lead.location}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-300">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Source: {lead.source}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Assigned Owner: {lead.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Created {lead.createdAt} · Contacted {lead.lastContacted}</span>
              </div>
            </div>
          </div>

          {/* Account Intelligence Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">Account Intelligence & Rep Notes</span>
              {isSavedNotes && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              placeholder="Record procurement discussions, blockers, next steps..."
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Lead
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsCreateDealOpen(true);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors cursor-pointer"
            >
              Convert to Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
