# TaskFlow REST API Documentation
**Organization:** Bright Mind Ltd  
**Base URL:** `http://localhost:5000/api`  
**Authentication Scheme:** Bearer Token (JWT)  
**Standard Header:** `Authorization: Bearer <token>`  

---

## 1. System Health

### `GET /health`
Verifies backend server status and PostgreSQL database connection.
- **Auth Required:** No
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "message": "Bright Mind TaskFlow API and Database are healthy",
  "database": {
    "connected": true,
    "name": "bright_mind_db",
    "serverTime": "2026-10-21T09:38:12.314Z"
  },
  "uptime": "1239 seconds",
  "timestamp": "2026-10-21T09:38:12.313Z",
  "environment": "development"
}
```

---

## 2. Authentication & Users

### `POST /auth/register`
Creates a new user account, hashes password with `bcryptjs`, and returns a JWT token.
- **Auth Required:** No
- **Request Body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@brightmind.com",
  "password": "Password@123"
}
```
- **Validation Rules:**
  - `name`: Required, 2-100 characters.
  - `email`: Required, valid email format.
  - `password`: Required, minimum 6 characters.
- **Success Response (HTTP 201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Morgan",
      "email": "alex.morgan@brightmind.com",
      "role": "member",
      "avatar_color": "#2563eb",
      "created_at": "2026-10-21T08:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Validation failure (short password, invalid email).
  - `409 Conflict`: Email already exists.

---

### `POST /auth/login`
Authenticates user credentials and returns a JWT token.
- **Auth Required:** No
- **Request Body:**
```json
{
  "email": "demo@brightmind.com",
  "password": "password123"
}
```
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Morgan",
      "email": "demo@brightmind.com",
      "role": "admin",
      "avatar_color": "#2563eb"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Invalid email or password.

---

### `GET /auth/me`
Fetches current authenticated user profile using token.
- **Auth Required:** Yes (`Bearer <token>`)
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Alex Morgan",
      "email": "demo@brightmind.com",
      "role": "admin",
      "avatar_color": "#2563eb"
    }
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Missing, expired, or invalid token.

---

### `GET /auth/users`
Returns list of available team members for task assignment.
- **Auth Required:** Yes (`Bearer <token>`)
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "users": [
      { "id": 1, "name": "Alex Morgan", "email": "demo@brightmind.com", "avatar_color": "#2563eb" },
      { "id": 2, "name": "Sarah Wilson", "email": "sarah.wilson@brightmind.com", "avatar_color": "#f59e0b" },
      { "id": 3, "name": "Mike Fisher", "email": "mike.fisher@brightmind.com", "avatar_color": "#10b981" }
    ]
  }
}
```

---

## 3. Dashboard Analytics

### `GET /dashboard`
Provides aggregated metrics computed directly from PostgreSQL records.
- **Auth Required:** Yes (`Bearer <token>`)
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "data": {
    "summary": {
      "totalProjects": 8,
      "totalTasks": 7,
      "completedTasks": 2,
      "pendingTasks": 5,
      "overdueTasks": 5,
      "overallProgress": 29
    },
    "projectsSummary": {
      "total": 8,
      "active": 5,
      "completed": 1,
      "notStarted": 1,
      "atRisk": 1
    },
    "tasksSummary": {
      "total": 7,
      "completed": 2,
      "pending": 5,
      "overdue": 5,
      "byStatus": {
        "toDo": 1,
        "inProgress": 4,
        "completed": 2
      },
      "byPriority": {
        "high": 3,
        "medium": 3,
        "low": 1
      }
    },
    "recentProjects": [
      {
        "id": 1,
        "title": "Website Redesign",
        "status": "In Progress",
        "priority": "High",
        "due_date": "2026-03-14T18:00:00.000Z",
        "total_tasks": 7,
        "completed_tasks": 2,
        "progress_percentage": 29
      }
    ],
    "urgentTasks": [
      {
        "id": 1,
        "project_id": 1,
        "project_title": "Website Redesign",
        "title": "Prepare Marketing Collateral",
        "status": "In Progress",
        "priority": "High",
        "assignee_name": "Sarah Wilson",
        "assignee_avatar": "#f59e0b",
        "due_date": "2026-03-09T18:00:00.000Z",
        "is_overdue": true
      }
    ]
  }
}
```

---

## 4. Projects Management

