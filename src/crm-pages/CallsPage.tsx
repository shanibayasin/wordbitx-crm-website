import {
ArrowDownLeft,
ArrowUpRight,
CheckCircle2,
FileText,
ListCheck,
Plus,
Radio,
Search,
Sparkles
} from 'lucide-react';
import React,{ useState } from 'react';
import { CallRecordingPlayer } from '../components/audio/CallRecordingPlayer';
import { useCrm } from '../context/CrmContext';
import { CallRecording } from '../types/crm';

export const CallsPage: React.FC = () => {
  const {
    calls,
    activeCall,
    setActiveCall,
    telephonyProvider,
    setIsLogCallOpen,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'actions'>('summary');
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState('All');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const currentCall: CallRecording = activeCall || calls[0];

  const filteredCalls = calls.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.repName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDir = directionFilter === 'All' || c.direction === directionFilter;
    return matchesSearch && matchesDir;
  });

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const toggleAction = (idx: number) => {
    const key = `${currentCall.id}-${idx}`;
    setCompletedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Call Center & VoIP Telephony Workspace</span>
            <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded">
              {telephonyProvider.providerType} Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized VoIP recordings, acoustic sentiment detection, and automated CRM action items
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLogCallOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Telephony Call</span>
        </button>
      </div>

      {/* Telephony Provider Integration Banner */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div>
            <span className="font-semibold text-white">Telephony Gateway: {telephonyProvider.name}</span>
            <span className="text-slate-400 text-[11px] ml-2">
              (SIP Trunk · Two-Party Recording Consent Policy Active)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Latency: <strong className="text-emerald-400">14ms</strong></span>
          <span>·</span>
          <span>Buffer: <strong className="text-slate-200">Lossless OPUS</strong></span>
        </div>
      </div>

      {/* Active Call Audio Player */}
      {currentCall && <CallRecordingPlayer recording={currentCall} />}

      {/* Main Split: Catalog on Left, AI Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Call Catalog (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white">Telephony Call Logs</span>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredCalls.length} logs
            </span>
          </div>

          {/* Search Box & Direction Filter */}
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter calls by customer or rep..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {(['All', 'Outgoing', 'Incoming'] as const).map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setDirectionFilter(dir)}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    directionFilter === dir
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Call list */}
          <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[550px]">
            {filteredCalls.map((call) => {
              const isSelected = currentCall.id === call.id;
              return (
                <div
                  key={call.id}
                  onClick={() => setActiveCall(call)}
                  className={`p-3.5 text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-600/10 border-l-2 border-indigo-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {call.direction === 'Incoming' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-100 truncate">{call.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {formatSeconds(call.durationSeconds)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-2 truncate">
                    <span className="text-slate-300 font-medium">{call.customerName}</span>
                    <span>·</span>
                    <span className="truncate">{call.company}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-[10px]">
                    <div className="text-slate-400 font-mono">
                      Outcome: <strong className="text-slate-300">{call.outcome}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      {call.recordingStatus === 'Available' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Audio
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">No Stream</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Intelligence & Transcript (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col">
          {/* Tabs */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'summary'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('transcript')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'transcript'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Audio Transcript ({currentCall.transcript?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'actions'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListCheck className="w-3.5 h-3.5" />
                <span>Action Checklist ({currentCall.actionItems?.length || 0})</span>
              </button>
            </div>

            <div className="hidden sm:block text-[11px] font-mono text-slate-400">
              Date: {currentCall.date}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 flex-1 overflow-y-auto max-h-[550px] text-xs">
            {activeTab === 'summary' && (
              <div className="space-y-5">
                {/* Acoustic Sentiment Index */}
                <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 mb-0.5">Acoustic Sentiment Index</div>
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <span
                        className={
                          currentCall.sentiment === 'Positive'
                            ? 'text-emerald-400'
                            : currentCall.sentiment === 'Needs Attention'
                            ? 'text-rose-400'
                            : 'text-amber-400'
                        }
                      >
                        {currentCall.sentiment}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({currentCall.sentimentScore}/100)
                      </span>
                    </div>
                  </div>
                  <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        currentCall.sentiment === 'Positive'
                          ? 'bg-emerald-500'
                          : currentCall.sentiment === 'Needs Attention'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${currentCall.sentimentScore}%` }}
                    />
                  </div>
                </div>

                {/* Synthesis */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Executive Dialogue Synthesis
                  </h3>
                  <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                    {currentCall.summary}
                  </div>
                </div>

                {/* Takeaways */}
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Key Commercial Takeaways
                  </h3>
                  <div className="space-y-2">
                    {currentCall.keyTakeaways.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 flex items-start gap-2.5 text-slate-300"
                      >
                        <span className="font-mono text-indigo-400 text-[11px] font-bold mt-0.5">
                          0{i + 1}.
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="space-y-3.5">
                {currentCall.transcript && currentCall.transcript.length > 0 ? (
                  currentCall.transcript.map((line, idx) => {
                    const isRep = line.speaker === currentCall.repName;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          isRep ? 'bg-slate-950/60 border-slate-800' : 'bg-indigo-950/15 border-indigo-900/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className={`font-semibold ${isRep ? 'text-slate-300' : 'text-indigo-400'}`}>
                            {line.speaker}
                          </span>
                          <span className="font-mono text-slate-500">{line.timestamp}</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{line.text}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No transcript available for this call log.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 mb-3">
                  AI extracted tasks assigned from this recording. Click to complete.
                </p>
                {currentCall.actionItems.map((item, idx) => {
                  const key = `${currentCall.id}-${idx}`;
                  const isDone = !!completedActions[key];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAction(idx)}
                      className={`w-full p-3.5 rounded-lg border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800 opacity-60 line-through'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 ${
                          isDone ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="flex-1 text-xs">{item}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
