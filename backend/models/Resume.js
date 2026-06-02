import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  filename: { 
    type: String, 
    required: true 
  },
  atsScore: { 
    type: Number, 
    required: true,
    min: 40,
    max: 98
  },
  detectedRole: { 
    type: String, 
    default: 'Software Engineer' 
  },
  atsKeywordMatchPercentage: { 
    type: Number, 
    default: 0 
  },
  extractedSkills: [{ 
    type: String 
  }],
  missingKeywords: [{ 
    type: String 
  }],
  matchedKeywords: [{ 
    type: String 
  }],
  recommendedKeywords: [{ 
    type: String 
  }],
  suggestions: {
    formatting: [{ type: String }],
    projectDescriptions: [{ type: String }],
    actionVerbs: [{ type: String }],
    weakSections: [{ type: String }]
  },
  detailedFeedback: {
    whyScoreIsLow: String,
    howToImprove: String,
    whatSectionsNeedRewriting: String
  },
  recommendedRoles: [{ 
    type: String 
  }],
  strengths: [{ 
    type: String 
  }],
  weaknesses: [{ 
    type: String 
  }],
  recruiterImpression: String,
  interviewReadinessScore: { 
    type: Number, 
    default: 0 
  },
  extractedText: {
    type: String,
    default: ''
  },
  optimizedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
