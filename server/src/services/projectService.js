import { query } from '../config/db.js';

// Get all projects for an authenticated user with task counts and progress
export const getProjects = async (userId, filters = {}) => {
  const { status, priority, search, sortBy = 'created_at', order = 'DESC' } = filters;

  let sql = `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.status,
      p.priority,
      p.due_date,
      p.user_id,
      p.created_at,
      p.updated_at,
      COUNT(t.id)::int AS total_tasks,
      COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::int AS completed_tasks,
      CASE 
        WHEN COUNT(t.id) > 0 THEN ROUND((COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::numeric / COUNT(t.id)::numeric) * 100)
        ELSE 0 
      END::int AS progress_percentage
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE p.user_id = $1
  `;

  const params = [userId];
  let paramIndex = 2;

  // Filter by status
  if (status) {
    sql += ` AND p.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  // Filter by priority
  if (priority) {
    sql += ` AND p.priority = $${paramIndex}`;
    params.push(priority);
    paramIndex++;
  }

  // Search by title or description
  if (search) {
    sql += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  sql += ` GROUP BY p.id`;

  // Safe sorting
  const allowedSortCols = ['created_at', 'title', 'due_date', 'priority', 'status'];
  const sortCol = allowedSortCols.includes(sortBy) ? `p.${sortBy}` : 'p.created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  sql += ` ORDER BY ${sortCol} ${sortOrder};`;

  const result = await query(sql, params);
  return result.rows;
};

// Get a single project by ID with ownership verification and associated tasks
export const getProjectById = async (projectId, userId) => {
  const projectSql = `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.status,
      p.priority,
      p.due_date,
      p.user_id,
      p.created_at,
      p.updated_at,
      COUNT(t.id)::int AS total_tasks,
      COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::int AS completed_tasks,
      CASE 
        WHEN COUNT(t.id) > 0 THEN ROUND((COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::numeric / COUNT(t.id)::numeric) * 100)
        ELSE 0 
      END::int AS progress_percentage
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE p.id = $1
    GROUP BY p.id;
  `;

  const result = await query(projectSql, [projectId]);

  if (result.rowCount === 0) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const project = result.rows[0];

  // Enforce ownership: reject unauthorized users
  if (project.user_id !== userId) {
    const error = new Error('Forbidden: You are not authorized to view this project');
    error.statusCode = 403;
    throw error;
  }

  // Fetch project tasks for detailed view
  const tasksSql = `
    SELECT 
      t.id,
      t.project_id,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.assigned_to,
      t.assignee_name,
      t.assignee_avatar,
      t.checklist,
      t.depends_on_task_id,
      t.due_date,
      t.created_at,
      t.updated_at
    FROM tasks t
    WHERE t.project_id = $1
    ORDER BY t.created_at ASC;
  `;

  const tasksResult = await query(tasksSql, [projectId]);
  project.tasks = tasksResult.rows;

  return project;
};

// Create a new project for the authenticated user
export const createProject = async (userId, projectData) => {
  const { title, description, status = 'In Progress', priority = 'Medium', due_date = null } = projectData;

  const insertSql = `
    INSERT INTO projects (title, description, status, priority, due_date, user_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, title, description, status, priority, due_date, user_id, created_at, updated_at;
  `;

  const result = await query(insertSql, [
    title.trim(),
    description ? description.trim() : null,
    status,
    priority,
    due_date || null,
    userId,
  ]);

  const newProject = result.rows[0];
  newProject.total_tasks = 0;
  newProject.completed_tasks = 0;
  newProject.progress_percentage = 0;

  return newProject;
};

// Update an existing project with ownership verification
export const updateProject = async (projectId, userId, updateData) => {
  // First verify existence and ownership
  const checkRes = await query('SELECT user_id FROM projects WHERE id = $1', [projectId]);

  if (checkRes.rowCount === 0) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (checkRes.rows[0].user_id !== userId) {
    const error = new Error('Forbidden: You are not authorized to update this project');
    error.statusCode = 403;
    throw error;
  }

  const { title, description, status, priority, due_date } = updateData;

  const updateSql = `
    UPDATE projects
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      priority = COALESCE($4, priority),
      due_date = COALESCE($5, due_date),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND user_id = $7
    RETURNING id, title, description, status, priority, due_date, user_id, created_at, updated_at;
  `;

  const result = await query(updateSql, [
    title !== undefined ? title.trim() : null,
    description !== undefined ? (description ? description.trim() : null) : null,
    status || null,
    priority || null,
    due_date !== undefined ? (due_date || null) : null,
    projectId,
    userId,
  ]);

  return result.rows[0];
};

// Delete a project with ownership verification and safe task handling
export const deleteProject = async (projectId, userId) => {
  // Check existence and ownership
  const checkRes = await query('SELECT user_id, title FROM projects WHERE id = $1', [projectId]);

  if (checkRes.rowCount === 0) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (checkRes.rows[0].user_id !== userId) {
    const error = new Error('Forbidden: You are not authorized to delete this project');
    error.statusCode = 403;
    throw error;
  }

  // Count tasks before deletion for safe reporting
  const taskCountRes = await query('SELECT COUNT(*)::int AS count FROM tasks WHERE project_id = $1', [projectId]);
  const deletedTasksCount = taskCountRes.rows[0].count;

  // Delete project (cascade deletes tasks automatically per foreign key constraint)
  await query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [projectId, userId]);

  return {
    projectId,
    projectTitle: checkRes.rows[0].title,
    deletedTasksCount,
  };
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
