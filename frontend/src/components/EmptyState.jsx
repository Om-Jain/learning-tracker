export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center shadow-panel backdrop-blur-xl">
      <h3 className="m-0 text-base font-semibold text-slate-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{message}</p>
    </div>
  );
}
