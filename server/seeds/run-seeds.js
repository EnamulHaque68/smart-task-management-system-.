import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hasDbUrl = Boolean(process.env.DATABASE_URL);
const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = hasDbUrl
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction || process.env.DATABASE_URL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bright_mind_db',
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };

async function runSeeds() {
  console.log(`===================================================`);
  console.log(`🌱 Seeding Database: ${hasDbUrl ? 'Cloud Database' : (process.env.DB_NAME || 'bright_mind_db')}...`);
  console.log(`===================================================`);

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log(`Connected to database. Executing seeds/seed_data.sql...`);

    const seedFile = path.join(__dirname, 'seed_data.sql');
    const sql = fs.readFileSync(seedFile, 'utf8');

    await client.query(sql);

    // Verify row counts
    const usersCount = await client.query('SELECT COUNT(*) FROM users;');
    const projectsCount = await client.query('SELECT COUNT(*) FROM projects;');
    const tasksCount = await client.query('SELECT COUNT(*) FROM tasks;');

    console.log(`\n📊 Data Insertion Summary:`);
    console.log(`   - Users:    ${usersCount.rows[0].count} total records`);
    console.log(`   - Projects: ${projectsCount.rows[0].count} total records`);
    console.log(`   - Tasks:    ${tasksCount.rows[0].count} total records`);

    await client.end();
    console.log(`\n🎉 Database seeding completed safely!`);
    console.log(`===================================================`);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

runSeeds();
