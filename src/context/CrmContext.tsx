'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getModuleFromPathname, getModulePath } from '../lib/navigation';
import {
  CRMModule,
  CurrencyCode,
  CurrencyConfig,
  Lead,
  Deal,
  DealStage,
  Customer,
  Product,
  Quotation,
  Order,
  CallRecording,
  Invoice,
  InvoiceStatus,
  InvoicePayment,
  Task,
  Meeting,
  Ticket,
  TicketStatus,
  TeamMember,
  TeamRole,
  RolePermissions,
  AuditLogEntry,
  ActivityItem,
} from '../types/crm';
import {
  CURRENCY_CONFIGS,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
  INITIAL_CALLS,
  INITIAL_INVOICES,
  INITIAL_TASKS,
  INITIAL_MEETINGS,
  INITIAL_TICKETS,
  INITIAL_TEAM,
  INITIAL_PERMISSIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'deal' | 'call' | 'payment' | 'system' | 'ticket' | 'lead';
}

interface TelephonyProviderConfig {
  name: string;
  connected: boolean;
  providerType: 'Twilio' | 'Amazon Connect' | 'WebRTC Gateway';
  apiKeyConfigured: boolean;
}

interface CrmContextType {
  currentModule: CRMModule;
  setCurrentModule: (mod: CRMModule) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyConfigs: Record<string, CurrencyConfig>;
  updateCurrencyRate: (code: CurrencyCode, rate: number, source?: string) => void;
  formatCurrency: (
    amountInUSD: number,
    options?: { compact?: boolean; originalCurrency?: CurrencyCode; originalAmount?: number; showOriginal?: boolean; decimals?: number }
  ) => string;
  convertAmount: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLead: (leadId: string, options: { createCustomer: boolean; createDeal: boolean; dealAmount?: number }) => { customerId?: string; dealId?: string };
  bulkArchiveLeads: (ids: string[]) => void;
  bulkDeleteLeads: (ids: string[]) => void;

  // Deals
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt'>) => void;
  updateDealStage: (id: string, stage: DealStage, lossReason?: string) => void;
  deleteDeal: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  toggleProductActive: (id: string) => void;

  // Quotations & Orders
  quotations: Quotation[];
  addQuotation: (quote: Omit<Quotation, 'id'>) => void;
  updateQuotationStatus: (id: string, status: Quotation['status']) => void;
  convertQuotation: (quoteId: string, target: 'order' | 'invoice') => { orderId?: string; invoiceId?: string };
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Invoices & Payments
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'paidAmount' | 'balanceDue' | 'payments'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  recordPayment: (invoiceId: string, payment: Omit<InvoicePayment, 'id' | 'invoiceId'>) => void;

  // Calls
  calls: CallRecording[];
  activeCall: CallRecording | null;
  setActiveCall: (call: CallRecording | null) => void;
  logCall: (call: Omit<CallRecording, 'id'>) => void;
  updateCallRecording: (id: string, updates: Partial<CallRecording>) => void;
  telephonyProvider: TelephonyProviderConfig;
  updateTelephonyProvider: (updates: Partial<TelephonyProviderConfig>) => void;

  // Tasks & Meetings
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;

  // Tickets
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  addTicketMessage: (id: string, message: { author: string; isStaff: boolean; content: string }) => void;

  // Team & Audits
  team: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  permissions: RolePermissions[];
  togglePermission: (role: TeamRole, field: keyof RolePermissions) => void;
  auditLogs: AuditLogEntry[];
  logAudit: (action: string, module: CRMModule | 'auth' | 'system', details: string) => void;
  activities: ActivityItem[];

