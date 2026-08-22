import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

export async function getPosts(req: Request, res: Response) {
  try {
    const { q } = req.query;
    
    const whereClause = q ? {
      content: { contains: String(q) }
    } : {};

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, city: true, country: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(posts);
  } catch (err) {
    console.error('Failed to get community posts:', err);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: { message: 'Content is required' } });
      return;
    }

    const post = await prisma.post.create({
      data: {
        userId: req.user!.id,
        content
      },
      include: {
        user: { select: { name: true, city: true, country: true } }
      }
    });
    
    res.status(201).json(post);
  } catch (err) {
    console.error('Failed to create community post:', err);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
}
