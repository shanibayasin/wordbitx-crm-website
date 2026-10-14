'use client';

import { useState, useSyncExternalStore, type ReactNode } from 'react';
import { useCrm } from './context/CrmContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandSearchModal } from './components/layout/CommandSearchModal';

import { LeadDetailModal } from './components/modals/LeadDetailModal';
import { CreateLeadModal } from './components/modals/CreateLeadModal';
import { LeadConvertModal } from './components/modals/LeadConvertModal';
import { DealDetailModal } from './components/modals/DealDetailModal';
import { CreateDealModal } from './components/modals/CreateDealModal';
import { CustomerDetailModal } from './components/modals/CustomerDetailModal';
import { CreateCustomerModal } from './components/modals/CreateCustomerModal';
import { QuotationPreviewModal } from './components/modals/QuotationPreviewModal';
import { CreateQuotationModal } from './components/modals/CreateQuotationModal';
import { InvoicePreviewModal } from './components/modals/InvoicePreviewModal';
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { TicketDetailModal } from './components/modals/TicketDetailModal';
import { LogCallModal } from './components/modals/LogCallModal';
import { InviteTeamModal } from './components/modals/InviteTeamModal';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function App({ children }: { children: ReactNode }) {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const {
    activeLeadModal,
    setActiveLeadModal,
    isCreateLeadOpen,
    setIsCreateLeadOpen,
    leadToConvert,
    setLeadToConvert,
    isConvertLeadOpen,
    setIsConvertLeadOpen,
    activeDealModal,
    setActiveDealModal,
    isCreateDealOpen,
    setIsCreateDealOpen,
    activeCustomerModal,
    setActiveCustomerModal,
    isCreateCustomerOpen,
    setIsCreateCustomerOpen,
    activeQuotationModal,
    setActiveQuotationModal,
    isCreateQuotationOpen,
    setIsCreateQuotationOpen,
    activeInvoiceModal,
    setActiveInvoiceModal,
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
    activeTicketModal,
    setActiveTicketModal,
    isCreateTicketOpen,
    setIsCreateTicketOpen,
    isInviteTeamOpen,
    setIsInviteTeamOpen,
  } = useCrm();

  if (!isMounted) {
    return (
      <div
        role="status"
        className="grid min-h-dvh place-items-center bg-slate-950 text-slate-600"
      >
        Loading your workspace...
      </div>
    );
  }

  return (
    <div className="dashboard-shell flex h-dvh min-h-[600px] w-full overflow-hidden bg-slate-950 text-slate-900">
      <Sidebar
        isMobileOpen={isMobileNavigationOpen}
        onMobileClose={() => setIsMobileNavigationOpen(false)}
      />
      {isMobileNavigationOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setIsMobileNavigationOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileNavigationOpen(true)} />
        <main className="dashboard-content-area min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 lg:px-4">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      <CommandSearchModal />

      <LeadDetailModal
        key={activeLeadModal?.id ?? 'no-lead'}
        lead={activeLeadModal}
        onClose={() => setActiveLeadModal(null)}
      />
      <CreateLeadModal
        isOpen={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
      />
      <LeadConvertModal
        isOpen={isConvertLeadOpen || Boolean(leadToConvert)}
        lead={leadToConvert}
        onClose={() => {
          setIsConvertLeadOpen(false);
          setLeadToConvert(null);
        }}
      />

      <DealDetailModal
        deal={activeDealModal}
        onClose={() => setActiveDealModal(null)}
      />
      <CreateDealModal
        isOpen={isCreateDealOpen}
        onClose={() => setIsCreateDealOpen(false)}
      />

      <CustomerDetailModal
        customer={activeCustomerModal}
        onClose={() => setActiveCustomerModal(null)}
      />
      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={() => setIsCreateCustomerOpen(false)}
      />

      <QuotationPreviewModal
        quotation={activeQuotationModal}
        onClose={() => setActiveQuotationModal(null)}
      />
      <CreateQuotationModal
        isOpen={isCreateQuotationOpen}
        onClose={() => setIsCreateQuotationOpen(false)}
      />

      <InvoicePreviewModal
        invoice={activeInvoiceModal}
        onClose={() => setActiveInvoiceModal(null)}
      />
      <CreateInvoiceModal
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
      />
      <RecordPaymentModal
        key={invoiceToPay?.id ?? 'no-invoice'}
        isOpen={isRecordPaymentOpen || Boolean(invoiceToPay)}
        invoice={invoiceToPay}
        onClose={() => {
          setIsRecordPaymentOpen(false);
          setInvoiceToPay(null);
        }}
      />

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />
      <LogCallModal
        isOpen={isLogCallOpen}
        onClose={() => setIsLogCallOpen(false)}
      />
      <TicketDetailModal
        ticket={activeTicketModal}
        onClose={() => setActiveTicketModal(null)}
      />
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
      />
      <InviteTeamModal
        isOpen={isInviteTeamOpen}
        onClose={() => setIsInviteTeamOpen(false)}
      />
    </div>
  );
}
