import React, { useEffect, useState } from 'react';
import {
  Search,
  X,
  Users,
  Briefcase,
  PhoneCall,
  Receipt,
  ArrowRight,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const CommandSearchModal: React.FC = () => {
  const {
    isCommandSearchOpen,
    setIsCommandSearchOpen,
    leads,
    deals,
    calls,
    invoices,
    setCurrentModule,
    setActiveLeadModal,
    setActiveDealModal,
    setActiveInvoiceModal,
    setActiveCall,
    formatCurrency,
  } = useCrm();

  const [query, setQuery] = useState('');

  // Global keydown listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandSearchOpen(!isCommandSearchOpen);
      }
      if (e.key === 'Escape' && isCommandSearchOpen) {
        setIsCommandSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandSearchOpen, setIsCommandSearchOpen]);

  if (!isCommandSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(trimmed) ||
      l.company.toLowerCase().includes(trimmed) ||
      l.email.toLowerCase().includes(trimmed)
  );

  const matchedDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(trimmed) ||
      d.company.toLowerCase().includes(trimmed) ||
      d.owner.toLowerCase().includes(trimmed)
  );

  const matchedCalls = calls.filter(
    (c) =>
      c.title.toLowerCase().includes(trimmed) ||
      c.customerName.toLowerCase().includes(trimmed) ||
      c.company.toLowerCase().includes(trimmed)
  );

  const matchedInvoices = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(trimmed) ||
      i.clientCompany.toLowerCase().includes(trimmed) ||
      i.clientName.toLowerCase().includes(trimmed)
  );

  const hasResults =
    matchedLeads.length > 0 ||
    matchedDeals.length > 0 ||
    matchedCalls.length > 0 ||
    matchedInvoices.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, deals, recordings, invoices..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-slate-500 hover:text-slate-300 mr-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsCommandSearchOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {!hasResults && query ? (
            <div className="py-12 text-center text-slate-500">
              No CRM records found matching &ldquo;{query}&rdquo;
            </div>
          ) : null}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Leads ({matchedLeads.length})</span>
              </div>
              <div className="space-y-1">
                {matchedLeads.slice(0, 3).map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => {
                      setCurrentModule('leads');
                      setActiveLeadModal(lead);
                      setIsCommandSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-300">
                        {lead.name} · {lead.company}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.title} · Score: {lead.score}/100 · Est: {formatCurrency(lead.dealEstimate)}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals */}
          {matchedDeals.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deals ({matchedDeals.length})</span>
              </div>
              <div className="space-y-1">
                {matchedDeals.slice(0, 3).map((deal) => (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => {
                      setCurrentModule('deals');
                      setActiveDealModal(deal);
                      setIsCommandSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-300">
                        {deal.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatCurrency(deal.amount)} · Stage: {deal.stage.replace('_', ' ')} · Owner: {deal.owner}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {matchedInvoices.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>Invoices ({matchedInvoices.length})</span>
              </div>
              <div className="space-y-1">
                {matchedInvoices.slice(0, 3).map((inv) => (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => {
                      setCurrentModule('invoices');
                      setActiveInvoiceModal(inv);
                      setIsCommandSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-300">
                        {inv.invoiceNumber} · {inv.clientCompany}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatCurrency(inv.subtotal)} · Status: {inv.status} · Due: {inv.dueDate}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calls */}
          {matchedCalls.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
                <span>Call Intelligence ({matchedCalls.length})</span>
              </div>
              <div className="space-y-1">
                {matchedCalls.slice(0, 3).map((call) => (
                  <button
                    key={call.id}
                    type="button"
                    onClick={() => {
                      setCurrentModule('calls');
                      setActiveCall(call);
                      setIsCommandSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-300">
                        {call.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {call.customerName} ({call.company}) · Sentiment: {call.sentiment}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono mr-1">
                ESC
              </kbd>
              to close
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 font-mono mr-1">
                ENTER
              </kbd>
              to open
            </span>
          </div>
          <span>WordbitX Global Index</span>
        </div>
      </div>
    </div>
  );
};
