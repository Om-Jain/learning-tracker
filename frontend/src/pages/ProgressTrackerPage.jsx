import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import MiniBarChart from '../components/MiniBarChart';
import PageHeader from '../components/PageHeader';
import ProgressRing from '../components/ProgressRing';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProgressTrackerPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    api.get('/user/progress', { params: { userId: user.id } })
      .then(({ data }) => setProgress(data.progress))
      .catch(() => setProgress(null));
  }, [user.id]);

  const categories = progress?.categories || [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Progress" title="Category-wise completion" />
      {categories.length ? (
      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <div className="grid place-items-center rounded-3xl border border-white/70 bg-white/75 p-5 shadow-panel backdrop-blur-xl">
          <ProgressRing label="Overall" value={progress?.completionPercentage || 0} />
        </div>
        <section className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-panel backdrop-blur-xl">
          <h3 className="m-0 mb-5 text-xl font-bold text-slate-950">Category analytics</h3>
          <MiniBarChart items={categories.map((category) => ({ label: category.category, value: category.completionPercentage }))} />
        </section>
      </div>
      ) : (
        <EmptyState title="No progress yet" message="Complete assigned subtopics to build your progress history." />
      )}
    </div>
  );
}
