import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateActivity, deleteActivity } from '../controllers/activityController.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

// ─── Validation Schema ──────────────────────────────────────

const updateActivitySchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['sightseeing', 'food', 'adventure', 'culture', 'other']).optional(),
  cost: z.number().min(0).optional(),
  durationMins: z.number().int().min(0).optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
}).partial();

// ─── Routes ──────────────────────────────────────────────────

router.patch('/:id', validate(updateActivitySchema), updateActivity);
router.delete('/:id', deleteActivity);

export default router;
