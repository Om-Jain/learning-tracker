import { useEffect, useState } from 'react';
import { Trash2, UserPlus, Users } from 'lucide-react';
import DashboardTable from '../components/DashboardTable';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const loadUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data.users || []);
  };

  useEffect(() => {
    loadUsers().catch(() => setError('Unable to load users. Check that the backend is running.'));
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await api.post('/admin/create-user', form);
      setForm({ username: '', password: '', role: 'user' });
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create user.');
    }
  };

  const handleDelete = async (id) => {
    setError('');

    try {
      await api.delete(`/admin/user/${id}`);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete user.');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'User', render: (row) => <span className="font-semibold text-white">{row.username}</span> },
    { key: 'role', label: 'Role', render: (row) => <StatusBadge tone={row.role === 'admin' ? 'info' : 'neutral'}>{row.role}</StatusBadge> },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-450 hover:bg-rose-500/20 hover:text-white transition duration-200"
          onClick={() => handleDelete(row.id)}
          type="button"
        >
          <Trash2 size={13} />
          Delete
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader eyebrow="Admin Control" title="User Account Management" />
      
      <section className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <form className="grid gap-3 rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl md:grid-cols-[1fr_1fr_160px_auto] items-center" onSubmit={handleCreate}>
          <input
            className="rounded-2xl glass-input px-3.5 py-2.5 text-xs outline-none"
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="Username"
            value={form.username}
            required
          />
          <input
            className="rounded-2xl glass-input px-3.5 py-2.5 text-xs outline-none"
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            type="password"
            value={form.password}
            required
          />
          <select
            className="rounded-2xl glass-input px-3.5 py-2.5 text-xs outline-none"
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            value={form.role}
          >
            <option value="user">User Role</option>
            <option value="admin">Admin Role</option>
          </select>
          <button 
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:shadow-neon-purple/20 hover:-translate-y-0.5" 
            type="submit"
          >
            <UserPlus size={14} />
            Create Account
          </button>
        </form>
        
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="m-0 text-3xl font-black text-white">{users.length}</p>
            <p className="m-0 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total accounts</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple border border-neon-purple/25">
            <Users size={20} />
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-450">
          {error}
        </div>
      ) : null}

      {users.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-1 shadow-panel">
          <DashboardTable columns={columns} emptyMessage="No users found." rows={users} />
        </div>
      ) : (
        <EmptyState title="No users found" message="Create users from the form above." />
      )}
    </div>
  );
}
