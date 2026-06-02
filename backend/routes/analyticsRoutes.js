import express from 'express';
import { getUserAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', protect, getUserAnalytics);

export default router;
