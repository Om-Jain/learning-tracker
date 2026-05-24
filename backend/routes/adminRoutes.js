import { Router } from 'express';
import {
  assignTopic,
  createUser,
  deleteAssignmentRow,
  deleteUser,
  getAssignmentList,
  getCategoryList,
  getNotesReport,
  getProgressReport,
  getUsers,
  updateAssignmentRow
} from '../controllers/adminController.js';

const router = Router();

router.post('/create-user', createUser);
router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.post('/assign-topic', assignTopic);
router.get('/assignments', getAssignmentList);
router.put('/assignment', updateAssignmentRow);
router.delete('/assignment', deleteAssignmentRow);
router.get('/categories', getCategoryList);
router.get('/progress', getProgressReport);
router.get('/notes', getNotesReport);

export default router;
