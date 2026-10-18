import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 MERN Practice API Server (TypeScript) is running!',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      taskStats: '/api/tasks/stats',
      seed: 'POST /api/tasks/seed',
    },
    version: '1.0.0',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} (TypeScript)`);
  console.log(`👉 API Health: http://localhost:${PORT}/api/health`);
  console.log(`👉 Tasks API: http://localhost:${PORT}/api/tasks`);
});
