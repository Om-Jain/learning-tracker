import { useState } from 'react';
import { Shield, User, Bell, Palette, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    theme: 'dark-neon',
    autoSaveInterval: '10'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('Settings updated successfully (Simulated)');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Configuration"
        title="Settings & Workspace Preferences"
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Settings Navigation Tabs */}
        <aside className="glass-panel rounded-3xl p-3 flex flex-col gap-1.5 h-fit">
          <button className="flex items-center gap-3 w-full rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-3 py-3 text-sm font-bold text-white shadow-lg">
            <User size={18} /> Profile Details
          </button>
          <button className="flex items-center gap-3 w-full rounded-2xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all">
            <Palette size={18} /> Design & Appearance
          </button>
          <button className="flex items-center gap-3 w-full rounded-2xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all">
            <Shield size={18} /> Security Credentials
          </button>
          <button className="flex items-center gap-3 w-full rounded-2xl px-3 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all">
            <Bell size={18} /> Alerts & Notifications
          </button>
        </aside>

        {/* Settings Content Area */}
        <div className="space-y-6">
          {successMsg && (
            <motion.div 
              className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle size={18} />
              {successMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 space-y-6">
            <h3 className="m-0 text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <User size={20} className="text-neon-purple" /> User Account Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-2xl glass-input px-4 py-3 text-sm"
                  disabled
                />
                <p className="m-0 text-xs text-slate-500">Contact admin to modify username.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Workspace Role</label>
                <input
                  type="text"
                  value={user?.role?.toUpperCase()}
                  className="w-full rounded-2xl glass-input px-4 py-3 text-sm bg-slate-950/40 text-slate-500 cursor-not-allowed uppercase border-dashed"
                  disabled
                />
              </div>
            </div>

            <h3 className="m-0 text-xl font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pt-3 pb-3">
              <Palette size={20} className="text-neon-cyan" /> Interface Configuration
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Design Theme</label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full rounded-2xl glass-input px-4 py-3 text-sm"
                >
                  <option value="dark-neon">Premium Dark Neon (Activated)</option>
                  <option value="dark-slate">Dark Slate Carbon</option>
                  <option value="classic">Standard Navy Blue</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400">Notes Auto-Save Delay</label>
                <select
                  name="autoSaveInterval"
                  value={formData.autoSaveInterval}
                  onChange={handleChange}
                  className="w-full rounded-2xl glass-input px-4 py-3 text-sm"
                >
                  <option value="5">Every 5 Seconds</option>
                  <option value="10">Every 10 Seconds</option>
                  <option value="30">Every 30 Seconds</option>
                  <option value="manual">Manual Save Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-950/40 p-4 border border-slate-800">
              <input
                type="checkbox"
                name="notifications"
                id="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-neon-purple focus:ring-neon-purple/50"
              />
              <label htmlFor="notifications" className="text-sm font-semibold text-slate-300 select-none cursor-pointer">
                Enable real-time notification toasts for saved notes and roadmap assignment changes
              </label>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-neon-purple hover:-translate-y-0.5"
              >
                <Save size={16} /> Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
