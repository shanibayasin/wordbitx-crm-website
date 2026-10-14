import {
Package,
Printer,
Receipt,
X
} from 'lucide-react';
import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { Quotation } from '../../types/crm';

interface Props {
  quotation: Quotation | null;
  onClose: () => void;
}

export const QuotationPreviewModal: React.FC<Props> = ({ quotation, onClose }) => {
  const { convertQuotation, updateQuotationStatus, setCurrentModule } = useCrm();

  if (!quotation) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleConvertToOrder = () => {
    convertQuotation(quotation.id, 'order');
    onClose();
    setCurrentModule('quotes_orders');
  };

  const handleConvertToInvoice = () => {
    convertQuotation(quotation.id, 'invoice');
    onClose();
    setCurrentModule('invoices');
  };

  const handleAccept = () => {
    updateQuotationStatus(quotation.id, 'Accepted');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-indigo-400">
              {quotation.quoteNumber}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-300 font-medium">Commercial Proposal</span>
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

        {/* Printable Viewport */}
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
                100 Montgomery St, Suite 2200, San Francisco, CA<br />
                support@wordbitx.io · www.wordbitx.io
              </div>
            </div>

            <div className="text-right sm:self-start">
              <div className="text-xl font-bold font-mono tracking-tight text-white mb-1">
                QUOTATION
              </div>
              <div className="text-xs font-mono text-indigo-400 font-semibold mb-2">
                #{quotation.quoteNumber}
              </div>
              <div className="text-[11px] font-mono px-2 py-0.5 rounded border border-slate-800 bg-slate-900 inline-block">
                Status: <span className="font-bold text-indigo-300">{quotation.status}</span>
              </div>
            </div>
          </div>

          {/* Client & Terms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Prepared For
              </div>
              <div className="text-sm font-bold text-white mb-0.5">{quotation.customerCompany}</div>
              <div className="text-slate-300 font-medium">{quotation.customerName}</div>
              <div className="text-slate-400 font-mono text-[11px]">{quotation.customerEmail}</div>
            </div>

            <div className="sm:text-right space-y-1">
              <div>
                <span className="text-slate-400">Date Issued: </span>
                <span className="font-mono text-slate-200">{quotation.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Valid Until: </span>
                <span className="font-mono text-slate-200">{quotation.expiryDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Currency: </span>
                <span className="font-mono text-slate-200 font-semibold">{quotation.currency}</span>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Item Scope</th>
                  <th className="py-2.5 px-4 text-center font-mono">Qty</th>
                  <th className="py-2.5 px-4 text-right font-mono">Unit Price</th>
                  <th className="py-2.5 px-4 text-right font-mono">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {quotation.items.map((it) => (
                  <tr key={it.id} className="text-slate-200">
                    <td className="py-3 px-4 font-sans font-medium text-slate-100">
                      {it.description}
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums text-slate-300">
                      {it.quantity}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {quotation.currency} {it.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-white">
                      {quotation.currency} {(it.quantity * it.unitPrice).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            <div className="text-xs text-slate-400 max-w-sm">
              <span className="font-semibold text-slate-300">Terms & SLA:</span><br />
              {quotation.notes}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-slate-200">
                  {quotation.currency} {quotation.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax ({(quotation.taxRate * 100).toFixed(1)}%):</span>
                <span className="text-slate-200">
                  {quotation.currency} {(quotation.subtotal * quotation.taxRate).toLocaleString()}
                </span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-{quotation.currency} {quotation.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-bold text-white">
                <span>Grand Total:</span>
                <span className="text-indigo-400 font-mono">
                  {quotation.currency} {quotation.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {quotation.status !== 'Accepted' && quotation.status !== 'Converted' && (
              <button
                type="button"
                onClick={handleAccept}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors cursor-pointer"
              >
                Mark as Accepted
              </button>
            )}
            <button
              type="button"
              onClick={handleConvertToOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Convert to Order</span>
            </button>
            <button
              type="button"
              onClick={handleConvertToInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded transition-colors cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Convert to Invoice</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
