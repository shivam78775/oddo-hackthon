import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// ─── Budget Breakdown ────────────────────────────────────────

export async function getBudgetBreakdown(req: Request, res: Response) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        stops: {
          include: { activities: true },
          orderBy: { orderIndex: 'asc' },
        },
        budgetItems: true,
      },
    });

    if (!trip) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    // Initialize category totals
    const byCategory: Record<string, number> = {
      transport: 0,
      stay: 0,
      activity: 0,
      meal: 0,
    };

    // Sum BudgetItems
    for (const item of trip.budgetItems) {
      if (byCategory[item.category] !== undefined) {
        byCategory[item.category] += item.amount;
      }
    }

    // Sum Activity costs into 'activity' category
    for (const stop of trip.stops) {
      for (const act of stop.activities) {
        byCategory.activity += act.cost;
      }
    }

    // Compute by-day totals
    const dayMap = new Map<string, number>();

    // Distribute budget items across stop days (or trip days if no stopId)
    for (const item of trip.budgetItems) {
      if (item.stopId) {
        const stop = trip.stops.find((s: any) => s.id === item.stopId);
        if (stop) {
          const days = getDaysBetween(stop.startDate, stop.endDate);
          const perDay = item.amount / Math.max(days.length, 1);
          for (const day of days) {
            dayMap.set(day, (dayMap.get(day) || 0) + perDay);
          }
        }
      } else {
        // Distribute across entire trip
        const days = getDaysBetween(trip.startDate, trip.endDate);
        const perDay = item.amount / Math.max(days.length, 1);
        for (const day of days) {
          dayMap.set(day, (dayMap.get(day) || 0) + perDay);
        }
      }
    }

    // Add activity costs to the days of their parent stop
    for (const stop of trip.stops) {
      const days = getDaysBetween(stop.startDate, stop.endDate);
      const activityTotal = stop.activities.reduce((sum: number, a: { cost: number }) => sum + a.cost, 0);
      const perDay = activityTotal / Math.max(days.length, 1);
      for (const day of days) {
        dayMap.set(day, (dayMap.get(day) || 0) + perDay);
      }
    }

    // Sort by date
    const byDay = Array.from(dayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({ date, total: Math.round(total * 100) / 100 }));

    const total = Object.values(byCategory).reduce((sum, v) => sum + v, 0);
    const tripDays = getDaysBetween(trip.startDate, trip.endDate).length || 1;
    const averagePerDay = Math.round((total / tripDays) * 100) / 100;

    res.json({
      data: {
        byCategory,
        byDay,
        total: Math.round(total * 100) / 100,
        averagePerDay,
      },
    });
  } catch (err) {
    console.error('Budget breakdown error:', err);
    res.status(500).json({ error: { message: 'Failed to compute budget' } });
  }
}

// ─── Helper: get array of date strings between two dates ─────

function getDaysBetween(start: Date, end: Date): string[] {
  const days: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);

  while (current <= endDate) {
    days.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return days;
}

// ─── Add Budget Item ─────────────────────────────────────────

export async function addBudgetItem(req: Request, res: Response) {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });

    if (!trip) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    const { category, amount, stopId } = req.body;

    const budgetItem = await prisma.budgetItem.create({
      data: {
        tripId: trip.id,
        category,
        amount,
        stopId: stopId || null,
      },
    });

    res.status(201).json({ data: budgetItem });
  } catch (err) {
    console.error('Add budget item error:', err);
    res.status(500).json({ error: { message: 'Failed to add budget item' } });
  }
}

// ─── Get Budget Items ────────────────────────────────────────

export async function getBudgetItems(req: Request, res: Response) {
  try {
    const trip = await prisma.trip.findUnique({ where: { id: req.params.id } });

    if (!trip) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    const items = await prisma.budgetItem.findMany({
      where: { tripId: trip.id },
      orderBy: { id: 'desc' },
    });

    res.json({ data: items });
  } catch (err) {
    console.error('Get budget items error:', err);
    res.status(500).json({ error: { message: 'Failed to get budget items' } });
  }
}
