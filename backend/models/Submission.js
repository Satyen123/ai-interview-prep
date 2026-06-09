import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingProblem',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Memory Limit Exceeded'],
    required: true
  },
  runtime: {
    type: Number, // milliseconds
    required: true
  },
  memory: {
    type: Number, // megabytes
    required: true
  },
  testCasesPassed: {
    type: Number,
    required: true
  },
  totalTestCases: {
    type: Number,
    required: true
  },
  errorMessage: {
    type: String,
    default: ''
  },
  problemTitle: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    default: ''
  },
  companyTags: [{
    type: String
  }],
  passedCases: {
    type: Number,
    default: 0
  },
  failedCases: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