### `GET /projects`
Fetches all projects owned by the authenticated user with task counts and completion percentages.
- **Auth Required:** Yes
- **Query Parameters:**
  - `status`: Optional filter (`Not Started`, `In Progress`, `Completed`, `At Risk`).
  - `priority`: Optional filter (`Low`, `Medium`, `High`).
  - `search`: Keyword search matching title or description.
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "projects": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Website Redesign",
        "description": "Comprehensive corporate website overhaul",
        "status": "In Progress",
        "priority": "High",
        "due_date": "2026-03-14",
        "total_tasks": 7,
        "completed_tasks": 2,
        "progress_percentage": 29,
        "created_at": "2026-10-21T08:00:00.000Z"
      }
    ]
  }
}
```

---

### `POST /projects`
Creates a new project.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "title": "Mobile App UI",
  "description": "Next-generation iOS & Android application",
  "status": "In Progress",
  "priority": "High",
  "due_date": "2026-06-30"
}
```
- **Validation Rules:**
  - `title`: Required, 3-200 characters.
  - `status`: Must be one of `'Not Started', 'In Progress', 'Completed', 'At Risk'`.
  - `priority`: Must be one of `'Low', 'Medium', 'High'`.
- **Success Response (HTTP 201):**
```json
{
  "status": "success",
  "message": "Project created successfully",
  "data": {
    "project": {
      "id": 9,
      "user_id": 1,
      "title": "Mobile App UI",
      "status": "In Progress",
      "priority": "High",
      "due_date": "2026-06-30"
    }
  }
}
```

---

### `GET /projects/:id`
Retrieves project details by ID.
- **Auth Required:** Yes
- **Error Responses:**
  - `400 Bad Request`: Non-numeric ID.
  - `403 Forbidden`: User does not own this project.
  - `404 Not Found`: Project not found.

---

### `PUT /projects/:id`
Updates project properties.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "title": "Updated Mobile App UI",
  "status": "Completed"
}
```
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "message": "Project updated successfully",
  "data": {
    "project": {
      "id": 9,
      "title": "Updated Mobile App UI",
      "status": "Completed"
    }
  }
}
```

---

### `DELETE /projects/:id`
Deletes a project and automatically cascades removal of its associated tasks.
- **Auth Required:** Yes
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "message": "Project \"Mobile App UI\" and all associated tasks deleted successfully",
  "data": {
    "projectId": 9
  }
}
```

---

## 5. Tasks Management

### `GET /tasks`
Retrieves tasks with multi-condition filtering.
- **Auth Required:** Yes
- **Query Parameters:**
  - `projectId`: Filter by integer project ID.
  - `status`: Filter by status (`To Do`, `In Progress`, `Completed`).
  - `priority`: Filter by priority (`Low`, `Medium`, `High`).
  - `assigneeId`: Filter by assigned user ID.
  - `search`: Keyword search in task title or description.
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "tasks": [
      {
        "id": 1,
        "project_id": 1,
        "project_title": "Website Redesign",
        "title": "Prepare Marketing Collateral",
        "description": "Create social media banners and pitch deck",
        "status": "In Progress",
        "priority": "High",
        "assigned_to": 2,
        "assignee_name": "Sarah Wilson",
        "assignee_avatar": "#f59e0b",
        "checklist": [
          { "id": 1, "text": "Draft copy", "done": true },
          { "id": 2, "text": "Design banner", "done": false }
        ],
        "depends_on_task_id": null,
        "due_date": "2026-03-09",
        "created_at": "2026-10-21T08:00:00.000Z"
      }
    ]
  }
}
```

---

### `POST /tasks`
Creates a new task in a project owned by the user.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "projectId": 1,
  "title": "Design responsive header",
  "description": "Include mobile drawer and notifications popover",
  "status": "To Do",
  "priority": "High",
  "assigneeId": 2,
  "due_date": "2026-11-20",
  "depends_on_task_id": null,
  "checklist": [
    { "id": 1, "text": "Create wireframe", "done": true }
  ]
}
```
- **Validation Rules:**
  - `title`: Required, 2-255 characters.
  - `projectId`: Required, valid project owned by authenticated user.
  - `status`: `'To Do'`, `'In Progress'`, or `'Completed'`.
  - `priority`: `'Low'`, `'Medium'`, or `'High'`.
- **Success Response (HTTP 201):**
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 8,
      "project_id": 1,
      "title": "Design responsive header",
      "status": "To Do",
      "priority": "High"
    }
  }
}
```

---

### `PUT /tasks/:id`
Updates task details, moves status, or updates assignee.
- **Auth Required:** Yes
- **Request Body:**
```json
{
  "status": "Completed"
}
```
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": 8,
      "status": "Completed"
    }
  }
}
```

---

### `DELETE /tasks/:id`
Deletes a task.
- **Auth Required:** Yes
- **Success Response (HTTP 200):**
```json
{
  "status": "success",
  "message": "Task \"Design responsive header\" deleted successfully",
  "data": {
    "taskId": 8
  }
}
```

---

## 6. Standard Error Response Structure
All client and server errors follow a consistent JSON schema:
```json
{
  "status": "error",
  "message": "Validation failed for one or more fields",
  "errors": [
    {
      "field": "title",
      "message": "Project title is required"
    }
  ]
}
```
*(In production, stack traces and database credentials are fully suppressed).*
