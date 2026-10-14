import { LifeBuoy,X } from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { TicketCategory,TicketPriority } from '../../types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTicket, customers } = useCrm();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Technical');
  const [priority, setPriority] = useState<TicketPriority>('High');
  const [assignedAgent, setAssignedAgent] = useState('Support Desk Lead');
  const [description, setDescription] = useState('');
  const [slaHours, setSlaHours] = useState(4);

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      alert('Please fill in ticket subject and issue description.');
      return;
    }

    addTicket({
      customerName: currentCustomer?.name || 'Client Contact',
      customerEmail: currentCustomer?.email || 'client@company.com',
      company: currentCustomer?.company || 'Client Account',
      subject,
      category,
      priority,
      status: 'Open',
      assignedAgent,
      slaHours,
      description,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Create Support Incident Ticket</h3>
              <p className="text-[11px] text-slate-400">Escalate customer issue with SLA tracking</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Incident Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Rate limit ceiling hit on telemetry sync API"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Customer Account</label>
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
              <label className="block text-slate-300 font-medium mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Technical">Technical & Infrastructure</option>
                <option value="Billing">Billing & Invoicing</option>
                <option value="Integration">Integration & Webhooks</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Account Access">Account Access & SSO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority SLA</label>
              <select
                value={priority}
                onChange={(e) => {
                  const p = e.target.value as TicketPriority;
                  setPriority(p);
                  if (p === 'Urgent') setSlaHours(2);
                  else if (p === 'High') setSlaHours(4);
                  else if (p === 'Medium') setSlaHours(8);
                  else setSlaHours(24);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Urgent">Urgent (2 hr SLA)</option>
                <option value="High">High (4 hr SLA)</option>
                <option value="Medium">Medium (8 hr SLA)</option>
                <option value="Low">Low (24 hr SLA)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">SLA Target (Hrs)</label>
              <input
                type="number"
                min="1"
                max="72"
                value={slaHours}
                onChange={(e) => setSlaHours(parseInt(e.target.value) || 4)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Assigned Agent</label>
              <select
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Support Desk Lead">Support Desk Lead</option>
                <option value="Zayn Malik">Zayn Malik (Tier 2)</option>
                <option value="Chloe Monet">Chloe Monet (Finance)</option>
                <option value="Marcus Vance">Marcus Vance (Strategic AE)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Issue Details & Steps to Reproduce *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe customer issue, error codes, affected endpoints..."
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
              Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
