import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { InvoiceItem, InvoiceStatus } from '../../types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateInvoiceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addInvoice, formatCurrency, currency } = useCrm();

  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [taxRate, setTaxRate] = useState(0.08);
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'WordbitX Enterprise (Annual 100 Seats)', quantity: 1, unitPrice: 45000 },
  ]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: 'Additional Integration Support', quantity: 1, unitPrice: 5000 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalAmount = Math.max(0, subtotal * (1 + taxRate) - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCompany || !clientEmail || items.length === 0) {
      alert('Please fill in client company and email.');
      return;
    }

    const invNum = `WBX-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    addInvoice({
      invoiceNumber: invNum,
      clientName: clientName || 'Accounts Payable',
      clientCompany,
      clientEmail,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Pending' as InvoiceStatus,
      currency: currency || 'USD',
      items,
      subtotal,
      taxRate,
      discount,
      totalAmount,
      notes: 'Payment due Net 30. Direct wire or ACH.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-sm font-bold text-white">Issue Client Invoice</h3>
            <p className="text-[11px] text-slate-400">Generate itemized billing record</p>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company *</label>
              <input
                type="text"
                required
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="e.g. Apex Cloud Systems"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Client Contact</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Billing Email *</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="billing@apex.io"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Payment Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tax Rate (%)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={taxRate * 100}
                onChange={(e) => setTaxRate((parseFloat(e.target.value) || 0) / 100)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Discount Amount ($)</label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">Itemized Services</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const desc = e.target.value;
                      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, description: desc } : it)));
                    }}
                    placeholder="Description of line item"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 1;
                      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, quantity: qty } : it)));
                    }}
                    className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 font-mono text-center text-slate-200"
                  />
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, unitPrice: price } : it)));
                    }}
                    className="w-28 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 font-mono text-right text-slate-200"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 text-right font-mono text-xs text-slate-300">
              Subtotal: <span className="font-bold text-white ml-2">{formatCurrency(subtotal)}</span>
            </div>
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
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded cursor-pointer transition-colors shadow-sm"
            >
              Issue Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
