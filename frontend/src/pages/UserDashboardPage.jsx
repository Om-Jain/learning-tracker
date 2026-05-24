import { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, CheckCircle2, Clock3, Gauge } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import ProgressRing from '../components/ProgressRing';
import StatCard from '../components/StatCard';
import TopicCard from '../components/TopicCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      const [{ data: topicsData }, { data: progressData }] = await Promise.all([
        api.get('/user/topics', { params: { userId: user.id } }),
        api.get('/user/progress', { params: { userId: user.id } })
      ]);

      setAssignments(topicsData.topics || []);
      setProgress(progressData.progress);
    }

    loadDashboard().catch(() => {
      setAssignments([]);
      setProgress(null);
    });
  }, [user.id]);

  const groupedTopics = useMemo(() => {
    const map = new Map();

    assignments.forEach((item) => {
      const current = map.get(item.topic) || {
        category: item.category,
        topic: item.topic,
        total: 0,
        completed: 0,
        subtopics: []
      };

      current.total += 1;
      current.subtopics.push(item.subtopic);
      if (item.completed) {
        current.completed += 1;
      }
      map.set(item.topic, current);
    });

    return Array.from(map.values()).map((item) => ({
      ...item,
      progress: item.total ? Math.round((item.completed / item.total) * 100) : 0,
      pending: item.total - item.completed
    }));
  }, [assignments]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader eyebrow="User Dashboard" title="Assigned learning roadmap" />
      <section className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard accent="border-neon-purple/20 bg-neon-purple/10 text-neon-purple" icon={BookOpenCheck} label="Assigned subtopics" trend="+0%" value={progress?.totalTopics ?? 0} />
          <StatCard accent="border-emerald-500/20 bg-emerald-500/10 text-emerald-400" icon={CheckCircle2} label="Completed" trend="+10%" value={progress?.completedTopics ?? 0} />
          <StatCard accent="border-amber-500/20 bg-amber-500/10 text-amber-400" icon={Clock3} label="Pending" trend="-3%" value={progress?.pendingTopics ?? 0} />
        </div>
        <div className="grid place-items-center rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl">
          <ProgressRing label="Overall" value={progress?.completionPercentage ?? 0} />
        </div>
      </section>
      <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan text-white shadow-lg"><Gauge size={18} /></div>
          <div>
            <h3 className="m-0 text-lg font-extrabold text-white">Roadmap Topics</h3>
            <p className="m-0 text-xs text-slate-400">Each card groups matching subtopics under one topic.</p>
          </div>
        </div>
        {groupedTopics.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {groupedTopics.map((topic) => (
              <TopicCard key={topic.topic} {...topic} />
            ))}
          </div>
        ) : (
          <EmptyState title="No assigned topics" message="Ask an admin to assign a learning roadmap." />
        )}
      </section>
    </div>
  );
}
