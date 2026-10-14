import {
AlertCircle,
CheckCircle,
Clock,
CreditCard,
Plus,
Search
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Invoice } from '../types/crm';

export const InvoicesPage: React.FC = () => {
  const {
    invoices,
    formatCurrency,
    convertAmount,
    setActiveInvoiceModal,
    setIsCreateInvoiceOpen,
    setIsRecordPaymentOpen,
    setInvoiceToPay,
  } = useCrm();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals normalized to USD base first
  const totalBilledUSD = invoices.reduce((sum, i) => sum + convertAmount(i.totalAmount, i.currency, 'USD'), 0);
  const totalPaidUSD = invoices.reduce((sum, i) => sum + convertAmount(i.paidAmount, i.currency, 'USD'), 0);
  const totalBalanceDueUSD = invoices.reduce((sum, i) => sum + convertAmount(i.balanceDue, i.currency, 'USD'), 0);
  const totalOverdueUSD = invoices
    .filter((i) => i.status === 'Overdue')
    .reduce((sum, i) => sum + convertAmount(i.balanceDue, i.currency, 'USD'), 0);

  const statuses: string[] = ['All', 'Paid', 'Partially Paid', 'Pending', 'Overdue', 'Draft'];

  const handleOpenPayment = (inv: Invoice) => {
    setInvoiceToPay(inv);
    setIsRecordPaymentOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Invoices & Accounts Receivable</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Billing Ledger
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Enterprise subscription billing, multi-currency invoices, partial payment reconciliation, and remittance wire records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateInvoiceOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue New Invoice</span>
        </button>
      </div>

      {/* Financial Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Gross Receivables Billed</div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(totalBilledUSD)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{invoices.length} total issued invoices</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Settled & Collected Cash</div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatCurrency(totalPaidUSD)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Reconciled via wire, ACH, and card
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Outstanding Balance Due</div>
          <div className="text-xl font-bold font-mono text-amber-300 tabular-nums">
            {formatCurrency(totalBalanceDueUSD)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pending Net 30/60 client terms</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Overdue Arrears</div>
          <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
            {formatCurrency(totalOverdueUSD)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {invoices.filter((i) => i.status === 'Overdue').length} past due accounts
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice # or client company..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 font-mono">Invoice #</th>
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4 font-mono">Issue Date</th>
                <th className="py-3 px-4 font-mono">Due Date</th>
                <th className="py-3 px-4 font-mono text-right">Invoice Total</th>
                <th className="py-3 px-4 font-mono text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No invoices found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setActiveInvoiceModal(inv)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200 group-hover:text-indigo-400">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{inv.clientCompany}</div>
                      <div className="text-[11px] text-slate-400">
                        {inv.clientName} {inv.currency !== 'USD' && `· Billed in ${inv.currency}`}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {inv.issueDate}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {inv.dueDate}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                      {formatCurrency(convertAmount(inv.totalAmount, inv.currency, 'USD'), {
                        originalCurrency: inv.currency,
                        originalAmount: inv.totalAmount,
                        showOriginal: true,
                      })}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300 text-right tabular-nums">
                      {inv.balanceDue === 0 ? (
                        <span className="text-emerald-400 font-semibold">$0.00</span>
                      ) : (
                        formatCurrency(convertAmount(inv.balanceDue, inv.currency, 'USD'), {
                          originalCurrency: inv.currency,
                          originalAmount: inv.balanceDue,
                          showOriginal: true,
                        })
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold ${
                          inv.status === 'Paid'
                            ? 'text-emerald-400'
                            : inv.status === 'Partially Paid'
                            ? 'text-indigo-300'
                            : inv.status === 'Overdue'
                            ? 'text-rose-400'
                            : inv.status === 'Draft'
                            ? 'text-slate-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {inv.status === 'Paid' && <CheckCircle className="w-3.5 h-3.5" />}
                        {inv.status === 'Overdue' && <AlertCircle className="w-3.5 h-3.5" />}
                        {inv.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {inv.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {inv.status !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:text-white hover:bg-emerald-600/40 border border-emerald-600/30 rounded transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveInvoiceModal(inv)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
