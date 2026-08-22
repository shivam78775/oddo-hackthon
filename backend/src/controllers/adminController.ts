import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// Verify Admin Middleware
export async function adminGuard(req: Request, res: Response, next: Function) {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: { message: 'Forbidden: Admin access required' } });
    return;
  }
  next();
}

export async function getAdminStats(req: Request, res: Response) {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    
    // Most popular cities based on how many stops use them
    const popularCitiesRaw = await prisma.stop.groupBy({
      by: ['cityId'],
      _count: { cityId: true },
      orderBy: { _count: { cityId: 'desc' } },
      take: 5
    });
    
    // Fetch city names
    const cityIds = popularCitiesRaw.map(s => s.cityId);
    const cities = await prisma.city.findMany({ where: { id: { in: cityIds } } });
    
    const popularCities = popularCitiesRaw.map(raw => ({
      name: cities.find(c => c.id === raw.cityId)?.name || 'Unknown',
      count: raw._count.cityId
    }));

    // User growth trend (mocked for past 6 months to have data, since all seeded are new)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const userGrowth = months.map(month => ({
      month,
      users: Math.floor(Math.random() * 50) + 10 // Mock data for hackathon visual
    }));

    res.json({
      totalUsers,
      totalTrips,
      popularCities,
      userGrowth
    });
  } catch (err) {
    console.error('Failed to get admin stats:', err);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { trips: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err) {
    console.error('Failed to get users:', err);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
}
