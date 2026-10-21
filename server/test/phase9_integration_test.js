import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'http://localhost:5000/api';

// PostgreSQL Direct Pool for ground truth verification
const { Pool } = pg;
const dbPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'bright_mind_db',
});

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} ${details ? `(${details})` : ''}`);
    failedCount++;
  }
}

async function request(urlPath, options = {}) {
  const url = `${BASE_URL}${urlPath}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  return { status: res.status, data };
}

async function runTests() {
  console.log('\n===============================================================');
  console.log('🚀 BRIGHT MIND TASKFLOW - PHASE 9 INTEGRATION TEST SUITE');
  console.log('===============================================================\n');

  const randomSuffix = Date.now().toString().slice(-5);
  const testEmailA = `test_user_a_${randomSuffix}@brightmind.com`;
  const testEmailB = `test_user_b_${randomSuffix}@brightmind.com`;
  const testPassword = 'Password@123';

  let tokenA = null;
  let userAId = null;
  let tokenB = null;
  let userBId = null;
  let createdProjectId = null;
  let createdTaskId = null;

  // ---------------------------------------------------------------------------
  // 1. Registration and Login
  // ---------------------------------------------------------------------------
  console.log('--- 1. Testing Registration and Login ---');
  {
    // Register User A
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Test User A', email: testEmailA, password: testPassword },
    });
    assert(regRes.status === 201 && regRes.data?.data?.token, 'Register User A returns HTTP 201 + JWT');
    tokenA = regRes.data?.data?.token;
    userAId = regRes.data?.data?.user?.id;

    // Login User A
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmailA, password: testPassword },
    });
    assert(loginRes.status === 200 && loginRes.data?.data?.token, 'Login User A returns HTTP 200 + token');

    // Register User B (for cross-user isolation tests)
    const regResB = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Test User B', email: testEmailB, password: testPassword },
    });
    tokenB = regResB.data?.data?.token;
    userBId = regResB.data?.data?.user?.id;
    assert(regResB.status === 201, 'Register User B returns HTTP 201');
  }

  // ---------------------------------------------------------------------------
  // 2. Password Validation and Duplicate Emails
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Testing Password Validation and Duplicate Emails ---');
  {
    // Password too short (< 6 chars)
    const shortPassRes = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Short Pass', email: `short_${randomSuffix}@test.com`, password: '123' },
    });
    assert(shortPassRes.status === 400, 'Register with short password rejected with HTTP 400');

    // Duplicate email
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Duplicate User', email: testEmailA, password: testPassword },
    });
    assert(dupRes.status === 409, 'Register with duplicate email rejected with HTTP 409 Conflict');

    // Wrong password login
    const wrongPassRes = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmailA, password: 'WrongPassword' },
    });
    assert(wrongPassRes.status === 401, 'Login with incorrect password rejected with HTTP 401');
  }

  // ---------------------------------------------------------------------------
  // 3. Missing or Invalid JWT
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Testing Missing or Invalid JWT Authentication ---');
  {
    // Missing JWT
    const noTokenRes = await request('/projects');
    assert(noTokenRes.status === 401, 'Request to protected /api/projects without token rejected with HTTP 401');

    // Malformed / Invalid JWT
    const badTokenRes = await request('/projects', {
      headers: { Authorization: 'Bearer this.is.an.invalid.jwt.token' },
    });
    assert(badTokenRes.status === 401, 'Request with malformed token rejected with HTTP 401');
  }

  // ---------------------------------------------------------------------------
  // 4. Project CRUD
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Testing Project CRUD ---');
  {
    // Create Project
    const createProjRes = await request('/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        title: 'Phase 9 Test Project',
        description: 'Automated test project verification',
        status: 'In Progress',
        priority: 'High',
        due_date: '2026-12-31',
      },
    });
    assert(createProjRes.status === 201, 'Create project returns HTTP 201');
    createdProjectId = createProjRes.data?.data?.project?.id;

    // Read all projects for User A
    const listProjRes = await request('/projects', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      listProjRes.status === 200 && listProjRes.data?.data?.projects?.some((p) => p.id === createdProjectId),
      'List projects returns HTTP 200 and includes created project'
    );

    // Read project by ID
    const getProjRes = await request(`/projects/${createdProjectId}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(getProjRes.status === 200 && getProjRes.data?.data?.project?.title === 'Phase 9 Test Project', 'Get project by ID returns HTTP 200 with correct data');

    // Update project
    const updateProjRes = await request(`/projects/${createdProjectId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        title: 'Updated Phase 9 Test Project',
        priority: 'Medium',
      },
    });
    assert(
      updateProjRes.status === 200 && updateProjRes.data?.data?.project?.title === 'Updated Phase 9 Test Project',
      'Update project returns HTTP 200 with updated fields'
    );
  }

  // ---------------------------------------------------------------------------
  // 5. Task CRUD
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Testing Task CRUD ---');
  {
    // Create Task
    const createTaskRes = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        projectId: createdProjectId,
        title: 'Integration Verification Task',
        description: 'Testing task CRUD and dependencies',
        status: 'To Do',
        priority: 'High',
        due_date: '2026-11-15',
        checklist: [{ id: 1, text: 'Run tests', done: true }],
      },
    });
    assert(createTaskRes.status === 201, 'Create task returns HTTP 201');
    createdTaskId = createTaskRes.data?.data?.task?.id;

    // Read task by ID
    const getTaskRes = await request(`/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(getTaskRes.status === 200 && getTaskRes.data?.data?.task?.title === 'Integration Verification Task', 'Get task by ID returns HTTP 200');

    // Update task status and priority
    const updateTaskRes = await request(`/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        status: 'In Progress',
        priority: 'Medium',
      },
    });
    assert(
      updateTaskRes.status === 200 && updateTaskRes.data?.data?.task?.status === 'In Progress',
      'Update task status to "In Progress" returns HTTP 200'
    );
  }

  // ---------------------------------------------------------------------------
  // 6. Status and Priority Validation
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Testing Status and Priority Validation ---');
  {
    // Invalid project status
    const badProjStatus = await request('/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: { title: 'Invalid Status Project', status: 'FakeStatus' },
    });
    assert(badProjStatus.status === 400, 'Invalid project status rejected with HTTP 400');

    // Invalid task priority
    const badTaskPriority = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: { projectId: createdProjectId, title: 'Invalid Priority Task', priority: 'UrgentSuper' },
    });
    assert(badTaskPriority.status === 400, 'Invalid task priority rejected with HTTP 400');

    // Invalid task status
    const badTaskStatus = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: { projectId: createdProjectId, title: 'Invalid Task Status', status: 'Archived' },
    });
    assert(badTaskStatus.status === 400, 'Invalid task status rejected with HTTP 400');
  }

  // ---------------------------------------------------------------------------
  // 7. Project, Status, Priority, and Assignee Filters
  // ---------------------------------------------------------------------------
  console.log('\n--- 7. Testing Task Query Filters ---');
  {
    // Filter by projectId
    const filterProj = await request(`/tasks?projectId=${createdProjectId}`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      filterProj.status === 200 && filterProj.data?.data?.tasks?.every((t) => t.project_id === createdProjectId),
      'Filter tasks by projectId returns only matching tasks'
    );

    // Filter by status
    const filterStatus = await request('/tasks?status=In Progress', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      filterStatus.status === 200 && filterStatus.data?.data?.tasks?.every((t) => t.status === 'In Progress'),
      'Filter tasks by status returns only "In Progress" tasks'
    );

    // Filter by priority
    const filterPriority = await request('/tasks?priority=Medium', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      filterPriority.status === 200 && filterPriority.data?.data?.tasks?.every((t) => t.priority === 'Medium'),
      'Filter tasks by priority returns only "Medium" priority tasks'
    );

    // Search query
    const filterSearch = await request('/tasks?search=Integration Verification', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      filterSearch.status === 200 && filterSearch.data?.data?.tasks?.length >= 1,
      'Filter tasks by search keyword returns matching tasks'
    );
  }

  // ---------------------------------------------------------------------------
  // 8. Overdue Task Calculation & Database Number Matching
  // ---------------------------------------------------------------------------
  console.log('\n--- 8. Testing Overdue Task Calculation & Dashboard Data Match ---');
  {
    // Create an overdue task (due date in the past)
    const overdueTaskRes = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: {
        projectId: createdProjectId,
        title: 'Past Overdue Task',
        status: 'To Do',
        due_date: '2026-01-01',
      },
    });
    assert(overdueTaskRes.status === 201, 'Create task with past due date returns HTTP 201');

    // Fetch Dashboard API metrics for User A
    const dashRes = await request('/dashboard', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(dashRes.status === 200, 'GET /api/dashboard returns HTTP 200');

    const apiMetrics = dashRes.data?.data?.summary;

    // Verify against direct PostgreSQL query
    const dbProjectsRes = await dbPool.query('SELECT COUNT(*)::int AS count FROM projects WHERE user_id = $1', [userAId]);
    const dbTotalTasksRes = await dbPool.query(
      `SELECT COUNT(*)::int AS count 
       FROM tasks t 
       INNER JOIN projects p ON t.project_id = p.id 
       WHERE p.user_id = $1`,
      [userAId]
    );
    const dbOverdueRes = await dbPool.query(
      `SELECT COUNT(*)::int AS count 
       FROM tasks t 
       INNER JOIN projects p ON t.project_id = p.id 
       WHERE p.user_id = $1 
         AND t.status != 'Completed' 
         AND t.due_date IS NOT NULL 
         AND t.due_date < CURRENT_DATE`,
      [userAId]
    );

    const dbTotalProjects = dbProjectsRes.rows[0].count;
    const dbTotalTasks = dbTotalTasksRes.rows[0].count;
    const dbOverdueTasks = dbOverdueRes.rows[0].count;

    assert(
      apiMetrics.totalProjects === dbTotalProjects,
      `Dashboard totalProjects (${apiMetrics.totalProjects}) matches database (${dbTotalProjects})`
    );
    assert(
      apiMetrics.totalTasks === dbTotalTasks,
      `Dashboard totalTasks (${apiMetrics.totalTasks}) matches database (${dbTotalTasks})`
    );
    assert(
      apiMetrics.overdueTasks === dbOverdueTasks,
      `Dashboard overdueTasks (${apiMetrics.overdueTasks}) matches database calculation (${dbOverdueTasks})`
    );
  }

  // ---------------------------------------------------------------------------
  // 9. Unauthorized Access to Another User's Resources (Security & RBAC)
  // ---------------------------------------------------------------------------
  console.log("\n--- 9. Testing Cross-User Authorization (User B -> User A's Data) ---");
  {
    // User B tries to view User A's project
    const unauthorizedGetProj = await request(`/projects/${createdProjectId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(unauthorizedGetProj.status === 403, "User B cannot view User A's project (HTTP 403 Forbidden)");

    // User B tries to update User A's project
    const unauthorizedUpdateProj = await request(`/projects/${createdProjectId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: { title: 'Hacked Title' },
    });
    assert(unauthorizedUpdateProj.status === 403, "User B cannot update User A's project (HTTP 403 Forbidden)");

    // User B tries to create a task in User A's project
    const unauthorizedCreateTask = await request('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: { projectId: createdProjectId, title: 'Injected Task' },
    });
    assert(unauthorizedCreateTask.status === 403, "User B cannot create tasks in User A's project (HTTP 403 Forbidden)");

    // User B tries to update User A's task
    const unauthorizedUpdateTask = await request(`/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenB}` },
      body: { title: 'Tampered Task' },
    });
    assert(unauthorizedUpdateTask.status === 403, "User B cannot update User A's task (HTTP 403 Forbidden)");

    // User B tries to delete User A's project
    const unauthorizedDelProj = await request(`/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(unauthorizedDelProj.status === 403, "User B cannot delete User A's project (HTTP 403 Forbidden)");
  }

  // ---------------------------------------------------------------------------
  // 10. Invalid IDs and Missing Records
  // ---------------------------------------------------------------------------
  console.log('\n--- 10. Testing Invalid IDs and Missing Records ---');
  {
    // Non-numeric ID for project
    const nonNumericProj = await request('/projects/abc_invalid', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(nonNumericProj.status === 400, 'Non-numeric project ID rejected with HTTP 400');

    // Non-existent numeric ID for project
    const missingProj = await request('/projects/999999', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(missingProj.status === 404, 'Non-existent project ID returns HTTP 404 Not Found');

    // Non-numeric ID for task
    const nonNumericTask = await request('/tasks/xyz_invalid', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(nonNumericTask.status === 400, 'Non-numeric task ID rejected with HTTP 400');

    // Non-existent numeric ID for task
    const missingTask = await request('/tasks/999999', {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(missingTask.status === 404, 'Non-existent task ID returns HTTP 404 Not Found');
  }

  // ---------------------------------------------------------------------------
  // 11. PostgreSQL Connection Failures and Safe Error Handling
  // ---------------------------------------------------------------------------
  console.log('\n--- 11. Testing Health and Error Handling ---');
  {
    // GET /api/health
    const healthRes = await request('/health');
    assert(
      healthRes.status === 200 && healthRes.data?.database?.connected === true && healthRes.data?.database?.name === 'bright_mind_db',
      'GET /api/health returns HTTP 200 with database connected=true and database name "bright_mind_db"'
    );

    // 404 for unknown route
    const notFoundRes = await request('/unknown_non_existent_route');
    assert(notFoundRes.status === 404, 'Unknown endpoint returns HTTP 404 with clean JSON error');
  }

  // ---------------------------------------------------------------------------
  // Cleanup test resources
  // ---------------------------------------------------------------------------
  console.log('\n--- Cleaning up temporary test resources ---');
  {
    if (createdProjectId) {
      const delRes = await request(`/projects/${createdProjectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenA}` },
      });
      assert(delRes.status === 200, 'Clean up test project (cascades tasks)');
    }
  }

  // Close direct db pool
  await dbPool.end();

  console.log('\n===============================================================');
  console.log(`📊 TEST EXECUTION SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log('===============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
