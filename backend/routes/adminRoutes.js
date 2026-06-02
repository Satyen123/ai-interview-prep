import express from 'express';
import { getAdminStats, getAllUsers, addProblemTemplate } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getAllUsers);
router.post('/problems', protect, admin, addProblemTemplate);

export default router;
export const adminRoutes = router;
