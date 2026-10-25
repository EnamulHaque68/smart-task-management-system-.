ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(100) DEFAULT 'Product Lead';
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"email_notifications": true, "task_assigned_alert": true, "due_date_reminders": true, "timezone": "Asia/Dhaka", "date_format": "YYYY-MM-DD", "language": "en", "theme": "light"}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/avatars/alex_morgan.jpg';

