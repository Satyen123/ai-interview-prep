import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isSample: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ['visible', 'hidden', 'edge', 'stress'],
    default: 'visible'
  }
});

const codingProblemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard', 'Expert'], 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  constraints: [{ 
    type: String 
  }],
  starterTemplates: {
    javascript: { type: String, required: true },
    typescript: { type: String, default: '' },
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    c: { type: String, default: '' },
    csharp: { type: String, default: '' },
    go: { type: String, default: '' },
    rust: { type: String, default: '' },
    php: { type: String, default: '' },
    kotlin: { type: String, default: '' },
    swift: { type: String, default: '' }
  },
  testCases: [testCaseSchema],
  tags: [{ type: String }],
  expectedTime: { type: String, default: '' },
  expectedSpace: { type: String, default: '' },
  hints: [{ type: String }],
  companyTags: [{ type: String }],
  explanation: { type: String, default: '' },
  optimalSolution: { type: String, default: '' },
  editorial: { type: String, default: '' }
}, { timestamps: true });

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);
export default CodingProblem;
