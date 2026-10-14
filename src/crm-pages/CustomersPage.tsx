import {
Download,
Plus,
Search
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    formatCurrency,
    setActiveCustomerModal,
    setIsCreateCustomerOpen,
  } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Company', 'Contact', 'Email', 'Phone', 'Industry', 'Location', 'Status', 'TotalSpentUSD', 'Owner'];
    const rows = filteredCustomers.map((c) => [
      c.company,
      c.name,
      c.email,
      c.phone,
      c.industry,
      c.location,
      c.status,
      c.totalSpentUSD,
      c.owner,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wordbitx-customers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Customer Accounts Directory</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Verified Accounts
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Client relationships, enterprise profiles, SLA commitments, and lifetime financial transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateCustomerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer Account</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by company or contact..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Account Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Onboarding">Onboarding</option>
            <option value="At Risk">At Risk</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            onClick={() => setActiveCustomerModal(cust)}
            className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-sm flex items-center justify-center shrink-0">
                  {cust.company.slice(0, 2).toUpperCase()}
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    cust.status === 'Active'
                      ? 'text-emerald-400 bg-emerald-950/50'
                      : cust.status === 'At Risk'
                      ? 'text-rose-400 bg-rose-950/50'
                      : 'text-amber-400 bg-amber-950/50'
                  }`}
                >
                  {cust.status}
                </span>
              </div>

              <div className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                {cust.company}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 truncate">{cust.name}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{cust.industry} · {cust.location}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[11px] font-sans">Lifetime Value</span>
              <span className="font-bold text-white tabular-nums">
                {formatCurrency(cust.totalSpentUSD)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Directory Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white">Full Customer Ledger</span>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredCustomers.length} accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Company Account</th>
                <th className="py-3 px-4">Executive Contact</th>
                <th className="py-3 px-4">Industry & HQ</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 font-mono text-right">Lifetime Billed</th>
                <th className="py-3 px-4">Account Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setActiveCustomerModal(c)}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-indigo-400">
                    {c.company}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{c.industry}</div>
                    <div className="text-[11px] text-slate-500">{c.location}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-mono ${
                        c.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                    {formatCurrency(c.totalSpentUSD)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{c.owner}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCustomerModal(c);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    >
                      View 360°
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
