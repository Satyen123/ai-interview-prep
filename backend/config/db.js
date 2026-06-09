import mongoose from 'mongoose';

const connectDB = async (retryCount = 5) => {
  const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-interview-prep';
  
  // Production connection options
  const options = {
    connectTimeoutMS: 10000, // Timeout after 10s
    socketTimeoutMS: 45000,  // Close sockets after 45s of inactivity
  };

  try {
    const conn = await mongoose.connect(connString, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    if (retryCount > 0) {
      console.log(`Retrying MongoDB connection in 5 seconds... (${retryCount} retries remaining)`);
      setTimeout(() => connectDB(retryCount - 1), 5000);
    } else {
      console.error('❌ Failed to connect to MongoDB after maximum retries.');
      console.warn('⚠️ Server will continue executing in Mock Database mode.');
    }
  }
};

export default connectDB;
