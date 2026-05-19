// backend-api/src/routes/auth.ts

import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validateRequest } from '../middleware/validation.middleware';
import { loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { sendSuccess, sendError, sendCreated } from '../utils/response.util';
import { catchAsync } from '../middleware/error.handler';

const router = Router();

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const result = await AuthService.login(email, password);
      sendSuccess(res, 200, 'Login successful', {
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error: any) {
      sendError(res, 401, error.message);
    }
  })
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  validateRequest(refreshTokenSchema),
  catchAsync(async (req: Request, res: Response) => {
    const { refresh_token } = req.body;

    try {
      const tokens = await AuthService.refreshAccessToken(refresh_token);
      sendSuccess(res, 200, 'Token refreshed', { tokens });
    } catch (error: any) {
      sendError(res, 401, error.message);
    }
  })
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token invalidation)
 * Note: Does not require authentication since user is already logging out
 */
router.post(
  '/logout',
  catchAsync(async (req: Request, res: Response) => {
    // Optional: Verify token if provided for logging/audit
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        // Could log logout for audit trail
        console.log('User logged out');
      }
    } catch (error) {
      // Continue even if token verification fails
      console.log('Logout without valid token');
    }
    
    sendSuccess(res, 200, 'Logout successful');
  })
);

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get(
  '/me',
  authenticateToken,
  catchAsync(async (req: any, res: Response) => {
    try {
      const user = await AuthService.getUserById(req.user.userId);
      if (!user) {
        return sendError(res, 404, 'User not found');
      }
      sendSuccess(res, 200, 'User profile fetched', user);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  })
);

export default router;
