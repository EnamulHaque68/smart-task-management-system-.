import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`===================================================`);
  console.log(`🚀 Bright Mind TaskFlow Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛠️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);

  // Test Database Connection on startup
  await testConnection();
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
