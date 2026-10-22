import { Router } from 'express';
import { register, login, getMe, getUsers, updateProfile, changePassword } from '../controllers/authController.js';
import { registerValidationRules, loginValidationRules, validate } from '../middleware/validateMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public Authentication Endpoints
router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);

// Protected Authentication & Profile Endpoints
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getUsers);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
