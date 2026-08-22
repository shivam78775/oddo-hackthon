import type { Request, Response, NextFunction } from 'express';
import { verifyToken, COOKIE_NAME } from '../lib/jwt.js';
import { prisma } from '../lib/db.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      res.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      res.status(401).json({ error: { message: 'User not found' } });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
}
