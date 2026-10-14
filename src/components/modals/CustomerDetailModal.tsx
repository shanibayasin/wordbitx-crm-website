import {
Briefcase,
Calendar,
Globe,
Mail,
MapPin,
Phone,
Receipt,
X
} from 'lucide-react';
import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Customer } from '../../types/crm';

interface Props {
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<Props> = ({ customer, onClose }) => {
  const { deals, invoices, formatCurrency, convertAmount } = useCrm();

  if (!customer) return null;

  const relatedDeals = deals.filter(
    (d) => d.customerId === customer.id || d.company.toLowerCase() === customer.company.toLowerCase()
  );
  const relatedInvoices = invoices.filter(
    (i) => i.clientCompany.toLowerCase() === customer.company.toLowerCase()
  );
  const totalBilled = relatedInvoices.reduce((s, i) => s + convertAmount(i.totalAmount, i.currency, 'USD'), 0);
  const totalPaid = relatedInvoices.reduce((s, i) => s + convertAmount(i.paidAmount, i.currency, 'USD'), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-lg flex items-center justify-center shrink-0">
              {customer.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{customer.company}</h3>
                <span className="text-xs text-emerald-400 font-mono">· {customer.status}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-slate-300">{customer.name}</span>
                <span>/</span>
                <span>{customer.industry}</span>
                <span>/</span>
                <span>{customer.location}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Lifetime Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/50 rounded-lg border border-slate-800 font-mono">
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5 font-sans">Lifetime Invoiced</div>
              <div className="text-base font-bold text-white tabular-nums">
                {formatCurrency(totalBilled || customer.totalSpentUSD)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5 font-sans">Settled Payments</div>
              <div className="text-base font-bold text-emerald-400 tabular-nums">
                {formatCurrency(totalPaid || customer.totalSpentUSD)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5 font-sans">Active Deals</div>
              <div className="text-base font-bold text-indigo-300 tabular-nums">
                {relatedDeals.length}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5 font-sans">Account Owner</div>
              <div className="text-xs font-sans text-slate-200 mt-1 truncate">
                {customer.owner}
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <a href={`mailto:${customer.email}`} className="hover:text-indigo-400 underline">
                  {customer.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.location}</span>
              </div>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <a href={customer.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                  {customer.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Client Since: {customer.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Connected Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                <span>Associated Pipeline Opportunities ({relatedDeals.length})</span>
              </span>
            </div>
            {relatedDeals.length === 0 ? (
              <div className="p-3 bg-slate-950/40 rounded border border-slate-800 text-slate-500">
                No pipeline opportunities linked to this customer.
              </div>
            ) : (
              <div className="space-y-1.5">
                {relatedDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-2.5 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{deal.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Stage: {deal.stage.replace('_', ' ')} · Prob: {deal.probability}%
                      </div>
                    </div>
                    <div className="font-mono font-bold text-indigo-300">
                      {formatCurrency(deal.amountInUSD)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connected Invoices */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>Billing History & Invoices ({relatedInvoices.length})</span>
              </span>
            </div>
            {relatedInvoices.length === 0 ? (
              <div className="p-3 bg-slate-950/40 rounded border border-slate-800 text-slate-500">
                No invoices on record for this customer.
              </div>
            ) : (
              <div className="space-y-1.5 font-mono">
                {relatedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-2.5 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white font-sans">{inv.invoiceNumber}</span>
                      <span className="text-slate-400 text-[11px] ml-2">Due: {inv.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300">{formatCurrency(inv.totalAmount)}</span>
                      <span
                        className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded ${
                          inv.status === 'Paid'
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : 'text-amber-400 bg-amber-950/60'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
