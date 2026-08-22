import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

const router = Router();

// ─── Search Cities ───────────────────────────────────────────
// GET /api/cities?q=&region=&country=&sort=popularity|cost|name&page=1&limit=12

router.get('/', async (req: Request, res: Response) => {
  try {
    const { q, region, country, sort, page: pageStr, limit: limitStr } = req.query;

    const page = Math.max(1, parseInt(pageStr as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(limitStr as string) || 12));
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (q) {
      const searchTerm = (q as string).toLowerCase();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { country: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    if (region) {
      where.region = region as string;
    }
    if (country) {
      where.country = country as string;
    }

    // Build orderBy
    let orderBy: any = { popularityScore: 'desc' };
    switch (sort) {
      case 'cost':
        orderBy = { costIndex: 'asc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'popularity':
      default:
        orderBy = { popularityScore: 'desc' };
    }

    const [cities, total] = await Promise.all([
      prisma.city.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.city.count({ where }),
    ]);

    res.json({
      data: {
        data: cities,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Search cities error:', err);
    res.status(500).json({ error: { message: 'Failed to search cities' } });
  }
});

// ─── Get Unique Regions ──────────────────────────────────────

router.get('/regions', async (_req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany({
      where: { region: { not: null } },
      select: { region: true },
      distinct: ['region'],
      orderBy: { region: 'asc' },
    });
    const regions = cities.map(c => c.region).filter(Boolean) as string[];
    res.json({ data: regions });
  } catch (err) {
    console.error('Get regions error:', err);
    res.status(500).json({ error: { message: 'Failed to get regions' } });
  }
});

// ─── Get Unique Countries ────────────────────────────────────

router.get('/countries', async (_req: Request, res: Response) => {
  try {
    const cities = await prisma.city.findMany({
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });
    const countries = cities.map(c => c.country);
    res.json({ data: countries });
  } catch (err) {
    console.error('Get countries error:', err);
    res.status(500).json({ error: { message: 'Failed to get countries' } });
  }
});

export default router;
