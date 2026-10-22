import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool Configuration
const isProduction = process.env.NODE_ENV === 'production';
const hasDbUrl = Boolean(process.env.DATABASE_URL);

export const pool = new Pool(
  hasDbUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction || process.env.DATABASE_URL?.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bright_mind_db',
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
);

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected client error', err);
});

// Centralized Query Helper Function
export const query = (text, params) => pool.query(text, params);

// Connection test utility
export const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() AS current_time, current_database() AS db_name');
    console.log(`✅ Connected to PostgreSQL database: "${res.rows[0].db_name}" at ${res.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error(`❌ PostgreSQL Connection Failed: ${error.message}`);
    return false;
  }
};

export default {
  pool,
  query,
  testConnection,
};
