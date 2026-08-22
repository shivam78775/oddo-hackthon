import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// ─── Add Stop to Trip ────────────────────────────────────────

export async function addStop(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate } = req.body;

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    // Verify city exists
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      res.status(404).json({ error: { message: 'City not found' } });
      return;
    }

    // Auto-assign orderIndex
    const maxStop = await prisma.stop.findFirst({
      where: { tripId },
      orderBy: { orderIndex: 'desc' },
    });
    const orderIndex = (maxStop?.orderIndex ?? -1) + 1;

    const stop = await prisma.stop.create({
      data: {
        tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        orderIndex,
      },
      include: { city: true, activities: true },
    });

    res.status(201).json({ data: stop });
  } catch (err) {
    console.error('Add stop error:', err);
    res.status(500).json({ error: { message: 'Failed to add stop' } });
  }
}

// ─── Update Stop ─────────────────────────────────────────────

export async function updateStop(req: Request, res: Response) {
  try {
    const stop = await prisma.stop.findUnique({
      where: { id: req.params.id },
      include: { trip: true },
    });

    if (!stop) {
      res.status(404).json({ error: { message: 'Stop not found' } });
      return;
    }
    if (stop.trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    const updateData: Record<string, any> = {};
    const { startDate, endDate, orderIndex } = req.body;

    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;

    const updated = await prisma.stop.update({
      where: { id: req.params.id },
      data: updateData,
      include: { city: true, activities: true },
    });

    res.json({ data: updated });
  } catch (err) {
    console.error('Update stop error:', err);
    res.status(500).json({ error: { message: 'Failed to update stop' } });
  }
}

// ─── Delete Stop ─────────────────────────────────────────────

export async function deleteStop(req: Request, res: Response) {
  try {
    const stop = await prisma.stop.findUnique({
      where: { id: req.params.id },
      include: { trip: true },
    });

    if (!stop) {
      res.status(404).json({ error: { message: 'Stop not found' } });
      return;
    }
    if (stop.trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    await prisma.stop.delete({ where: { id: req.params.id } });

    res.json({ data: { message: 'Stop deleted successfully' } });
  } catch (err) {
    console.error('Delete stop error:', err);
    res.status(500).json({ error: { message: 'Failed to delete stop' } });
  }
}

// ─── Reorder Stops ───────────────────────────────────────────

export async function reorderStops(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const { stopIds } = req.body;

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    // Update each stop's orderIndex
    await Promise.all(
      stopIds.map((id: string, index: number) =>
        prisma.stop.update({
          where: { id },
          data: { orderIndex: index },
        })
      )
    );

    res.json({ data: { message: 'Stops reordered successfully' } });
  } catch (err) {
    console.error('Reorder stops error:', err);
    res.status(500).json({ error: { message: 'Failed to reorder stops' } });
  }
}
