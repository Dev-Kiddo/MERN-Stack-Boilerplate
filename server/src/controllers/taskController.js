import mongoose from 'mongoose';
import { Task } from '../models/Task.js';

// Helper to check if MongoDB is ready
const checkDBReady = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * @desc    Get all tasks with optional search, status, and priority filters
 * @route   GET /api/tasks
 */
export const getTasks = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Please verify your connection string in server/.env or start MongoDB.',
        data: [],
      });
    }

    const { search, status, priority, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    const sortOptions = {};
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
export const getTaskById = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected.',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${req.params.id} not found`,
      });
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
export const createTask = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Cannot save task.',
      });
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
export const updateTask = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected.',
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${req.params.id} not found`,
      });
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
export const deleteTask = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected.',
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with id ${req.params.id} not found`,
      });
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
export const getTaskStats = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(200).json({
        success: true,
        data: {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          dbConnected: false,
        },
      });
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
export const seedTasks = async (req, res, next) => {
  try {
    if (!checkDBReady()) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB is currently disconnected. Cannot seed data.',
      });
    }

    const sampleTasks = [
      {
        title: 'Set up local MongoDB or Atlas cluster',
        description: 'Verify your MongoDB connection string in the server/.env file.',
        status: 'completed',
        priority: 'high',
        category: 'DevOps',
      },
      {
        title: 'Explore Express REST API Endpoints',
        description: 'Test the GET, POST, PUT, DELETE routes using Postman, Thunder Client, or the frontend UI.',
        status: 'in-progress',
        priority: 'medium',
        category: 'Backend',
      },
      {
        title: 'Customize Tailwind CSS v4 styling',
        description: 'Experiment with Tailwind utility classes and responsive layouts in client/src/components.',
        status: 'pending',
        priority: 'low',
        category: 'Frontend',
      },
      {
        title: 'Practice adding a new MERN feature',
        description: 'Try adding user authentication, tags, or file uploads to expand your full-stack skills.',
        status: 'pending',
        priority: 'high',
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
