import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  solvedProblems: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingProblem',
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Expert'],
      required: true
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Memory Limit Exceeded'],
      required: true
    },
    solvedAt: {
      type: Date,
      default: Date.now
    }
  }],
  failedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem'
  }],
  skippedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem'
  }],
  askedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem'
  }],
  bookmarkedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem'
  }],
  favoriteProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem'
  }],
  recentlyViewed: [{
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' },
    viewedAt: { type: Date, default: Date.now }
  }],
  lastSession: {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' },
    language: { type: String, default: 'javascript' },
    code: { type: String, default: '' },
    category: { type: String, default: '' },
    difficulty: { type: String, default: '' },
    company: { type: String, default: '' },
    isInterviewMode: { type: Boolean, default: false }
  },
  dailyChallenge: {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' },
    assignedDate: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    xpReward: { type: Number, default: 50 }
  },
  weeklyGoals: {
    solvedGoal: { type: Number, default: 10 },
    solvedCurrent: { type: Number, default: 0 },
    graphGoal: { type: Number, default: 3 },
    graphCurrent: { type: Number, default: 0 },
    accuracyGoal: { type: Number, default: 80 }
  },
  extendedStreaks: {
    codingStreak: { type: Number, default: 0 },
    interviewStreak: { type: Number, default: 0 },
    resumeStreak: { type: Number, default: 0 },
    lastCodingDate: { type: Date },
    lastInterviewDate: { type: Date },
    lastResumeDate: { type: Date }
  },
  achievements: [{
    id: { type: String },
    name: { type: String },
    description: { type: String },
    category: { type: String }, // 'solved', 'mastery', 'readiness', 'streak'
    progress: { type: Number, default: 0 }, // percentage 0-100
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date },
    badge: { type: String }
  }],
  accuracy: {
    type: Number,
    default: 0
  },
  codingReadinessScore: {
    type: Number,
    default: 0
  },
  readinessBreakdown: {
    google: { type: Number, default: 0 },
    amazon: { type: Number, default: 0 },
    meta: { type: Number, default: 0 },
    microsoft: { type: Number, default: 0 },
    netflix: { type: Number, default: 0 }
  },
  topicMastery: {
    type: Map,
    of: Number, // Maps category (e.g. 'Arrays') to accuracy/completion percentage
    default: {}
  },
  streak: {
    type: Number,
    default: 0
  },
  dailyStreakHistory: [{
    type: Date
  }],
  codingSpeed: {
    type: Number, // Average solution execution time in milliseconds
    default: 0
  },
  codingMemory: {
    type: Number, // Average solution memory in MB
    default: 0
  },
  hintsUsedCount: {
    type: Number,
    default: 0
  },
  totalXP: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
