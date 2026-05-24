import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, LogOut, Search, Settings, Shield, User, ChevronDown, Award, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Welcome to your learning dashboard!', time: '1h ago', unread: true },
    { id: 2, text: 'Admin assigned AWS -> S3 topic.', time: '1d ago', unread: false },
    { id: 3, text: 'Your Terraform score was updated.', time: '2d ago', unread: false }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="mb-6 rounded-3xl border border-slate-800 bg-slate-950/60 px-5 py-3.5 shadow-panel backdrop-blur-xl relative z-40">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-neon-purple flex items-center gap-1.5">
            <Sparkles size={11} className="animate-spin" />
            Active Workspace
          </p>
          <h1 className="m-0 text-lg font-extrabold text-slate-100 tracking-tight">
            {user?.role === 'admin' ? 'Enterprise Operations Console' : 'Learner Dashboard'}
          </h1>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center md:justify-end md:max-w-3xl">
          {/* Search bar */}
          <label className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              className="w-full rounded-2xl glass-input py-2.5 pl-10 pr-4 text-xs placeholder:text-slate-500"
              placeholder="Search users, assignments, credentials..."
            />
          </label>

          {/* Quick Action Button for Admin/User */}
          <div className="flex items-center gap-3">
            {user?.role === 'admin' ? (
              <Link
                to="/admin/assignments"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-neon-purple/15 hover:shadow-neon-purple/25 transition-all hover:-translate-y-0.5"
              >
                <PlusCircle size={14} />
                <span>Assign Topic</span>
              </Link>
            ) : (
              <Link
                to="/certificates"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-blue px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-neon-cyan/15 hover:shadow-neon-cyan/25 transition-all hover:-translate-y-0.5"
              >
                <Award size={14} />
                <span>Certificates</span>
              </Link>
            )}

            {/* Notification Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className={`grid h-10 w-10 place-items-center rounded-2xl border transition-all ${
                  showNotifications 
                    ? 'border-neon-purple bg-slate-900 text-neon-purple shadow-neon-purple/20' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-100'
                }`}
                type="button"
              >
                <span className="relative">
                  <Bell size={17} />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-neon-pink shadow-neon-pink" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-panel z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</span>
                      <span className="text-[10px] text-neon-purple font-semibold cursor-pointer">Mark all read</span>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-900/60 text-xs">
                          <p className={`m-0 leading-normal ${n.unread ? 'text-slate-100 font-semibold' : 'text-slate-400'}`}>
                            {n.text}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className={`flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 text-left transition-all ${
                  showProfileMenu 
                    ? 'border-neon-purple bg-slate-900 shadow-neon-purple/20' 
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
                type="button"
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue text-xs font-black text-white">
                  {user?.username?.slice(0, 2).toUpperCase()}
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-panel z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-900">
                      <p className="m-0 text-xs font-bold text-slate-200">{user?.username}</p>
                      <p className="m-0 text-[10px] uppercase font-semibold text-slate-500 tracking-wider mt-0.5">{user?.role}</p>
                    </div>

                    <Link
                      to={user?.role === 'admin' ? '/admin/settings' : '/settings'}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all"
                    >
                      <Settings size={14} /> Profile Settings
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/users"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-all"
                      >
                        <User size={14} /> User Manager
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
