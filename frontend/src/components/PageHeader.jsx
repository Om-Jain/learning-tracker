export default function PageHeader({ eyebrow, title, actions }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neon-purple text-neon-purple">{eyebrow}</p> : null}
        <h2 className="m-0 text-2xl font-extrabold tracking-tight text-white">{title}</h2>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
