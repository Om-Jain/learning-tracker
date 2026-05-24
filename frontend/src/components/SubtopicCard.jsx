import { motion } from 'framer-motion';
import { CheckCircle2, Circle, NotebookPen } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function SubtopicCard({ item, index, onToggle }) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-panel backdrop-blur-xl transition hover:-translate-y-1 hover:border-neon-purple/45 duration-300"
      initial={{ opacity: 0, y: 12 }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          className="group min-w-0"
          to={`/topics/${encodeURIComponent(item.topic)}/${encodeURIComponent(item.subtopic)}`}
        >
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Subtopic</p>
          <h3 className="m-0 truncate text-base font-extrabold text-white group-hover:text-neon-purple transition-all duration-300">{item.subtopic}</h3>
        </Link>
        <StatusBadge tone={item.completed ? 'success' : 'warning'}>{item.completed ? 'Done' : 'Pending'}</StatusBadge>
      </div>
      
      <div className="mt-6 flex items-center justify-between gap-3">
        <Link
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2 text-xs font-bold text-slate-300 transition-all duration-300 hover:border-neon-purple hover:bg-neon-purple/10 hover:text-white"
          to={`/topics/${encodeURIComponent(item.topic)}/${encodeURIComponent(item.subtopic)}`}
        >
          <NotebookPen size={14} />
          Open notes
        </Link>
        
        <button
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 ${
            item.completed
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-gradient-to-r from-neon-purple to-neon-blue text-white hover:shadow-neon-purple/20'
          }`}
          onClick={() => onToggle(item, !item.completed)}
          type="button"
        >
          {item.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
          {item.completed ? 'Completed' : 'Complete'}
        </button>
      </div>
    </motion.article>
  );
}
