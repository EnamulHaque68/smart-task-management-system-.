import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  createProjectValidationRules,
  updateProjectValidationRules,
  projectIdParamValidation,
  validate,
} from '../middleware/validateMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all project endpoints - requires valid JWT authentication
router.use(authenticate);

// Project Endpoints
router.get('/', getAllProjects);
router.post('/', createProjectValidationRules, validate, createProject);
router.get('/:id', projectIdParamValidation, validate, getProjectById);
router.put('/:id', updateProjectValidationRules, validate, updateProject);
router.delete('/:id', projectIdParamValidation, validate, deleteProject);

export default router;
