export default function CategorySelector({ categories, value, customValue, onChange, onCustomChange }) {
  const isCustom = value === '__new__';

  return (
    <div className="space-y-3">
      <select
        className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-slate-100 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
        <option value="__new__">+ Create new category</option>
      </select>
      {isCustom ? (
        <input
          className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
          onChange={(event) => onCustomChange(event.target.value)}
          placeholder="New category name"
          value={customValue}
        />
      ) : null}
    </div>
  );
}
