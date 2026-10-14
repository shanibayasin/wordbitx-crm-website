export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'JPY' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD base = 1.0
  name: string;
  source?: string;
  lastUpdated?: string;
}

export type CRMModule =
  | 'overview'
  | 'leads'
  | 'deals'
  | 'customers'
  | 'quotes_orders'
  | 'invoices'
  | 'calls'
  | 'tasks'
  | 'tickets'
  | 'reports'
  | 'team'
  | 'settings';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Disqualified' | 'Converted';
export type LeadSource = 'Inbound Web' | 'LinkedIn' | 'Outbound SDR' | 'Referral' | 'Conference' | 'Partner';
export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  dealEstimate: number; // in USD base
  currency: CurrencyCode;
  owner: string;
  createdAt: string;
  lastContacted: string;
  notes: string;
  industry: string;
  location: string;
  convertedCustomerId?: string;
  convertedDealId?: string;
}

export type DealStage =
  | 'discovery'
  | 'qualified'
  | 'technical_review'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Deal {
  id: string;
  title: string;
  company: string;
  customerId?: string;
  amount: number; // original transaction amount
  currency: CurrencyCode;
  amountInUSD: number; // calculated using exchange rate at creation
  stage: DealStage;
  probability: number;
  expectedClose: string;
  owner: string;
  contactName: string;
  contactEmail: string;
  notes: string;
  products: string[];
  lossReason?: string;
  createdAt: string;
  stageHistory?: { stage: DealStage; changedAt: string; changedBy: string }[];
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  status: 'Active' | 'Onboarding' | 'At Risk' | 'Inactive';
  totalSpentUSD: number;
  owner: string;
  createdAt: string;
  website: string;
  notes: string;
  originalLeadId?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Subscription' | 'Professional Services' | 'Add-on Module' | 'Hardware Gateway';
  unitPrice: number;
  currency: CurrencyCode;
  taxRate: number;
  active: boolean;
  description: string;
}

export interface QuoteItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  issueDate: string;
  expiryDate: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Converted';
  items: QuoteItem[];
  subtotal: number;
  taxRate: number;
  discount: number;
  grandTotal: number;
  currency: CurrencyCode;
  notes: string;
  convertedOrderId?: string;
  convertedInvoiceId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  total: number;
  currency: CurrencyCode;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
  items: QuoteItem[];
}

export type CallSentiment = 'Positive' | 'Neutral' | 'Needs Attention';
export type CallDirection = 'Incoming' | 'Outgoing';
export type CallOutcome = 'Connected' | 'Voicemail' | 'Busy' | 'Follow-up Scheduled' | 'Gatekeeper';
export type RecordingStatus = 'Available' | 'Processing' | 'No Recording / Consent Not Provided' | 'Provider Disconnected';

export interface TranscriptSnippet {
  timestamp: string;
  speaker: string;
  text: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface CallRecording {
  id: string;
  direction: CallDirection;
  outcome: CallOutcome;
  customerName: string;
  company: string;
  repName: string;
  date: string;
  durationSeconds: number;
  sentiment: CallSentiment;
  sentimentScore: number; // 0 to 100
  title: string;
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  recordingStatus: RecordingStatus;
  consentObtained: boolean;
  audioWaveform: number[];
  audioUrl?: string;
  transcript: TranscriptSnippet[];
  notes?: string;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue' | 'Draft';

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  method: 'Wire Transfer' | 'Credit Card' | 'ACH' | 'Bank Deposit';
  reference: string;
  recordedBy: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  payments: InvoicePayment[];
  notes: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  relatedType?: 'lead' | 'deal' | 'customer' | 'ticket';
  relatedId?: string;
  relatedTitle?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  clientCompany: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  meetingLink: string;
  notes?: string;
}

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';
export type TicketCategory = 'Billing' | 'Technical' | 'Integration' | 'Feature Request' | 'Account Access';

export interface TicketMessage {
  id: string;
  author: string;
  isStaff: boolean;
  timestamp: string;
  content: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  company: string;
  subject: string;
  description?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgent: string;
  slaHours: number;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export type TeamRole =
  | 'Admin'
  | 'Sales Manager'
  | 'Account Executive'
  | 'SDR Lead'
  | 'Billing Specialist'
  | 'Support Agent';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  department: string;
  avatar: string;
  status: 'Active' | 'Invited' | 'Suspended';
  dealsClosed: number;
  quotaAttainment: number;
  pipelineValue: number;
  joinedDate: string;
}

export interface RolePermissions {
  role: TeamRole;
  viewLeads: boolean;
  editLeads: boolean;
  deleteLeads: boolean;
  viewDeals: boolean;
  editDeals: boolean;
  viewBilling: boolean;
  exportReports: boolean;
  manageTeam: boolean;
  manageSettings: boolean;
  viewTickets: boolean;
  manageQuotes: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  module: CRMModule | 'auth' | 'system';
  details: string;
  ipAddress?: string;
}

export interface ActivityItem {
  id: string;
  type: 'call' | 'deal' | 'invoice' | 'lead' | 'email' | 'payment' | 'ticket' | 'task';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  amount?: number;
}
