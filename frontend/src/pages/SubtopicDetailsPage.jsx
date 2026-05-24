import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, Link as LinkIcon, Paperclip, Plus, Trash2, Calendar, ClipboardCheck } from 'lucide-react';
import NotesEditor from '../components/NotesEditor';
import ProgressRing from '../components/ProgressRing';
import ResourceCard from '../components/ResourceCard';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const defaultChecklist = [
  { id: 1, text: 'Review subtopic lecture or documentation', completed: false },
  { id: 2, text: 'Set up hands-on lab or environment sandbox', completed: false },
  { id: 3, text: 'Complete practice task / CLI exercises', completed: false },
  { id: 4, text: 'Draft reference notes and key command blocks', completed: false }
];

export default function SubtopicDetailsPage() {
  const { topicName, subtopicName } = useParams();
  const { user } = useAuth();
  const topic = decodeURIComponent(topicName);
  const subtopic = decodeURIComponent(subtopicName);
  const [assignments, setAssignments] = useState([]);
  const [notesText, setNotesText] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('All changes saved');
  const [loadingData, setLoadingData] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [attachments, setAttachments] = useState([
    { name: 'architecture_diagram.png', size: '240KB' },
    { name: 'cli_cheat_sheet.pdf', size: '1.2MB' }
  ]);
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const topicItems = useMemo(() => assignments.filter((item) => item.topic === topic), [assignments, topic]);
  const currentIndex = topicItems.findIndex((item) => item.subtopic === subtopic);
  const current = topicItems[currentIndex];
  const previous = currentIndex > 0 ? topicItems[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < topicItems.length - 1 ? topicItems[currentIndex + 1] : null;
  const completedCount = topicItems.filter((item) => item.completed).length;
  const completionPercentage = topicItems.length ? Math.round((completedCount / topicItems.length) * 100) : 0;

  // Load subtopic notes, checklist, and assignments on mount or parameter change
  useEffect(() => {
    setLoadingData(true);
    setAutoSaveStatus('Loading...');
    api.get('/user/topics', { params: { userId: user.id } })
      .then(({ data }) => {
        const rows = data.topics || [];
        const selected = rows.find((row) => row.topic === topic && row.subtopic === subtopic);
        setAssignments(rows);
        
        let noteVal = selected?.notes || '';
        let listItems = [...defaultChecklist];
        let updatedTime = '';

        try {
          const parsed = JSON.parse(noteVal);
          if (parsed && typeof parsed === 'object' && parsed.hasOwnProperty('notesText')) {
            noteVal = parsed.notesText || '';
            if (parsed.checklist && Array.isArray(parsed.checklist)) {
              listItems = parsed.checklist;
            }
            updatedTime = parsed.lastUpdated || '';
          }
        } catch {
          noteVal = selected?.notes || '';
        }

        setNotesText(noteVal);
        setChecklist(listItems);
        setLastUpdated(updatedTime || 'Not saved yet');
        setLoadingData(false);
        setAutoSaveStatus('Changes synchronized');
      })
      .catch(() => {
        setAssignments([]);
        setLoadingData(false);
        setAutoSaveStatus('Connection error');
      });
  }, [subtopic, topic, user.id]);

  const refreshAssignments = async () => {
    const { data } = await api.get('/user/topics', { params: { userId: user.id } });
    setAssignments(data.topics || []);
  };

  const toggleComplete = async () => {
    if (!current) return;
    await api.post('/user/complete-topic', {
      userId: user.id,
      topic,
      subtopic,
      completed: !current.completed
    });
    await refreshAssignments();
  };

  // Central save notes logic
  const handleSaveNotes = async (forced = false) => {
    if (loadingData) return;
    setIsSaving(true);
    if (forced) setMessage('');
    setAutoSaveStatus('Syncing Excel...');

    const payload = JSON.stringify({
      notesText,
      checklist,
      lastUpdated: new Date().toISOString()
    });

    try {
      await api.post('/user/save-notes', {
        userId: user.id,
        topic: subtopic,
        parentTopic: topic,
        notes: payload
      });
      setLastUpdated(new Date().toLocaleTimeString());
      setAutoSaveStatus('Changes synced');
      if (forced) {
        setMessage('Changes manually synchronized in Excel storage.');
        setTimeout(() => setMessage(''), 3500);
      }
    } catch {
      setAutoSaveStatus('Sync failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced auto-save
  useEffect(() => {
    if (loadingData) return;

    setAutoSaveStatus('Editing...');
    const timer = setTimeout(() => {
      handleSaveNotes(false);
    }, 2500); // 2.5s debounce

    return () => clearTimeout(timer);
  }, [notesText, checklist]);

  // Checklist actions
  const toggleCheckItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const addCheckItem = (e) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    const newItem = {
      id: Date.now(),
      text: newCheckItem.trim(),
      completed: false
    };
    setChecklist(prev => [...prev, newItem]);
    setNewCheckItem('');
  };

  const removeCheckItem = (id) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  // Mock attachments action
  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (!newAttachmentName.trim()) return;
    setAttachments(prev => [...prev, { name: newAttachmentName.trim(), size: '100KB' }]);
    setNewAttachmentName('');
  };

  const handleRemoveAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/40 shadow-panel backdrop-blur-xl">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.15),transparent_35%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_30%)] p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-neon-purple transition-all" to="/dashboard">Roadmap</Link>
              <span>/</span>
              <Link className="hover:text-neon-purple transition-all" to={`/topics/${encodeURIComponent(topic)}`}>{topic}</Link>
              <span>/</span>
              <span className="text-white font-bold">{subtopic}</span>
            </div>
            <StatusBadge tone={current?.completed ? 'success' : 'warning'}>
              {current?.completed ? 'Completed' : 'In progress'}
            </StatusBadge>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-end">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neon-cyan">{current?.category || 'Roadmap Topic'}</p>
              <h2 className="m-0 text-3xl font-extrabold tracking-tight text-white">{subtopic}</h2>
              <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-400">
                Configure notes, attachments, resources, and checklists for this learning subtopic milestone.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/40 border border-slate-900/60 p-4 text-center backdrop-blur flex justify-center items-center">
              <ProgressRing value={completionPercentage} label="Topic Core" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_365px]">
        {/* Main Work Area */}
        <div className="space-y-6">
          {/* Notes Workspace */}
          <NotesEditor 
            value={notesText} 
            onChange={setNotesText} 
            onSave={() => handleSaveNotes(true)} 
            isSaving={isSaving} 
            message={message} 
            autoSaveStatus={autoSaveStatus} 
          />

          {/* Resources */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl">
            <h3 className="m-0 flex items-center gap-2 text-base font-extrabold text-white">
              <BookOpen size={18} className="text-neon-cyan" />
              Syllabus Study Resources
            </h3>
            <p className="m-0 text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-0.5">
              Admin assigned external references and documentations.
            </p>
            
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(current?.resources || []).length ? (
                current.resources.map((resource, index) => <ResourceCard key={`${resource.title}-${index}`} resource={resource} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-6 text-center text-xs text-slate-500 sm:col-span-2">
                  No learning resources attached to this subtopic yet.
                </div>
              )}
            </div>
          </section>

          {/* Attachments Section */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-panel backdrop-blur-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <h3 className="m-0 flex items-center gap-2 text-base font-extrabold text-white">
                  <Paperclip size={18} className="text-neon-purple" />
                  Reference Attachments
                </h3>
                <p className="m-0 text-[10px] text-slate-500 uppercase font-semibold tracking-wider mt-0.5">
                  Link files or assets for study reference.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddAttachment} className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-2xl glass-input px-3.5 py-2.5 text-xs"
                placeholder="Link image, code snippet, or doc url..."
                value={newAttachmentName}
                onChange={e => setNewAttachmentName(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-4 py-2.5 text-xs font-bold text-white shadow-lg"
              >
                <Plus size={14} /> Add
              </button>
            </form>

            <div className="space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-950/40 border border-slate-900 px-4 py-3 text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-medium">
                    <LinkIcon size={14} className="text-neon-cyan" /> {file.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{file.size}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <aside className="space-y-6">
          {/* Subtopic Checklist Widget */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl space-y-4">
            <h3 className="m-0 flex items-center gap-2 text-sm font-extrabold text-white">
              <ClipboardCheck size={16} className="text-neon-purple" />
              Syllabus Checklist
            </h3>
            
            <form onSubmit={addCheckItem} className="flex gap-1.5">
              <input
                type="text"
                className="flex-1 rounded-xl glass-input px-3 py-2 text-xs"
                placeholder="New check item..."
                value={newCheckItem}
                onChange={e => setNewCheckItem(e.target.value)}
              />
              <button
                type="submit"
                className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 border border-slate-850 text-slate-200 hover:border-neon-purple transition"
              >
                <Plus size={15} />
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {checklist.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-950/30 border border-slate-900/60 text-xs hover:border-slate-800 transition"
                >
                  <label className="flex items-start gap-2.5 cursor-pointer select-none min-w-0">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleCheckItem(item.id)}
                      className="mt-0.5 rounded border-slate-850 bg-slate-950 text-neon-purple focus:ring-neon-purple/50"
                    />
                    <span className={`leading-normal ${item.completed ? 'line-through text-slate-500 font-medium' : 'text-slate-300 font-semibold'}`}>
                      {item.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCheckItem(item.id)}
                    className="text-slate-600 hover:text-rose-400 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Status Tracker */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl space-y-4">
            <h3 className="m-0 text-sm font-extrabold text-white">Status Tracker</h3>
            <button
              className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold transition-all duration-350 ${
                current?.completed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg hover:shadow-neon-purple/20 hover:-translate-y-0.5'
              }`}
              onClick={toggleComplete}
              type="button"
            >
              {current?.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              {current?.completed ? 'Subtopic Completed' : 'Mark Subtopic Complete'}
            </button>
          </section>

          {/* Learning Details */}
          <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl space-y-4 text-xs">
            <h3 className="m-0 text-sm font-extrabold text-white">Learning Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-900/60">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Clock3 size={13} /> Est. study time</span>
                <span className="font-extrabold text-white">1.5 Hours</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-900/60">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5"><Calendar size={13} /> Last synced</span>
                <span className="font-extrabold text-neon-cyan">{lastUpdated}</span>
              </div>
              <div className="space-y-2 pt-1.5">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Learning Objectives</span>
                <div className="rounded-2xl bg-slate-950/45 p-3 border border-slate-900 leading-normal text-slate-400 space-y-1.5">
                  <p className="m-0 font-medium">{current?.requirements || 'Master subtopic objectives and maintain synced learning notes.'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Nav Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <NavButton disabled={!previous} item={previous} label="Previous" icon="left" topic={topic} />
            <NavButton disabled={!next} item={next} label="Next" icon="right" topic={topic} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function NavButton({ disabled, icon, item, label, topic }) {
  const content = (
    <span className="flex items-center justify-center gap-2">
      {icon === 'left' ? <ArrowLeft size={14} /> : null}
      {label}
      {icon === 'right' ? <ArrowRight size={14} /> : null}
    </span>
  );

  if (disabled) {
    return <span className="rounded-2xl border border-slate-900 bg-slate-950/40 py-3 text-center text-xs font-bold text-slate-500 cursor-not-allowed opacity-60">{content}</span>;
  }

  return (
    <Link
      className="rounded-2xl border border-slate-800 bg-slate-950/40 py-3 text-center text-xs font-bold text-slate-300 transition hover:border-neon-purple hover:bg-neon-purple/5 hover:text-white"
      to={`/topics/${encodeURIComponent(topic)}/${encodeURIComponent(item.subtopic)}`}
    >
      {content}
    </Link>
  );
}
