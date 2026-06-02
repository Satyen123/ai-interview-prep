import Interview from '../models/Interview.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { generateQuestion, evaluateAnswer, evaluateOrHintAnswer, synthesizeInterview } from '../services/aiService.js';

// Mock interview session is now continuous and unlimited
/**
 * @desc    Start a new mock interview session
 * @route   POST /api/interview/start
 * @access  Private
 */
export const startInterview = async (req, res, next) => {
  const { interviewType, difficulty, jobRole, experienceLevel, companyType, interviewerStyle } = req.body;

  if (!interviewType || !difficulty || !jobRole) {
    res.status(400);
    return next(new Error('Please provide interviewType, difficulty, and jobRole'));
  }

  try {
    // Check free limits for non-premium
    if (!req.user.isFullPremium && !req.user.mockInterviewPremium) {
      const interviewCount = await Interview.countDocuments({ userId: req.user._id });
      if (interviewCount >= 2) {
        res.status(403);
        return next(new Error('Free Tier Limit Reached: You have completed your 2 free mock interviews. Please upgrade to utilized Mock Interview Premium for unlimited interviews.'));
      }
    }

    // Try to retrieve the latest resume to extract skills and raw text dynamically
    let skills = [];
    let resumeText = '';
    try {
      const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
      if (latestResume) {
        if (latestResume.extractedSkills) {
          skills = latestResume.extractedSkills;
        }
        if (latestResume.extractedText) {
          resumeText = latestResume.extractedText;
        }
      }
    } catch (dbErr) {
      console.error('Error fetching resume skills:', dbErr);
    }

    // Generate first question via AI
    const firstQuestionText = await generateQuestion(
      interviewType, 
      difficulty, 
      jobRole, 
      [], 
      experienceLevel || 'Mid-Level', 
      companyType || 'Startup', 
      skills,
      interviewerStyle || 'Friendly',
      resumeText
    );

    const interview = await Interview.create({
      userId: req.user._id,
      interviewType,
      difficulty,
      jobRole,
      experienceLevel: experienceLevel || 'Mid-Level',
      companyType: companyType || 'Startup',
      skills,
      interviewerStyle: interviewerStyle || 'Friendly',
      resumeText,
      status: 'in-progress',
      questions: [{
        questionText: firstQuestionText,
        userAnswer: '',
        idealAnswer: '',
        feedback: '',
        score: 0,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        missingConcepts: []
      }]
    });

    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit answer to active question and load next question
 * @route   POST /api/interview/answer
 * @access  Private
 */
export const submitAnswer = async (req, res, next) => {
  const { interviewId, answer, durationSeconds, endInterview } = req.body;

  if (!interviewId) {
    res.status(400);
    return next(new Error('Please provide interviewId'));
  }

  try {
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      res.status(404);
      return next(new Error('Interview session not found'));
    }

    if (interview.status === 'completed') {
      res.status(400);
      return next(new Error('Interview is already completed'));
    }

    // Capture active question index
    const activeIndex = interview.questions.length - 1;
    const activeQuestion = interview.questions[activeIndex];

    let evaluation = null;

    // Only evaluate if there's an active question and an answer is provided
    if (activeQuestion && answer !== undefined && answer.trim() !== '') {
      evaluation = await evaluateOrHintAnswer(
        activeQuestion.questionText,
        answer,
        interview.jobRole,
        interview.difficulty,
        activeQuestion.attempts || 0
      );

      // If AI decides to give a hint instead of moving on
      if (evaluation.action === 'hint' && !endInterview) {
        activeQuestion.attempts = (activeQuestion.attempts || 0) + 1;
        activeQuestion.questionText = evaluation.followUpText;
        activeQuestion.userAnswer = '';

        if (durationSeconds) {
          interview.duration += durationSeconds;
        }
        
        await interview.save();
        return res.json(interview); // Returns updated question with the hint, prompt stays on same index!
      }

      // Save answer and evaluation on active question
      activeQuestion.userAnswer = answer;
      activeQuestion.score = evaluation.score || 0;
      activeQuestion.feedback = evaluation.feedback || 'Skipped';
      activeQuestion.idealAnswer = evaluation.idealAnswer || 'Skipped';
      activeQuestion.strengths = evaluation.strengths || [];
      activeQuestion.weaknesses = evaluation.weaknesses || [];
      activeQuestion.suggestions = evaluation.suggestions || [];
      activeQuestion.missingConcepts = evaluation.missingConcepts || [];
    } else if (activeQuestion) {
      // Skipped or empty answer
      activeQuestion.userAnswer = answer || 'Skipped';
      activeQuestion.score = 0;
      activeQuestion.feedback = 'Skipped';
      activeQuestion.idealAnswer = 'Skipped';
      activeQuestion.strengths = [];
      activeQuestion.weaknesses = [];
      activeQuestion.suggestions = [];
      activeQuestion.missingConcepts = [];
    }

    // Accumulate duration if provided
    if (durationSeconds) {
      interview.duration += durationSeconds;
    }

    // Adaptive difficulty logic:
    if (evaluation && evaluation.score >= 8) {
      if (interview.difficulty === 'Beginner') {
        interview.difficulty = 'Intermediate';
      } else if (interview.difficulty === 'Intermediate') {
        interview.difficulty = 'Advanced';
      } else if (interview.difficulty === 'Advanced') {
        interview.difficulty = 'FAANG';
      } else if (interview.difficulty === 'FAANG') {
        interview.difficulty = 'Expert';
      }
    } else if (evaluation && evaluation.score < 5) {
      if (interview.difficulty === 'Expert') {
        interview.difficulty = 'FAANG';
      } else if (interview.difficulty === 'FAANG') {
        interview.difficulty = 'Advanced';
      } else if (interview.difficulty === 'Advanced') {
        interview.difficulty = 'Intermediate';
      } else if (interview.difficulty === 'Intermediate') {
        interview.difficulty = 'Beginner';
      }
    }

    // Check if user manually triggered "End Interview"
    if (endInterview === true) {
      // Perform final AI synthesis.
      const synthesis = await synthesizeInterview(interview);

      interview.status = 'completed';
      interview.overallScore = synthesis.overallScore;
      interview.evaluationSummary = {
        communication: synthesis.communication,
        technicalAccuracy: synthesis.technicalAccuracy,
        confidence: synthesis.confidence,
        grammarSuggestions: synthesis.grammarSuggestions,
        behavioralTips: synthesis.behavioralTips
      };

      await interview.save();

      // Award User Gamification stats!
      const user = await User.findById(req.user._id);
      if (user) {
        // Award XP dynamically based on questions answered (e.g. 20 XP per question up to 200 XP)
        const xpEarned = Math.min(interview.questions.length * 20, 200);
        user.xp += xpEarned;
        
        // Handle level up
        const xpForNextLevel = user.level * 150;
        if (user.xp >= xpForNextLevel) {
          user.level += 1;
          user.xp = user.xp - xpForNextLevel;
          user.badges.push({
            name: `Level ${user.level} Prep Master`,
            icon: '🏆'
          });
        }

        // Handle daily streaks
        const today = new Date().toDateString();
        const lastActiveDay = new Date(user.lastActive).toDateString();
        if (lastActiveDay !== today) {
          user.streak += 1;
          user.lastActive = new Date();
        }

        await user.save();
      }

      return res.json({
        message: 'Interview completed and evaluated.',
        interview,
        xpAwarded: Math.min(interview.questions.length * 20, 200)
      });
    }

    // Otherwise, generate NEXT question with adaptive difficulty and session parameters
    const nextQuestionText = await generateQuestion(
      interview.interviewType,
      interview.difficulty,
      interview.jobRole,
      interview.questions,
      interview.experienceLevel || 'Mid-Level',
      interview.companyType || 'Startup',
      interview.skills || [],
      interview.interviewerStyle || 'Friendly',
      interview.resumeText || ''
    );

    // Push new question into array
    interview.questions.push({
      questionText: nextQuestionText,
      userAnswer: '',
      idealAnswer: '',
      feedback: '',
      score: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missingConcepts: []
    });

    await interview.save();

    res.json(interview);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's past interviews
 * @route   GET /api/interview/history
 * @access  Private
 */
export const getInterviewHistory = async (req, res, next) => {
  try {
    const history = await Interview.find({ userId: req.user._id, status: 'completed' })
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get individual interview session details
 * @route   GET /api/interview/:id
 * @access  Private
 */
export const getInterviewDetails = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      res.status(404);
      return next(new Error('Interview details not found'));
    }

    // Ensure users can only view their own interviews
    if (interview.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to access these details'));
    }

    res.json(interview);
  } catch (error) {
    next(error);
  }
};
