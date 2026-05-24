export default function ProgressRing({ value = 0, size = 96, label = 'Complete' }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative inline-grid place-items-center" style={{ height: size, width: size }}>
      <svg height={size} width={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="url(#progress-ring-neon)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
        <defs>
          <linearGradient id="progress-ring-neon" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="m-0 text-lg font-black text-white">{value}%</p>
        <p className="m-0 text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
    </div>
  );
}
