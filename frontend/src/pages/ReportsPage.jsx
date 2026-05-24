import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, Search } from 'lucide-react';
import DashboardTable from '../components/DashboardTable';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/admin/progress')
      .then(({ data }) => setReports(data.reports || []))
      .catch(() => setReports([]));
  }, []);

  const topicRows = useMemo(() => reports.flatMap((report) => (
    (report.topics || []).map((topic) => ({
      ...topic,
      userId: report.userId,
      username: report.username,
      userCompletion: report.completionPercentage
    }))
  )), [reports]);

  const visibleReports = useMemo(() => {
    if (filter === 'completed') {
      return topicRows.filter((report) => Number(report.pending) === 0 && Number(report.total) > 0);
    }

    if (filter === 'pending') {
      return topicRows.filter((report) => Number(report.pending) > 0);
    }

    return topicRows;
  }, [filter, topicRows]).filter((report) => (
    `${report.username} ${report.category} ${report.topic}`.toLowerCase().includes(query.toLowerCase())
  ));

  const columns = [
    { key: 'username', label: 'User', render: (row) => <span className="font-semibold text-slate-950">{row.username}</span> },
    { key: 'category', label: 'Category' },
    { key: 'topic', label: 'Topic', render: (row) => <span className="font-semibold text-slate-950">{row.topic}</span> },
    { key: 'total', label: 'Subtopics' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending', render: (row) => <StatusBadge tone={row.pending > 0 ? 'warning' : 'success'}>{row.pending}</StatusBadge> },
    { key: 'completionPercentage', label: 'Progress', render: (row) => `${row.completionPercentage}%` },
    { key: 'pendingSubtopics', label: 'Pending names', render: (row) => row.pendingSubtopics?.length ? row.pendingSubtopics.join(', ') : 'None' },
    {
      key: 'notes',
      label: 'Notes',
      render: (row) => (
        <Link
          className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-teal-300 hover:border-teal-400 hover:bg-teal-500/10"
          to={`/admin/notes?userId=${row.userId}&topic=${encodeURIComponent(row.topic)}&subtopic=${encodeURIComponent(row.subtopics?.[0] || row.pendingSubtopics?.[0] || '')}`}
        >
          View Notes
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
          <select
            className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            onChange={(event) => setFilter(event.target.value)}
            value={filter}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-3 py-2 text-sm font-black text-slate-950" type="button">
            <Download size={16} />
            Export
          </button>
          </>
        }
        eyebrow="Reports"
        title="Progress and pending work"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Filter} label="Learners" value={reports.length} />
        <StatCard icon={Search} label="Tracked topics" trend="+6%" value={topicRows.length} />
        <StatCard icon={Filter} label="Pending subtopics" trend="-2%" value={topicRows.reduce((total, row) => total + Number(row.pending || 0), 0)} />
      </div>
      <div className="rounded-3xl border border-white/70 bg-white/65 p-4 shadow-panel backdrop-blur-xl">
        <label className="relative mb-4 block max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter reports..."
            value={query}
          />
        </label>
        <DashboardTable columns={columns} emptyMessage="Create assignments and learner progress to populate reports." rows={visibleReports} />
      </div>
    </div>
  );
}
