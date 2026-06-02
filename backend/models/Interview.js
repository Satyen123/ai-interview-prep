import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  idealAnswer: { type: String, default: '' },
  feedback: { type: String, default: '' },
  score: { type: Number, min: 0, max: 10, default: 0 },
  attempts: { type: Number, default: 0 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  missingConcepts: [{ type: String }]
});

const interviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  interviewType: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'FAANG', 'Expert'], 
    required: true 
  },
  interviewerStyle: {
    type: String,
    default: 'Friendly'
  },
  resumeText: {
    type: String,
    default: ''
  },
  jobRole: { 
    type: String, 
    required: true 
  },
  experienceLevel: {
    type: String,
    default: 'Mid-Level'
  },
  companyType: {
    type: String,
    default: 'Startup'
  },
  skills: [{
    type: String
  }],
  status: { 
    type: String, 
    enum: ['in-progress', 'completed'], 
    default: 'in-progress' 
  },
  duration: { 
    type: Number, 
    default: 0 
  }, // in seconds
  questions: [questionSchema],
  overallScore: { 
    type: Number, 
    default: 0 
  },
  evaluationSummary: {
    communication: { type: String, default: '' },
    technicalAccuracy: { type: String, default: '' },
    confidence: { type: String, default: '' },
    grammarSuggestions: { type: String, default: '' },
    behavioralTips: { type: String, default: '' }
  }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
