import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT Sign Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { name, email, password, targetRole } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({
      name,
      email,
      password,
      targetRole: targetRole || 'MERN Stack Developer',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        isPremium: user.isPremium,
        isFullPremium: user.isFullPremium,
        mockInterviewPremium: user.mockInterviewPremium,
        resumePremium: user.resumePremium,
        codingPremium: user.codingPremium,
        subscriptionType: user.subscriptionType,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      next(new Error('Invalid user data provided'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Manage Streak updates upon login
      const today = new Date().toDateString();
      const lastActiveDay = new Date(user.lastActive).toDateString();
      
      let streakUpdate = user.streak;
      if (lastActiveDay !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActiveDay === yesterday.toDateString()) {
          streakUpdate += 1;
        } else {
          streakUpdate = 1; // streak reset if skipped a day
        }
        user.streak = streakUpdate;
        user.lastActive = new Date();
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        isPremium: user.isPremium,
        isFullPremium: user.isFullPremium,
        mockInterviewPremium: user.mockInterviewPremium,
        resumePremium: user.resumePremium,
        codingPremium: user.codingPremium,
        subscriptionType: user.subscriptionType,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionExpiryDate: user.subscriptionExpiryDate,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile details
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.targetRole = req.body.targetRole || user.targetRole;
      user.skills = req.body.skills || user.skills;
      user.profileImage = req.body.profileImage || user.profileImage;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        targetRole: updatedUser.targetRole,
        skills: updatedUser.skills,
        profileImage: updatedUser.profileImage,
        isPremium: updatedUser.isPremium,
        isFullPremium: updatedUser.isFullPremium,
        mockInterviewPremium: updatedUser.mockInterviewPremium,
        resumePremium: updatedUser.resumePremium,
        codingPremium: updatedUser.codingPremium,
        subscriptionType: updatedUser.subscriptionType,
        subscriptionStartDate: updatedUser.subscriptionStartDate,
        subscriptionExpiryDate: updatedUser.subscriptionExpiryDate,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upgrade user to Premium subscription (Modular SaaS Plans)
 * @route   PUT /api/auth/upgrade
 * @access  Private
 */
export const upgradeUser = async (req, res, next) => {
  const { plan } = req.body; // mock, resume, coding, full, lifetime, none

  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const today = new Date();
      const expiry = new Date();

      if (plan === 'mock') {
        user.mockInterviewPremium = true;
        user.subscriptionType = 'mock';
        expiry.setDate(today.getDate() + 30);
      } else if (plan === 'resume') {
        user.resumePremium = true;
        user.subscriptionType = 'resume';
        expiry.setDate(today.getDate() + 30);
      } else if (plan === 'coding') {
        user.codingPremium = true;
        user.subscriptionType = 'coding';
        expiry.setDate(today.getDate() + 30);
      } else if (plan === 'full') {
        user.isFullPremium = true;
        user.mockInterviewPremium = true;
        user.resumePremium = true;
        user.codingPremium = true;
        user.subscriptionType = 'full';
        expiry.setDate(today.getDate() + 30);
      } else if (plan === 'lifetime') {
        user.isFullPremium = true;
        user.mockInterviewPremium = true;
        user.resumePremium = true;
        user.codingPremium = true;
        user.subscriptionType = 'lifetime';
        expiry.setFullYear(today.getFullYear() + 99); // 99 years expiry
      } else {
        // default / reset / 'none'
        user.isFullPremium = false;
        user.mockInterviewPremium = false;
        user.resumePremium = false;
        user.codingPremium = false;
        user.subscriptionType = 'none';
        user.subscriptionStartDate = null;
        user.subscriptionExpiryDate = null;
      }

      if (plan && plan !== 'none') {
        user.subscriptionStartDate = today;
        user.subscriptionExpiryDate = expiry;
        user.isPremium = true; // For backwards compatibility
      } else {
        user.isPremium = false;
      }

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        targetRole: updatedUser.targetRole,
        isPremium: updatedUser.isPremium,
        isFullPremium: updatedUser.isFullPremium,
        mockInterviewPremium: updatedUser.mockInterviewPremium,
        resumePremium: updatedUser.resumePremium,
        codingPremium: updatedUser.codingPremium,
        subscriptionType: updatedUser.subscriptionType,
        subscriptionStartDate: updatedUser.subscriptionStartDate,
        subscriptionExpiryDate: updatedUser.subscriptionExpiryDate,
        xp: updatedUser.xp,
        level: updatedUser.level,
        streak: updatedUser.streak,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};
