import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getBudgetBreakdown, addBudgetItem, getBudgetItems } from '../controllers/budgetController.js';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

// ─── Validation Schema ──────────────────────────────────────

const addBudgetItemSchema = z.object({
  category: z.enum(['transport', 'stay', 'activity', 'meal']),
  amount: z.number().min(0, 'Amount must be non-negative'),
  stopId: z.string().uuid().optional().nullable(),
});

// ─── Routes ──────────────────────────────────────────────────

// GET /api/budget/trips/:id — get budget breakdown for a trip
router.get('/trips/:id', getBudgetBreakdown);

// GET /api/budget/trips/:id/items — list budget items for a trip
router.get('/trips/:id/items', getBudgetItems);

// POST /api/budget/trips/:id/items — add a budget item to a trip
router.post('/trips/:id/items', validate(addBudgetItemSchema), addBudgetItem);

export default router;
