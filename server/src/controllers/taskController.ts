import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task, ITask } from '../models/Task.js';

const checkDBReady = (): boolean => {
  return mongoose.connection.readyState === 1;
};

interface GetTasksQuery {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * @desc    Get all tasks with optional search, status, and priority filters
 * @route   GET /api/tasks
 */
export const getTasks = async (
  req: Request<{}, {}, {}, GetTasksQuery>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Please verify your connection string in server/.env or start MongoDB.',
        data: [],
      });
      return;
    }

    const { search, status, priority, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query: mongoose.FilterQuery<ITask> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status as any;
    }

    if (priority && priority !== 'all') {
      query.priority = priority as any;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 */
export const getTaskById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected.',
      });
      return;
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: `Task with id ${req.params.id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
export const createTask = async (
  req: Request<{}, {}, Partial<ITask>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Cannot save task.',
      });
      return;
    }

    const { title, description, status, priority, category, dueDate } = req.body;

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      category,
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a task by ID
 * @route   PUT /api/tasks/:id
 */
export const updateTask = async (
  req: Request<{ id: string }, {}, Partial<ITask>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected.',
      });
      return;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: `Task with id ${req.params.id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task by ID
 * @route   DELETE /api/tasks/:id
 */
export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected.',
      });
      return;
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: `Task with id ${req.params.id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task statistics for dashboard summary
 * @route   GET /api/tasks/stats
 */
export const getTaskStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(200).json({
        success: true,
        data: {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          dbConnected: false,
        },
      });
      return;
    }

    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'pending' });
    const inProgress = await Task.countDocuments({ status: 'in-progress' });
    const completed = await Task.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        dbConnected: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed sample tasks for initial practice
 * @route   POST /api/tasks/seed
 */
export const seedTasks = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!checkDBReady()) {
      res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Cannot seed data.',
      });
      return;
    }

    const sampleTasks = [
      {
        title: 'Set up local MongoDB or Atlas cluster',
        description: 'Verify your MongoDB connection string in the server/.env file.',
        status: 'completed' as const,
        priority: 'high' as const,
        category: 'DevOps',
      },
      {
        title: 'Explore Express REST API Endpoints',
        description: 'Test the GET, POST, PUT, DELETE routes using Postman, Thunder Client, or the frontend UI.',
        status: 'in-progress' as const,
        priority: 'medium' as const,
        category: 'Backend',
      },
      {
        title: 'Customize Tailwind CSS v4 styling',
        description: 'Experiment with Tailwind utility classes and responsive layouts in client/src/components.',
        status: 'pending' as const,
        priority: 'low' as const,
        category: 'Frontend',
      },
      {
        title: 'Practice adding a new MERN feature',
        description: 'Try adding user authentication, tags, or file uploads to expand your full-stack skills.',
        status: 'pending' as const,
        priority: 'high' as const,
        category: 'FullStack',
      },
    ];

    await Task.deleteMany({});
    const inserted = await Task.insertMany(sampleTasks);

    res.status(201).json({
      success: true,
      message: `Database seeded with ${inserted.length} practice tasks`,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
