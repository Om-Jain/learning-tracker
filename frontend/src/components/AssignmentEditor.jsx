import { Plus, Save, Trash2 } from 'lucide-react';
import CategorySelector from './CategorySelector';

const emptyResource = { title: '', type: 'documentation', url: '', description: '' };

export default function AssignmentEditor({
  categories,
  form,
  users,
  onChange,
  onResourceChange,
  onAddResource,
  onRemoveResource,
  onSubmit,
  submitLabel = 'Save assignment'
}) {
  return (
    <form className="space-y-4 rounded-3xl border border-slate-700/70 bg-slate-900/75 p-5 shadow-panel backdrop-blur-xl" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <select
          className="rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-slate-100 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
          onChange={(event) => onChange('userId', event.target.value)}
          required
          value={form.userId}
        >
          <option value="">Select learner</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <CategorySelector
          categories={categories}
          customValue={form.newCategory}
          onChange={(value) => onChange('category', value)}
          onCustomChange={(value) => onChange('newCategory', value)}
          value={form.category}
        />
        <input
          className="rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
          onChange={(event) => onChange('topic', event.target.value)}
          placeholder="Topic"
          required
          value={form.topic}
        />
        <input
          className="rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
          onChange={(event) => onChange('subtopic', event.target.value)}
          placeholder="Subtopic"
          required
          value={form.subtopic}
        />
      </div>
      <textarea
        className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
        onChange={(event) => onChange('requirements', event.target.value)}
        placeholder="Completion requirements"
        value={form.requirements}
      />
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="m-0 text-sm font-bold uppercase tracking-wide text-slate-300">Learning resources</h3>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-teal-400 hover:text-teal-300"
            onClick={() => onAddResource(emptyResource)}
            type="button"
          >
            <Plus size={15} />
            Add resource
          </button>
        </div>
        <div className="space-y-3">
          {form.resources.map((resource, index) => (
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 md:grid-cols-2" key={index}>
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" onChange={(event) => onResourceChange(index, 'title', event.target.value)} placeholder="Title" value={resource.title} />
              <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" onChange={(event) => onResourceChange(index, 'type', event.target.value)} value={resource.type}>
                <option value="documentation">Documentation</option>
                <option value="youtube">YouTube</option>
                <option value="pdf">PDF</option>
                <option value="notes">Notes</option>
                <option value="link">External link</option>
              </select>
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 md:col-span-2" onChange={(event) => onResourceChange(index, 'url', event.target.value)} placeholder="URL" value={resource.url} />
              <input className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" onChange={(event) => onResourceChange(index, 'description', event.target.value)} placeholder="Description" value={resource.description} />
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/10" onClick={() => onRemoveResource(index)} type="button">
                <Trash2 size={15} />
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300" type="submit">
        <Save size={16} />
        {submitLabel}
      </button>
    </form>
  );
}
