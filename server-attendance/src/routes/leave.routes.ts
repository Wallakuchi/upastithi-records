// backend-api/src/routes/leave.ts

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { sendSuccess, sendError, sendPaginated, sendCreated } from '../utils/response.util';
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
          reason,
        },
      });

      sendCreated(res, leaveRequest, 'Leave request created');
    } catch (error: any) {
      sendError(res, 400, error.message);
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
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 20);
      const skip = (page - 1) * limit;

      const where: any = {};

      // If not admin/hr, only show own requests
      if (!['ADMIN', 'HR'].includes(req.user.role)) {
        where.employee_id = req.user.userId;
      }

      const [leaveRequests, total] = await Promise.all([
        prisma.leaveRequest.findMany({
          where,
          include: {
            employee: {
              select: { id: true, name: true, employee_code: true },
            },
          },
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.leaveRequest.count({ where }),
      ]);

      sendPaginated(res, leaveRequests, total, page, limit);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  })
);

/**
 * PUT /api/leaves/:id
 * Update leave request status (Admin/HR only)
 */
router.put(
  '/:id',
  authenticateToken,
  authorize('ADMIN', 'HR'),
  catchAsync(async (req: any, res: Response) => {
    try {
      const { status, remarks } = req.body;

      if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        return sendError(res, 400, 'Invalid status');
      }

      const leaveRequest = await prisma.leaveRequest.update({
        where: { id: req.params.id },
        data: {
          status: status.toUpperCase(),
          approved_by: req.user.userId,
        },
      });

      sendSuccess(res, 200, 'Leave request updated', leaveRequest);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return sendError(res, 404, 'Leave request not found');
      }
      sendError(res, 500, error.message);
    }
  })
);

export default router;
