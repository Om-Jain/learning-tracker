import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ClipboardList, Sparkles, Trash2 } from 'lucide-react';
import AssignmentEditor from '../components/AssignmentEditor';
import PageHeader from '../components/PageHeader';
import ResourceCard from '../components/ResourceCard';
import api from '../services/api';

const initialForm = {
  userId: '',
  category: '',
  newCategory: '',
  topic: '',
  subtopic: '',
  requirements: 'Complete notes and mark subtopic done',
  resources: []
};

export default function TopicAssignmentPage() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [expandedKey, setExpandedKey] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(null);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const [{ data: usersData }, { data: categoriesData }, { data: assignmentsData }] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/categories'),
      api.get('/admin/assignments')
    ]);

    setUsers((usersData.users || []).filter((user) => user.role === 'user'));
    setCategories(categoriesData.categories || []);
    setAssignments(assignmentsData.assignments || []);
  };

  useEffect(() => {
    loadData().catch(() => setMessage('Unable to load assignment data.'));
  }, []);

  const selectedAssignments = useMemo(() => (
    assignments.filter((assignment) => !selectedUserId || Number(assignment.userId) === Number(selectedUserId))
  ), [assignments, selectedUserId]);

  const groupedAssignments = useMemo(() => {
    const map = new Map();

    selectedAssignments.forEach((assignment) => {
      const key = `${assignment.userId}-${assignment.category}-${assignment.topic}`;
      const current = map.get(key) || {
        key,
        userId: assignment.userId,
        username: users.find((user) => Number(user.id) === Number(assignment.userId))?.username || `User ${assignment.userId}`,
        category: assignment.category,
        topic: assignment.topic,
        items: []
      };

      current.items.push(assignment);
      map.set(key, current);
    });

    return Array.from(map.values());
  }, [selectedAssignments, users]);

  const updateForm = (field, value, target = 'create') => {
    const setter = target === 'edit' ? setEditForm : setForm;
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const updateResource = (index, field, value, target = 'create') => {
    const setter = target === 'edit' ? setEditForm : setForm;
    setter((prev) => ({
      ...prev,
      resources: prev.resources.map((resource, resourceIndex) => (
        resourceIndex === index ? { ...resource, [field]: value } : resource
      ))
    }));
  };

  const addResource = (resource, target = 'create') => {
    const setter = target === 'edit' ? setEditForm : setForm;
    setter((prev) => ({ ...prev, resources: [...prev.resources, resource] }));
  };

  const removeResource = (index, target = 'create') => {
    const setter = target === 'edit' ? setEditForm : setForm;
    setter((prev) => ({ ...prev, resources: prev.resources.filter((_, resourceIndex) => resourceIndex !== index) }));
  };

  const payloadFromForm = (source) => ({
    ...source,
    category: source.category === '__new__' ? source.newCategory : source.category
  });

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage('');
    await api.post('/admin/assign-topic', payloadFromForm(form));
    setForm(initialForm);
    setMessage('Assignment saved with resources.');
    await loadData();
  };

  const openEdit = (assignment) => {
    setEditForm({
      ...assignment,
      originalTopic: assignment.topic,
      originalSubtopic: assignment.subtopic,
      newCategory: ''
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    await api.put('/admin/assignment', payloadFromForm(editForm));
    setEditForm(null);
    setMessage('Assignment updated.');
    await loadData();
  };

  const handleDelete = async (assignment) => {
    await api.delete('/admin/assignment', { data: assignment });
    setMessage('Assignment removed.');
    await loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Assignments" title="Assignment management" />
      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <AssignmentEditor
          categories={categories}
          form={form}
          onAddResource={(resource) => addResource(resource)}
          onChange={(field, value) => updateForm(field, value)}
          onRemoveResource={(index) => removeResource(index)}
          onResourceChange={(index, field, value) => updateResource(index, field, value)}
          onSubmit={handleCreate}
          users={users}
        />
        <aside className="rounded-3xl border border-slate-700/70 bg-gradient-to-br from-slate-950 to-indigo-950 p-5 text-white shadow-panel">
          <ClipboardList className="mb-5 text-teal-300" />
          <h3 className="m-0 text-xl font-bold">Assignment overview</h3>
          <p className="mt-2 text-sm text-slate-300">Create one row per subtopic. Matching topic names automatically group under the same roadmap card.</p>
          <div className="mt-5 rounded-2xl bg-white/10 p-3 text-sm text-slate-200">
            <Sparkles className="mb-2 text-amber-300" size={18} />
            Resources added here appear in the user topic and subtopic pages.
          </div>
        </aside>
      </section>
      {message ? <p className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 shadow-panel">{message}</p> : null}

      <section className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-5 shadow-panel backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="m-0 text-xl font-bold text-slate-100">Manage existing assignments</h3>
            <p className="m-0 text-sm text-slate-400">Expand a topic to edit subtopics, resources, requirements, and reassignment details.</p>
          </div>
          <select
            className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-slate-100"
            onChange={(event) => setSelectedUserId(event.target.value)}
            value={selectedUserId}
          >
            <option value="">All learners</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.username}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          {groupedAssignments.map((group) => (
            <article className="rounded-2xl border border-slate-700 bg-slate-950/70" key={group.key}>
              <button
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                onClick={() => setExpandedKey((current) => current === group.key ? '' : group.key)}
                type="button"
              >
                <div>
                  <p className="m-0 text-sm text-teal-300">{group.username} / {group.category}</p>
                  <h4 className="m-0 text-lg font-bold text-slate-100">{group.topic}</h4>
                </div>
                <ChevronDown className={`text-slate-400 transition ${expandedKey === group.key ? 'rotate-180' : ''}`} />
              </button>
              {expandedKey === group.key ? (
                <div className="space-y-3 border-t border-slate-800 p-4">
                  {group.items.map((assignment) => (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4" key={`${assignment.topic}-${assignment.subtopic}`}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="m-0 text-base font-bold text-slate-100">{assignment.subtopic}</p>
                          <p className="m-0 text-sm text-slate-400">{assignment.requirements || 'No custom requirements'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-teal-400 hover:text-teal-300" onClick={() => openEdit(assignment)} type="button">Edit</button>
                          <button className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10" onClick={() => handleDelete(assignment)} type="button">
                            <Trash2 size={15} />
                            Remove
                          </button>
                        </div>
                      </div>
                      {assignment.resources?.length ? (
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {assignment.resources.map((resource, index) => <ResourceCard key={`${resource.title}-${index}`} resource={resource} />)}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {editForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto">
            <AssignmentEditor
              categories={categories}
              form={editForm}
              onAddResource={(resource) => addResource(resource, 'edit')}
              onChange={(field, value) => updateForm(field, value, 'edit')}
              onRemoveResource={(index) => removeResource(index, 'edit')}
              onResourceChange={(index, field, value) => updateResource(index, field, value, 'edit')}
              onSubmit={handleUpdate}
              submitLabel="Update assignment"
              users={users}
            />
            <button className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800" onClick={() => setEditForm(null)} type="button">
              Close editor
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
