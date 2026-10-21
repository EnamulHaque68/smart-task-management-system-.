import { body, param, query, validationResult } from 'express-validator';

// Middleware to extract validation results and format standard error response
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed for one or more fields',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// -----------------------------------------------------------------------------
// Authentication Validation Rules
// -----------------------------------------------------------------------------
export const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// -----------------------------------------------------------------------------
// Project Validation Rules
// -----------------------------------------------------------------------------
export const createProjectValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Project title must be between 3 and 200 characters long'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional()
    .isIn(['Not Started', 'In Progress', 'Completed', 'At Risk'])
    .withMessage("Status must be one of: 'Not Started', 'In Progress', 'Completed', 'At Risk'"),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage("Priority must be one of: 'Low', 'Medium', 'High'"),

  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date in YYYY-MM-DD format'),
];

export const updateProjectValidationRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Project title must be between 3 and 200 characters long'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional()
    .isIn(['Not Started', 'In Progress', 'Completed', 'At Risk'])
    .withMessage("Status must be one of: 'Not Started', 'In Progress', 'Completed', 'At Risk'"),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage("Priority must be one of: 'Low', 'Medium', 'High'"),

  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date in YYYY-MM-DD format'),
];

export const projectIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a positive integer'),
];

// -----------------------------------------------------------------------------
// Task Validation Rules
// -----------------------------------------------------------------------------
export const createTaskValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 255 })
    .withMessage('Task title must be between 2 and 255 characters long'),

  body('projectId')
    .custom((val, { req }) => {
      const pid = val || req.body.project_id;
      if (!pid || isNaN(parseInt(pid, 10)) || parseInt(pid, 10) < 1) {
        throw new Error('Valid project ID is required');
      }
      return true;
    }),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Completed'])
    .withMessage("Status must be one of: 'To Do', 'In Progress', 'Completed'"),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage("Priority must be one of: 'Low', 'Medium', 'High'"),

  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date in YYYY-MM-DD format'),

  body('assigned_to')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Assigned user ID must be a positive integer'),

  body('assigneeId')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Assignee ID must be a positive integer'),
];

export const updateTaskValidationRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Task title must be between 2 and 255 characters long'),

  body('description')
    .optional({ nullable: true })
    .trim(),

  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Completed'])
    .withMessage("Status must be one of: 'To Do', 'In Progress', 'Completed'"),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage("Priority must be one of: 'Low', 'Medium', 'High'"),

  body('due_date')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Due date must be a valid date in YYYY-MM-DD format'),
];

export const taskIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Task ID must be a positive integer'),
];

export default {
  validate,
  registerValidationRules,
  loginValidationRules,
  createProjectValidationRules,
  updateProjectValidationRules,
  projectIdParamValidation,
  createTaskValidationRules,
  updateTaskValidationRules,
  taskIdParamValidation,
};
