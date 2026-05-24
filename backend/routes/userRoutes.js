import { Router } from 'express';
import {
  completeTopic,
  getResources,
  getTopics,
  getUserNoteDetails,
  getUserProgress,
  saveNotes
} from '../controllers/userController.js';

const router = Router();

router.get('/topics', getTopics);
router.post('/complete-topic', completeTopic);
router.post('/save-notes', saveNotes);
router.get('/progress', getUserProgress);
router.get('/resources', getResources);
router.get('/notes', getUserNoteDetails);

export default router;
