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
  accuracy: {
    type: Number,
    default: 0
  },
  codingReadinessScore: {
    type: Number,
    default: 0
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
  totalXP: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
