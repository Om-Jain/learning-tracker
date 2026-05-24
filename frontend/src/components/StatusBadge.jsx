export default function StatusBadge({ tone = 'neutral', children }) {
  const tones = {
    neutral: 'border-slate-600 bg-slate-800 text-slate-300',
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    danger: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    info: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
