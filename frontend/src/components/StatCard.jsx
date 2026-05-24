import { motion } from 'framer-motion';

export default function StatCard({ label, value, accent, icon: Icon, trend = '+8%' }) {
  return (
    <motion.div
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl"
      whileHover={{ y: -4 }}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-2xl border ${accent || 'border-neon-purple/20 bg-neon-purple/10 text-neon-purple'}`}>
          {Icon ? <Icon size={18} /> : null}
        </div>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">{trend}</span>
      </div>
      <p className="mb-1 text-xs font-semibold text-slate-400">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        <div className="h-6 w-16 rounded-full bg-gradient-to-r from-neon-purple/20 via-neon-blue/20 to-neon-cyan/20 blur-xs" />
      </div>
    </motion.div>
  );
}
