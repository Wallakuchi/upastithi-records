// backend-api/src/validators/attendance.ts

import { z } from 'zod';

export const checkInSchema = z.object({
  employee_id: z.string().cuid('Invalid employee ID'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  selfie_photo: z.string().min(100, 'Invalid image data'), // base64 or file path
  device_info: z.string().optional(),
});

export const checkOutSchema = z.object({
  employee_id: z.string().cuid('Invalid employee ID'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  selfie_photo: z.string().min(100, 'Invalid image data'),
  device_info: z.string().optional(),
});

export const historyQuerySchema = z.object({
  employee_id: z.string().cuid('Invalid employee ID'),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// export const reportQuerySchema = z.object({
//   from_date: z.string().datetime(),
//   to_date: z.string().datetime(),
//   department: z.string().optional(),
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(20),
// });

export const reportQuerySchema = z.object({
  from_date: z.coerce.date(),
  to_date: z.coerce.date(),
  department: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;
export type ReportQueryInput = z.infer<typeof reportQuerySchema>;
