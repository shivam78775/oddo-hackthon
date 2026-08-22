import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import {
  addStop,
  reorderStops,
} from '../controllers/stopController.js';
import { z } from 'zod';

const router = Router();

// All trip routes require auth
router.use(authMiddleware);

// ─── Validation Schemas ──────────────────────────────────────

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
  coverPhotoUrl: z.string().url().optional().or(z.literal('')),
});

const updateTripSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  coverPhotoUrl: z.string().url().optional().or(z.literal('')).or(z.null()),
  isPublic: z.boolean().optional(),
}).partial();

const addStopSchema = z.object({
  cityId: z.string().uuid('Invalid city ID'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

const reorderStopsSchema = z.object({
  stopIds: z.array(z.string().uuid()),
});

// ─── Trip Routes ─────────────────────────────────────────────

router.post('/', validate(createTripSchema), createTrip);
router.get('/', getTrips);
router.get('/:id', getTrip);
router.patch('/:id', validate(updateTripSchema), updateTrip);
router.delete('/:id', deleteTrip);

// ─── Stop Routes (nested under trips) ───────────────────────

router.post('/:tripId/stops', validate(addStopSchema), addStop);
router.patch('/:tripId/stops/reorder', validate(reorderStopsSchema), reorderStops);

export default router;
