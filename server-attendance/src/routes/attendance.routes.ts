// backend-api/src/routes/attendance.ts

import { Router, Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { validateRequest, validateQuery } from '../middleware/validation.middleware';
import { checkInSchema, checkOutSchema, historyQuerySchema, reportQuerySchema } from '../validators/attendance.validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { sendSuccess, sendError, sendPaginated } from '../utils/response.util';
import { catchAsync } from '../middleware/error.handler';

const router = Router();

/**
 * POST /api/attendance/check-in
 * Employee check-in with GPS and selfie
 */
router.post(
  '/check-in',
  authenticateToken,
  validateRequest(checkInSchema),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const result = await AttendanceService.checkIn(req.body);
      sendSuccess(res, 200, result.message, result.attendance);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  })
);

/**
 * POST /api/attendance/check-out
 * Employee check-out with GPS and selfie
 */
router.post(
  '/check-out',
  authenticateToken,
  validateRequest(checkOutSchema),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const result = await AttendanceService.checkOut(req.body);
      sendSuccess(res, 200, result.message, result.attendance);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  })
);

/**
 * GET /api/attendance/history
 * Get attendance history for employee
 */
router.get(
  '/history',
  authenticateToken,
  validateQuery(historyQuerySchema),
  catchAsync(async (req: any, res: Response) => {
    try {
      const { employee_id, from_date, to_date, page, limit } = req.query;

      const result = await AttendanceService.getHistory(
        employee_id,
        from_date ? new Date(from_date) : undefined,
        to_date ? new Date(to_date) : undefined,
        page,
        limit
      );

      sendPaginated(res, result.records, result.total, result.page, result.limit);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  })
);

/**
 * GET /api/attendance/today
 * Get today's attendance for employee
 */
router.get(
  '/today',
  authenticateToken,
  catchAsync(async (req: any, res: Response) => {
    console.log('TODAY API HIT');
    try {
      const employeeId = req.query.employee_id || req.user.userId;
      const attendance = await AttendanceService.getTodayAttendance(employeeId);

      if (!attendance) {
        return sendSuccess(res, 200, 'No attendance record for today');
      }

      sendSuccess(res, 200, 'Today attendance fetched', attendance);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  })
);

/**
 * GET /api/attendance/report
 * Get attendance report (Admin/HR only)
 */
router.get(
  '/report',
  authenticateToken,
  validateQuery(reportQuerySchema),
  catchAsync(async (req: any, res: Response) => {
    try {
      const { from_date, to_date, department, page, limit } = req.query;

      // Verify user is admin or hr
      if (!['ADMIN', 'HR'].includes(req.user.role)) {
        return sendError(res, 403, 'Insufficient permissions');
      }

      const result = await AttendanceService.getReport(
        new Date(from_date),
        new Date(to_date),
        department,
        page,
        limit
      );

      sendPaginated(res, result.records, result.total, result.page, result.limit);
    } catch (error: any) {
      sendError(res, 400, error.message);
    }
  })
);

export default router;
