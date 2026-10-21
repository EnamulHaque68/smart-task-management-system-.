import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import {
  createTaskValidationRules,
  updateTaskValidationRules,
  taskIdParamValidation,
  validate,
} from '../middleware/validateMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all task endpoints - requires valid JWT authentication
router.use(authenticate);

// Task Endpoints
router.get('/', getAllTasks);
router.post('/', createTaskValidationRules, validate, createTask);
router.get('/:id', taskIdParamValidation, validate, getTaskById);
router.put('/:id', updateTaskValidationRules, validate, updateTask);
router.delete('/:id', taskIdParamValidation, validate, deleteTask);

export default router;
