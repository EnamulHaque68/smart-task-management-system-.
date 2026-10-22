import { query } from '../config/db.js';

// Get tasks for an authenticated user with advanced filters
export const getTasks = async (userId, filters = {}) => {
  const {
    projectId,
    status,
    priority,
    assigneeId,
    search,
    sortBy = 'created_at',
    order = 'DESC',
  } = filters;

  let sql = `
    SELECT 
      t.id,
      t.project_id,
      p.title AS project_title,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.assigned_to,
      COALESCE(u.name, t.assignee_name, 'Unassigned') AS assignee_name,
      COALESCE(u.avatar_color, t.assignee_avatar, '#6b7280') AS assignee_avatar,
      u.email AS assignee_email,
      t.checklist,
      t.depends_on_task_id,
      dt.title AS depends_on_task_title,
      t.due_date,
      t.created_at,
      t.updated_at
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN tasks dt ON t.depends_on_task_id = dt.id
    WHERE (p.user_id = $1 OR t.assigned_to = $1)
  `;

  const params = [userId];
  let paramIndex = 2;

  // Filter by Project
  const pId = projectId || filters.project_id;
  if (pId) {
    sql += ` AND t.project_id = $${paramIndex}`;
    params.push(parseInt(pId, 10));
    paramIndex++;
  }

  // Filter by Status
  if (status) {
    sql += ` AND t.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  // Filter by Priority
  if (priority) {
    sql += ` AND t.priority = $${paramIndex}`;
    params.push(priority);
    paramIndex++;
  }

  // Filter by Assignee
  const aId = assigneeId || filters.assigned_to;
  if (aId) {
    sql += ` AND t.assigned_to = $${paramIndex}`;
    params.push(parseInt(aId, 10));
    paramIndex++;
  }

  // Search keyword in title or description
  if (search) {
    sql += ` AND (t.title ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Safe sorting
  const allowedSortCols = ['created_at', 'title', 'due_date', 'priority', 'status'];
  const sortCol = allowedSortCols.includes(sortBy) ? `t.${sortBy}` : 't.created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  sql += ` ORDER BY ${sortCol} ${sortOrder};`;

  const result = await query(sql, params);
  return result.rows;
};

// Get a single task by ID with authorization check
export const getTaskById = async (taskId, userId) => {
  const sql = `
    SELECT 
      t.id,
      t.project_id,
      p.title AS project_title,
      p.user_id AS project_owner_id,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.assigned_to,
      COALESCE(u.name, t.assignee_name, 'Unassigned') AS assignee_name,
      COALESCE(u.avatar_color, t.assignee_avatar, '#6b7280') AS assignee_avatar,
      u.email AS assignee_email,
      t.checklist,
      t.depends_on_task_id,
      dt.title AS depends_on_task_title,
      t.due_date,
      t.created_at,
      t.updated_at
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN tasks dt ON t.depends_on_task_id = dt.id
    WHERE t.id = $1;
  `;

  const result = await query(sql, [taskId]);

  if (result.rowCount === 0) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const task = result.rows[0];

  // Authorization check: User must own the project OR be the assignee
  if (task.project_owner_id !== userId && task.assigned_to !== userId) {
    const error = new Error('Forbidden: You are not authorized to view this task');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

// Create a new task within a project owned by the user
export const createTask = async (userId, taskData) => {
  const {
    title,
    description,
    status = 'To Do',
    priority = 'Medium',
    due_date = null,
    checklist = [],
    depends_on_task_id = null,
  } = taskData;

  const projectId = taskData.project_id || taskData.projectId;
  const assignedTo = taskData.assigned_to || taskData.assigneeId || null;

  // 1. Verify project exists and user owns the project
  const projectRes = await query('SELECT id, user_id FROM projects WHERE id = $1', [projectId]);
  if (projectRes.rowCount === 0) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  if (projectRes.rows[0].user_id !== userId) {
    const error = new Error('Forbidden: You cannot create tasks in a project you do not own');
    error.statusCode = 403;
    throw error;
  }

  // 2. If assigned_to is provided, verify user exists and fetch name & avatar
  let assigneeName = 'Unassigned';
  let assigneeAvatar = '#6b7280';

  if (assignedTo) {
    const userRes = await query('SELECT id, name, avatar_color FROM users WHERE id = $1', [assignedTo]);
    if (userRes.rowCount === 0) {
      const error = new Error('Assigned user does not exist');
      error.statusCode = 400;
      throw error;
    }
    assigneeName = userRes.rows[0].name;
    assigneeAvatar = userRes.rows[0].avatar_color;
  }

  // 3. If depends_on_task_id is provided, verify it belongs to the same project
  if (depends_on_task_id) {
    const depRes = await query('SELECT id FROM tasks WHERE id = $1 AND project_id = $2', [
      depends_on_task_id,
      projectId,
    ]);
    if (depRes.rowCount === 0) {
      const error = new Error('Dependent task must exist within the same project');
      error.statusCode = 400;
      throw error;
    }
  }

  // 4. Insert task
  const insertSql = `
    INSERT INTO tasks (
      project_id, title, description, status, priority, 
      assigned_to, assignee_name, assignee_avatar, checklist, 
      depends_on_task_id, due_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  const result = await query(insertSql, [
    projectId,
    title.trim(),
    description ? description.trim() : null,
    status,
    priority,
    assignedTo,
    assigneeName,
    assigneeAvatar,
    JSON.stringify(Array.isArray(checklist) ? checklist : []),
    depends_on_task_id || null,
    due_date || null,
  ]);

  return result.rows[0];
};

// Update an existing task with authorization check
export const updateTask = async (taskId, userId, updateData) => {
  // 1. Fetch task and project owner
  const taskRes = await query(
    `SELECT t.*, p.user_id AS project_owner_id 
     FROM tasks t 
     INNER JOIN projects p ON t.project_id = p.id 
     WHERE t.id = $1;`,
    [taskId]
  );

  if (taskRes.rowCount === 0) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const existingTask = taskRes.rows[0];

  // Authorization check: User must own the project OR be the assigned user
  if (existingTask.project_owner_id !== userId && existingTask.assigned_to !== userId) {
    const error = new Error('Forbidden: You are not authorized to update this task');
    error.statusCode = 403;
    throw error;
  }

  const {
    title,
    description,
    status,
    priority,
    due_date,
    checklist,
    depends_on_task_id,
  } = updateData;

  const assignedTo = updateData.assigned_to !== undefined
    ? updateData.assigned_to
    : (updateData.assigneeId !== undefined ? updateData.assigneeId : undefined);

  let newAssigneeName = existingTask.assignee_name;
  let newAssigneeAvatar = existingTask.assignee_avatar;

  if (assignedTo !== undefined) {
    if (assignedTo === null) {
      newAssigneeName = 'Unassigned';
      newAssigneeAvatar = '#6b7280';
    } else {
      const userRes = await query('SELECT id, name, avatar_color FROM users WHERE id = $1', [assignedTo]);
      if (userRes.rowCount === 0) {
        const error = new Error('Assigned user does not exist');
        error.statusCode = 400;
        throw error;
      }
      newAssigneeName = userRes.rows[0].name;
      newAssigneeAvatar = userRes.rows[0].avatar_color;
    }
  }

  // If changing dependent task, verify existence
  if (depends_on_task_id) {
    if (depends_on_task_id === taskId) {
      const error = new Error('A task cannot depend on itself');
      error.statusCode = 400;
      throw error;
    }
    const depRes = await query('SELECT id FROM tasks WHERE id = $1 AND project_id = $2', [
      depends_on_task_id,
      existingTask.project_id,
    ]);
    if (depRes.rowCount === 0) {
      const error = new Error('Dependent task must exist within the same project');
      error.statusCode = 400;
      throw error;
    }
  }

  const updateSql = `
    UPDATE tasks
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      priority = COALESCE($4, priority),
      assigned_to = CASE WHEN $5::boolean THEN $6::integer ELSE assigned_to END,
      assignee_name = $7,
      assignee_avatar = $8,
      checklist = CASE WHEN $9::boolean THEN $10::jsonb ELSE checklist END,
      depends_on_task_id = CASE WHEN $11::boolean THEN $12::integer ELSE depends_on_task_id END,
      due_date = CASE WHEN $13::boolean THEN $14::date ELSE due_date END,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $15
    RETURNING *;
  `;

  const isAssignedUpdated = assignedTo !== undefined;
  const isChecklistUpdated = checklist !== undefined;
  const isDependsUpdated = depends_on_task_id !== undefined;
  const isDueDateUpdated = due_date !== undefined;

  const result = await query(updateSql, [
    title !== undefined ? title.trim() : null,
    description !== undefined ? (description ? description.trim() : null) : null,
    status || null,
    priority || null,
    isAssignedUpdated,
    assignedTo || null,
    newAssigneeName,
    newAssigneeAvatar,
    isChecklistUpdated,
    JSON.stringify(Array.isArray(checklist) ? checklist : []),
    isDependsUpdated,
    depends_on_task_id || null,
    isDueDateUpdated,
    due_date || null,
    taskId,
  ]);

  return result.rows[0];
};

// Delete a task with authorization check
export const deleteTask = async (taskId, userId) => {
  const taskRes = await query(
    `SELECT t.id, t.title, p.user_id AS project_owner_id 
     FROM tasks t 
     INNER JOIN projects p ON t.project_id = p.id 
     WHERE t.id = $1;`,
    [taskId]
  );

  if (taskRes.rowCount === 0) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const task = taskRes.rows[0];

  // Authorization: Only the project owner can delete tasks
  if (task.project_owner_id !== userId) {
    const error = new Error('Forbidden: Only the project owner can delete tasks');
    error.statusCode = 403;
    throw error;
  }

  await query('DELETE FROM tasks WHERE id = $1;', [taskId]);

  return {
    taskId,
    taskTitle: task.title,
  };
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
