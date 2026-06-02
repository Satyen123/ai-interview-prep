import express from 'express';
import { startInterview, submitAnswer, getInterviewHistory, getInterviewDetails } from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.post('/answer', protect, submitAnswer);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewDetails);

export default router;
