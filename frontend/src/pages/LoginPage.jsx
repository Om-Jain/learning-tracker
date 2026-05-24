import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Compass, Sparkles, KeyRound, User } from 'lucide-react';
import api from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/login', credentials);
      const nextUser = { ...data.user, role: data.role };

      login(nextUser);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check backend server and credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-transparent">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 shadow-panel backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Left Side: Brand presentation */}
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 p-8 text-slate-100 sm:p-12 flex flex-col justify-between border-r border-slate-900/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.1),transparent_40%)] pointer-events-none" />
          
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan text-sm font-black text-white shadow-lg shadow-neon-purple/25">
                LT
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">Learning Tracker</span>
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neon-cyan flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" /> SaaS ROADMAP SYSTEM
            </p>
            <h1 className="mb-6 max-w-xl text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Manage roadmaps, progress, and notes from one workspace.
            </h1>
          </div>

          <div className="mt-8 space-y-4 relative z-10">
            <div className="flex gap-3.5 items-start rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-neon-purple/10 text-neon-purple">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 m-0">Admin Controller</h4>
                <p className="text-xs text-slate-400 m-0 mt-1">Assign topics, manage system users, and review learning reports.</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-neon-cyan/10 text-neon-cyan">
                <Compass size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 m-0">Structured Roadmaps</h4>
                <p className="text-xs text-slate-400 m-0 mt-1">Learners track subtopic milestones, resources, checklists, and notes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Sign In Form */}
        <section className="p-8 sm:p-12 flex flex-col justify-center bg-slate-950/20 relative">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.06),transparent_40%)] pointer-events-none" />

          <div className="max-w-sm w-full mx-auto space-y-6">
            <div>
              <h2 className="mb-1 text-2xl font-black text-white tracking-tight">Sign In</h2>
              <p className="text-xs text-slate-400 leading-normal">
                Credentials: <code className="text-neon-purple bg-slate-900 px-1 py-0.5 rounded font-mono font-bold">admin/admin123</code> or <code className="text-neon-cyan bg-slate-900 px-1 py-0.5 rounded font-mono font-bold">om/om123</code>
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    className="w-full rounded-2xl glass-input py-3 pl-11 pr-4 text-sm"
                    value={credentials.username}
                    onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="password"
                    className="w-full rounded-2xl glass-input py-3 pl-11 pr-4 text-sm"
                    value={credentials.password}
                    onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-400">
                  {error}
                </div>
              ) : null}

              <button
                className="w-full rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-neon-purple/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Signing in...' : 'Access Workspace'}
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}
