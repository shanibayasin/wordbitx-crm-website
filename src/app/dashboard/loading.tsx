export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6" aria-label="Loading CRM section">
      <div className="h-8 w-72 rounded bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-28 rounded-xl border border-slate-200 bg-white" />
        ))}
      </div>
      <div className="h-80 rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}
