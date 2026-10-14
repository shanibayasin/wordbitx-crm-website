import {
Bell,
Building,
Check,
Globe,
Key,
Save,
Sliders
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { CurrencyCode } from '../types/crm';

export const SettingsPage: React.FC = () => {
  const { currency, setCurrency, currencyConfigs, updateCurrencyRate } = useCrm();

  const [companyName, setCompanyName] = useState('WordbitX Enterprise Corp');
  const [domain, setDomain] = useState('crm.wordbitx.io');
  const [supportEmail, setSupportEmail] = useState('support@wordbitx.io');
  const [timezone, setTimezone] = useState('America/Los_Angeles (UTC-7)');
  const [staleThresholdDays, setStaleThresholdDays] = useState(14);

  // Notification toggles
  const [notifyDeals, setNotifyDeals] = useState(true);
  const [notifyLeads, setNotifyLeads] = useState(true);
  const [notifyTranscripts, setNotifyTranscripts] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            CRM Workspace Preferences & System Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure enterprise workspace policies, webhook gateways, and notification triggers
          </p>
        </div>

        {saveSuccess && (
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded-lg">
            <Check className="w-3.5 h-3.5" /> Changes saved successfully
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Organization Profile */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Organization & Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Entity Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Custom CRM Domain URL</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Support & Escalation Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Default Reporting Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="USD">USD ($) - US Dollar (Base)</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="PKR">PKR (₨) - Pakistani Rupee</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="AUD">AUD (A$) - Australian Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Multi-Currency & Exchange Rate Table */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Multi-Currency & Forex Rate Engine</h2>
                <p className="text-[11px] text-slate-400">
                  Illustrative, locally edited rates relative to USD. No live exchange-rate provider is connected.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-slate-300">
              Base: USD ($)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Currency</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3 font-mono">Exchange Rate (vs USD)</th>
                  <th className="py-2.5 px-3">Rate Source</th>
                  <th className="py-2.5 px-3 font-mono">Last Updated</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {Object.values(currencyConfigs).map((cfg) => {
                  return (
                    <tr key={cfg.code} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">
                        {cfg.code} <span className="font-sans text-slate-400 font-normal">({cfg.name})</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-indigo-400">{cfg.symbol}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-400 font-bold">{cfg.rate.toFixed(cfg.code === 'JPY' || cfg.code === 'PKR' ? 2 : 4)}</span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">
                        {cfg.source || 'No live provider'}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400">
                        {cfg.lastUpdated || 'Not synchronized'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const newRateStr = prompt(
                              `Update exchange rate for ${cfg.code} (currently ${cfg.rate}):`,
                              String(cfg.rate)
                            );
                            if (newRateStr && !isNaN(parseFloat(newRateStr))) {
                              updateCurrencyRate(
                                cfg.code,
                                parseFloat(newRateStr),
                                'Manual local adjustment (not a live feed)'
                              );
                            }
                          }}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[11px] font-sans transition-colors cursor-pointer"
                        >
                          Edit Rate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Pipeline Calibration */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Pipeline Automation & SLA Triggers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Stale Deal Inactivity Alert (Days)
              </label>
              <input
                type="number"
                min="3"
                max="90"
                value={staleThresholdDays}
                onChange={(e) => setStaleThresholdDays(parseInt(e.target.value) || 14)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Flag opportunities with no client contact past this period.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">System Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Toggles */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Notification & Dispatch Rules</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">High-Value Deal Escalation Alerts</div>
                <div className="text-[11px] text-slate-400">
                  Notify VP of Sales when opportunities exceed $50,000 threshold.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyDeals}
                onChange={(e) => setNotifyDeals(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">New Inbound Prospect Qualification</div>
                <div className="text-[11px] text-slate-400">
                  Alert SDR routing queue upon high-scoring website form submission.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyLeads}
                onChange={(e) => setNotifyLeads(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 cursor-pointer">
              <div>
                <div className="font-semibold text-slate-200">Call Recording AI Transcription Ready</div>
                <div className="text-[11px] text-slate-400">
                  Instant push notification when audio transcription and sentiment analysis finish.
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyTranscripts}
                onChange={(e) => setNotifyTranscripts(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 4: API & Webhooks */}
        <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">API Credentials & Webhook Gateway</h2>
          </div>

          <div className="rounded-lg border border-amber-800/70 bg-amber-950/30 p-3 text-amber-200">
            This client-only demo has no backend API or webhook integration. Do not enter or use production
            credentials here. Configure secrets in a server-side environment after a backend is implemented.
          </div>
        </div>

        {/* Submit Save */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
