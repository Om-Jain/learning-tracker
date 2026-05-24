import { ExternalLink, FileText, Link as LinkIcon, PlayCircle, ScrollText } from 'lucide-react';

const iconMap = {
  documentation: FileText,
  youtube: PlayCircle,
  pdf: ScrollText,
  notes: ScrollText,
  link: LinkIcon
};

export default function ResourceCard({ resource }) {
  const Icon = iconMap[resource.type] || LinkIcon;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/35 p-4 shadow-panel backdrop-blur-xl transition hover:-translate-y-1 hover:border-neon-purple/45 hover:bg-slate-900/50 duration-300">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 text-neon-purple">
          <Icon size={18} />
        </div>
        <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {resource.type || 'link'}
        </span>
      </div>
      <h3 className="m-0 text-sm font-bold text-slate-100">{resource.title || 'Untitled resource'}</h3>
      <p className="mt-2 text-xs leading-relaxed text-slate-400 min-h-8">{resource.description || 'No description added.'}</p>
      {resource.url ? (
        <a
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:shadow-neon-purple/20 hover:-translate-y-0.5"
          href={resource.url}
          rel="noreferrer"
          target="_blank"
        >
          Open resource
          <ExternalLink size={13} />
        </a>
      ) : null}
    </article>
  );
}
