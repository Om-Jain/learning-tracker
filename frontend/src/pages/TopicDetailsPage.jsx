import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, BookOpen, CheckCircle2, Clock3 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import ProgressRing from '../components/ProgressRing';
import SubtopicCard from '../components/SubtopicCard';

export default function TopicDetailsPage() {
  const { topicName } = useParams();
  const { user } = useAuth();
  const decodedTopic = decodeURIComponent(topicName);
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');

  const topicItems = useMemo(
    () => assignments.filter((item) => item.topic === decodedTopic),
    [assignments, decodedTopic]
  );
  const completedCount = topicItems.filter((item) => item.completed).length;
  const completionPercentage = topicItems.length ? Math.round((completedCount / topicItems.length) * 100) : 0;

  useEffect(() => {
    api.get('/user/topics', { params: { userId: user.id } })
      .then(({ data }) => {
        const rows = data.topics || [];
        setAssignments(rows);
      })
      .catch(() => setAssignments([]));
  }, [decodedTopic, user.id]);

  const refreshTopic = async () => {
    const { data } = await api.get('/user/topics', { params: { userId: user.id } });
    setAssignments(data.topics || []);
  };

  const handleComplete = async (item, completed) => {
    setMessage('');
    await api.post('/user/complete-topic', {
      userId: user.id,
      topic: item.topic,
      subtopic: item.subtopic,
      completed
    });
    await refreshTopic();
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        actions={message ? <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">{message}</span> : null}
        eyebrow="Topic Roadmap"
        title={decodedTopic}
      />
      {topicItems.length ? (
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 shadow-panel backdrop-blur-xl">
          <div className="grid gap-6 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.18),transparent_35%)] p-6 lg:grid-cols-[1fr_220px]">
            <div>
              <p className="m-0 text-[10px] font-bold uppercase tracking-wider text-neon-cyan">{topicItems[0].category}</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">{decodedTopic}</h2>
              <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-400">
                Work through the subtopics below. Open a subtopic to maintain focused notes, resources, and progress history.
              </p>
              <div className="mt-6 max-w-xl">
                <ProgressBar value={completionPercentage} />
              </div>
            </div>
            <div className="rounded-3xl bg-slate-950/45 p-4 border border-slate-900 flex justify-center items-center backdrop-blur">
              <ProgressRing value={completionPercentage} label="Topic" />
            </div>
          </div>
        </section>
      ) : null}
      {topicItems.length ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <section className="grid gap-4 md:grid-cols-2">
            {topicItems.map((item, index) => (
              <SubtopicCard
                index={index}
                item={item}
                key={`${item.topic}-${item.subtopic}`}
                onToggle={handleComplete}
              />
            ))}
          </section>
          <aside className="space-y-4">
            <motion.div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl" whileHover={{ y: -3 }}>
              <h3 className="m-0 flex items-center gap-2 text-sm font-extrabold text-white"><Activity size={16} className="text-neon-purple" /> Progress Snapshot</h3>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Metric icon={BookOpen} label="Subtopics" value={topicItems.length} />
                <Metric icon={CheckCircle2} label="Done" value={completedCount} />
                <Metric icon={Clock3} label="Pending" value={topicItems.length - completedCount} />
              </div>
            </motion.div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl">
              <h3 className="m-0 text-sm font-extrabold text-white">Timeline</h3>
              <div className="mt-4 space-y-2">
                {topicItems.map((item) => (
                  <div key={item.subtopic} className="flex items-center gap-3 rounded-2xl bg-slate-950/35 border border-slate-900/60 p-3 text-xs">
                    <span className={`h-2.5 w-2.5 rounded-full shadow-lg ${item.completed ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-amber-500 shadow-amber-500/30'}`} />
                    <span className="font-semibold text-slate-300">{item.subtopic}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <EmptyState title="Topic not found" message="This topic is not assigned to your account." />
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-950/45 p-3">
      <Icon className="mx-auto mb-1.5 text-neon-cyan" size={16} />
      <p className="m-0 text-lg font-black text-white">{value}</p>
      <p className="m-0 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}