  // Modals & Panels State
  isCommandSearchOpen: boolean;
  setIsCommandSearchOpen: (open: boolean) => void;
  activeLeadModal: Lead | null;
  setActiveLeadModal: (lead: Lead | null) => void;
  activeDealModal: Deal | null;
  setActiveDealModal: (deal: Deal | null) => void;
  activeCustomerModal: Customer | null;
  setActiveCustomerModal: (cust: Customer | null) => void;
  activeQuotationModal: Quotation | null;
  setActiveQuotationModal: (q: Quotation | null) => void;
  activeInvoiceModal: Invoice | null;
  setActiveInvoiceModal: (inv: Invoice | null) => void;
  activeTicketModal: Ticket | null;
  setActiveTicketModal: (t: Ticket | null) => void;

  isCreateLeadOpen: boolean;
  setIsCreateLeadOpen: (open: boolean) => void;
  isConvertLeadOpen: boolean;
  setIsConvertLeadOpen: (open: boolean) => void;
  leadToConvert: Lead | null;
  setLeadToConvert: (lead: Lead | null) => void;

  isCreateDealOpen: boolean;
  setIsCreateDealOpen: (open: boolean) => void;
  isCreateCustomerOpen: boolean;
  setIsCreateCustomerOpen: (open: boolean) => void;
  isCreateQuotationOpen: boolean;
  setIsCreateQuotationOpen: (open: boolean) => void;
  isCreateInvoiceOpen: boolean;
  setIsCreateInvoiceOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  invoiceToPay: Invoice | null;
  setInvoiceToPay: (inv: Invoice | null) => void;

  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  isLogCallOpen: boolean;
  setIsLogCallOpen: (open: boolean) => void;
  isCreateTicketOpen: boolean;
  setIsCreateTicketOpen: (open: boolean) => void;
  isInviteTeamOpen: boolean;
  setIsInviteTeamOpen: (open: boolean) => void;

