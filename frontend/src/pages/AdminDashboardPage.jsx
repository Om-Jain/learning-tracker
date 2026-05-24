import { useEffect, useState, useMemo } from 'react';
import { Users, BookOpen, CheckCircle2, Clock, Percent, FileText, Award, Calendar, ChevronRight, Activity, Sparkles } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import api from '../services/api';

const COLORS = ['#a855f7', '#06b6d4', '#d946ef', '#3b82f6'];

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    usersCount: 0,
    totalTopics: 0,
    completedTopics: 0,
    pendingTopics: 0,
    completionRate: 0,
    notesCount: 0,
    reports: [],
    assignments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [
        { data: usersData }, 
        { data: progressData },
        { data: assignData }
      ] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/progress'),
        api.get('/admin/assignments')
      ]);

      const reports = progressData.reports || [];
      const users = (usersData.users || []).filter(u => u.role === 'user');
      const assignments = assignData.assignments || [];

      // Calculate stats
      const totalUsers = users.length;
      const notesCreated = progressData.notesCount || 0;

      // Unique topics
      const uniqueTopics = new Set(assignments.map(a => `${a.category}-${a.topic}`));
      const totalTopicsCount = uniqueTopics.size;

      // Completed / Pending counts
      let totalCompleted = 0;
      let totalPending = 0;

      reports.forEach(r => {
        totalCompleted += Number(r.completedTopics || 0);
        totalPending += Number(r.pendingTopics || 0);
      });

      const totalItems = totalCompleted + totalPending;
      const rate = totalItems ? Math.round((totalCompleted / totalItems) * 100) : 0;

      setData({
        usersCount: totalUsers,
        totalTopics: totalTopicsCount,
        completedTopics: totalCompleted,
        pendingTopics: totalPending,
        completionRate: rate,
        notesCount: notesCreated,
        reports,
        assignments
      });
      setLoading(false);
    }

    loadData().catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Format data for Recharts
  const userProgressData = useMemo(() => {
    return data.reports.map(r => ({
      name: r.username,
      completed: r.completedTopics || 0,
      progress: r.completionPercentage || 0
    }));
  }, [data.reports]);

  const donutData = useMemo(() => {
    return [
      { name: 'Completed Subtopics', value: data.completedTopics },
      { name: 'Pending Subtopics', value: data.pendingTopics }
    ];
  }, [data.completedTopics, data.pendingTopics]);

  // Flattened reports rows for the table
  const tableRows = useMemo(() => {
    return data.reports.flatMap(report => 
      (report.topics || []).map(topic => ({
        id: `${report.userId}-${topic.topic}`,
        userId: report.userId,
        username: report.username,
        category: topic.category,
        topic: topic.topic,
        total: topic.total,
        completed: topic.completed,
        pending: topic.pending,
        completionPercentage: topic.completionPercentage,
        subtopics: topic.subtopics || [],
        notes: topic.notes || '',
        pendingSubtopics: topic.pendingSubtopics || []
      }))
    );
  }, [data.reports]);

  // Quick activity items
  const recentActivities = [
    { text: 'AWS EC2 Notes synced in notes.xlsx', time: '10m ago', user: 'om' },
    { text: 'Azure assignment added for user: om', time: '1h ago', user: 'admin' },
    { text: 'Progress audit report generated', time: '3h ago', user: 'admin' },
    { text: 'User profile om logged in', time: '5h ago', user: 'om' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Operations Control"
        title="Admin Command Console"
        actions={
          <span className="flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3.5 py-1 text-xs font-bold text-neon-purple">
            <Sparkles size={12} className="animate-pulse" /> Sysops Online
          </span>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 rounded-3xl bg-slate-900/60" />
          ))}
        </div>
      ) : (
        /* Analytics Cards Grid */
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard accent="border-neon-purple/20 bg-neon-purple/10 text-neon-purple" icon={Users} label="Total Users" trend="+0%" value={data.usersCount} />
          <StatCard accent="border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan" icon={BookOpen} label="Total Topics" trend="+2" value={data.totalTopics} />
          <StatCard accent="border-emerald-500/20 bg-emerald-500/10 text-emerald-400" icon={CheckCircle2} label="Completed" trend="+4%" value={data.completedTopics} />
          <StatCard accent="border-amber-500/20 bg-amber-500/10 text-amber-400" icon={Clock} label="Pending Items" trend="-3%" value={data.pendingTopics} />
          <StatCard accent="border-neon-blue/20 bg-neon-blue/10 text-neon-blue" icon={Percent} label="Completion" trend="+8%" value={`${data.completionRate}%`} />
          <StatCard accent="border-neon-pink/20 bg-neon-pink/10 text-neon-pink" icon={FileText} label="Notes Created" trend="+5" value={data.notesCount} />
        </div>
      )}

      {/* Analytics Charts & Widgets Row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Progress charts */}
        <div className="space-y-6">
          {/* User Progress overview area chart */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl space-y-4">
            <h3 className="m-0 text-base font-extrabold text-white flex items-center gap-2">
              <Activity size={18} className="text-neon-purple" /> Learner Performance Grid
            </h3>
            <div className="h-72 w-full">
              {userProgressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#090d16', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="progress" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" name="Roadmap Completion %" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">No student metrics available.</div>
              )}
            </div>
          </section>

          {/* User activity progress bar chart */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl space-y-4">
            <h3 className="m-0 text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-neon-cyan" /> Subtopics Done count
            </h3>
            <div className="h-64 w-full">
              {userProgressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#090d16', borderColor: '#334155', borderRadius: '12px' }}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="completed" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Completed subtopics" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">No student metrics available.</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          {/* Donut Ratio Chart */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl flex flex-col items-center text-center space-y-4">
            <h3 className="m-0 text-base font-extrabold text-white flex items-center gap-2 w-full text-left">
              <Percent size={18} className="text-neon-pink" /> Completion Ratio
            </h3>
            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-white">{data.completionRate}%</span>
                <p className="m-0 text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">Overall rate</p>
              </div>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-neon-purple" /> Done: {data.completedTopics}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-neon-cyan" /> Pending: {data.pendingTopics}
              </span>
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl space-y-4">
            <h3 className="m-0 text-base font-extrabold text-white flex items-center gap-2">
              <Activity size={18} className="text-neon-cyan" /> Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((act, index) => (
                <div key={index} className="flex gap-3 rounded-2xl bg-slate-950/30 border border-slate-900/60 p-3 text-xs leading-normal">
                  <div className="h-2 w-2 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-slate-200 font-semibold">{act.text}</p>
                    <p className="m-0 text-[10px] text-slate-500 mt-0.5">By {act.user} &bull; {act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Deadlines Widget */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl space-y-4">
            <h3 className="m-0 text-base font-extrabold text-white flex items-center gap-2">
              <Calendar size={18} className="text-neon-pink" /> Roadmap Milestones
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-950/45 border border-slate-900 rounded-2xl text-xs">
                <div className="min-w-0">
                  <p className="m-0 font-bold text-slate-250">AWS Cloud Practitioner</p>
                  <p className="m-0 text-[10px] text-slate-500">om: EC2 & S3 completion</p>
                </div>
                <span className="shrink-0 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-2 py-0.5 text-[9px] font-bold text-neon-cyan">
                  Urgent
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/45 border border-slate-900 rounded-2xl text-xs">
                <div className="min-w-0">
                  <p className="m-0 font-bold text-slate-250">Terraform Fundamentals</p>
                  <p className="m-0 text-[10px] text-slate-500">All users: Config files check</p>
                </div>
                <span className="shrink-0 rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                  Step 2
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Reports Table Section */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl space-y-6">
        <div>
          <h3 className="m-0 text-base font-extrabold text-white">Learner Operations Ledger</h3>
          <p className="m-0 text-xs text-slate-400 mt-1">
            Active syllabus progress matrix synced with Excel spreadsheet logs.
          </p>
        </div>

        {tableRows.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-900 bg-slate-950/40">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-slate-900 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Topic</th>
                  <th className="px-5 py-4">Subtopics</th>
                  <th className="px-5 py-4 text-center">Done</th>
                  <th className="px-5 py-4 text-center">Pending</th>
                  <th className="px-5 py-4">Progress</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {tableRows.map((row) => {
                  const hasNotes = row.notes && row.notes.trim().length > 0;
                  
                  return (
                    <tr key={row.id} className="transition duration-150 hover:bg-slate-900/35">
                      <td className="px-5 py-4 font-bold text-white">{row.username}</td>
                      <td className="px-5 py-4">{row.category}</td>
                      <td className="px-5 py-4 font-bold">{row.topic}</td>
                      <td className="px-5 py-4 font-semibold text-slate-400 line-clamp-1 max-w-[200px]" title={row.subtopics.join(', ')}>
                        {row.subtopics.join(', ')}
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-emerald-400">{row.completed}</td>
                      <td className="px-5 py-4 text-center font-bold text-amber-400">{row.pending}</td>
                      <td className="px-5 py-4 max-w-[120px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[10px] min-w-8">{row.completionPercentage}%</span>
                          <div className="w-16">
                            <ProgressBar value={row.completionPercentage} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge tone={row.pending > 0 ? 'warning' : 'success'}>
                          {row.pending > 0 ? 'Pending' : 'Completed'}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Link
                          to={`/admin/notes?userId=${row.userId}&topic=${encodeURIComponent(row.topic)}&subtopic=${encodeURIComponent(row.subtopics[0] || '')}`}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-[10px] font-bold tracking-tight transition ${
                            hasNotes 
                              ? 'border-neon-purple/30 bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20' 
                              : 'border-slate-800 bg-slate-950 text-slate-500 hover:text-slate-350 hover:border-slate-700'
                          }`}
                        >
                          <FileText size={12} />
                          <span>{hasNotes ? 'View Notes' : 'Empty'}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-8 text-center text-slate-500">
            Create user topic assignments to view the progress catalog matrix.
          </div>
        )}
      </section>
    </div>
  );
}
