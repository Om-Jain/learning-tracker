import {
  appendSheetRow,
  readSheetRows,
  replaceSheetRows
} from '../utils/excelStore.js';

export function getAllUsers() {
  return readSheetRows('users');
}

export function findUserByCredentials(username, password) {
  return getAllUsers().find((user) => user.username === username && user.password === password);
}

export function createNewUser(payload) {
  if (!payload.username || !payload.password) {
    throw new Error('Username and password are required');
  }

  const users = getAllUsers();

  if (users.some((user) => user.username === payload.username)) {
    throw new Error('Username already exists');
  }

  const nextId = users.length ? Math.max(...users.map((user) => Number(user.id))) + 1 : 1;
  const user = {
    id: nextId,
    username: payload.username,
    password: payload.password,
    role: payload.role || 'user'
  };

  appendSheetRow('users', user);
  return user;
}

export function deleteExistingUser(userId) {
  if (!userId) {
    throw new Error('Valid user id is required');
  }

  const filtered = getAllUsers().filter((user) => Number(user.id) !== userId);
  replaceSheetRows('users', filtered);
}

export function saveAssignment(payload) {
  if (!payload.userId || !payload.category || !payload.topic || !payload.subtopic) {
    throw new Error('User, category, topic, and subtopic are required');
  }

  const assignment = {
    userId: Number(payload.userId),
    category: payload.category,
    topic: payload.topic,
    subtopic: payload.subtopic,
    resources: serializeResources(payload.resources),
    requirements: payload.requirements || 'Complete notes and mark subtopic done'
  };

  appendSheetRow('assignments', assignment);
  return assignment;
}

export function getAllAssignments() {
  return readSheetRows('assignments').map(normalizeAssignment);
}

export function getCategories() {
  const defaults = ['Cloud', 'DevOps', 'Cybersecurity', 'Networking', 'Linux'];
  const assigned = getAllAssignments().map((assignment) => assignment.category).filter(Boolean);
  return Array.from(new Set([...defaults, ...assigned]));
}

export function updateAssignment(payload) {
  if (!payload.userId || !payload.topic || !payload.subtopic) {
    throw new Error('User, topic, and subtopic are required');
  }

  const rows = readSheetRows('assignments');
  const index = rows.findIndex((row) => (
    Number(row.userId) === Number(payload.userId)
    && row.topic === payload.originalTopic
    && row.subtopic === payload.originalSubtopic
  ));

  if (index === -1) {
    throw new Error('Assignment not found');
  }

  rows[index] = {
    ...rows[index],
    userId: Number(payload.userId),
    category: payload.category,
    topic: payload.topic,
    subtopic: payload.subtopic,
    resources: serializeResources(payload.resources),
    requirements: payload.requirements || rows[index].requirements || ''
  };
  replaceSheetRows('assignments', rows);
  return normalizeAssignment(rows[index]);
}

export function deleteAssignment(payload) {
  const rows = readSheetRows('assignments');
  const nextRows = rows.filter((row) => !(
    Number(row.userId) === Number(payload.userId)
    && row.topic === payload.topic
    && row.subtopic === payload.subtopic
  ));

  replaceSheetRows('assignments', nextRows);
}

export function getAssignmentsForUser(userId) {
  const assignments = readSheetRows('assignments').filter((row) => Number(row.userId) === userId);
  const progressRows = readSheetRows('progress').filter((row) => Number(row.userId) === userId);
  const notesRows = readSheetRows('notes').filter((row) => Number(row.userId) === userId);

  return assignments.map((assignmentRow) => {
    const assignment = normalizeAssignment(assignmentRow);

    return {
      ...assignment,
      completed: progressRows.some((progress) => isProgressMatch(progress, assignment)),
      notes: findAssignmentNote(notesRows, assignment)?.notes || ''
    };
  });
}

export function markTopicCompleted(payload) {
  if (!payload.userId || !payload.topic) {
    throw new Error('User and topic are required');
  }

  const rows = readSheetRows('progress');
  const next = rows.filter(
    (row) => !(
      Number(row.userId) === Number(payload.userId)
      && row.topic === payload.topic
      && String(row.subtopic || '') === String(payload.subtopic || '')
    )
  );
  const entry = {
    userId: Number(payload.userId),
    topic: payload.topic,
    subtopic: payload.subtopic || '',
    completed: payload.completed ?? true
  };

  next.push(entry);
  replaceSheetRows('progress', next);
  return entry;
}

export function upsertNote(payload) {
  if (!payload.userId || !payload.topic) {
    throw new Error('User and topic are required');
  }

  const rows = readSheetRows('notes');
  const next = rows.filter(
    (row) => !(
      Number(row.userId) === Number(payload.userId)
      && row.topic === payload.topic
      && String(row.parentTopic || '') === String(payload.parentTopic || '')
    )
  );
  const entry = {
    userId: Number(payload.userId),
    topic: payload.topic,
    parentTopic: payload.parentTopic || '',
    notes: payload.notes || '',
    lastUpdated: new Date().toISOString()
  };

  next.push(entry);
  replaceSheetRows('notes', next);
  return entry;
}

