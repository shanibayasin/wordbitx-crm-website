import { FileText,Plus,Trash2,X } from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CurrencyCode,QuoteItem } from '../../types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuotationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { customers, products, addQuotation, currency } = useCrm();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(currency);
  const [expiryDate, setExpiryDate] = useState('2026-11-15');
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0.05);
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: '1',
      description: products[0]?.name || 'WordbitX Enterprise Suite (Annual)',
      quantity: 1,
      unitPrice: products[0]?.unitPrice || 120000,
    },
  ]);
  const [notes, setNotes] = useState('Formal quotation valid for 30 calendar days.');

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        description: 'Dedicated Solution Architect & Integration Pack',
        quantity: 1,
        unitPrice: 15000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const taxAmount = subtotal * taxRate;
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) {
      alert('Please select a customer.');
      return;
    }

    const qNumber = `QTE-2026-00${Math.floor(100 + Math.random() * 900)}`;

    addQuotation({
      quoteNumber: qNumber,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerCompany: currentCustomer.company,
      customerEmail: currentCustomer.email,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate,
      status: 'Sent',
      items,
      subtotal,
      taxRate,
      discount,
      grandTotal,
      currency: currencyCode,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Draft Commercial Quotation</h3>
              <p className="text-[11px] text-slate-400">Generate formal client proposal</p>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Client *</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Quotation Currency</label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-mono"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (₨)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Valid Until</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">Products & Scope</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Scope Line
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, description: val } : it)));
                    }}
                    placeholder="Product or service scope"
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
                      const pr = parseFloat(e.target.value) || 0;
                      setItems((prev) => prev.map((it, i) => (i === index ? { ...it, unitPrice: pr } : it)));
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

            {/* Calculations Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 mt-3 font-mono">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-sans">Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={taxRate * 100}
                  onChange={(e) => setTaxRate((parseFloat(e.target.value) || 0) / 100)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-sans">Discount ($)</label>
                <input
                  type="number"
                  step="500"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200"
                />
              </div>
              <div className="text-right self-end">
                <div className="text-slate-400 text-[11px] font-sans">Total Proposal:</div>
                <div className="text-base font-bold text-white">
                  {currencyCode} {grandTotal.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Contract Remarks & SLA</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded cursor-pointer transition-colors shadow-sm"
            >
              Create & Send Quotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
