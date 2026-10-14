import {
Send,
X
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Ticket,TicketStatus } from '../../types/crm';

interface Props {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<Props> = ({ ticket, onClose }) => {
  const { updateTicketStatus, addTicketMessage, tickets } = useCrm();
  const [replyText, setReplyText] = useState('');

  if (!ticket) return null;

  const currentTicket = tickets.find((t) => t.id === ticket.id) || ticket;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addTicketMessage(currentTicket.id, {
      author: 'Alex Rivera (Staff Support)',
      isStaff: true,
      content: replyText.trim(),
    });

    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-indigo-400">
                {ticket.ticketNumber}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] text-slate-400">{ticket.category}</span>
              <span className="text-slate-600">·</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  ticket.priority === 'Urgent'
                    ? 'text-rose-400 bg-rose-950/50'
                    : ticket.priority === 'High'
                    ? 'text-amber-400 bg-amber-950/50'
                    : 'text-indigo-300 bg-indigo-950/50'
                }`}
              >
                {ticket.priority} Priority ({ticket.slaHours}h SLA)
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{ticket.subject}</h3>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Account: <span className="text-slate-200 font-semibold">{ticket.company}</span> ({ticket.customerName})
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

        {/* Status Lifecycle Selector */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              value={currentTicket.status}
              onChange={(e) => updateTicketStatus(currentTicket.id, e.target.value as TicketStatus)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending Client Response</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Assigned: <span className="text-slate-200">{currentTicket.assignedAgent}</span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 max-h-[380px] text-xs">
          {currentTicket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3.5 rounded-lg border ${
                msg.isStaff
                  ? 'bg-indigo-950/20 border-indigo-900/40 ml-4'
                  : 'bg-slate-950/60 border-slate-800 mr-4'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`font-semibold ${msg.isStaff ? 'text-indigo-400' : 'text-white'}`}>
                    {msg.author}
                  </span>
                  {msg.isStaff && (
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-indigo-900/60 text-indigo-300 rounded">
                      Staff
                    </span>
                  )}
                </div>
                <span className="text-slate-500 font-mono">{msg.timestamp}</span>
              </div>
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="p-3 border-t border-slate-800 bg-slate-950/70 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type customer reply or internal engineering response..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
