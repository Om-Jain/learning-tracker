export default function MiniBarChart({ items, labelKey = 'label', valueKey = 'value' }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item[labelKey]} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{item[labelKey]}</span>
            <span className="text-slate-500">{item[valueKey]}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-500"
              style={{ width: `${item[valueKey]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
