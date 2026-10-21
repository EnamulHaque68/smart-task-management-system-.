-- Migration 004: Create messages table for real-time team collaboration
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
