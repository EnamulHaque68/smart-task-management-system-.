import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Authorization header starting with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No authentication token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Malformed authentication token.',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'bright_mind_task_secret_key_2026_super_secure'
    );

    // Verify user still exists in database
    const userRes = await query(
      `SELECT id, name, email, avatar_color, role, phone, job_title, preferences, avatar_url, created_at 
       FROM users 
       WHERE id = $1;`,
      [decoded.id]
    );

    if (userRes.rowCount === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'User belonging to this token no longer exists.',
      });
    }

    // Attach authenticated user to request object
    req.user = userRes.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authentication token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token has expired. Please log in again.',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to authenticate user.',
    });
  }
};

export default {
  authenticate,
};
