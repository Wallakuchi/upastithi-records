// backend-api/src/routes/employee.ts

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { sendSuccess, sendError, sendPaginated, sendCreated } from '../utils/response.util';
import { catchAsync } from '../middleware/error.handler';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/employees
 * Get all employees (Admin/HR only)
 */
router.get(
  '/',
  authenticateToken,
  authorize('ADMIN', 'HR'),
  catchAsync(async (req: any, res: Response) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, parseInt(req.query.limit) || 20);
      const skip = (page - 1) * limit;

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          select: {
            id: true,
            employee_code: true,
            name: true,
            email: true,
            phone: true,
            designation: true,
            department: true,
            status: true,
            created_at: true,
          },
          skip,
          take: limit,
        }),
        prisma.employee.count(),
      ]);

      sendPaginated(res, employees, total, page, limit);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  })
);

/**
 * GET /api/employees/:id
 * Get employee by ID
 */
router.get(
  '/:id',
  authenticateToken,
  catchAsync(async (req: any, res: Response) => {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          employee_code: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          designation: true,
          department: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!employee) {
        return sendError(res, 404, 'Employee not found');
      }

      sendSuccess(res, 200, 'Employee fetched', employee);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  })
);

/**
 * DELETE /api/employees/:id
 * Delete employee (Admin only)
 */
router.delete(
  '/:id',
  authenticateToken,
  authorize('ADMIN'),
  catchAsync(async (req: Request, res: Response) => {
    try {
      await prisma.employee.delete({
        where: { id: req.params.id },
      });

      sendSuccess(res, 200, 'Employee deleted');
    } catch (error: any) {
      if (error.code === 'P2025') {
        return sendError(res, 404, 'Employee not found');
      }
      sendError(res, 500, error.message);
    }
  })
);

export default router;
