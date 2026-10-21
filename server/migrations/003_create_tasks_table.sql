-- Migration 003: Create tasks table for Bright Mind Ltd
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_depends_on ON tasks(depends_on_task_id);
