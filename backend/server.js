import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { rateLimiter } from './middleware/rateLimitMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import codingRoutes from './routes/codingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { isAiEngineActive } from './services/aiService.js';
import compression from 'compression';
import mongoose from 'mongoose';

// Setup environment configurations
dotenv.config();

// Environment verification - Fail Fast in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
  const missingEnv = requiredEnv.filter(env => !process.env[env]);
  if (missingEnv.length > 0) {
    console.error(`\n❌ CRITICAL CONFIGURATION ERROR: Missing required environment variables: ${missingEnv.join(', ')}`);
    console.error('Please configure these environment variables in the Railway dashboard and redeploy.');
    process.exit(1);
  }
}

// Establish MongoDB connection
connectDB();

const app = express();

// Request Tracing Middleware (must be first)
console.log('Registering Request Tracing Middleware...');
app.use((req, res, next) => {
  console.log(`[REQUEST TRACE] Method: ${req.method} | Url: ${req.originalUrl} | IP: ${req.ip} | Host: ${req.headers.host}`);
  next();
});
console.log('Request Tracing Middleware Registered.');

// Standard middlewares
console.log('Registering express.json middleware...');
app.use(express.json());
console.log('express.json middleware registered.');

console.log('Registering cors middleware...');
app.use(cors());
console.log('cors middleware registered.');

console.log('Registering compression middleware...');
app.use(compression());
console.log('compression middleware registered.');

console.log('Registering rateLimiter middleware on /api...');
app.use('/api', rateLimiter);
console.log('rateLimiter middleware registered.');

// Configure Helmet securely, permitting static PDF access
console.log('Registering helmet middleware...');
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
console.log('helmet middleware registered.');

// API Request Logging
console.log('Registering morgan middleware...');
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}
console.log('morgan middleware registered.');

// Serve uploaded resumes statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Registering /uploads static route...');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('/uploads static route registered.');

// Core API endpoints routing registration
console.log('Registering Core API routes...');
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
console.log('Core API routes registered.');

// Health check route for Railway container metrics
console.log('Registering /health route...');
app.get('/health', (req, res) => {
  console.log('[HEALTH ENDPOINT HIT]');
  try {
    const healthPayload = {
      status: 'ok',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      gemini: isAiEngineActive() ? 'initialized' : 'fallback',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    };
    console.log('[HEALTH RESPONSE PAYLOAD]', JSON.stringify(healthPayload));
    res.json(healthPayload);
  } catch (error) {
    console.error('[HEALTH ENDPOINT ERROR]', error.stack || error);
    res.status(500).json({ error: error.message });
  }
});
console.log('/health route registered.');

// Landing route check
console.log('Registering root / route...');
app.get('/', (req, res) => {
  console.log('[ROOT ENDPOINT HIT]');
  res.json({ message: 'AI Interview Prep API is running securely...' });
});
console.log('root / route registered.');

// Centralized error boundary middlewares
console.log('Registering error boundary handlers...');
app.use(notFound);
app.use(errorHandler);
console.log('error boundary handlers registered.');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server executing securely in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during MongoDB connection close:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if connections hang
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch-all runtime stability handlers
process.on('uncaughtException', (err) => {
  console.error('❌ CRITICAL UNCAUGHT EXCEPTION:', err.stack || err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

