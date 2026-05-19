// backend-api/src/utils/response.ts

import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/index';

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number = 200,
  message: string = 'Success',
  data?: T
): Response<ApiResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  statusCode: number = 500,
  message: string = 'Internal Server Error',
  error?: string
): Response<ApiResponse<null>> {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error || message,
  });
}

/**
 * Send paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  statusCode: number = 200,
  message: string = 'Success'
): Response<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit);

  return res.status(statusCode).json({
    success: true,
    data,
    total,
    page,
    limit,
    totalPages,
    message,
  });
}

/**
 * Send created response
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Created successfully'
): Response<ApiResponse<T>> {
  return sendSuccess(res, 201, message, data);
}

/**
 * Send no content response
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Record<string, string[]>
): Response<ApiResponse<null>> {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    error: JSON.stringify(errors),
  });
}
