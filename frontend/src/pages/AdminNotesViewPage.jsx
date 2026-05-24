import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock3, Paperclip } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ResourceCard from '../components/ResourceCard';
import api from '../services/api';

export default function AdminNotesViewPage() {
  const [params] = useSearchParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    api.get('/admin/notes', {
      params: {
        userId: params.get('userId'),
        topic: params.get('topic'),
        subtopic: params.get('subtopic')
      }
    }).then(({ data }) => setDetails(data.details));
  }, [params]);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Link className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:border-teal-400 hover:text-teal-300" to="/admin/reports"><ArrowLeft size={16} />Back to reports</Link>}
        eyebrow="Notes"
        title="Notes review"
      />
      <section className="rounded-3xl border border-slate-700/70 bg-slate-900/75 p-6 shadow-panel backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-4">
          <Info label="User" value={details?.username || '-'} />
          <Info label="Topic" value={details?.topic || '-'} />
          <Info label="Subtopic" value={details?.subtopic || '-'} />
          <Info label="Last updated" value={details?.lastUpdated ? new Date(details.lastUpdated).toLocaleString() : '-'} />
        </div>
      </section>
      <section className="rounded-3xl border border-slate-700/70 bg-slate-950 p-6 shadow-panel">
        <h3 className="m-0 text-lg font-bold text-slate-100">Markdown notes</h3>
        <pre className="mt-4 min-h-64 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm leading-6 text-slate-200">
          {details?.notes || 'No notes saved yet.'}
        </pre>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-panel">
          <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-slate-100"><Paperclip size={18} />Attached resources</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(details?.resources || []).map((resource, index) => <ResourceCard key={`${resource.title}-${index}`} resource={resource} />)}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-panel">
          <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-slate-100"><Clock3 size={18} />Edit history</h3>
          <div className="mt-4 space-y-3">
            {(details?.history || []).map((item) => (
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3" key={item.label}>
                <p className="m-0 text-sm font-semibold text-slate-200">{item.label}</p>
                <p className="m-0 text-xs text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="m-0 mt-1 text-sm font-bold text-slate-100">{value}</p>
    </div>
  );
}
