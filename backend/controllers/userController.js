import {
  getAssignmentsForUser,
  getNoteDetails,
  getUserProgressSummary,
  markTopicCompleted,
  upsertNote
} from '../services/userService.js';

export function getTopics(req, res) {
  const userId = Number(req.query.userId);
  return res.json({ success: true, topics: getAssignmentsForUser(userId) });
}

export function completeTopic(req, res) {
  try {
    const progress = markTopicCompleted(req.body);
    return res.json({ success: true, progress });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export function saveNotes(req, res) {
  try {
    const note = upsertNote(req.body);
    return res.json({ success: true, note });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export function getUserProgress(req, res) {
  const userId = Number(req.query.userId);
  return res.json({ success: true, progress: getUserProgressSummary(userId) });
}

export function getResources(req, res) {
  const userId = Number(req.query.userId);
  const assignments = getAssignmentsForUser(userId);
  const resources = assignments.flatMap((assignment) => (
    (assignment.resources || []).map((resource) => ({
      ...resource,
      category: assignment.category,
      topic: assignment.topic,
      subtopic: assignment.subtopic
    }))
  ));

  return res.json({ success: true, resources });
}

export function getUserNoteDetails(req, res) {
  const details = getNoteDetails({
    userId: req.query.userId,
    topic: req.query.topic,
    subtopic: req.query.subtopic
  });

  return res.json({ success: true, details });
}
