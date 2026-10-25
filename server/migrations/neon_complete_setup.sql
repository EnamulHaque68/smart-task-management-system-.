-- ==============================================================================
-- Bright Mind Ltd - TaskFlow Complete Neon / Cloud PostgreSQL Setup Script
-- Safe & Idempotent: Creates all tables, columns, indexes, and seed demo accounts.
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_color VARCHAR(20) DEFAULT '#2563eb',
    role VARCHAR(50) DEFAULT 'user',
    phone VARCHAR(50) DEFAULT '',
    job_title VARCHAR(100) DEFAULT 'Product Lead',
    preferences JSONB DEFAULT '{"email_notifications": true, "task_assigned_alert": true, "due_date_reminders": true, "timezone": "Asia/Dhaka", "date_format": "YYYY-MM-DD", "language": "en", "theme": "light"}',
    avatar_url TEXT DEFAULT '/avatars/alex_morgan.jpg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(100) DEFAULT 'Product Lead';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"email_notifications": true, "task_assigned_alert": true, "due_date_reminders": true, "timezone": "Asia/Dhaka", "date_format": "YYYY-MM-DD", "language": "en", "theme": "light"}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/avatars/alex_morgan.jpg';

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'At Risk')),
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    due_date DATE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Completed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assignee_name VARCHAR(100) DEFAULT 'Unassigned',
    assignee_avatar VARCHAR(20) DEFAULT '#6b7280',
    checklist JSONB DEFAULT '[]'::jsonb,
    depends_on_task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_depends_on ON tasks(depends_on_task_id);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_avatar VARCHAR(20) DEFAULT '#2563eb',
    text TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- ==============================================================================
-- 5. Seed Initial Users (Password for all: password123)
-- ==============================================================================
INSERT INTO users (id, name, email, password, avatar_color, role)
VALUES 
  (1, 'Alex Morgan', 'demo@brightmind.com', '$2a$10$arjvo02FN3UMFwmmP99hT.6G1ZNiPZkn2xom6IX.UgbV/XcW6ETm.', '#2563eb', 'admin'),
  (2, 'Sarah Wilson', 'sarah.wilson@brightmind.com', '$2a$10$arjvo02FN3UMFwmmP99hT.6G1ZNiPZkn2xom6IX.UgbV/XcW6ETm.', '#f59e0b', 'user'),
  (3, 'Mike Fisher', 'mike.fisher@brightmind.com', '$2a$10$arjvo02FN3UMFwmmP99hT.6G1ZNiPZkn2xom6IX.UgbV/XcW6ETm.', '#10b981', 'user'),
  (4, 'John Doe', 'john.doe@brightmind.com', '$2a$10$arjvo02FN3UMFwmmP99hT.6G1ZNiPZkn2xom6IX.UgbV/XcW6ETm.', '#0d9488', 'user')
ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;

