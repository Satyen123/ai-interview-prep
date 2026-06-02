import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-interview-prep');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Database Connection Warning: ${error.message}`);
    console.warn('⚠️ Server will continue executing in Mock Database mode. Start a local MongoDB service or configure MONGO_URI inside backend/.env to persist profiles.');
  }
};

export default connectDB;
