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
  const defaultPrefs = {
    email_notifications: true,
    task_assigned_alert: true,
    due_date_reminders: true,
    timezone: 'Asia/Dhaka',
    date_format: 'YYYY-MM-DD',
    language: 'en',
    theme: 'light',
  };

  const insertRes = await query(
    `INSERT INTO users (name, email, password, avatar_color, role, phone, job_title, preferences)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, name, email, avatar_color, role, phone, job_title, preferences, created_at;`,
    [name.trim(), normalizedEmail, hashedPassword, avatarColor, 'user', '', 'Team Member', defaultPrefs]
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
    `SELECT id, name, email, password, avatar_color, role, phone, job_title, preferences, avatar_url, created_at 
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
    `SELECT id, name, email, avatar_color, role, phone, job_title, preferences, avatar_url, created_at, updated_at 
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

// Update User Profile & Preferences
export const updateProfile = async (userId, data) => {
  const { name, phone, job_title, avatar_color, avatar_url, preferences } = data;

  const userRes = await query('SELECT * FROM users WHERE id = $1', [userId]);
  if (userRes.rowCount === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  const current = userRes.rows[0];

  const updatedName = name !== undefined ? name.trim() : current.name;
  const updatedPhone = phone !== undefined ? phone.trim() : (current.phone || '');
  const updatedJobTitle = job_title !== undefined ? job_title.trim() : (current.job_title || 'Team Member');
  const updatedAvatarColor = avatar_color !== undefined ? avatar_color : current.avatar_color;
  const updatedAvatarUrl = avatar_url !== undefined ? avatar_url : (current.avatar_url || '/avatars/alex_morgan.jpg');

  let mergedPreferences = current.preferences || {};
  if (preferences) {
    const parsed = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;
    mergedPreferences = { ...mergedPreferences, ...parsed };
  }

  const result = await query(
    `UPDATE users 
     SET name = $1, phone = $2, job_title = $3, avatar_color = $4, avatar_url = $5, preferences = $6, updated_at = NOW()
     WHERE id = $7
     RETURNING id, name, email, avatar_color, role, phone, job_title, preferences, avatar_url, created_at, updated_at;`,
    [updatedName, updatedPhone, updatedJobTitle, updatedAvatarColor, updatedAvatarUrl, mergedPreferences, userId]
  );

  return result.rows[0];
};

// Change Password Service
export const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    const error = new Error('Current password and new password are required');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error('New password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  const userRes = await query('SELECT password FROM users WHERE id = $1', [userId]);
  if (userRes.rowCount === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const user = userRes.rows[0];
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashedPassword, userId]);

  return { message: 'Password updated successfully' };
};

// Reset Password by Email (Forgot Password feature)
export const resetPasswordByEmail = async ({ email, newPassword }) => {
  if (!email || !newPassword) {
    const error = new Error('Email and new password are required');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error('New password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const userRes = await query('SELECT id, name FROM users WHERE email = $1', [normalizedEmail]);

  if (userRes.rowCount === 0) {
    const error = new Error('No user account found with this email address');
    error.statusCode = 404;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await query('UPDATE users SET password = $1, updated_at = NOW() WHERE email = $2', [
    hashedPassword,
    normalizedEmail,
  ]);

  return { message: 'Password reset successful! You can now log in with your new password.' };
};

// Get All Users (for task assignment)
export const getAllUsers = async () => {
  const result = await query(
    `SELECT id, name, email, avatar_color, role, phone, job_title, created_at 
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
  updateProfile,
  changePassword,
  resetPasswordByEmail,
  getAllUsers,
};