export function getUserProgressSummary(userId) {
  const assignments = getAssignmentsForUser(userId);
  const completedCount = assignments.filter((item) => item.completed).length;
  const total = assignments.length;
  const completionPercentage = total ? Math.round((completedCount / total) * 100) : 0;

  return {
    userId,
    totalTopics: total,
    completedTopics: completedCount,
    pendingTopics: total - completedCount,
    completionPercentage,
    categories: buildCategorySummary(assignments),
    topics: buildTopicSummary(assignments)
  };
}

export function getMergedProgress() {
  return getAllUsers()
    .filter((user) => user.role === 'user')
    .map((user) => ({
      userId: user.id,
      username: user.username,
      ...getUserProgressSummary(Number(user.id))
    }));
}

export function getNoteDetails({ userId, topic, subtopic }) {
  const user = getAllUsers().find((item) => Number(item.id) === Number(userId));
  const assignment = getAssignmentsForUser(Number(userId)).find((item) => (
    item.topic === topic && item.subtopic === subtopic
  ));
  const notesRows = readSheetRows('notes');
  const note = notesRows.find((row) => (
    Number(row.userId) === Number(userId)
    && row.topic === subtopic
    && (!row.parentTopic || row.parentTopic === topic)
  ));

  return {
    userId: Number(userId),
    username: user?.username || 'Unknown',
    topic,
    subtopic,
    notes: note?.notes || '',
    lastUpdated: note?.lastUpdated || '',
    resources: assignment?.resources || [],
    history: [
      { label: 'Assignment created', detail: `${topic} / ${subtopic}` },
      { label: 'Notes captured', detail: note?.notes ? 'User has saved notes' : 'No notes saved yet' }
    ]
  };
}

function buildCategorySummary(assignments) {
  const categoryMap = new Map();

  assignments.forEach((assignment) => {
    const current = categoryMap.get(assignment.category) || {
      category: assignment.category,
      total: 0,
      completed: 0
    };

    current.total += 1;
    if (assignment.completed) {
      current.completed += 1;
    }
    categoryMap.set(assignment.category, current);
  });

  return Array.from(categoryMap.values()).map((item) => ({
    ...item,
    completionPercentage: item.total ? Math.round((item.completed / item.total) * 100) : 0
  }));
}

function buildTopicSummary(assignments) {
  const topicMap = new Map();

  assignments.forEach((assignment) => {
    const key = `${assignment.category}::${assignment.topic}`;
    const current = topicMap.get(key) || {
      category: assignment.category,
      topic: assignment.topic,
      total: 0,
      completed: 0,
      pendingSubtopics: [],
      subtopics: [],
      notes: '',
      subtopicNotes: [],
      resources: []
    };

    current.total += 1;
    current.subtopics.push(assignment.subtopic);
    current.resources.push(...(assignment.resources || []));
    if (assignment.notes) {
      current.subtopicNotes.push({
        subtopic: assignment.subtopic,
        notes: assignment.notes
      });
    }
    if (assignment.completed) {
      current.completed += 1;
    } else {
      current.pendingSubtopics.push(assignment.subtopic);
    }
    topicMap.set(key, current);
  });

  return Array.from(topicMap.values()).map((item) => ({
    ...item,
    resources: item.resources,
    notes: item.subtopicNotes.map((note) => `${note.subtopic}: ${note.notes}`).join(' | '),
    pending: item.total - item.completed,
    completionPercentage: item.total ? Math.round((item.completed / item.total) * 100) : 0
  }));
}

function normalizeAssignment(row) {
  return {
    ...row,
    userId: Number(row.userId),
    resources: parseResources(row.resources),
    requirements: row.requirements || ''
  };
}

function parseResources(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function serializeResources(resources) {
  if (!Array.isArray(resources)) {
    return JSON.stringify([]);
  }

  return JSON.stringify(resources.filter((resource) => resource.title || resource.url));
}

function findAssignmentNote(notesRows, assignment) {
  return notesRows.find((note) => (
    note.topic === assignment.subtopic
    && (!note.parentTopic || note.parentTopic === assignment.topic)
  )) || notesRows.find((note) => note.topic === assignment.topic);
}

function isProgressMatch(progress, assignment) {
  const isCompleted = String(progress.completed).toLowerCase() === 'true';

  if (!isCompleted || progress.topic !== assignment.topic) {
    return false;
  }

  return progress.subtopic === assignment.subtopic;
}

export function getAllNotes() {
  return readSheetRows('notes');
}
