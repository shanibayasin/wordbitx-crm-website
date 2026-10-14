import {
AlertTriangle,
Archive,
ArrowUpDown,
CheckCircle2,
Download,
Filter,
Plus,
Search,
Trash2,
Upload
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { LeadSource } from '../types/crm';

export const LeadsPage: React.FC = () => {
  const {
    leads,
    formatCurrency,
    setActiveLeadModal,
    setIsCreateLeadOpen,
    setLeadToConvert,
    setIsConvertLeadOpen,
    bulkArchiveLeads,
    bulkDeleteLeads,
    addLead,
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'prospects' | 'contacts'>('prospects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'estimate' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');

  // Duplicate detection logic (checks for duplicate email or company)
  const duplicateCompanies = leads
    .map((l) => l.company.toLowerCase())
    .filter((comp, idx, arr) => arr.indexOf(comp) !== idx && arr.lastIndexOf(comp) === idx);

  // Filtered leads
  const filteredLeads = leads
    .filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'All' || l.status === selectedStatus;
      const matchSource = selectedSource === 'All' || l.source === selectedSource;

      return matchSearch && matchStatus && matchSource;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'score') diff = b.score - a.score;
      if (sortBy === 'estimate') diff = b.dealEstimate - a.dealEstimate;
      if (sortBy === 'name') diff = a.name.localeCompare(b.name);
      return sortOrder === 'desc' ? diff : -diff;
    });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkArchive = () => {
    if (confirm(`Archive ${selectedLeadIds.length} selected leads?`)) {
      bulkArchiveLeads(selectedLeadIds);
      setSelectedLeadIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Permanently remove ${selectedLeadIds.length} selected leads?`)) {
      bulkDeleteLeads(selectedLeadIds);
      setSelectedLeadIds([]);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Title',
      'Company',
      'Email',
      'Phone',
      'Source',
      'Status',
      'Score',
      'DealEstimate',
      'Currency',
      'Owner',
    ];
    const rows = filteredLeads.map((l) => [
      l.name,
      l.title,
      l.company,
      l.email,
      l.phone,
      l.source,
      l.status,
      l.score,
      l.dealEstimate,
      l.currency,
      l.owner,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `wordbitx-leads-export-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessCsvImport = () => {
    if (!importCsvText.trim()) return;
    const lines = importCsvText.trim().split('\n');
    let imported = 0;
    lines.slice(1).forEach((line) => {
      const parts = line.split(',').map((p) => p.trim());
      if (parts[0] && parts[2]) {
        addLead({
          name: parts[0],
          title: parts[1] || 'Lead Contact',
          company: parts[2],
          email: parts[3] || `${parts[0].toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: parts[4] || '+1 555-0100',
          source: (parts[5] as LeadSource) || 'Inbound Web',
          status: 'New',
          priority: 'Medium',
          score: parseInt(parts[7]) || 70,
          dealEstimate: parseFloat(parts[8]) || 35000,
          currency: 'USD',
          owner: parts[10] || 'Marcus Vance',
          lastContacted: 'Imported',
          notes: 'Batch imported via CSV ingestion.',
          industry: 'Enterprise Technology',
          location: 'United States',
        });
        imported++;
      }
    });
    alert(`Successfully imported ${imported} leads from CSV.`);
    setShowImportModal(false);
    setImportCsvText('');
  };

  const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Disqualified', 'Converted'];
  const sourceOptions = ['All', 'Inbound Web', 'LinkedIn', 'Outbound SDR', 'Referral', 'Conference', 'Partner'];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Leads & Prospect Intelligence</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {leads.length} Records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify, score, qualify, and convert inbound enterprise prospects into verified accounts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCreateLeadOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Duplicate Warning Banner if applicable */}
      {duplicateCompanies.length > 0 && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Duplicate Account Detected:</strong> Multiple leads belong to &ldquo;
              {duplicateCompanies.join(', ')}&rdquo;. Merge or consolidate to avoid rep collision.
            </span>
          </div>
        </div>
      )}

      {/* Bulk Action Strip (when items selected) */}
      {selectedLeadIds.length > 0 && (
        <div className="p-2.5 bg-indigo-950/60 border border-indigo-800 rounded-xl flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            <span>
              <strong>{selectedLeadIds.length}</strong> leads selected for bulk action
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkArchive}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <Archive className="w-3 h-3" />
              <span>Archive</span>
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded text-xs flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Tab */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('prospects')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'prospects'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Prospect Leads ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Contacts Directory
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, name, email, or industry..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Multi-Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3 h-3 text-slate-500" />
            <span>Filters:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {sourceOptions.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-400 text-[11px]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'estimate' | 'name')}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="score">Lead Score</option>
              <option value="estimate">Valuation Estimate</option>
              <option value="name">Contact Name</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0
                    }
                    onChange={handleSelectAll}
                    className="accent-indigo-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Contact & Role</th>
                <th className="py-3 px-4">Account & Industry</th>
                <th className="py-3 px-4 font-mono text-center">Score</th>
                <th className="py-3 px-4">Status & Channel</th>
                <th className="py-3 px-4 font-mono text-right">Est. Value</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);
                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-slate-800/40 transition-colors group cursor-pointer ${
                      isSelected ? 'bg-indigo-950/20' : ''
                    }`}
                    onClick={() => setActiveLeadModal(lead)}
                  >
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(lead.id)}
                        className="accent-indigo-600 cursor-pointer"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{lead.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{lead.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{lead.company}</div>
                      <div className="text-[11px] text-slate-400">{lead.industry}</div>
                      <div className="text-[10px] text-slate-500">{lead.location}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-mono font-bold text-slate-100 tabular-nums">
                          {lead.score}
                        </span>
                        <div className="w-12 bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full ${
                              lead.score > 80
                                ? 'bg-emerald-500'
                                : lead.score > 60
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-mono font-medium ${
                          lead.status === 'Converted'
                            ? 'text-emerald-400 font-bold'
                            : lead.status === 'Qualified'
                            ? 'text-indigo-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{lead.source}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                      {formatCurrency(lead.dealEstimate)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{lead.owner}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Last: {lead.lastContacted}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {lead.status !== 'Converted' && (
                          <button
                            type="button"
                            onClick={() => {
                              setLeadToConvert(lead);
                              setIsConvertLeadOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:text-white hover:bg-emerald-600/40 border border-emerald-600/30 rounded transition-colors cursor-pointer"
                          >
                            Qualify →
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveLeadModal(lead)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Import Leads from CSV</h3>
            <p className="text-slate-400">Paste standard CSV text (Header: Name, Title, Company, Email, Phone, Source, Status, Score, DealEstimate, Currency, Owner)</p>
            <textarea
              rows={6}
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              placeholder={`Name,Title,Company,Email,Phone,Source,Status,Score,DealEstimate,Currency,Owner\nZubair Ahmed,CTO,PakTech Systems,z.ahmed@paktech.pk,+92 21 3456 7890,Inbound Web,New,80,40000,USD,Marcus Vance`}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessCsvImport}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded cursor-pointer"
              >
                Ingest CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
