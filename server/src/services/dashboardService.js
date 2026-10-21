import { query } from '../config/db.js';

// Get aggregated dashboard metrics and analytics for authenticated user
export const getDashboardMetrics = async (userId) => {
  // Check if user owns personal projects; if not, fall back to organization projects (user_id = 1)
  const countRes = await query('SELECT COUNT(*)::int AS cnt FROM projects WHERE user_id = $1', [userId]);
  const hasOwnProjects = (countRes.rows[0]?.cnt || 0) > 0;
  const targetUserId = hasOwnProjects ? userId : 1;

  // 1. Projects Statistics Query
  const projectsSql = `
    SELECT 
      COUNT(*)::int AS total_projects,
      COUNT(CASE WHEN status = 'In Progress' THEN 1 END)::int AS active_projects,
      COUNT(CASE WHEN status = 'Completed' THEN 1 END)::int AS completed_projects,
      COUNT(CASE WHEN status = 'Not Started' THEN 1 END)::int AS not_started_projects,
      COUNT(CASE WHEN status = 'At Risk' THEN 1 END)::int AS at_risk_projects
    FROM projects
    WHERE user_id = $1;
  `;

  // 2. Tasks Statistics Query (Scoped to projects owned by user)
  // Pending tasks: all tasks not completed (status != 'Completed')
  // Overdue tasks: due_date is set, due_date < CURRENT_DATE, and task is not completed
  const tasksSql = `
    SELECT 
      COUNT(t.id)::int AS total_tasks,
      COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::int AS completed_tasks,
      COUNT(CASE WHEN t.status != 'Completed' THEN 1 END)::int AS pending_tasks,
      COUNT(CASE 
        WHEN t.due_date IS NOT NULL AND t.due_date < CURRENT_DATE AND t.status != 'Completed' THEN 1 
      END)::int AS overdue_tasks,
      COUNT(CASE WHEN t.status = 'To Do' THEN 1 END)::int AS todo_tasks,
      COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END)::int AS in_progress_tasks,
      COUNT(CASE WHEN t.priority = 'High' THEN 1 END)::int AS high_priority_tasks,
      COUNT(CASE WHEN t.priority = 'Medium' THEN 1 END)::int AS medium_priority_tasks,
      COUNT(CASE WHEN t.priority = 'Low' THEN 1 END)::int AS low_priority_tasks
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    WHERE p.user_id = $1;
  `;

  // 3. Recent Projects with Progress Percentage
  const recentProjectsSql = `
    SELECT 
      p.id,
      p.title,
      p.status,
      p.priority,
      p.due_date,
      COUNT(t.id)::int AS total_tasks,
      COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::int AS completed_tasks,
      CASE 
        WHEN COUNT(t.id) > 0 THEN ROUND((COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::numeric / COUNT(t.id)::numeric) * 100)
        ELSE 0 
      END::int AS progress_percentage
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE p.user_id = $1
    GROUP BY p.id
    ORDER BY p.updated_at DESC
    LIMIT 6;
  `;

  // 4. Priority / Urgent Pending Tasks
  const pendingTasksSql = `
    SELECT 
      t.id,
      t.project_id,
      p.title AS project_title,
      t.title,
      t.status,
      t.priority,
      t.assignee_name,
      t.assignee_avatar,
      t.due_date,
      CASE 
        WHEN t.due_date IS NOT NULL AND t.due_date < CURRENT_DATE AND t.status != 'Completed' THEN true 
        ELSE false 
      END AS is_overdue
    FROM tasks t
    INNER JOIN projects p ON t.project_id = p.id
    WHERE p.user_id = $1 AND t.status != 'Completed'
    ORDER BY 
      CASE WHEN t.due_date IS NOT NULL AND t.due_date < CURRENT_DATE THEN 0 ELSE 1 END,
      t.due_date ASC NULLS LAST,
      t.created_at DESC
    LIMIT 5;
  `;

  // Execute all queries in parallel with parameterized targetUserId
  const [projectsRes, tasksRes, recentProjectsRes, pendingTasksRes] = await Promise.all([
    query(projectsSql, [targetUserId]),
    query(tasksSql, [targetUserId]),
    query(recentProjectsSql, [targetUserId]),
    query(pendingTasksSql, [targetUserId]),
  ]);

  const pStats = projectsRes.rows[0];
  const tStats = tasksRes.rows[0];

  const totalTasks = tStats.total_tasks || 0;
  const completedTasks = tStats.completed_tasks || 0;
  const pendingTasks = tStats.pending_tasks || 0;
  const overdueTasks = tStats.overdue_tasks || 0;

  // Safe progress percentage calculation (handles 0 total tasks without NaN)
  const overallProgress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return {
    summary: {
      totalProjects: pStats.total_projects || 0,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      overallProgress,
    },
    projectsSummary: {
      total: pStats.total_projects || 0,
      active: pStats.active_projects || 0,
      completed: pStats.completed_projects || 0,
      notStarted: pStats.not_started_projects || 0,
      atRisk: pStats.at_risk_projects || 0,
    },
    tasksSummary: {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      overdue: overdueTasks,
      byStatus: {
        toDo: tStats.todo_tasks || 0,
        inProgress: tStats.in_progress_tasks || 0,
        completed: completedTasks,
      },
      byPriority: {
        high: tStats.high_priority_tasks || 0,
        medium: tStats.medium_priority_tasks || 0,
        low: tStats.low_priority_tasks || 0,
      },
    },
    recentProjects: recentProjectsRes.rows,
    urgentTasks: pendingTasksRes.rows,
  };
};

export default {
  getDashboardMetrics,
};
