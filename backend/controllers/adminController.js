import User from '../models/User.js';
import Interview from '../models/Interview.js';
import CodingProblem from '../models/CodingProblem.js';

/**
 * @desc    Get complete administrative analytics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalInterviews = await Interview.countDocuments({});
    const totalProblems = await CodingProblem.countDocuments({});

    const recentUsers = await User.find({ role: 'student' })
      .select('name email createdAt streak level')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentInterviews = await Interview.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalInterviews,
      totalProblems,
      recentUsers,
      recentInterviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add coding problem template
 * @route   POST /api/admin/problems
 * @access  Private/Admin
 */
export const addProblemTemplate = async (req, res, next) => {
  const { title, description, difficulty, category, constraints, starterTemplates, testCases } = req.body;

  if (!title || !description || !difficulty || !category || !starterTemplates || !testCases) {
    res.status(400);
    return next(new Error('Please provide all required coding problem fields.'));
  }

  try {
    const exists = await CodingProblem.findOne({ title });
    if (exists) {
      res.status(400);
      return next(new Error('Problem template with this title already exists.'));
    }

    const problem = await CodingProblem.create({
      title,
      description,
      difficulty,
      category,
      constraints,
      starterTemplates,
      testCases
    });

    res.status(201).json({
      message: 'Coding problem template registered successfully.',
      problem
    });
  } catch (error) {
    next(error);
  }
};
