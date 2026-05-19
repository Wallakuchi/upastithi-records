// backend-api/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * JWT Authentication middleware
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      sendError(res, 401, 'Access token required');
      return;
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      sendError(res, 401, 'Invalid or expired access token');
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 401, 'Authentication failed');
  }
}

/**
 * Authorization middleware - check role
 */
export function authorize(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        sendError(res, 401, 'User not authenticated');
        return;
      }

      if (!roles.includes(req.user.role)) {
        sendError(res, 403, 'Insufficient permissions');
        return;
      }

      next();
    } catch (error) {
      sendError(res, 403, 'Authorization failed');
    }
  };
}

/**
 * Check if user is owner of resource or admin
 */
export function isOwnerOrAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const resourceOwnerId = req.params.id;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (userId !== resourceOwnerId && userRole !== 'admin') {
      sendError(res, 403, 'You do not have permission to access this resource');
      return;
    }

    next();
  } catch (error) {
    sendError(res, 403, 'Authorization failed');
  }
}
