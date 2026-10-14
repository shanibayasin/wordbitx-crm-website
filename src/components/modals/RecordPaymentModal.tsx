import { DollarSign,X } from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Invoice } from '../../types/crm';

interface Props {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<Props> = ({ isOpen, invoice, onClose }) => {
  const { recordPayment, formatCurrency } = useCrm();

  const [paymentAmount, setPaymentAmount] = useState<number>(invoice?.balanceDue || 0);
  const [method, setMethod] = useState<'Wire Transfer' | 'Credit Card' | 'ACH' | 'Bank Deposit'>('Wire Transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      alert('Please enter a valid payment amount greater than zero.');
      return;
    }

    recordPayment(invoice.id, {
      amount: paymentAmount,
      currency: invoice.currency,
      date: new Date().toISOString().split('T')[0],
      method,
      reference: reference || `REF-${Date.now().toString().slice(-6)}`,
      recordedBy: 'Finance Specialist',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Record Invoice Payment</h3>
              <p className="text-[11px] text-slate-400">
                Post transaction for {invoice.invoiceNumber}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Invoice Balance Summary Box */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Client:</span>
              <span className="text-white font-sans font-semibold">{invoice.clientCompany}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Invoice Total:</span>
              <span className="text-white">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Already Paid:</span>
              <span className="text-emerald-400">{formatCurrency(invoice.paidAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-sm font-bold">
              <span className="text-amber-400">Remaining Balance:</span>
              <span className="text-amber-400">{formatCurrency(invoice.balanceDue)}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Payment Amount ({invoice.currency}) *
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="1"
                max={invoice.balanceDue}
                required
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setPaymentAmount(invoice.balanceDue)}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
              >
                Pay Full
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Settlement Method *</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Wire Transfer">Wire Transfer (SEPA / Swift)</option>
              <option value="ACH">ACH Direct Debit</option>
              <option value="Credit Card">Corporate Credit Card</option>
              <option value="Bank Deposit">Local Bank Cash/Cheque Deposit</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Bank Transaction / Wire Reference *
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. WIRE-891024-NY"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Notes / Ledger Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reconciled with bank statement by Chloe..."
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
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded cursor-pointer transition-colors shadow-sm"
            >
              Post Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
