import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateStop, deleteStop } from '../controllers/stopController.js';
import { addActivity } from '../controllers/activityController.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

// ─── Validation Schemas ──────────────────────────────────────

const updateStopSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  orderIndex: z.number().int().min(0).optional(),
}).partial();

const addActivitySchema = z.object({
  name: z.string().min(1, 'Activity name is required'),
  category: z.enum(['sightseeing', 'food', 'adventure', 'culture', 'other']).optional(),
  cost: z.number().min(0, 'Cost must be non-negative').optional(),
  durationMins: z.number().int().min(0).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

// ─── Routes ──────────────────────────────────────────────────

router.patch('/:id', validate(updateStopSchema), updateStop);
router.delete('/:id', deleteStop);

// Nested: add activity to a stop
router.post('/:stopId/activities', validate(addActivitySchema), addActivity);

export default router;
