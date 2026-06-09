import express from 'express';
import { 
  getCodingProblems, 
  submitCodingSolution,
  getCodingProgress,
  getLeaderboard,
  generateAIProblemEndpoint,
  getAICoachingHintEndpoint,
  getAICodeReviewEndpoint,
  getAISolutionExplanationEndpoint,
  getAIInterviewFollowUpEndpoint,
  handleProblemAction,
  toggleBookmark,
  toggleFavorite,
  saveSessionEndpoint,
  getDailyChallenge
} from '../controllers/codingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkCodingPremium } from '../middleware/premiumMiddleware.js';

const router = express.Router();

router.get('/problems', protect, getCodingProblems);
router.post('/submit', protect, submitCodingSolution);
router.get('/progress', protect, getCodingProgress);
router.get('/leaderboard', protect, getLeaderboard);
router.post('/generate-problem', protect, checkCodingPremium, generateAIProblemEndpoint);
router.post('/problems/:id/action', protect, handleProblemAction);
router.post('/problems/:id/bookmark', protect, toggleBookmark);
router.post('/problems/:id/favorite', protect, toggleFavorite);
router.post('/session', protect, saveSessionEndpoint);
router.get('/daily-challenge', protect, getDailyChallenge);
router.post('/coach/hint', protect, checkCodingPremium, getAICoachingHintEndpoint);
router.post('/coach/review', protect, checkCodingPremium, getAICodeReviewEndpoint);
router.post('/coach/explain', protect, checkCodingPremium, getAISolutionExplanationEndpoint);
router.post('/coach/followup', protect, checkCodingPremium, getAIInterviewFollowUpEndpoint);

export default router;
