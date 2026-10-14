import {
Calendar,
CheckCircle2,
LayoutGrid,
List,
Plus,
Search,
Video
} from 'lucide-react';
import React,{ useState } from 'react';
import { useCrm } from '../context/CrmContext';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    meetings,
    toggleTaskStatus,
    setIsCreateTaskOpen,
  } = useCrm();

  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'Todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'Completed');

  const overdueCount = tasks.filter((t) => t.status !== 'Completed' && t.dueDate < todayStr).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Tasks, Calendar & Executive Activities</span>
            {overdueCount > 0 && (
              <span className="text-[10px] font-mono uppercase bg-rose-950/60 text-rose-400 border border-rose-800/40 px-2 py-0.5 rounded">
                {overdueCount} Overdue
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Follow-up reminders, scheduled client demonstrations, and team action tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Kanban View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Calendar & Meetings View"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateTaskOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[180px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-2.5 py-1 text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Total: <strong className="text-white">{tasks.length}</strong> tasks (
          <span className="text-emerald-400">
            {tasks.filter((t) => t.status === 'Completed').length} completed
          </span>
          )
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-800/60">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">No tasks recorded.</div>
            ) : (
              filteredTasks.map((t) => {
                const isOverdue = t.status !== 'Completed' && t.dueDate < todayStr;
                const isCompleted = t.status === 'Completed';

                return (
                  <div
                    key={t.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isCompleted ? 'bg-slate-950/30 opacity-70' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(t.id)}
                        className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-600 hover:border-indigo-400'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="min-w-0">
                        <div
                          className={`font-semibold text-xs leading-snug ${
                            isCompleted ? 'text-slate-400 line-through' : 'text-white'
                          }`}
                        >
                          {t.title}
                        </div>
                        {t.description && (
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {t.description}
                          </div>
                        )}
                        {t.relatedTitle && (
                          <div className="text-[10px] text-indigo-400 font-mono mt-1">
                            Linked: {t.relatedTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0 pl-8 sm:pl-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded font-sans ${
                          t.priority === 'Urgent'
                            ? 'text-rose-400 bg-rose-950/50'
                            : t.priority === 'High'
                            ? 'text-amber-400 bg-amber-950/50'
                            : 'text-slate-400 bg-slate-800'
                        }`}
                      >
                        {t.priority}
                      </span>

                      <div className="text-right">
                        <div className={`text-[11px] ${isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                          {isOverdue && '⚠️ '}Due {t.dueDate}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">{t.assignedTo}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column Todo */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3.5 flex flex-col">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-xs font-bold text-white">
              <span>To Do Action Items</span>
              <span className="font-mono text-slate-400">{todoTasks.length}</span>
            </div>
            <div className="space-y-2.5 flex-1">
              {todoTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <div className="font-semibold text-white leading-snug mb-1">{t.title}</div>
                  <div className="text-[11px] text-slate-400 mb-2">{t.description}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px]">
                    <span className="text-amber-400">{t.priority}</span>
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(t.id)}
                      className="text-indigo-400 hover:underline cursor-pointer"
                    >
                      Complete →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column In Progress */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3.5 flex flex-col">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-xs font-bold text-white">
              <span>In Progress Workstreams</span>
              <span className="font-mono text-slate-400">{inProgressTasks.length}</span>
            </div>
            <div className="space-y-2.5 flex-1">
              {inProgressTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <div className="font-semibold text-white leading-snug mb-1">{t.title}</div>
                  <div className="text-[11px] text-slate-400 mb-2">{t.description}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-[10px]">
                    <span className="text-indigo-400">{t.assignedTo}</span>
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(t.id)}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      Done ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column Completed */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3.5 flex flex-col">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-xs font-bold text-white">
              <span>Completed Tasks</span>
              <span className="font-mono text-emerald-400">{completedTasks.length}</span>
            </div>
            <div className="space-y-2.5 flex-1">
              {completedTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 text-xs opacity-70">
                  <div className="font-semibold text-slate-300 line-through leading-snug">{t.title}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Done by {t.assignedTo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Executive Calendar & Scheduled Calls</h2>
              <p className="text-xs text-slate-400">Confirmed stakeholder demonstrations and review meetings</p>
            </div>
            <span className="text-[11px] font-mono text-indigo-400">Google Meet & Zoom Bridge Active</span>
          </div>

          <div className="space-y-3">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-slate-400 font-semibold">{m.date}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-indigo-400 font-mono font-medium">
                      {m.startTime} - {m.endTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{m.title}</h3>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Account: <span className="text-slate-200">{m.clientCompany}</span> · Attendees:{' '}
                    {m.attendees.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={m.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