  notifications: NotificationItem[];
  markNotificationsAsRead: () => void;
  resetAllDemoData: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

// Local storage helper
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`wordbitx_${key}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return fallback;
};

const saveToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(`wordbitx_${key}`, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export const CrmProvider: React.FC<{
  children: React.ReactNode;
  demoMode?: boolean;
}> = ({ children, demoMode = false }) => {
  const pathname = usePathname();
  const router = useRouter();
  const loadState = <T,>(key: string, fallback: T): T =>
    demoMode ? fallback : loadFromStorage(key, fallback);
  const persistState = useCallback(<T,>(key: string, value: T) => {
    if (!demoMode) saveToStorage(key, value);
  }, [demoMode]);
  const [storedModule, setStoredModule] = useState<CRMModule>(() =>
    loadState('module', 'overview')
  );
  const currentModule = getModuleFromPathname(pathname) ?? storedModule;
  const [currency, setCurrencyState] = useState<CurrencyCode>(() =>
    loadState('currency', 'USD')
  );
  const [currencyConfigs, setCurrencyConfigs] = useState<Record<string, CurrencyConfig>>(() =>
    loadState('currency_configs', CURRENCY_CONFIGS)
  );

  const [leads, setLeads] = useState<Lead[]>(() => loadState('leads', INITIAL_LEADS));
  const [deals, setDeals] = useState<Deal[]>(() => loadState('deals', INITIAL_DEALS));
  const [customers, setCustomers] = useState<Customer[]>(() => loadState('customers', INITIAL_CUSTOMERS));
  const [products, setProducts] = useState<Product[]>(() => loadState('products', INITIAL_PRODUCTS));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadState('quotations', INITIAL_QUOTATIONS));
  const [orders, setOrders] = useState<Order[]>(() => loadState('orders', INITIAL_ORDERS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadState('invoices', INITIAL_INVOICES));
  const [calls, setCalls] = useState<CallRecording[]>(() => loadState('calls', INITIAL_CALLS));
  const [activeCall, setActiveCall] = useState<CallRecording | null>(INITIAL_CALLS[0]);
  const [tasks, setTasks] = useState<Task[]>(() => loadState('tasks', INITIAL_TASKS));
  const [meetings, setMeetings] = useState<Meeting[]>(() => loadState('meetings', INITIAL_MEETINGS));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadState('tickets', INITIAL_TICKETS));
  const [team, setTeam] = useState<TeamMember[]>(() => loadState('team', INITIAL_TEAM));
  const [permissions, setPermissions] = useState<RolePermissions[]>(() => loadState('permissions', INITIAL_PERMISSIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadState('audit_logs', INITIAL_AUDIT_LOGS));
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadState('activities', INITIAL_ACTIVITIES));

  const [telephonyProvider, setTelephonyProvider] = useState<TelephonyProviderConfig>(() =>
    loadState('telephony_provider', {
      name: 'Twilio Elastic Voice SIP Trunk',
      connected: true,
      providerType: 'Twilio',
      apiKeyConfigured: true,
    })
  );

  const setCurrentModule = (module: CRMModule) => {
    setStoredModule(module);
    const path = getModulePath(module);
    if (pathname !== path) router.push(path);
  };

  // Sync state to localStorage on updates
  useEffect(() => persistState('module', currentModule), [currentModule, persistState]);
  useEffect(() => persistState('currency', currency), [currency, persistState]);
  useEffect(() => persistState('currency_configs', currencyConfigs), [currencyConfigs, persistState]);
  useEffect(() => persistState('leads', leads), [leads, persistState]);
  useEffect(() => persistState('deals', deals), [deals, persistState]);
  useEffect(() => persistState('customers', customers), [customers, persistState]);
  useEffect(() => persistState('products', products), [products, persistState]);
  useEffect(() => persistState('quotations', quotations), [quotations, persistState]);
  useEffect(() => persistState('orders', orders), [orders, persistState]);
  useEffect(() => persistState('invoices', invoices), [invoices, persistState]);
  useEffect(() => persistState('calls', calls), [calls, persistState]);
  useEffect(() => persistState('tasks', tasks), [tasks, persistState]);
  useEffect(() => persistState('meetings', meetings), [meetings, persistState]);
  useEffect(() => persistState('tickets', tickets), [tickets, persistState]);
  useEffect(() => persistState('team', team), [team, persistState]);
  useEffect(() => persistState('permissions', permissions), [permissions, persistState]);
  useEffect(() => persistState('audit_logs', auditLogs), [auditLogs, persistState]);
  useEffect(() => persistState('activities', activities), [activities, persistState]);
  useEffect(() => persistState('telephony_provider', telephonyProvider), [telephonyProvider, persistState]);

  // Modals
  const [isCommandSearchOpen, setIsCommandSearchOpen] = useState(false);
  const [activeLeadModal, setActiveLeadModal] = useState<Lead | null>(null);
  const [activeDealModal, setActiveDealModal] = useState<Deal | null>(null);
  const [activeCustomerModal, setActiveCustomerModal] = useState<Customer | null>(null);
  const [activeQuotationModal, setActiveQuotationModal] = useState<Quotation | null>(null);
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<Invoice | null>(null);
  const [activeTicketModal, setActiveTicketModal] = useState<Ticket | null>(null);

  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isConvertLeadOpen, setIsConvertLeadOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isInviteTeamOpen, setIsInviteTeamOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Deal Advanced to Negotiation',
      message: 'Apex Cloud Systems reached Negotiation ($120k)',
      time: '2h ago',
      read: false,
      type: 'deal',
    },
    {
      id: 'notif-2',
      title: 'Partial Wire Received',
      message: '$35,000 recorded for invoice #WBX-2026-0090 (Apex Cloud)',
      time: '3h ago',
      read: false,
      type: 'payment',
    },
    {
      id: 'notif-3',
      title: 'High Priority Ticket',
      message: 'Rate limit ceiling raised for Strata Energy Group (TCK-2026-001)',
      time: '6h ago',
      read: false,
      type: 'ticket',
    },
  ]);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    logAudit('CURRENCY_PREFERENCE_CHANGED', 'settings', `User set reporting currency to ${code}`);
  };

  const updateCurrencyRate = (code: CurrencyCode, rate: number, source?: string) => {
    setCurrencyConfigs((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        rate,
        source: source || 'Manual local adjustment (not a live feed)',
        lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      },
    }));
    logAudit('FOREX_RATE_UPDATED', 'settings', `Updated ${code}/USD rate to ${rate}`);
  };

  const convertAmount = (amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    if (from === to) return amount;
    const fromRate = currencyConfigs[from]?.rate || 1.0;
    const toRate = currencyConfigs[to]?.rate || 1.0;
    // Convert to base USD first, then to target
    const amountInUSD = from === 'USD' ? amount : amount / fromRate;
    return to === 'USD' ? amountInUSD : amountInUSD * toRate;
  };

  const formatCurrency: CrmContextType['formatCurrency'] = (
    amountInUSD,
    options
  ) => {
      const config = currencyConfigs[currency] || CURRENCY_CONFIGS.USD;
      const converted = amountInUSD * config.rate;

      if (options?.compact) {
        if (converted >= 1_000_000) {
          return `${config.symbol}${(converted / 1_000_000).toFixed(1)}M`;
        }
        if (converted >= 1_000) {
          return `${config.symbol}${(converted / 1_000).toFixed(0)}k`;
        }
      }

      let formattedConverted = '';
      if (options?.decimals !== undefined) {
        formattedConverted = `${config.symbol}${converted.toLocaleString(undefined, {
          minimumFractionDigits: options.decimals,
          maximumFractionDigits: options.decimals,
        })}`;
      } else {
        formattedConverted = `${config.symbol}${Math.round(converted).toLocaleString()}`;
      }

      if (options?.showOriginal && options.originalCurrency && options.originalCurrency !== currency && options.originalAmount !== undefined) {
        const origConfig = currencyConfigs[options.originalCurrency] || CURRENCY_CONFIGS.USD;
        const origFormatted = options?.decimals !== undefined
          ? options.originalAmount.toLocaleString(undefined, { minimumFractionDigits: options.decimals, maximumFractionDigits: options.decimals })
          : Math.round(options.originalAmount).toLocaleString();
        return `${formattedConverted} (${origConfig.symbol}${origFormatted} ${options.originalCurrency})`;
      }
      return formattedConverted;
      return formattedConverted;
  };

  const logAudit = (action: string, module: CRMModule | 'auth' | 'system', details: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Current Session User (Alex Rivera)',
      action,
      module,
      details,
      ipAddress: '192.168.1.42',
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 99)]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Leads CRUD
  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    logAudit('LEAD_CREATED', 'leads', `Added lead for ${newLead.name} (${newLead.company})`);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'lead',
        title: `New lead created: ${newLead.company}`,
        description: `${newLead.name} added with score ${newLead.score}/100`,
        timestamp: 'Just now',
        user: newLead.owner,
        amount: newLead.dealEstimate,
      },
      ...prev,
    ]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    logAudit('LEAD_UPDATED', 'leads', `Updated lead ${id}`);
  };

  const deleteLead = (id: string) => {
    const target = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    logAudit('LEAD_DELETED', 'leads', `Deleted lead ${target?.name || id}`);
  };

  const bulkArchiveLeads = (ids: string[]) => {
    setLeads((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, status: 'Disqualified' as const } : l))
    );
    logAudit('LEADS_BULK_ARCHIVED', 'leads', `Archived ${ids.length} leads`);
  };

  const bulkDeleteLeads = (ids: string[]) => {
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
    logAudit('LEADS_BULK_DELETED', 'leads', `Bulk removed ${ids.length} leads`);
  };

  // Lead qualification & conversion
  const convertLead = (
    leadId: string,
    options: { createCustomer: boolean; createDeal: boolean; dealAmount?: number }
  ) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return {};

    let newCustomerId: string | undefined;
    let newDealId: string | undefined;

    if (options.createCustomer) {
      newCustomerId = `cust-${Date.now()}`;
      const newCust: Customer = {
        id: newCustomerId,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        industry: lead.industry,
        location: lead.location,
        status: 'Active',
        totalSpentUSD: 0,
        owner: lead.owner,
        createdAt: new Date().toISOString().split('T')[0],
        website: `https://${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        notes: `Converted from qualified lead. Original discovery notes: ${lead.notes}`,
        originalLeadId: lead.id,
      };
      setCustomers((prev) => [newCust, ...prev]);
    }

    if (options.createDeal) {
      newDealId = `deal-${Date.now()}`;
      const amountUSD = options.dealAmount ?? lead.dealEstimate;
      const newDeal: Deal = {
        id: newDealId,
        title: `${lead.company} - Expansion Deal`,
        company: lead.company,
        customerId: newCustomerId,
        amount: amountUSD,
        currency: 'USD',
        amountInUSD: amountUSD,
        stage: 'qualified',
        probability: 50,
        expectedClose: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        owner: lead.owner,
        contactName: lead.name,
        contactEmail: lead.email,
        notes: `Deal generated upon lead conversion. ${lead.notes}`,
        products: ['WordbitX Growth License (50 Seats)'],
        createdAt: new Date().toISOString().split('T')[0],
        stageHistory: [
          {
            stage: 'qualified',
            changedAt: new Date().toISOString().split('T')[0],
            changedBy: lead.owner,
          },
        ],
      };
      setDeals((prev) => [newDeal, ...prev]);
    }

    // Mark lead as converted
    updateLead(leadId, {
      status: 'Converted',
      convertedCustomerId: newCustomerId,
      convertedDealId: newDealId,
    });

    logAudit(
      'LEAD_CONVERTED',
      'leads',
      `Converted lead ${lead.name} (${lead.company}) into Customer ${newCustomerId || 'N/A'} and Deal ${newDealId || 'N/A'}`
    );

    return { customerId: newCustomerId, dealId: newDealId };
  };

  // Deals CRUD
  const addDeal = (newDealData: Omit<Deal, 'id' | 'createdAt'>) => {
    const newDeal: Deal = {
      ...newDealData,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      stageHistory: [
        {
          stage: newDealData.stage,
          changedAt: new Date().toISOString().split('T')[0],
          changedBy: newDealData.owner,
        },
      ],
    };
    setDeals((prev) => [newDeal, ...prev]);
    logAudit('DEAL_CREATED', 'deals', `Created deal ${newDeal.title} ($${newDeal.amount.toLocaleString()})`);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'deal',
        title: `Opportunity initialized: ${newDeal.title}`,
        description: `${newDeal.company} · ${newDeal.stage.replace('_', ' ')}`,
        timestamp: 'Just now',
        user: newDeal.owner,
        amount: newDeal.amountInUSD,
      },
      ...prev,
    ]);
  };

  const updateDealStage = (id: string, stage: DealStage, lossReason?: string) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === id) {
          const updated: Deal = {
            ...deal,
            stage,
            lossReason: stage === 'closed_lost' ? lossReason : deal.lossReason,
            stageHistory: [
              ...(deal.stageHistory || []),
              {
                stage,
                changedAt: new Date().toISOString().split('T')[0],
                changedBy: deal.owner,
              },
            ],
          };
          logAudit('DEAL_STAGE_UPDATED', 'deals', `Moved ${deal.title} to ${stage}`);
          setActivities((actPrev) => [
            {
              id: `act-${Date.now()}`,
              type: 'deal',
              title: `Deal advanced to ${stage.replace('_', ' ')}`,
              description: `${deal.title} (${deal.company})`,
              timestamp: 'Just now',
              user: deal.owner,
              amount: deal.amountInUSD,
            },
            ...actPrev,
          ]);
          return updated;
        }
        return deal;
      })
    );
  };

  const deleteDeal = (id: string) => {
    const target = deals.find((d) => d.id === id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
    logAudit('DEAL_DELETED', 'deals', `Removed deal ${target?.title || id}`);
  };

  // Customers CRUD
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    logAudit('CUSTOMER_CREATED', 'customers', `Added customer profile ${newCust.company}`);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    logAudit('CUSTOMER_UPDATED', 'customers', `Updated customer profile ${id}`);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    logAudit('CUSTOMER_DELETED', 'customers', `Removed customer ${id}`);
  };

  // Products
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = { ...prod, id: `prod-${Date.now()}` };
    setProducts((prev) => [newProd, ...prev]);
    logAudit('PRODUCT_CREATED', 'settings', `Added SKU ${newProd.sku}`);
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  // Quotations & Orders
  const addQuotation = (qData: Omit<Quotation, 'id'>) => {
    const newQuote: Quotation = { ...qData, id: `quote-${Date.now()}` };
    setQuotations((prev) => [newQuote, ...prev]);
    logAudit('QUOTATION_CREATED', 'quotes_orders', `Dispatched quote ${newQuote.quoteNumber}`);
  };

  const updateQuotationStatus = (id: string, status: Quotation['status']) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    logAudit('QUOTATION_STATUS_UPDATED', 'quotes_orders', `Quote ${id} marked ${status}`);
  };

  const convertQuotation = (quoteId: string, target: 'order' | 'invoice') => {
    const quote = quotations.find((q) => q.id === quoteId);
    if (!quote) return {};

    let orderId: string | undefined;
    let invoiceId: string | undefined;

    if (target === 'order') {
      orderId = `ord-${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        orderNumber: `ORD-2026-00${Math.floor(100 + Math.random() * 900)}`,
        quotationId: quote.id,
        customerId: quote.customerId,
        customerName: quote.customerName,
        customerCompany: quote.customerCompany,
        total: quote.grandTotal,
        currency: quote.currency,
        status: 'Processing',
        createdAt: new Date().toISOString().split('T')[0],
        items: quote.items,
      };
      setOrders((prev) => [newOrder, ...prev]);
      updateQuotationStatus(quoteId, 'Converted');
      logAudit('ORDER_CREATED_FROM_QUOTE', 'quotes_orders', `Converted quote ${quote.quoteNumber} to order ${newOrder.orderNumber}`);
    } else {
      invoiceId = `inv-${Date.now()}`;
      const newInv: Invoice = {
        id: invoiceId,
        invoiceNumber: `WBX-2026-00${Math.floor(100 + Math.random() * 900)}`,
        clientName: quote.customerName,
        clientCompany: quote.customerCompany,
        clientEmail: quote.customerEmail,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
        currency: quote.currency,
        items: quote.items.map((it) => ({
          id: it.id,
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        })),
        subtotal: quote.subtotal,
        taxRate: quote.taxRate,
        discount: quote.discount,
        totalAmount: quote.grandTotal,
        paidAmount: 0,
        balanceDue: quote.grandTotal,
        payments: [],
        notes: `Generated from accepted quote ${quote.quoteNumber}`,
      };
      setInvoices((prev) => [newInv, ...prev]);
      updateQuotationStatus(quoteId, 'Converted');
      logAudit('INVOICE_CREATED_FROM_QUOTE', 'invoices', `Created invoice ${newInv.invoiceNumber} from quote`);
    }

    return { orderId, invoiceId };
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrd: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders((prev) => [newOrd, ...prev]);
    logAudit('ORDER_CREATED', 'quotes_orders', `Created order ${newOrd.orderNumber}`);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Invoices & Payments
  const addInvoice = (invData: Omit<Invoice, 'id' | 'paidAmount' | 'balanceDue' | 'payments'>) => {
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      paidAmount: 0,
      balanceDue: invData.totalAmount,
      payments: [],
    };
    setInvoices((prev) => [newInv, ...prev]);
    logAudit('INVOICE_ISSUED', 'invoices', `Issued invoice ${newInv.invoiceNumber} for ${newInv.clientCompany}`);
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = { ...inv, status };
          if (status === 'Paid') {
            updated.paidAmount = inv.totalAmount;
            updated.balanceDue = 0;
          }
          return updated;
        }
        return inv;
      })
    );
    logAudit('INVOICE_STATUS_UPDATED', 'invoices', `Invoice ${id} marked ${status}`);
  };

  const recordPayment = (
    invoiceId: string,
    paymentData: Omit<InvoicePayment, 'id' | 'invoiceId'>
  ) => {
    const pmt: InvoicePayment = {
      ...paymentData,
      id: `pmt-${Date.now()}`,
      invoiceId,
    };

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + pmt.amount;
          const newBalance = Math.max(0, inv.totalAmount - newPaid);
          const newStatus: InvoiceStatus =
            newBalance === 0 ? 'Paid' : newPaid > 0 ? 'Partially Paid' : inv.status;

          return {
            ...inv,
            paidAmount: newPaid,
            balanceDue: newBalance,
            status: newStatus,
            payments: [...inv.payments, pmt],
          };
        }
        return inv;
      })
    );

    logAudit(
      'PAYMENT_RECORDED',
      'invoices',
      `Recorded ${paymentData.currency} ${paymentData.amount.toLocaleString()} payment via ${paymentData.method}`
    );

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'payment',
        title: `Payment received: ${paymentData.currency} ${paymentData.amount.toLocaleString()}`,
        description: `Ref: ${paymentData.reference} · Method: ${paymentData.method}`,
        timestamp: 'Just now',
        user: paymentData.recordedBy,
        amount: paymentData.amount,
      },
      ...prev,
    ]);
  };

  // Calls
  const logCall = (callData: Omit<CallRecording, 'id'>) => {
    const newCall: CallRecording = {
      ...callData,
      id: `call-${Date.now()}`,
    };
    setCalls((prev) => [newCall, ...prev]);
    logAudit('CALL_LOGGED', 'calls', `Logged ${newCall.direction} call with ${newCall.customerName} (${newCall.outcome})`);
  };

  const updateCallRecording = (id: string, updates: Partial<CallRecording>) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    setActiveCall((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
    logAudit('CALL_RECORDING_UPDATED', 'calls', `Updated recording metadata for call ${id}`);
  };

  const updateTelephonyProvider = (updates: Partial<TelephonyProviderConfig>) => {
    setTelephonyProvider((prev) => ({ ...prev, ...updates }));
    logAudit('TELEPHONY_CONFIG_CHANGED', 'settings', `Updated telephony provider settings`);
  };

  // Tasks & Meetings
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    logAudit('TASK_CREATED', 'tasks', `Assigned task "${newTask.title}" to ${newTask.assignedTo}`);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Todo' : 'Completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addMeeting = (mtgData: Omit<Meeting, 'id'>) => {
    const newMeeting: Meeting = {
      ...mtgData,
      id: `mtg-${Date.now()}`,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    logAudit('MEETING_SCHEDULED', 'tasks', `Scheduled "${newMeeting.title}" with ${newMeeting.clientCompany}`);
  };

  // Tickets
  const addTicket = (
    tData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>
  ) => {
    const newTicket: Ticket = {
      ...tData,
      id: `tck-${Date.now()}`,
      ticketNumber: `TCK-2026-00${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messages: [
        {
          id: `msg-${Date.now()}`,
          author: tData.customerName,
          isStaff: false,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          content: tData.description || 'Ticket initialized.',
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    logAudit('TICKET_CREATED', 'tickets', `Created support ticket ${newTicket.ticketNumber}`);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) }
          : t
      )
    );
    logAudit('TICKET_STATUS_UPDATED', 'tickets', `Ticket ${id} marked ${status}`);
  };

  const addTicketMessage = (
    id: string,
    message: { author: string; isStaff: boolean; content: string }
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                ...message,
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  // Team & Permissions
  const addTeamMember = (m: Omit<TeamMember, 'id' | 'joinedDate'>) => {
    const newMember: TeamMember = {
      ...m,
      id: `user-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setTeam((prev) => [...prev, newMember]);
    logAudit('TEAM_MEMBER_INVITED', 'team', `Invited ${newMember.name} as ${newMember.role}`);
  };

  const togglePermission = (role: TeamRole, field: keyof RolePermissions) => {
    if (field === 'role') return;
    setPermissions((prev) =>
      prev.map((p) => (p.role === role ? { ...p, [field]: !p[field] } : p))
    );
    logAudit('RBAC_PERMISSION_TOGGLED', 'team', `Toggled ${String(field)} for ${role}`);
  };

  const resetAllDemoData = () => {
    if (!demoMode) localStorage.clear();
    setLeads(INITIAL_LEADS);
    setDeals(INITIAL_DEALS);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setQuotations(INITIAL_QUOTATIONS);
    setOrders(INITIAL_ORDERS);
    setInvoices(INITIAL_INVOICES);
    setCalls(INITIAL_CALLS);
    setTasks(INITIAL_TASKS);
    setMeetings(INITIAL_MEETINGS);
    setTickets(INITIAL_TICKETS);
    setTeam(INITIAL_TEAM);
    setPermissions(INITIAL_PERMISSIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActivities(INITIAL_ACTIVITIES);
    setCurrencyConfigs(CURRENCY_CONFIGS);
    setCurrencyState('USD');
    logAudit('DEMO_DATA_RESET', 'system', 'Restored pristine seed data');
  };

  return (
    <CrmContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        currency,
        setCurrency,
        currencyConfigs,
        updateCurrencyRate,
        formatCurrency,
        convertAmount,
        leads,
        addLead,
        updateLead,
        deleteLead,
        convertLead,
        bulkArchiveLeads,
        bulkDeleteLeads,
        deals,
        addDeal,
        updateDealStage,
        deleteDeal,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        products,
        addProduct,
        toggleProductActive,
        quotations,
        addQuotation,
        updateQuotationStatus,
        convertQuotation,
        orders,
        addOrder,
        updateOrderStatus,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        recordPayment,
        calls,
        activeCall,
        setActiveCall,
        logCall,
        updateCallRecording,
        telephonyProvider,
        updateTelephonyProvider,
        tasks,
        addTask,
        toggleTaskStatus,
        deleteTask,
        meetings,
        addMeeting,
        tickets,
        addTicket,
        updateTicketStatus,
        addTicketMessage,
        team,
        addTeamMember,
        permissions,
        togglePermission,
        auditLogs,
        logAudit,
        activities,
        isCommandSearchOpen,
        setIsCommandSearchOpen,
        activeLeadModal,
        setActiveLeadModal,
        activeDealModal,
        setActiveDealModal,
        activeCustomerModal,
        setActiveCustomerModal,
        activeQuotationModal,
        setActiveQuotationModal,
        activeInvoiceModal,
        setActiveInvoiceModal,
        activeTicketModal,
        setActiveTicketModal,
        isCreateLeadOpen,
        setIsCreateLeadOpen,
        isConvertLeadOpen,
        setIsConvertLeadOpen,
        leadToConvert,
        setLeadToConvert,
        isCreateDealOpen,
        setIsCreateDealOpen,
        isCreateCustomerOpen,
        setIsCreateCustomerOpen,
        isCreateQuotationOpen,
        setIsCreateQuotationOpen,
        isCreateInvoiceOpen,
        setIsCreateInvoiceOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        invoiceToPay,
        setInvoiceToPay,
        isCreateTaskOpen,
        setIsCreateTaskOpen,
        isLogCallOpen,
        setIsLogCallOpen,
        isCreateTicketOpen,
        setIsCreateTicketOpen,
        isInviteTeamOpen,
        setIsInviteTeamOpen,
        notifications,
        markNotificationsAsRead,
        resetAllDemoData,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
