import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

// Predefined vibrant avatar colors
const AVATAR_COLORS = [
  '#2563eb', // Blue
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#0d9488', // Teal
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#ef4444', // Red
];

// Helper to generate a random vibrant avatar color
const getRandomAvatarColor = () => {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
};

// Generate JWT Token
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'bright_mind_task_secret_key_2026_super_secure', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Register User Service
export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUserRes = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existingUserRes.rowCount > 0) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // Hash password securely with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const avatarColor = getRandomAvatarColor();

  // Insert new user
  const insertRes = await query(
    `INSERT INTO users (name, email, password, avatar_color, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, avatar_color, role, created_at;`,
    [name.trim(), normalizedEmail, hashedPassword, avatarColor, 'user']
  );

  const newUser = insertRes.rows[0];
  const token = generateToken(newUser);

  return {
    user: newUser,
    token,
  };
};

// Login User Service
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user by email
  const userRes = await query(
    `SELECT id, name, email, password, avatar_color, role, created_at 
     FROM users 
     WHERE email = $1;`,
    [normalizedEmail]
  );

  if (userRes.rowCount === 0) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  const user = userRes.rows[0];

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401; // Unauthorized
    throw error;
  }

  // Generate token
  const token = generateToken(user);

  // Return user without password
  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

// Get User Profile By ID
export const getUserById = async (id) => {
  const userRes = await query(
    `SELECT id, name, email, avatar_color, role, created_at 
     FROM users 
     WHERE id = $1;`,
    [id]
  );

  if (userRes.rowCount === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return userRes.rows[0];
};

// Get All Users (for task assignment)
export const getAllUsers = async () => {
  const result = await query(
    `SELECT id, name, email, avatar_color, role, created_at 
     FROM users 
     ORDER BY name ASC;`
  );
  return result.rows;
};

export default {
  generateToken,
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
};
