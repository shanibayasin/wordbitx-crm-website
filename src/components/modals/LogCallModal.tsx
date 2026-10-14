import { PhoneCall,X } from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CallDirection,CallOutcome } from '../../types/crm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LogCallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { logCall, customers, team } = useCrm();

  const [direction, setDirection] = useState<CallDirection>('Outgoing');
  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Elena Rostova');
  const [company, setCompany] = useState(customers[0]?.company || 'Apex Cloud Systems');
  const [repName, setRepName] = useState(team[0]?.name || 'Marcus Vance');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(8);
  const [outcome, setOutcome] = useState<CallOutcome>('Connected');
  const [consentObtained, setConsentObtained] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName) {
      alert('Please fill in call title and customer contact.');
      return;
    }

    logCall({
      direction,
      outcome,
      customerName,
      company,
      repName,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      durationSeconds: durationMinutes * 60,
      sentiment: outcome === 'Connected' ? 'Positive' : 'Neutral',
      sentimentScore: outcome === 'Connected' ? 85 : 50,
      recordingStatus: consentObtained ? 'Available' : 'No Recording / Consent Not Provided',
      consentObtained,
      title,
      summary: notes || 'Call logged manually by representative.',
      keyTakeaways: ['Call summary logged in CRM', `Outcome tagged as ${outcome}`],
      actionItems: ['Review follow-up timeline'],
      audioWaveform: consentObtained ? [20, 40, 60, 75, 80, 65, 45, 30, 50, 70, 85, 60, 30, 20] : [],
      transcript: [],
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Log Telephony Call Record</h3>
              <p className="text-[11px] text-slate-400">Record call disposition, timing, and recording status</p>
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
            <label className="block text-slate-300 font-medium mb-1">Call Subject / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Executive Discovery & SLA Alignment"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Call Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as CallDirection)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Outgoing">Outgoing Call</option>
                <option value="Incoming">Incoming Call</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Call Outcome / Disposition</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as CallOutcome)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Connected">Connected & Spoke</option>
                <option value="Follow-up Scheduled">Follow-up Scheduled</option>
                <option value="Voicemail">Left Voicemail</option>
                <option value="Busy">Busy / No Answer</option>
                <option value="Gatekeeper">Gatekeeper Screened</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Client Contact Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Apex Cloud Systems"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Call Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Sales Representative</label>
              <select
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {team.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recording Consent Checkbox */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentObtained}
                onChange={(e) => setConsentObtained(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-indigo-600 rounded cursor-pointer"
              />
              <div>
                <div className="font-semibold text-slate-200">Recording Consent Verified</div>
                <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Confirm two-party audio recording consent was announced in compliance with regulatory mandates.
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Discussion Takeaways & Next Steps</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key pain points, requested redlines, decision makers..."
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
              Log Call Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
