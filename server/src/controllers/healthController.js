import { pool } from '../config/db.js';

export const getHealth = async (req, res, next) => {
  try {
    // Query PostgreSQL to verify database connectivity and fetch database name
    const dbRes = await pool.query('SELECT current_database() AS db_name, NOW() AS db_time');
    const { db_name, db_time } = dbRes.rows[0];

    return res.status(200).json({
      status: 'success',
      message: 'Bright Mind TaskFlow API and Database are healthy',
      database: {
        connected: true,
        name: db_name,
        serverTime: db_time
      },
      uptime: `${Math.floor(process.uptime())} seconds`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('[Health Check DB Error]:', error.message);

    // Safe error response without exposing credentials
    return res.status(503).json({
      status: 'degraded',
      message: 'Bright Mind TaskFlow API is running, but database connection is unavailable',
      database: {
        connected: false,
        error: 'Database connection failed. Please ensure PostgreSQL is running and DB_PASSWORD in server/.env is correct.'
      },
      uptime: `${Math.floor(process.uptime())} seconds`,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }
};

export default {
  getHealth
};
