import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  seedTasks,
} from '../controllers/taskController.js';

const router = express.Router();

// Stats and Seeder routes (must come before /:id)
router.get('/stats', getTaskStats);
router.post('/seed', seedTasks);

// Main CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default router;
