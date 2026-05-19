// backend-api/src/middleware/validation.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendValidationError } from '../utils/response.util';

/**
 * Validation middleware using Zod
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });
        sendValidationError(res, errors);
        return;
      }

      // Replace body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      sendValidationError(res, { general: ['Validation failed'] });
    }
  };
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });
        sendValidationError(res, errors);
        return;
      }

      req.query = result.data;
      next();
    } catch (error) {
      sendValidationError(res, { general: ['Query validation failed'] });
    }
  };
}

/**
 * Validate path parameters
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const errors: Record<string, string[]> = {};
        result.error.errors.forEach((err) => {
          const field = err.path.join('.');
          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(err.message);
        });
        sendValidationError(res, errors);
        return;
      }

      req.params = result.data;
      next();
    } catch (error) {
      sendValidationError(res, { general: ['Params validation failed'] });
    }
  };
}
