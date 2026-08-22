import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getPosts, createPost } from '../controllers/communityController.js';

const router = Router();

// Protect all community routes
router.use(authMiddleware);

router.get('/posts', getPosts);
router.post('/posts', createPost);

export default router;
