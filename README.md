# Bright Mind Ltd — Smart Task & Project Management System

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![Integration Tests](https://img.shields.io/badge/Tests-39%20Passed-success)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue)]()
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)]()
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2018-blue)]()
[![License](https://img.shields.io/badge/License-MIT-purple)]()

A modern, full-stack Task & Project Management application designed for **Bright Mind Ltd** (internal codename: *TaskFlow*). Built with a high-performance React (Vite) frontend, modular Node.js/Express REST backend, and PostgreSQL 18 relational database.

---

## 📸 Key Features

- **Split-Screen Authentication:** Modern split-screen layout with live dashboard preview cards, input validation, and 1-click Demo credentials auto-fill.
- **Role-Based Authorization & Session Management:** Stateless JWT authentication with secure password hashing via `bcryptjs`. Protected routes guard against unauthorized access.
- **Interactive TaskFlow Dashboard:** Real-time analytics derived directly from PostgreSQL:
  - Metric summary cards: Active Projects, In Progress Tasks, Completed Tasks, Overdue Tasks.
  - Project progress breakdown bars and overdue warning badges.
  - Recent projects table and urgent/overdue task list.
- **Project Management (CRUD):**
  - Full CRUD operations (Create, Read, Update, Delete) with server-side ownership authorization.
  - Multi-attribute search and filters by status (`Not Started`, `In Progress`, `Completed`, `At Risk`) and priority (`Low`, `Medium`, `High`).
  - Automatic task count and dynamic completion percentage calculation.
- **Kanban Task Board & Sprint Tracker:**
  - 3-column Kanban board (`TODO`, `IN PROGRESS`, `COMPLETE`) with color-coded headers and counters.
  - 1-click status advancement (`Start` / `Done` / `Reopen`).
  - Task dependencies indicator (`🔗 Depends on: [Task Title]`).
  - Sub-task checklist tracker (`☑️ 2/3 completed`).
  - Searchable team assignee selector with color-coded avatars.
  - View switcher: Toggle between Kanban Board and Table/List View.
- **Comprehensive Validation & Error Handling:**
  - Client-side and server-side validation via `express-validator`.
  - Accessible error banners matching design references.
  - Helpful empty states, loading skeletons, and retry mechanisms.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Lucide React, Vanilla CSS Design System |
| **Backend** | Node.js (v24), Express.js (ES Modules), Helmet, CORS, Morgan |
| **Database** | PostgreSQL 18, `pg` (node-postgres Connection Pool) |
| **Authentication** | JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`) |
| **Validation** | `express-validator` with centralized error formatting |
| **Dev & OS** | Windows 11, PowerShell, Node.js built-in test runner |

---

## 📋 Prerequisites

Ensure the following are installed on your machine:
1. **Node.js** (v18.0.0 or higher; v24 recommended) — [Download Node.js](https://nodejs.org/)
2. **PostgreSQL** (v15 or higher; v18 recommended) — [Download PostgreSQL](https://www.postgresql.org/)
3. **Git** — [Download Git](https://git-scm.com/)

---

## 🚀 Installation & Setup

### 1. Clone or Open the Repository
```bash
cd "Smart Task & Project Management System"
```

### 2. Configure Backend Environment
Navigate to `server/` and create your `.env` file from the provided `.env.example`:
```powershell
cd server
cp .env.example .env
```
Edit `server/.env` with your PostgreSQL database password:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD="your_postgres_password"
DB_NAME=bright_mind_db

# JWT Configuration
JWT_SECRET=bright_mind_task_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d
```
> **Tip:** If your database password contains special characters such as `#`, wrap it in double quotes (e.g. `DB_PASSWORD="your#password"`).

### 3. Install Dependencies
Install dependencies for both backend and frontend:
```powershell
# In server directory:
npm.cmd install

# In client directory:
cd ../client
npm.cmd install
cd ..
```

---

## 🗄️ Database Setup & Migrations

### 1. Create the Database
Open PostgreSQL `psql` or pgAdmin and create the database:
```sql
CREATE DATABASE bright_mind_db;
```

### 2. Run Database Migrations
Execute the migration runner to automatically create tables, constraints, foreign keys, and indexes:
```powershell
cd server
node migrations/run-migrations.js
```
*Creates `users`, `projects`, and `tasks` tables.*

### 3. Seed Sample Data
Populate the database with sample projects, tasks, and team members:
```powershell
node seeds/run-seeds.js
```
*Default Demo Accounts:*
- **Admin/Lead:** `demo@brightmind.com` | Password: `password123`
- **Team Members:** `sarah.wilson@brightmind.com`, `mike.fisher@brightmind.com`, `john.doe@brightmind.com`, `tanvir@brightmind.com`

---

## 💻 Running the Application

### Option A: Run Backend & Frontend in Separate Terminals

**Terminal 1 (Backend API Server on port 5000):**
```powershell
cd server
node src/server.js
```

**Terminal 2 (Frontend Client on port 5173):**
```powershell
cd client
node node_modules/vite/bin/vite.js
```

### Option B: Access in Browser
Once running, open your web browser and navigate to:
👉 **`http://localhost:5173`**

You will be presented with the split-screen login page. Click **"Click to fill Demo Account"** or enter `demo@brightmind.com` / `password123` to log in.

---

## 🧪 Testing & Verification

The project includes an automated end-to-end integration test suite covering **39 test cases** (Registration, Login, Validation, JWT security, Project CRUD, Task CRUD, Query Filters, Overdue calculation, Cross-user isolation, ID validation, and DB Health).

### Run Automated Integration Tests:
```powershell
cd server
npm.cmd test
# Or:
node test/phase9_integration_test.js
```

**Test Output:**
```text
===============================================================
📊 TEST EXECUTION SUMMARY: 39 PASSED, 0 FAILED
===============================================================
```

### Build Frontend for Production:
```powershell
cd client
node node_modules/vite/bin/vite.js build
```
*(Produces optimized assets in `client/dist/` with zero errors).*

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service and database connectivity health check | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT token | No |
| `GET` | `/api/auth/me` | Get authenticated user profile | Yes |
| `GET` | `/api/auth/users` | List team members for task assignment | Yes |
| `GET` | `/api/dashboard` | Aggregated analytics & overdue metrics | Yes |
| `GET` | `/api/projects` | List projects (with search & filters) | Yes |
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects/:id` | Get single project with task count | Yes |
| `PUT` | `/api/projects/:id` | Update project fields | Yes |
| `DELETE` | `/api/projects/:id` | Delete project (cascades tasks) | Yes |
| `GET` | `/api/tasks` | List tasks (supports `projectId`, `status`, `priority`, `assigneeId`, `search`) | Yes |
| `POST` | `/api/tasks` | Create a new task in user project | Yes |
| `GET` | `/api/tasks/:id` | Get single task with dependency & assignee | Yes |
| `PUT` | `/api/tasks/:id` | Update task status, priority, or details | Yes |
| `DELETE` | `/api/tasks/:id` | Delete task | Yes |

*For complete payload and response documentation, see [docs/api-documentation.md](docs/api-documentation.md).*

---

## ⚠️ Known Limitations & Disclosures

1. **Google OAuth Button:** The "Sign in with Google" button is simulated for the assignment demo; integration requires Google Cloud Console OAuth Client credentials.
2. **Offline Browser Environment:** Playwright headless driver downloading is restricted in sandboxed offline environments; manual testing via Chrome/Edge browser is fully verified.
3. **Password Reset Workflow:** Email-based password reset (SMTP/Nodemailer) was out of scope for this phase and is not enabled.

---

## 📄 License
This project is licensed under the MIT License. Developed for Bright Mind Ltd.
