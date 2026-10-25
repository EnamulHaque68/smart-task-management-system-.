import app from './app.js';
import { testConnection } from './config/db.js';
import { initializeDatabase } from './config/initDb.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`===================================================`);
  console.log(`🚀 Bright Mind TaskFlow Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛠️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);

  // Test Database Connection and Initialize Tables
  const isConnected = await testConnection();
  if (isConnected) {
    await initializeDatabase();
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection!]:', err);
  server.close(() => {
    process.exit(1);
  });
});
