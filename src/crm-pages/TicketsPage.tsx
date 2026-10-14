import {
Plus,
Search
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';

export const TicketsPage: React.FC = () => {
  const { tickets, setActiveTicketModal, setIsCreateTicketOpen } = useCrm();

  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
  const urgentTickets = tickets.filter((t) => t.priority === 'Urgent' && t.status !== 'Resolved' && t.status !== 'Closed').length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Customer Support & SLA Incident Desk</span>
            {urgentTickets > 0 && (
              <span className="text-[10px] font-mono uppercase bg-rose-950/60 text-rose-400 border border-rose-800/40 px-2 py-0.5 rounded">
                {urgentTickets} Urgent SLA Breach Risk
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Client incident tracking, technical escalation routing, and guaranteed response SLAs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateTicketOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Incident Ticket</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Active Open Incidents</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{openTickets}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending resolution</div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Average First Response</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">18 Mins</div>
          <div className="text-[11px] text-slate-500 mt-1">Target SLA: &lt;60 mins</div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">SLA Compliance Rate</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">98.6%</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 42 monthly tickets</div>
        </div>

        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Resolution Rate</div>
          <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">94.2%</div>
          <div className="text-[11px] text-slate-500 mt-1">Resolved on first contact</div>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, company, subject..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 font-mono">Ticket ID</th>
                <th className="py-3 px-4">Subject & Account</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority & SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Agent</th>
                <th className="py-3 px-4 font-mono">Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setActiveTicketModal(t)}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200 group-hover:text-indigo-400">
                    {t.ticketNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-indigo-300">
                      {t.subject}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {t.company} · {t.customerName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{t.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        t.priority === 'Urgent'
                          ? 'text-rose-400 bg-rose-950/50'
                          : t.priority === 'High'
                          ? 'text-amber-400 bg-amber-950/50'
                          : 'text-indigo-300 bg-indigo-950/50'
                      }`}
                    >
                      {t.priority} ({t.slaHours}h)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-mono ${
                        t.status === 'Resolved' || t.status === 'Closed'
                          ? 'text-emerald-400'
                          : t.status === 'In Progress'
                          ? 'text-indigo-400 font-semibold'
                          : 'text-amber-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{t.assignedAgent}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{t.updatedAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTicketModal(t);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                    >
                      Reply ({t.messages.length})
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
