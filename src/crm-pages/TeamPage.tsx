import {
Check,
Lock,
ShieldCheck,
UserPlus,
Users,
X
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { RolePermissions } from '../types/crm';

export const TeamPage: React.FC = () => {
  const { team, permissions, togglePermission, setIsInviteTeamOpen } = useCrm();

  const [activeTab, setActiveTab] = useState<'members' | 'rbac'>('members');

  const permissionColumns: { key: keyof RolePermissions; label: string }[] = [
    { key: 'viewLeads', label: 'View Leads' },
    { key: 'editLeads', label: 'Edit Leads' },
    { key: 'deleteLeads', label: 'Delete Leads' },
    { key: 'viewDeals', label: 'View Deals' },
    { key: 'editDeals', label: 'Edit Deals' },
    { key: 'viewBilling', label: 'View Billing' },
    { key: 'exportReports', label: 'Export Reports' },
    { key: 'manageTeam', label: 'Manage Team' },
    { key: 'manageSettings', label: 'Configure Settings' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Team Governance & RBAC Security</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Role definitions, fine-grained object access controls, and organization roster
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteTeamOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Team Colleague</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'members'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Directory ({team.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rbac')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rbac'
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBAC Permission Matrix</span>
        </button>
      </div>

      {/* Team Directory Tab */}
      {activeTab === 'members' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Role & Department</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4 font-mono text-center">Deals Closed</th>
                  <th className="py-3 px-4 font-mono text-center">Quota Pace</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 font-mono">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{member.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">ID: {member.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{member.role}</div>
                      <div className="text-[11px] text-slate-400">{member.department}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {member.email}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-center tabular-nums text-slate-200">
                      {member.dealsClosed}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-center tabular-nums">
                      <span
                        className={
                          member.quotaAttainment >= 100
                            ? 'text-emerald-400 font-bold'
                            : 'text-amber-400'
                        }
                      >
                        {member.quotaAttainment}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono text-emerald-400">
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {member.joinedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RBAC Matrix Tab */}
      {activeTab === 'rbac' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                Role-Based Access Control (RBAC) Rulebook
              </h2>
              <p className="text-xs text-slate-400">
                Click any toggle to dynamically update privilege policies for that persona
              </p>
            </div>
            <span className="text-[11px] font-mono text-indigo-400">
              Zero-Trust Enforcement Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800/80 rounded-lg">
              <thead className="bg-slate-950/80 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 min-w-[160px]">System Persona</th>
                  {permissionColumns.map((col) => (
                    <th key={col.key} className="py-3 px-3 text-center min-w-[110px]">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {permissions.map((p) => (
                  <tr key={p.role} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.role}</span>
                    </td>

                    {permissionColumns.map((col) => {
                      const isAllowed = p[col.key];
                      const isSuperAdminLocked = p.role === 'Admin' && col.key === 'manageSettings';

                      return (
                        <td key={col.key} className="py-3 px-3 text-center">
                          <button
                            type="button"
                            disabled={isSuperAdminLocked}
                            onClick={() => togglePermission(p.role, col.key)}
                            className={`w-7 h-7 mx-auto rounded flex items-center justify-center transition-colors cursor-pointer ${
                              isAllowed
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                                : 'bg-slate-800/50 text-slate-500 hover:bg-slate-800 border border-slate-800'
                            }`}
                            title={`Toggle ${col.label} for ${p.role}`}
                          >
                            {isAllowed ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-950/40 rounded border border-slate-850 text-xs text-slate-400 flex items-center justify-between">
            <span>All permission edits take effect immediately across all active user sessions.</span>
            <span className="font-mono text-emerald-400">Policies Enforced</span>
          </div>
        </div>
      )}
    </div>
  );
};
