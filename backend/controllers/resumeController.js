import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { extractTextFromPDF } from '../services/resumeService.js';
import { 
  analyzeResume, 
  optimizeResumeText, 
  enhanceBulletText, 
  generateProjectBullets, 
  generateCoverLetterText 
} from '../services/aiService.js';

/**
 * @desc    Upload and analyze resume (ATS scoring & keywords analysis)
 * @route   POST /api/resume/upload
 * @access  Private
 */
export const uploadAndAnalyzeResume = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('Please upload a PDF resume file'));
  }

  const { targetRole } = req.body;

  try {
    // 1. Extract text from the PDF file on disk
    const extractedText = await extractTextFromPDF(req.file.path);

    // 2. Perform AI ATS analysis
    const analysis = await analyzeResume(extractedText, targetRole || req.user.targetRole);

    // 3. Save Resume record to DB
    const resumeRecord = await Resume.create({
      userId: req.user._id,
      filename: req.file.originalname,
      atsScore: analysis.atsScore,
      detectedRole: analysis.detectedRole || targetRole || req.user.targetRole,
      atsKeywordMatchPercentage: analysis.atsKeywordMatchPercentage || 0,
      extractedSkills: analysis.extractedSkills,
      missingKeywords: analysis.missingKeywords,
      matchedKeywords: analysis.matchedKeywords,
      recommendedKeywords: analysis.recommendedKeywords,
      suggestions: {
        formatting: analysis.suggestions.formatting,
        projectDescriptions: analysis.suggestions.projectDescriptions,
        actionVerbs: analysis.suggestions.actionVerbs,
        weakSections: analysis.suggestions.weakSections
      },
      detailedFeedback: analysis.detailedFeedback,
      recommendedRoles: analysis.recommendedRoles,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recruiterImpression: analysis.recruiterImpression,
      interviewReadinessScore: analysis.interviewReadinessScore || 0,
      extractedText // SAVE RAW PARSED TEXT
    });

    // 4. Award User Gamification XP!
    const user = await User.findById(req.user._id);
    if (user) {
      user.xp += 50;
      
      // Handle level up
      const xpForNextLevel = user.level * 150;
      if (user.xp >= xpForNextLevel) {
        user.level += 1;
        user.xp = user.xp - xpForNextLevel;
        user.badges.push({
          name: `Resume Optimizer Level ${user.level}`,
          icon: '📄'
        });
      }
      await user.save();
    }

    res.status(201).json({
      message: 'Resume analyzed successfully.',
      resume: resumeRecord,
      xpAwarded: 50
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all resume reports for the user
 * @route   GET /api/resume/history
 * @access  Private
 */
export const getResumeHistory = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Optimize and rewrite resume for ATS readability (Premium Pro Only)
 * @route   POST /api/resume/optimize
 * @access  Private
 */
export const optimizeResume = async (req, res, next) => {
  if (!req.user.isPremium && !req.user.isFullPremium && !req.user.resumePremium) {
    res.status(403);
    return next(new Error('Premium Feature: Please upgrade your account to utilize the AI ATS Resume Generator.'));
  }

  if (!req.file) {
    res.status(400);
    return next(new Error('Please upload a PDF resume file to optimize'));
  }

  const { targetRole } = req.body;

  try {
    // 1. Extract text from PDF
    const text = await extractTextFromPDF(req.file.path);

    // 2. Perform AI ATS optimization
    const optimizedData = await optimizeResumeText(text, targetRole || req.user.targetRole);

    // 3. Persist to MongoDB history so optimized data is saved and restored on reload
    await Resume.create({
      userId: req.user._id,
      filename: req.file.originalname,
      atsScore: optimizedData.afterScore || 90,
      detectedRole: targetRole || req.user.targetRole,
      atsKeywordMatchPercentage: 80,
      extractedSkills: optimizedData.skills || [],
      extractedText: text,
      optimizedData: optimizedData, // SAVE STRUCT
      suggestions: {
        formatting: ["Fully optimized ATS structure applied!"],
        projectDescriptions: [],
        actionVerbs: [],
        weakSections: []
      },
      recruiterImpression: "AI Resume optimization fully processed and saved."
    });

    res.status(200).json({
      message: 'Resume optimized and rewritten successfully.',
      optimizedData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Enhance passive resume bullet point using STAR method (Premium Pro Only)
 * @route   POST /api/resume/tools/enhance-bullet
 * @access  Private
 */
export const enhanceBulletEndpoint = async (req, res, next) => {
  if (!req.user.isPremium) {
    res.status(403);
    return next(new Error('Premium Feature: Please upgrade your account to utilize AI Bullet point enhancement.'));
  }

  const { bulletText, targetRole, temperature } = req.body;
  if (!bulletText) {
    res.status(400);
    return next(new Error('Please provide bulletText to enhance'));
  }

  try {
    const enhancedText = await enhanceBulletText(bulletText, targetRole || req.user.targetRole, temperature);
    res.status(200).json({
      message: 'Bullet point enhanced successfully.',
      enhancedText
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate technical project description bullets (Premium Pro Only)
 * @route   POST /api/resume/tools/generate-project
 * @access  Private
 */
export const generateProjectEndpoint = async (req, res, next) => {
  if (!req.user.isPremium) {
    res.status(403);
    return next(new Error('Premium Feature: Please upgrade your account to utilize AI Project generation.'));
  }

  const { topic, techStack, targetRole, temperature } = req.body;
  if (!topic || !techStack) {
    res.status(400);
    return next(new Error('Please provide both topic and techStack parameters'));
  }

  try {
    const bullets = await generateProjectBullets(topic, techStack, targetRole || req.user.targetRole, temperature);
    res.status(200).json({
      message: 'Project description generated successfully.',
      bullets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate personalized Cover Letter (Premium Pro Only)
 * @route   POST /api/resume/tools/generate-cover
 * @access  Private
 */
export const generateCoverEndpoint = async (req, res, next) => {
  if (!req.user.isPremium && !req.user.isFullPremium && !req.user.resumePremium) {
    res.status(403);
    return next(new Error('Premium Feature: Please upgrade your account to utilize Cover Letter generation.'));
  }

  const { companyName, jobRole, skills, projects, experience, tone, temperature } = req.body;
  if (!companyName || !jobRole) {
    res.status(400);
    return next(new Error('Please provide both companyName and jobRole parameters'));
  }

  try {
    const coverLetter = await generateCoverLetterText(
      companyName, 
      jobRole, 
      skills || [], 
      projects || [], 
      experience || [], 
      tone || 'Professional',
      temperature
    );
    res.status(200).json({
      message: 'Cover letter generated successfully.',
      coverLetter
    });
  } catch (error) {
    next(error);
  }
};
