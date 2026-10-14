import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building,
  Briefcase,
  FileText,
  PhoneCall,
  Receipt,
  CheckSquare,
  LifeBuoy,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { CRMModule } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';

interface NavItem {
  id: CRMModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const {
    currentModule,
    setCurrentModule,
    leads,
    customers,
    deals,
    quotations,
    calls,
    invoices,
    tasks,
    tickets,
    setIsCreateLeadOpen,
    setIsCreateDealOpen,
    setIsCreateInvoiceOpen,
    setIsCreateCustomerOpen,
    setIsCreateQuotationOpen,
    setIsCreateTaskOpen,
    setIsLogCallOpen,
    setIsCreateTicketOpen,
  } = useCrm();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('WordbitX Global');
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  const pendingInvoices = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const openTickets = tickets.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Prospects', icon: Users, badge: leads.length },
    { id: 'customers', label: 'Customers & Accounts', icon: Building, badge: customers.length },
    { id: 'deals', label: 'Deals & Pipeline', icon: Briefcase, badge: deals.length },
    { id: 'calls', label: 'Call Intelligence', icon: PhoneCall, badge: calls.length },
    { id: 'tickets', label: 'Support Tickets', icon: LifeBuoy, badge: openTickets },
    { id: 'tasks', label: 'Tasks & Meetings', icon: CheckSquare, badge: pendingTasks },
    { id: 'quotes_orders', label: 'Quotes & Orders', icon: FileText, badge: quotations.length },
    { id: 'invoices', label: 'Invoices & Billing', icon: Receipt, badge: pendingInvoices },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team & RBAC', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navGroups = [
    { label: 'WORKSPACE', items: navItems.slice(0, 1) },
    { label: 'CUSTOMER OPERATIONS', items: navItems.slice(1, 7) },
    { label: 'REVENUE', items: navItems.slice(7, 10) },
    { label: 'ADMINISTRATION', items: navItems.slice(10) },
  ];

  const workspaces = ['WordbitX Global', 'EMEA Hub (London)', 'APAC Branch (Singapore)'];

  return (
    <aside
      className={`relative flex flex-col shrink-0 border-r border-slate-200 bg-white transition-all duration-200 select-none z-40 ${
        isCollapsed ? 'w-20' : 'w-56'
      } ${
        isMobileOpen
          ? 'fixed inset-y-0 left-0 shadow-xl md:relative md:inset-auto md:shadow-none'
          : 'hidden md:flex'
      }`}
    >
      {/* Brand & Organization */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30 shrink-0">
              W
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 truncate">
                Wordbit<span className="text-indigo-400">X</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                  CRM
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            W
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Switcher */}
      {!isCollapsed && (
        <div className="px-3 pt-3 pb-2 relative">
          <button
            type="button"
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentWorkspace}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-12 left-3 right-3 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  type="button"
                  onClick={() => {
                    setCurrentWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                    currentWorkspace === ws ? 'text-indigo-400 bg-slate-800/60 font-semibold' : 'text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  {ws}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Add CTA */}
      <div className="px-3 py-2 relative">
        {!isCollapsed ? (
          <div>
            <button
              type="button"
              onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Create New Record</span>
            </button>
            {showQuickAddMenu && (
              <div className="absolute top-12 left-3 right-3 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateLeadOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + New Inbound Lead
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateDealOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + New Sales Deal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateCustomerOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + New Customer Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateQuotationOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + Create Price Quote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateInvoiceOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + New Client Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogCallOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + Log Call & Recording
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateTaskOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + Create Action Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateTicketOpen(true);
                    setShowQuickAddMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  + New Support Ticket
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreateDealOpen(true)}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
            title="Create Record"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav aria-label="CRM sections" className="flex-1 px-2.5 py-2 space-y-3 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="px-3 pb-1 pt-1 text-[9px] font-bold tracking-[.12em] text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentModule(item.id);
                      onMobileClose();
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[11px] font-medium transition-colors cursor-pointer group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="text-[10px] tabular-nums text-slate-500">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Upgrade / Live Plan Banner */}
      {!isCollapsed && (
        <div className="mx-3 my-2 p-3 rounded-lg border border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-medium text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>WordbitX Enterprise</span>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed mb-2">
            Multi-currency forex enabled. Call intelligence active.
          </div>
          <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
            SLA Uptime 99.99%
          </div>
        </div>
      )}

      {/* User Session Profile */}
      <div className="p-3 border-t border-slate-800/80">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
            AR
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">Alex Rivera</div>
              <div className="text-[11px] text-slate-400 truncate">alex.rivera@wordbitx.io</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
