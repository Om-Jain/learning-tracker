import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpenCheck,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Library,
  LayoutDashboard,
  Map,
  Users,
  Award,
  Settings,
  LogOut,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const linksByRole = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/admin/topics', label: 'Topics', icon: Layers },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/certificates', label: 'Certificates', icon: Award },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ],
  user: [
    { to: '/dashboard', label: 'Roadmap', icon: Map },
    { to: '/resources', label: 'Resources', icon: Library },
    { to: '/progress', label: 'Reports', icon: BookOpenCheck },
    { to: '/certificates', label: 'Certificates', icon: Award },
    { to: '/settings', label: 'Settings', icon: Settings }
  ]
};

export default function Sidebar({ isCollapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = linksByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 88 : 280 }}
      className="shrink-0 rounded-3xl border border-slate-800 bg-slate-950/70 p-4 shadow-panel backdrop-blur-xl flex flex-col justify-between"
      style={{ minHeight: 'calc(100vh - 32px)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan text-sm font-black text-white shadow-lg shadow-neon-purple/20">
              LT
            </div>
            {!isCollapsed ? (
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-bold tracking-tight text-slate-100">Learning Tracker</p>
                <p className="m-0 truncate text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  {user?.role} Portal
                </p>
              </div>
            ) : null}
          </div>
          <button
            className="hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 transition hover:border-neon-purple hover:text-slate-100 lg:inline-flex"
            onClick={onToggle}
            type="button"
          >
            {isCollapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 whitespace-nowrap rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 text-white border border-neon-purple/30 shadow-neon-purple/5'
                      : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-100 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-neon-purple shadow-neon-purple" />
                    ) : null}
                    <Icon size={18} className={isActive ? 'text-neon-purple' : ''} />
                    {!isCollapsed ? <span>{link.label}</span> : null}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action at Bottom */}
      <div className="pt-4 border-t border-slate-900">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent transition-all duration-200"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
