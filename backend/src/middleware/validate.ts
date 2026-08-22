import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fields: Record<string, string> = {};
        err.errors.forEach((e) => {
          const path = e.path.join('.');
          if (path) fields[path] = e.message;
        });
        res.status(400).json({
          error: {
            message: 'Validation failed',
            fields,
          },
        });
        return;
      }
      next(err);
    }
  };
}
