// Centralized Error Handling Middleware for Bright Mind TaskFlow

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('[Centralized Error]:', err);

  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

export default {
  notFoundHandler,
  errorHandler
};
