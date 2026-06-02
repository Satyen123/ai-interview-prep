import express from 'express';
import { registerUser, authUser, getUserProfile, updateUserProfile, upgradeUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/upgrade', protect, upgradeUser);
router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
