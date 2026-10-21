import { Router } from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController.js';
import { registerValidationRules, loginValidationRules, validate } from '../middleware/validateMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public Authentication Endpoints
router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);

// Protected Authentication Endpoints
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getUsers);

export default router;
