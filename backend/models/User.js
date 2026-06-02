import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  profileImage: { 
    type: String, 
    default: '' 
  },
  skills: [{ 
    type: String 
  }],
  targetRole: { 
    type: String, 
    default: 'MERN Stack Developer' 
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFullPremium: {
    type: Boolean,
    default: false
  },
  mockInterviewPremium: {
    type: Boolean,
    default: false
  },
  resumePremium: {
    type: Boolean,
    default: false
  },
  codingPremium: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String,
    enum: ['none', 'mock', 'resume', 'coding', 'full', 'lifetime'],
    default: 'none'
  },
  subscriptionStartDate: {
    type: Date,
    default: null
  },
  subscriptionExpiryDate: {
    type: Date,
    default: null
  },
  // Gamification & Engagement
  xp: { 
    type: Number, 
    default: 0 
  },
  level: { 
    type: Number, 
    default: 1 
  },
  streak: { 
    type: Number, 
    default: 0 
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
  },
  badges: [{
    name: { type: String, required: true },
    icon: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Password hashing hook before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
