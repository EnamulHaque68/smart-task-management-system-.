import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Security HTTP Headers
app.use(helmet());

// Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Status Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Bright Mind Ltd - Smart Task & Project Management API',
    version: '1.0.0',
    status: 'online',
    healthCheck: '/api/health',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      tasks: '/api/tasks',
      dashboard: '/api/dashboard',
      messages: '/api/messages',
    },
  });
});

// Mount Application Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
