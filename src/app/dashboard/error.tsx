'use client';

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section
      role="alert"
      className="mx-auto max-w-xl rounded-xl border border-rose-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-lg font-semibold text-slate-900">This CRM section could not load</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your workspace data has not been changed. Try loading the section again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </section>
  );
}
