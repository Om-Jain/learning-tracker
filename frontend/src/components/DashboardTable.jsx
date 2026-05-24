export default function DashboardTable({ columns, rows, emptyMessage }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="max-h-[560px] overflow-auto rounded-2xl border border-slate-700/70 bg-slate-900/75 shadow-panel backdrop-blur-xl">
      <table className="min-w-full text-left text-sm">
        <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs uppercase tracking-wide text-slate-400 backdrop-blur">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id || row.key || rowIndex} className="border-t border-slate-800 transition hover:bg-slate-800/70">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 align-top text-slate-300">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
