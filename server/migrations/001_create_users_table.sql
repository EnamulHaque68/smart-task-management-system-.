-- Migration 001: Create users table for Bright Mind Ltd
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar_color VARCHAR(20) DEFAULT '#2563eb',
    role VARCHAR(50) DEFAULT 'user',
    avatar_url TEXT DEFAULT '/avatars/alex_morgan.jpg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for fast lookups during authentication
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
