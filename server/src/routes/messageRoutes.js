import { Router } from 'express';
import { getAllMessages, sendMessage } from '../controllers/messageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all message routes with JWT authentication
router.use(authenticate);

router.get('/', getAllMessages);
router.post('/', sendMessage);

export default router;
