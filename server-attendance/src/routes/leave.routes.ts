import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
} from '../utils/response.util';
import { catchAsync } from '../middleware/error.handler';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/leaves
 * Create leave request
 */
router.post(
  '/',
  authenticateToken,
  catchAsync(async (req: any, res: Response) => {
    try {
      const { from_date, to_date, leave_type, reason } = req.body;

      if (!from_date || !to_date || !leave_type || !reason) {
        return sendError(res, 400, 'Missing required fields');
      }

      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          employee_id: req.user.userId,
          from_date: new Date(from_date),
          to_date: new Date(to_date),
          leave_type: leave_type.toUpperCase(),
          reason: reason.trim(),
          status: 'PENDING',
        },
      });

      return sendCreated(res, leaveRequest, 'Leave request created successfully');
    } catch (error: any) {
      console.error('Create Leave Error:', error);
      return sendError(res, 500, error.message || 'Failed to create leave request');
    }
  })
);

/**
 * GET /api/leaves
 * Get leave requests
 */
router.get(
  '/',
  authenticateToken,
  catchAsync(async (req: any, res: Response) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);

      const skip = (page - 1) * limit;

      const where: any = {};

      // Employee sees only own leaves
      if (!['ADMIN', 'HR'].includes(req.user.role)) {
        where.employee_id = req.user.userId;
      }

      const [leaveRequests, total] = await Promise.all([
        prisma.leaveRequest.findMany({
          where,
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                employee_code: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: limit,
        }),

        prisma.leaveRequest.count({
          where,
        }),
      ]);

      return sendPaginated(
        res,
        leaveRequests,
        total,
        page,
        limit
      );
    } catch (error: any) {
      console.error('Get Leave Error:', error);
      return sendError(res, 500, error.message || 'Failed to fetch leaves');
    }
  })
);

/**
 * PUT /api/leaves/:id
 * Approve / Reject leave
 */
router.put(
  '/:id',
  authenticateToken,
  authorize('ADMIN', 'HR'),
  catchAsync(async (req: any, res: Response) => {
    try {
      const { status } = req.body;

      if (!status) {
        return sendError(res, 400, 'Status is required');
      }

      const normalizedStatus = status.toUpperCase();

      if (!['APPROVED', 'REJECTED'].includes(normalizedStatus)) {
        return sendError(res, 400, 'Invalid status');
      }

      const leaveRequest = await prisma.leaveRequest.update({
        where: {
          id: req.params.id,
        },
        data: {
          status: normalizedStatus,
          approved_by: req.user.userId,
        },
      });

      return sendSuccess(
        res,
        200,
        'Leave request updated successfully',
        leaveRequest
      );
    } catch (error: any) {
      console.error('Update Leave Error:', error);

      if (error.code === 'P2025') {
        return sendError(res, 404, 'Leave request not found');
      }

      return sendError(
        res,
        500,
        error.message || 'Failed to update leave request'
      );
    }
  })
);

export default router;