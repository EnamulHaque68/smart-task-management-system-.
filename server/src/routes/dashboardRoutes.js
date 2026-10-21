import { Router } from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Protect dashboard route - requires valid JWT authentication
router.use(authenticate);

// GET /api/dashboard
router.get('/', getDashboardSummary);

export default router;
