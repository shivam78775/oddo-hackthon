import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { adminGuard, getAdminStats, getUsers } from '../controllers/adminController.js';

const router = Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(adminGuard);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);

export default router;
