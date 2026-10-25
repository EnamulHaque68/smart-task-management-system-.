import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automatically initializes database schema and seeds on application startup.
 * Ensures that cloud databases (e.g. Neon, Render PostgreSQL) have all required
 * tables, columns, indexes, and initial demo users without requiring manual shell commands.
 */
export async function initializeDatabase() {
  try {
    console.log('[DB Init] Verifying database schema...');

    // Check if the 'users' table exists
    const checkRes = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) AS table_exists;
    `);

    const usersTableExists = checkRes.rows[0]?.table_exists;

    const migrationsDir = path.resolve(__dirname, '../../migrations');
    const seedsDir = path.resolve(__dirname, '../../seeds');

    const migrationFiles = [
      '001_create_users_table.sql',
      '002_create_projects_table.sql',
      '003_create_tasks_table.sql',
      '004_create_messages_table.sql',
      '005_add_profile_fields_to_users.sql'
    ];

    if (!usersTableExists) {
      console.log('⚡ [DB Init] Tables not found. Automatically running migrations...');

      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        if (fs.existsSync(filePath)) {
          const sql = fs.readFileSync(filePath, 'utf8');
          await pool.query(sql);
          console.log(`   ✅ Migration applied: ${file}`);
        }
      }

      console.log('🌱 [DB Init] Seeding initial database records...');
      const seedFile = path.join(seedsDir, 'seed_data.sql');
      if (fs.existsSync(seedFile)) {
        const seedSql = fs.readFileSync(seedFile, 'utf8');
        await pool.query(seedSql);
        console.log('   ✅ Initial users, projects, and tasks seeded.');
      }
    } else {
      // Ensure profile and preferences columns exist (including avatar_url)
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR(100) DEFAULT 'Product Lead';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{"email_notifications": true, "task_assigned_alert": true, "due_date_reminders": true, "timezone": "Asia/Dhaka", "date_format": "YYYY-MM-DD", "language": "en", "theme": "light"}';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/avatars/alex_morgan.jpg';
      `);

      // Check if users table is empty
      const countRes = await pool.query('SELECT COUNT(*) FROM users;');
      const userCount = parseInt(countRes.rows[0]?.count || '0', 10);

      if (userCount === 0) {
        console.log('🌱 [DB Init] Users table is empty. Inserting demo users & data...');
        const seedFile = path.join(seedsDir, 'seed_data.sql');
        if (fs.existsSync(seedFile)) {
          const seedSql = fs.readFileSync(seedFile, 'utf8');
          await pool.query(seedSql);
          console.log('   ✅ Demo users and projects seeded.');
        }
      }
    }

    console.log('✨ [DB Init] Database is fully ready and operational!');
    return true;
  } catch (error) {
    console.error('❌ [DB Init Error]:', error.message);
    return false;
  }
}

export default initializeDatabase;