-- 6. Seed Sample Projects
INSERT INTO projects (id, title, description, status, priority, due_date, user_id)
VALUES
  (1, 'Website Redesign', 'Revamp corporate portal with modern UI/UX design, mobile responsiveness, and high speed.', 'In Progress', 'High', '2026-03-15', 1),
  (2, 'Mobile App Development', 'Native cross-platform iOS and Android application with real-time push notifications.', 'In Progress', 'High', '2026-04-30', 1),
  (3, 'API Integration', 'Integrate third-party payment gateways, CRM webhooks, and partner service endpoints.', 'In Progress', 'Medium', '2026-02-20', 1),
  (4, 'Database Migration', 'Migrate legacy relational database to high-throughput PostgreSQL cluster with zero downtime.', 'Completed', 'High', '2026-03-15', 1),
  (5, 'Security Audit', 'Perform comprehensive penetration testing, vulnerability assessments, and compliance audits.', 'In Progress', 'Low', '2026-02-05', 1),
  (6, 'Marketing Dashboard', 'Customer analytics dashboard with conversion tracking, ad spending ROI, and traffic metrics.', 'Not Started', 'Medium', '2026-03-25', 1),
  (7, 'Cloud Infrastructure Upgrade', 'Containerize microservices with automated CI/CD deployment pipelines on AWS.', 'In Progress', 'High', '2026-04-10', 1),
  (8, 'Customer Feedback Portal', 'Interactive user feedback widget and review management system for SaaS clients.', 'At Risk', 'High', '2026-02-28', 1)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Sample Tasks
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, assignee_name, assignee_avatar, checklist, depends_on_task_id, due_date)
VALUES
  (1, 1, 'Prepare Marketing Collateral', 'Design collateral for upcoming exhibition and product launches.', 'In Progress', 'High', 2, 'Sarah Wilson', '#f59e0b', '[{"id": 1, "text": "Sales brochure", "done": true}, {"id": 2, "text": "Infographic", "done": false}, {"id": 3, "text": "Web content", "done": false}]'::jsonb, NULL, '2026-03-10'),
  (2, 1, 'Plan Exhibition For Trade Show', 'Coordinate booth layout, marketing collateral distribution, and staffing schedule.', 'To Do', 'High', 3, 'Mike Fisher', '#10b981', '[{"id": 1, "text": "@Lora to book space", "done": false}, {"id": 2, "text": "Order brochures", "done": false}, {"id": 3, "text": "Promote event on social media", "done": false}]'::jsonb, 1, '2026-03-12'),
  (3, 1, 'New EULA', 'Draft updated End User License Agreement and coordinate legal review.', 'In Progress', 'Medium', 2, 'Sarah Wilson', '#f59e0b', '[{"id": 1, "text": "@Mark to prepare new EULA", "done": true}, {"id": 2, "text": "Web team to update website", "done": false}, {"id": 3, "text": "Product team to embed EULA", "done": false}]'::jsonb, NULL, '2026-03-08'),
  (4, 1, 'Review Security Guidelines', 'Audit security posture and update developer guidelines for secrets management.', 'In Progress', 'Low', 4, 'John Doe', '#0d9488', '[{"id": 1, "text": "@Ian to provide current documents", "done": true}, {"id": 2, "text": "@Jane to review guidelines", "done": true}, {"id": 3, "text": "Distribute internally", "done": false}, {"id": 4, "text": "Define Processes", "done": false}]'::jsonb, NULL, '2026-03-05'),
  (5, 1, 'Implement CRM Integration', 'Establish bi-directional sync between sales CRM leads and project pipeline.', 'In Progress', 'Medium', 1, 'Alex Morgan', '#2563eb', '[{"id": 1, "text": "Prepare new microservice", "done": false}, {"id": 2, "text": "Define responsibilities", "done": false}]'::jsonb, NULL, '2026-03-14'),
  (6, 1, 'Develop iPhone App', 'Complete core UI wireframes and native iOS components.', 'Completed', 'High', 2, 'Sarah Wilson', '#f59e0b', '[{"id": 1, "text": "Create wireframes", "done": true}, {"id": 2, "text": "Create assets", "done": true}, {"id": 3, "text": "Define functionality", "done": true}, {"id": 4, "text": "Hand over to dev team", "done": true}]'::jsonb, NULL, '2026-02-18'),
  (7, 1, 'Channel Partners Licensing', 'Finalize licensing agreements for reseller network and partner distribution.', 'Completed', 'Medium', 3, 'Mike Fisher', '#10b981', '[{"id": 1, "text": "Prepare NFR licenses", "done": true}, {"id": 2, "text": "Document process", "done": true}, {"id": 3, "text": "Consult with partners", "done": true}, {"id": 4, "text": "Distribute license keys", "done": true}]'::jsonb, NULL, '2026-02-15')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Sample Messages
INSERT INTO messages (id, user_id, sender_name, sender_avatar, text, created_at)
VALUES
  (1, 2, 'Sarah Wilson', '#f59e0b', 'Hey team, I have prepared the initial marketing collateral for review!', NOW() - INTERVAL '2 hours'),
  (2, 3, 'Mike Fisher', '#10b981', 'Just completed the trade show floor plan checklist item.', NOW() - INTERVAL '1 hour'),
  (3, 4, 'John Doe', '#0d9488', 'Security review is 50% completed on the CRM sync pipeline.', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- 9. Synchronize Sequences
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM projects));
SELECT setval('tasks_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tasks));
SELECT setval('messages_id_seq', (SELECT COALESCE(MAX(id), 1) FROM messages));
