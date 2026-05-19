// backend-api/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err);

  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  // Prisma errors
  if (err.name === 'PrismaClientValidationError') {
    sendError(res, 400, 'Invalid request data');
    return;
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.message.includes('Unique constraint failed')) {
      sendError(res, 409, 'Resource already exists');
      return;
    }
    sendError(res, 400, 'Database error');
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 401, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 401, 'Token expired');
    return;
  }

  // Default error
  sendError(res, 500, 'Internal server error', err.message);
}

/**
 * Async error wrapper
 */
export function catchAsync(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
