import { useEffect, useState, useMemo } from 'react';
import { Layers, Folder, ChevronRight, BookOpen, Clock, CheckCircle, Search, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

export default function AdminTopicsPage() {
  const [assignments, setAssignments] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/assignments')
      .then(({ data }) => {
        setAssignments(data.assignments || []);
        setLoading(false);
      })
      .catch(() => {
        setAssignments([]);
        setLoading(false);
      });
  }, []);

  const groupedTree = useMemo(() => {
    const tree = {};

    assignments.forEach((assignment) => {
      const { category, topic, subtopic, requirements, resources } = assignment;
      
      if (!tree[category]) {
        tree[category] = {};
      }
      if (!tree[category][topic]) {
        tree[category][topic] = [];
      }

      tree[category][topic].push({
        subtopic,
        requirements,
        resourcesCount: Array.isArray(resources) ? resources.length : 0
      });
    });

    return tree;
  }, [assignments]);

  const filteredTree = useMemo(() => {
    if (!query) return groupedTree;

    const filtered = {};
    const lowerQuery = query.toLowerCase();

    Object.keys(groupedTree).forEach(category => {
      Object.keys(groupedTree[category]).forEach(topic => {
        const subtopics = groupedTree[category][topic];
        const matchesCategory = category.toLowerCase().includes(lowerQuery);
        const matchesTopic = topic.toLowerCase().includes(lowerQuery);
        const matchingSubtopics = subtopics.filter(s => s.subtopic.toLowerCase().includes(lowerQuery));

        if (matchesCategory || matchesTopic || matchingSubtopics.length > 0) {
          if (!filtered[category]) {
            filtered[category] = {};
          }
          filtered[category][topic] = matchingSubtopics.length > 0 ? matchingSubtopics : subtopics;
        }
      });
    });

    return filtered;
  }, [groupedTree, query]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        eyebrow="Curriculum Inventory"
        title="Roadmap Topics Catalog"
      />

      <div className="flex items-center gap-3">
        <label className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="w-full rounded-2xl glass-input py-2.5 pl-10 pr-3 text-sm"
            placeholder="Search categories, topics, or subtopics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 w-full animate-pulse rounded-3xl bg-slate-900/60" />
          ))}
        </div>
      ) : Object.keys(filteredTree).length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
          <HelpCircle className="mx-auto mb-3 text-slate-500" size={36} />
          <h3 className="m-0 text-lg font-semibold text-slate-200">No catalog items found</h3>
          <p className="mt-1 text-sm">Create an assignment to bootstrap roadmap topics.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(filteredTree).map((category, catIdx) => (
            <motion.section
              key={category}
              className="glass-panel rounded-3xl p-5 space-y-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.04 }}
            >
              <h3 className="m-0 flex items-center gap-2 text-xl font-extrabold text-neon-cyan uppercase tracking-wider">
                <Folder size={20} />
                {category}
              </h3>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.keys(filteredTree[category]).map((topic) => {
                  const items = filteredTree[category][topic];
                  return (
                    <div 
                      key={topic}
                      className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 space-y-3"
                    >
                      <h4 className="m-0 text-base font-bold text-slate-100 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Layers size={16} className="text-neon-purple" /> {topic}
                        </span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-slate-400">
                          {items.length} subtopics
                        </span>
                      </h4>

                      <div className="space-y-2 border-t border-slate-900 pt-3">
                        {items.map((sub, sIdx) => (
                          <div 
                            key={`${sub.subtopic}-${sIdx}`}
                            className="flex items-start justify-between gap-3 text-xs bg-slate-900/30 rounded-xl p-2.5 border border-slate-900/60"
                          >
                            <div className="min-w-0">
                              <p className="m-0 font-semibold text-slate-200 truncate">{sub.subtopic}</p>
                              <p className="m-0 text-[10px] text-slate-500 line-clamp-1">{sub.requirements}</p>
                            </div>
                            <span className="shrink-0 rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-400">
                              {sub.resourcesCount} links
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  );
}
