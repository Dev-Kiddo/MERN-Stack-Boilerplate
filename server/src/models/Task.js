import mongoose from 'mongoose';

/**
 * Task Schema
 * Defines the structure for task items in the practice MERN application
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Task = mongoose.model('Task', taskSchema);
