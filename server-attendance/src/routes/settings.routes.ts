// backend-api/src/routes/settings.ts

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response.util';
import { catchAsync } from '../middleware/error.handler';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/office-settings
 * Get office settings
 */
router.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    try {
      let settings = await prisma.officeSettings.findFirst();

      // Create default settings if not exists
      if (!settings) {
        settings = await prisma.officeSettings.create({
          data: {
            office_name: process.env.OFFICE_NAME || 'Company Office',
            office_latitude: parseFloat(process.env.OFFICE_LATITUDE || '28.553306'),
            office_longitude: parseFloat(process.env.OFFICE_LONGITUDE || '77.2047050'),
            allowed_radius: parseInt(process.env.OFFICE_RADIUS || '500'),
            office_start_time: process.env.OFFICE_START_TIME || '09:00',
            office_end_time: process.env.OFFICE_END_TIME || '18:00',
          },
        });
      }

      sendSuccess(res, 200, 'Office settings fetched', settings);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  })
);

/**
 * PUT /api/office-settings
 * Update office settings (Admin only)
 */
router.put(
  '/',
  authenticateToken,
  authorize('ADMIN'),
  catchAsync(async (req: Request, res: Response) => {
    try {
      const {
        office_name,
        office_latitude,
        office_longitude,
        allowed_radius,
        office_start_time,
        office_end_time,
      } = req.body;

      // Validate coordinates
      if (office_latitude !== undefined) {
        if (office_latitude < -90 || office_latitude > 90) {
          return sendError(res, 400, 'Invalid latitude');
        }
      }

      if (office_longitude !== undefined) {
        if (office_longitude < -180 || office_longitude > 180) {
          return sendError(res, 400, 'Invalid longitude');
        }
      }

      if (allowed_radius !== undefined && allowed_radius < 0) {
        return sendError(res, 400, 'Radius must be positive');
      }

      // Get or create settings
      let settings = await prisma.officeSettings.findFirst();

      if (!settings) {
        settings = await prisma.officeSettings.create({
          data: {
            office_name: office_name || 'Company Office',
            office_latitude: office_latitude || 28.553306,
            office_longitude: office_longitude || 77.2047050,
            allowed_radius: allowed_radius || 500,
            office_start_time: office_start_time || '09:00',
            office_end_time: office_end_time || '18:00',
          },
        });
      } else {
        settings = await prisma.officeSettings.update({
          where: { id: settings.id },
          data: {
            ...(office_name && { office_name }),
            ...(office_latitude && { office_latitude }),
            ...(office_longitude && { office_longitude }),
            ...(allowed_radius && { allowed_radius }),
            ...(office_start_time && { office_start_time }),
            ...(office_end_time && { office_end_time }),
          },
        });
      }

      sendSuccess(res, 200, 'Office settings updated', settings);
    } catch (error: any) {
      sendError(res, 500, error.message);
    }
  })
);

export default router;
