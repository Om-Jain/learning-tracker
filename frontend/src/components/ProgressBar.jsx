export default function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-900">
      <div
        className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan transition-all duration-300 shadow-neon-purple"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
