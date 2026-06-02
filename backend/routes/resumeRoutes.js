import express from 'express';
import { 
  uploadAndAnalyzeResume, 
  getResumeHistory, 
  optimizeResume,
  enhanceBulletEndpoint,
  generateProjectEndpoint,
  generateCoverEndpoint
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkResumePremium } from '../middleware/premiumMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadAndAnalyzeResume);
router.post('/optimize', protect, checkResumePremium, upload.single('resume'), optimizeResume);
router.post('/tools/enhance-bullet', protect, checkResumePremium, enhanceBulletEndpoint);
router.post('/tools/generate-project', protect, checkResumePremium, generateProjectEndpoint);
router.post('/tools/generate-cover', protect, checkResumePremium, generateCoverEndpoint);
router.get('/history', protect, getResumeHistory);

export default router;
