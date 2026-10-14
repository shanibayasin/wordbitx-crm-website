import {
FileText,
Package,
Plus,
Search,
Tag
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';

export const QuotesOrdersPage: React.FC = () => {
  const {
    quotations,
    orders,
    products,
    setActiveQuotationModal,
    setIsCreateQuotationOpen,
    convertQuotation,
    updateOrderStatus,
    setCurrentModule,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'quotes' | 'orders' | 'products'>('quotes');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuotes = quotations.filter(
    (q) =>
      q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Quotations & Commercial Orders</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              RevOps Gateway
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal commercial quotations, accepted contracts, product SKUs, and fulfillment orders
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateQuotationOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Draft Quotation</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quotes'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotations ({quotations.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Commercial Orders ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Products Catalog ({products.length})</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotations, orders, or accounts..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tab Content: Quotations */}
      {activeTab === 'quotes' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 font-mono">Quote #</th>
                  <th className="py-3 px-4">Client Company</th>
                  <th className="py-3 px-4 font-mono">Issued</th>
                  <th className="py-3 px-4 font-mono">Valid Until</th>
                  <th className="py-3 px-4 font-mono text-right">Grand Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredQuotes.map((q) => (
                  <tr
                    key={q.id}
                    onClick={() => setActiveQuotationModal(q)}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200 group-hover:text-indigo-400">
                      {q.quoteNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{q.customerCompany}</div>
                      <div className="text-[11px] text-slate-400">{q.customerName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{q.issueDate}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{q.expiryDate}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                      {q.currency} {q.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                          q.status === 'Accepted' || q.status === 'Converted'
                            ? 'text-emerald-400 bg-emerald-950/50'
                            : q.status === 'Declined'
                            ? 'text-rose-400 bg-rose-950/50'
                            : 'text-indigo-300 bg-indigo-950/50'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            convertQuotation(q.id, 'order');
                            setActiveTab('orders');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 rounded transition-colors cursor-pointer"
                        >
                          → Order
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            convertQuotation(q.id, 'invoice');
                            setCurrentModule('invoices');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 rounded transition-colors cursor-pointer"
                        >
                          → Invoice
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveQuotationModal(q);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                        >
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 font-mono">Order #</th>
                  <th className="py-3 px-4">Client Company</th>
                  <th className="py-3 px-4 font-mono">Order Date</th>
                  <th className="py-3 px-4 font-mono text-right">Order Value</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">
                      {ord.customerCompany}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{ord.createdAt}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-indigo-300 tabular-nums">
                      {ord.currency} {ord.total.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                          ord.status === 'Completed'
                            ? 'text-emerald-400 bg-emerald-950/50'
                            : ord.status === 'Processing'
                            ? 'text-indigo-400 bg-indigo-950/50'
                            : 'text-amber-400 bg-amber-950/50'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      {ord.status !== 'Completed' && (
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(ord.id, 'Completed')}
                          className="px-2.5 py-1 text-[11px] text-emerald-400 hover:text-white hover:bg-emerald-600/40 rounded transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Products */}
      {activeTab === 'products' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Configured Products & Subscription Licenses</span>
            <span className="text-[11px] font-mono text-slate-400">{products.length} SKUs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 font-mono">SKU</th>
                  <th className="py-3 px-4">Product / Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 font-mono text-right">Standard Price</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-indigo-400">{p.sku}</td>
                    <td className="py-3.5 px-4 font-medium text-white">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                      {p.currency} {p.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono text-emerald-400">
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
