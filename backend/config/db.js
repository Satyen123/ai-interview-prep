import mongoose from 'mongoose';

const connectDB = async (retryCount = 5) => {
  const connString = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!connString) {
    console.error('❌ CRITICAL DATABASE ERROR: process.env.MONGO_URI or process.env.MONGODB_URI is missing or undefined!');
    throw new Error('Missing MONGO_URI environment variable');
  }

  // Production connection options
  const options = {
    connectTimeoutMS: 10000, // Timeout after 10s
    socketTimeoutMS: 45000,  // Close sockets after 45s of inactivity
  };

  try {
    console.log(`Attempting to connect to MongoDB Atlas... (${retryCount} retries remaining)`);
    const conn = await mongoose.connect(connString, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log('MONGODB CONNECTED');
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    if (retryCount > 0) {
      console.log('Retrying MongoDB connection in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount - 1);
    } else {
      console.error('❌ Failed to connect to MongoDB after maximum retries.');
      throw new Error('Database connection failed after maximum retries');
    }
  }
};

export default connectDB;
