import ProgressBar from './ProgressBar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Layers } from 'lucide-react';

export default function TopicCard({ category, topic, progress, pending, total, completed }) {
  return (
    <motion.article
      className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 shadow-panel backdrop-blur-xl hover:border-neon-purple/45 transition-all duration-300"
      whileHover={{ scale: 1.015, y: -4 }}
    >
      <div className="border-b border-slate-900 bg-gradient-to-br from-slate-950 to-indigo-950/35 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-neon-cyan">{category}</p>
            <h3 className="m-0 text-xl font-extrabold tracking-tight text-white group-hover:text-neon-purple transition-all duration-300">{topic}</h3>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-neon-purple group-hover:border-neon-purple/30 transition-all duration-300">
            <Layers size={18} />
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-slate-950/50 border border-slate-900/60 p-3">
            <p className="m-0 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Subtopics</p>
            <p className="m-0 text-lg font-bold text-slate-300 mt-0.5">{total}</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-3">
            <p className="m-0 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Done</p>
            <p className="m-0 text-lg font-bold text-emerald-300 mt-0.5">{completed}</p>
          </div>
          <div className="rounded-2xl bg-amber-500/5 border border-amber-500/10 p-3">
            <p className="m-0 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Pending</p>
            <p className="m-0 text-lg font-bold text-amber-300 mt-0.5">{pending}</p>
          </div>
        </div>
        <ProgressBar value={progress} />
        <Link
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-3 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-neon-purple/20 hover:-translate-y-0.5"
          to={`/topics/${encodeURIComponent(topic)}`}
        >
          Open subtopics
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
}
