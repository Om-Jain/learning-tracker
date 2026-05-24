import { Save, Bold, Italic, Code, Heading, List, Sparkles } from 'lucide-react';

export default function NotesEditor({ value, onChange, onSave, isSaving, message, autoSaveStatus }) {
  const insertFormat = (syntax) => {
    const textarea = document.getElementById('notes-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let replacement = '';
    
    if (syntax === 'bold') replacement = `**${selectedText || 'bold text'}**`;
    else if (syntax === 'italic') replacement = `*${selectedText || 'italic text'}*`;
    else if (syntax === 'code') replacement = `\`${selectedText || 'code snippet'}\``;
    else if (syntax === 'heading') replacement = `\n### ${selectedText || 'Heading'}\n`;
    else if (syntax === 'list') replacement = `\n- ${selectedText || 'List item'}\n`;
    
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 shadow-panel backdrop-blur-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h3 className="m-0 text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-neon-purple animate-pulse" />
            Syllabus Notes Workspace
          </h3>
          <p className="m-0 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            Auto-saves modifications to the Excel data store.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {autoSaveStatus && (
            <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest animate-pulse">
              {autoSaveStatus}
            </span>
          )}
          <button
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:shadow-neon-purple/20 hover:-translate-y-0.5 disabled:opacity-60"
            disabled={isSaving}
            onClick={onSave}
            type="button"
          >
            <Save size={14} />
            {isSaving ? 'Syncing...' : 'Force Sync'}
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1.5 rounded-xl bg-slate-950/60 p-1.5 border border-slate-900/60 w-fit">
        <button
          type="button"
          onClick={() => insertFormat('heading')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          title="Heading"
        >
          <Heading size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('bold')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('italic')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          title="Italic"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('code')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          title="Code Block"
        >
          <Code size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertFormat('list')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          title="List"
        >
          <List size={15} />
        </button>
      </div>

      <textarea
        id="notes-textarea"
        className="min-h-80 w-full resize-y rounded-2xl border border-slate-900 bg-slate-950/65 p-5 font-mono text-xs leading-relaxed text-slate-200 outline-none transition placeholder:text-slate-650 focus:border-neon-purple/50 focus:ring-4 focus:ring-neon-purple/5"
        onChange={(event) => onChange(event.target.value)}
        placeholder="# AWS EC2 Notes&#10;- Key Compute Concepts&#10;- Command snippets: `aws ec2 run-instances`&#10;- Architecture notes: VPC mapping, Security Groups, EBS storage..."
        value={value}
      />
      
      {message ? (
        <p className="mt-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400">
          {message}
        </p>
      ) : null}
    </section>
  );
}
