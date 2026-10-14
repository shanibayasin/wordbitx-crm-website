import React, { useState } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { TaskPriority } from '../../types/crm';

const DEFAULT_DUE_DATE = new Date(Date.now() + 3 * 86400000)
  .toISOString()
  .split('T')[0];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addTask, team, deals, leads, customers } = useCrm();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('High');
  const [dueDate, setDueDate] = useState(DEFAULT_DUE_DATE);
  const [assignedTo, setAssignedTo] = useState(team[0]?.name || 'Marcus Vance');
  const [relatedType, setRelatedType] = useState<'deal' | 'lead' | 'customer'>('deal');
  const [relatedId, setRelatedId] = useState(deals[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a task title.');
      return;
    }

    let relatedTitle = '';
    if (relatedType === 'deal') {
      relatedTitle = deals.find((d) => d.id === relatedId)?.title || '';
    } else if (relatedType === 'lead') {
      relatedTitle = leads.find((l) => l.id === relatedId)?.name || '';
    } else {
      relatedTitle = customers.find((c) => c.id === relatedId)?.company || '';
    }

    addTask({
      title,
      description,
      priority,
      status: 'Todo',
      dueDate,
      assignedTo,
      relatedType,
      relatedId,
      relatedTitle,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Create Sales Follow-Up Task</h3>
              <p className="text-[11px] text-slate-400">Schedule team action item or reminder</p>
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
            <label className="block text-slate-300 font-medium mb-1">Task Action Item *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Call CFO to confirm wire transfer"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assigned Executive</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {team.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name} ({t.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Link Record Type</label>
              <select
                value={relatedType}
                onChange={(e) => {
                  const t = e.target.value as 'deal' | 'lead' | 'customer';
                  setRelatedType(t);
                  if (t === 'deal') setRelatedId(deals[0]?.id || '');
                  if (t === 'lead') setRelatedId(leads[0]?.id || '');
                  if (t === 'customer') setRelatedId(customers[0]?.id || '');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="deal">Opportunity Deal</option>
                <option value="lead">Inbound Lead</option>
                <option value="customer">Customer Profile</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Associated Record</label>
              <select
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer truncate"
              >
                {relatedType === 'deal' &&
                  deals.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.company} - {d.title}
                    </option>
                  ))}
                {relatedType === 'lead' &&
                  leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company} ({l.name})
                    </option>
                  ))}
                {relatedType === 'customer' &&
                  customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Action Context & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Background context for task completion..."
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
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
