import {
Download,
Trophy
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';

export const ReportsPage: React.FC = () => {
  const { team, deals, formatCurrency } = useCrm();

  const [period, setPeriod] = useState<'MTD' | 'Q3' | 'YTD'>('Q3');

  // Rep leaderboard data
  const leaderReps = [...team]
    .filter((t) => t.role === 'Sales Manager' || t.role === 'Account Executive' || t.role === 'SDR Lead')
    .sort((a, b) => b.quotaAttainment - a.quotaAttainment);

  // Lead source ROI analytics data
  const sourceAnalytics = [
    { source: 'Inbound Web', count: 48, converted: 19, rate: 39.5, avgDeal: 82000, pipeline: 1558000 },
    { source: 'Referral', count: 24, converted: 14, rate: 58.3, avgDeal: 110000, pipeline: 1540000 },
    { source: 'LinkedIn InMail', count: 62, converted: 15, rate: 24.2, avgDeal: 54000, pipeline: 810000 },
    { source: 'Outbound SDR', count: 85, converted: 18, rate: 21.1, avgDeal: 68000, pipeline: 1224000 },
    { source: 'Conference & Events', count: 18, converted: 8, rate: 44.4, avgDeal: 145000, pipeline: 1160000 },
    { source: 'Strategic Partners', count: 15, converted: 7, rate: 46.7, avgDeal: 95000, pipeline: 665000 },
  ];

  const handleExportCSV = () => {
    const headers = ['ChannelSource', 'LeadsCount', 'ConvertedCount', 'ConversionRatePct', 'AvgDealUSD', 'PipelineYieldUSD'];
    const rows = sourceAnalytics.map((s) => [s.source, s.count, s.converted, s.rate, s.avgDeal, s.pipeline]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wordbitx-source-roi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Reports & Performance Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quota attainment leaderboards, channel conversion ROI, and pipeline velocity metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['MTD', 'Q3', 'YTD'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                  period === p ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* High-Level Conversion Velocity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Average Deal Cycle</span>
            <span className="text-emerald-400 font-mono text-[11px]">-4 days faster</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              31.8 Days
            </div>
            <div className="text-[11px] text-slate-400 mt-1">From initial lead to closed won</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Overall Win Rate</span>
            <span className="text-emerald-400 font-mono text-[11px]">+6.2% vs target</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              68.4%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Proposal to contract execution</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Average Contract Value (ACV)</span>
            <span className="text-indigo-400 font-mono text-[11px]">Enterprise tier</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-indigo-300 tabular-nums">
              {formatCurrency(86500)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Across 18 enterprise sign-ups</div>
          </div>
        </div>
      </div>

      {/* SDR / AE Leaderboard */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Sales Executive & Quota Leaderboard ({period})</span>
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Ranked by quota pacing and closed commercial volume
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">Benchmark: 100% Target</span>
        </div>

        <div className="space-y-4">
          {leaderReps.map((rep, idx) => {
            const repDeals = deals.filter((d) => d.owner === rep.name);
            const dealsClosedCount = repDeals.filter((d) => d.stage === 'closed_won').length || rep.dealsClosed;
            const repPipeline = repDeals.reduce((sum, d) => sum + d.amountInUSD, 0) || rep.pipelineValue;

            return (
              <div
                key={rep.id}
                className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-xs">{rep.name}</div>
                    <div className="text-[11px] text-slate-400">{rep.role} · {rep.department}</div>
                  </div>
                </div>

                {/* Quota Progress */}
                <div className="flex-1 max-w-md mx-2">
                  <div className="flex items-center justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-400">Quota Attainment:</span>
                    <span
                      className={`font-bold ${
                        rep.quotaAttainment >= 100 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {rep.quotaAttainment}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        rep.quotaAttainment >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(rep.quotaAttainment, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500">Deals Closed</div>
                    <div className="font-bold text-slate-200">{dealsClosedCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Pipeline Managed</div>
                    <div className="font-bold text-indigo-300">
                      {formatCurrency(repPipeline)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel Source ROI Comparison */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Lead Generation Channel ROI Matrix</h2>
            <div className="text-xs text-slate-400">Efficiency, conversion velocity, and pipeline yield</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Acquisition Channel</th>
                <th className="py-3 px-4 font-mono text-center">Leads</th>
                <th className="py-3 px-4 font-mono text-center">Wins</th>
                <th className="py-3 px-4 font-mono text-center">Conv. Rate</th>
                <th className="py-3 px-4 font-mono text-right">Avg. Deal Size</th>
                <th className="py-3 px-4 font-mono text-right">Pipeline Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sourceAnalytics.map((src, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {src.source}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-center tabular-nums text-slate-300">
                    {src.count}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-center tabular-nums text-emerald-400 font-bold">
                    {src.converted}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-center tabular-nums text-slate-200">
                    {src.rate}%
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right tabular-nums text-slate-200">
                    {formatCurrency(src.avgDeal)}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-300 text-right tabular-nums">
                    {formatCurrency(src.pipeline)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
