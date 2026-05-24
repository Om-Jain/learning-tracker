import { useEffect, useMemo, useState } from 'react';
import { Library, Search } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import ResourceCard from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LearningResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    api.get('/user/resources', { params: { userId: user.id } })
      .then(({ data }) => setResources(data.resources || []))
      .catch(() => setResources([]));
  }, [user.id]);

  const types = useMemo(() => Array.from(new Set(resources.map((resource) => resource.type || 'link'))), [resources]);
  const visibleResources = resources.filter((resource) => {
    const matchesType = type === 'all' || resource.type === type;
    const haystack = `${resource.title} ${resource.description} ${resource.topic} ${resource.subtopic}`.toLowerCase();
    return matchesType && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Resources" title="Learning resources" />
      <section className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-panel backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources..."
              value={query}
            />
          </label>
          <select className="rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-sm text-slate-100" onChange={(event) => setType(event.target.value)} value={type}>
            <option value="all">All types</option>
            {types.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>
      {visibleResources.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleResources.map((resource, index) => (
            <ResourceCard key={`${resource.title}-${index}`} resource={resource} />
          ))}
        </section>
      ) : (
        <EmptyState title="No resources found" message="Assigned resources will appear here grouped by topic and subtopic." />
      )}
      <section className="rounded-3xl border border-slate-700/70 bg-slate-950 p-5 shadow-panel">
        <Library className="mb-3 text-teal-300" />
        <h3 className="m-0 text-xl font-bold text-slate-100">Recently added</h3>
        <p className="m-0 mt-2 text-sm text-slate-400">Resources are pulled from admin assignments and remain available inside subtopic pages.</p>
      </section>
    </div>
  );
}
