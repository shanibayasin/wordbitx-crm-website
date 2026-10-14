import {
AlertCircle,
CheckCircle,
Clock,
Printer,
X
} from 'lucide-react';
import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Invoice } from '../../types/crm';

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<Props> = ({ invoice, onClose }) => {
  const { updateInvoiceStatus, formatCurrency } = useCrm();

  if (!invoice) return null;

  const taxAmount = invoice.subtotal * invoice.taxRate;
  const grandTotal = invoice.subtotal + taxAmount - invoice.discount;

  const handleMarkPaid = () => {
    updateInvoiceStatus(invoice.id, 'Paid');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-indigo-400">
              {invoice.invoiceNumber}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300 font-medium">
              Enterprise Billing Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Viewport */}
        <div className="p-8 overflow-y-auto space-y-8 bg-slate-950 text-slate-100 font-sans">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  W
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Wordbit<span className="text-indigo-400">X</span> Technologies Inc.
                </span>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed font-mono">
                100 Montgomery St, Suite 2200<br />
                San Francisco, CA 94104, USA<br />
                VAT / Tax ID: US-EIN-94-3891024<br />
                finance@wordbitx.io
              </div>
            </div>

            <div className="text-right sm:self-start">
              <div className="text-xl font-bold font-mono tracking-tight text-white mb-1">
                INVOICE
              </div>
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-2">
                #{invoice.invoiceNumber}
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold font-mono border border-slate-800 bg-slate-900">
                {invoice.status === 'Paid' ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> PAID IN FULL
                  </span>
                ) : invoice.status === 'Overdue' ? (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> OVERDUE
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> PENDING PAYMENT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Billed To and Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Billed To
              </div>
              <div className="text-sm font-bold text-white mb-0.5">{invoice.clientCompany}</div>
              <div className="text-slate-300 font-medium">{invoice.clientName}</div>
              <div className="text-slate-400 font-mono text-[11px]">{invoice.clientEmail}</div>
            </div>

            <div className="sm:text-right space-y-1">
              <div>
                <span className="text-slate-400">Invoice Date: </span>
                <span className="font-mono text-slate-200 font-medium">{invoice.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Payment Due: </span>
                <span className="font-mono text-slate-200 font-medium">{invoice.dueDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Payment Terms: </span>
                <span className="text-slate-200 font-medium">Net 30 Enterprise</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center font-mono">Qty</th>
                  <th className="py-2.5 px-4 text-right font-mono">Unit Price</th>
                  <th className="py-2.5 px-4 text-right font-mono">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="text-slate-200">
                    <td className="py-3 px-4 font-sans font-medium text-slate-100">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums text-slate-300">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-white">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            <div className="max-w-xs text-xs space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Remittance & Wire Instructions
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded text-[11px] font-mono text-slate-300 leading-relaxed">
                Bank: Silicon Valley Bank NY<br />
                Routing (ABA): 121042882<br />
                SWIFT: SVBUS6S<br />
                Account: 8820-9914-0012<br />
                Ref: {invoice.invoiceNumber}
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 text-slate-400">
                <span>Subtotal:</span>
                <span className="text-slate-200 tabular-nums font-medium">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Tax ({(invoice.taxRate * 100).toFixed(1)}%):</span>
                <span className="text-slate-200 tabular-nums font-medium">
                  {formatCurrency(taxAmount)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between py-1 text-emerald-400">
                  <span>Discount:</span>
                  <span className="tabular-nums font-medium">
                    -{formatCurrency(invoice.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-slate-800 text-sm font-bold text-white">
                <span>Grand Total:</span>
                <span className="text-indigo-400 tabular-nums text-base">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Current Status: <span className="font-semibold text-white">{invoice.status}</span>
          </div>

          <div className="flex items-center gap-2">
            {invoice.status !== 'Paid' && (
              <button
                type="button"
                onClick={handleMarkPaid}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors cursor-pointer"
              >
                Mark as Fully Paid
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
