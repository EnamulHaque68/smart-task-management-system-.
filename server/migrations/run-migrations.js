import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const targetDb = process.env.DB_NAME || 'bright_mind_db';

async function ensureDatabaseExists() {
  const rootClient = new Client({
    ...dbConfig,
    database: 'postgres',
  });

  try {
    await rootClient.connect();
    const checkRes = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [targetDb]
    );

    if (checkRes.rowCount === 0) {
      console.log(`[Database] "${targetDb}" does not exist. Creating database...`);
      await rootClient.query(`CREATE DATABASE "${targetDb}";`);
      console.log(`[Database] "${targetDb}" created successfully.`);
    } else {
      console.log(`[Database] "${targetDb}" already exists. Skipping creation.`);
    }
  } catch (error) {
    console.error(`[Database Error] Could not verify/create database: ${error.message}`);
    throw error;
  } finally {
    await rootClient.end();
  }
}

async function runMigrations() {
  console.log(`===================================================`);
  console.log(`🚀 Starting Database Migrations for ${targetDb}...`);
  console.log(`===================================================`);

  try {
    await ensureDatabaseExists();

    const client = new Client({
      ...dbConfig,
      database: targetDb,
    });

    await client.connect();
    console.log(`Connected to database "${targetDb}". Applying migrations...`);

    const migrationFiles = [
      '001_create_users_table.sql',
      '002_create_projects_table.sql',
      '003_create_tasks_table.sql',
      '004_create_messages_table.sql',
      '005_add_profile_fields_to_users.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`⏳ Running migration: ${file}...`);
        await client.query(sql);
        console.log(`✅ Completed migration: ${file}`);
      } else {
        console.warn(`⚠️ Migration file not found: ${file}`);
      }
    }

    // Verify existing tables
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n📋 Current Tables in "${targetDb}":`);
    tableRes.rows.forEach(r => console.log(`   - ${r.table_name}`));

    await client.end();
    console.log(`\n🎉 All migrations completed successfully!`);
    console.log(`===================================================`);
  } catch (error) {
    console.error(`❌ Migration failed: ${error.message}`);
    process.exit(1);
  }
}

runMigrations();
