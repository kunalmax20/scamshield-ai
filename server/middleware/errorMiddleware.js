import { ApiResponse } from '../utils/apiResponse.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorStack = config.nodeEnv === 'development' ? err.stack : undefined;

  return ApiResponse.error(res, message, statusCode, errorStack);
};
