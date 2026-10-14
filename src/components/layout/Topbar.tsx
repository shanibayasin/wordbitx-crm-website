import {
Bell,
Building,
CheckCheck,
ChevronDown,
Globe,
  LogOut,
Menu,
Plus,
Search
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CURRENCY_CONFIGS } from '../../data/mockData';
import { CurrencyCode } from '../../types/crm';

const MODULE_TITLES: Record<string, string> = {
  overview: 'Executive Overview',
  leads: 'Leads & Accounts Directory',
  deals: 'Sales Pipeline & Kanban',
  calls: 'Call Intelligence & Voice AI',
  invoices: 'Invoices & Billing',
  reports: 'Reports & Performance Leaderboards',
  team: 'Team Roles & RBAC Matrix',
  settings: 'CRM Preferences & Configurations',
};

export const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const {
    currentModule,
    currency,
    setCurrency,
    setIsCommandSearchOpen,
    notifications,
    markNotificationsAsRead,
    setIsCreateDealOpen,
  } = useCrm();

  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'PKR', 'JPY', 'AUD'];

  return (
    <header className="dashboard-topbar h-12 px-3 sm:px-4 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 sm:gap-4 sticky top-0 z-20 select-none">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onMenuClick}
        className="md:hidden shrink-0 p-2 rounded-lg text-slate-600 hover:bg-slate-200"
      >
        <Menu className="h-4 w-4" />
      </button>
      {/* Breadcrumb Trail */}
      <div className="hidden md:flex items-center gap-2 text-xs font-medium min-w-0">
        <span className="text-slate-400 flex items-center gap-1.5 shrink-0">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          WordbitX CRM
        </span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-semibold truncate">
          {MODULE_TITLES[currentModule] || 'Dashboard'}
        </span>
      </div>

      {/* Center Search Input Trigger */}
      <div className="flex-1 min-w-0 max-w-md mx-0 sm:mx-2">
        <button
          type="button"
          onClick={() => setIsCommandSearchOpen(true)}
          className="dashboard-search-button w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline truncate">Search leads, deals, calls, or invoices...</span>
            <span className="sm:hidden truncate">Search CRM</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Currency Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowCurrencyMenu(!showCurrencyMenu);
              setShowNotificationMenu(false);
              setShowUserMenu(false);
            }}
            className="dashboard-toolbar-control flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Change reporting currency"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-indigo-300">{CURRENCY_CONFIGS[currency]?.symbol}</span>
            <span>{currency}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showCurrencyMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                Reporting Currency
              </div>
              {currencies.map((code) => {
                const cfg = CURRENCY_CONFIGS[code];
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCurrency(code);
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-indigo-400 bg-slate-800 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold w-5">{cfg.symbol}</span>
                      <span>{cfg.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{code}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowCurrencyMenu(false);
              setShowUserMenu(false);
            }}
            className="dashboard-icon-button relative p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-mono font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">
                  Notifications ({unreadCount} new)
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markNotificationsAsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 text-left transition-colors ${
                      item.read ? 'bg-slate-900/40 opacity-75' : 'bg-slate-900/90'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setIsCreateDealOpen(true)}
          className="dashboard-primary-action hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Deal</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowCurrencyMenu(false);
              setShowNotificationMenu(false);
            }}
            className="dashboard-profile-button flex items-center gap-2 pl-2 pr-1.5 py-1 text-xs font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
          >
            <div className="dashboard-avatar w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold text-[11px] flex items-center justify-center border border-indigo-500/40">
              AR
            </div>
            <span className="hidden md:inline font-semibold">Alex</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-bold text-white">Alex Rivera</div>
                <div className="text-[11px] text-slate-400 truncate">alex.rivera@wordbitx.io</div>
                <div className="mt-1 text-[10px] font-mono text-indigo-400">Enterprise Admin</div>
              </div>
              <div className="py-1">
                <div className="px-3 py-1.5 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Role Permission</span>
                  <span className="text-[10px] text-emerald-400">Full Access</span>
                </div>
                <div className="px-3 py-1.5 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Session State</span>
                  <span className="text-[10px] text-slate-400 font-mono">Live Demo</span>
                </div>
              </div>
              <form action="/api/demo-logout" method="post" className="border-t border-slate-800 px-2 py-1">
                <button type="submit" className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-100">
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
