import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getBudgetBreakdown } from '../controllers/budgetController.js';

const router = Router();

router.use(authMiddleware);

// GET /api/budget/trips/:id — get budget breakdown for a trip
router.get('/trips/:id', getBudgetBreakdown);

export default router;
