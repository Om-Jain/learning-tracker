import {
  createNewUser,
  deleteAssignment,
  deleteExistingUser,
  getAllAssignments,
  getAllUsers,
  getCategories,
  getMergedProgress,
  getNoteDetails,
  saveAssignment,
  updateAssignment,
  getAllNotes
} from '../services/userService.js';

export function createUser(req, res) {
  try {
    const created = createNewUser(req.body);
    return res.status(201).json({ success: true, user: created });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export function getUsers(req, res) {
  return res.json({ success: true, users: getAllUsers() });
}

export function deleteUser(req, res) {
  try {
    deleteExistingUser(Number(req.params.id));
    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export function assignTopic(req, res) {
  try {
    const assignment = saveAssignment(req.body);
    return res.status(201).json({ success: true, assignment });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export function getProgressReport(req, res) {
  let notesCount = 0;
  try {
    notesCount = getAllNotes().length;
  } catch (err) {
    console.error(err);
  }
  return res.json({ success: true, reports: getMergedProgress(), notesCount });
}

export function getAssignmentList(req, res) {
  return res.json({ success: true, assignments: getAllAssignments() });
}

export function getCategoryList(req, res) {
  return res.json({ success: true, categories: getCategories() });
}

export function updateAssignmentRow(req, res) {
  try {
    const assignment = updateAssignment(req.body);
    return res.json({ success: true, assignment });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export function deleteAssignmentRow(req, res) {
  deleteAssignment(req.body);
  return res.json({ success: true, message: 'Assignment deleted' });
}

export function getNotesReport(req, res) {
  const details = getNoteDetails({
    userId: req.query.userId,
    topic: req.query.topic,
    subtopic: req.query.subtopic
  });

  return res.json({ success: true, details });
}
