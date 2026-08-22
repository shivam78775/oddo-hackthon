import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// ─── Add Activity to Stop ────────────────────────────────────

export async function addActivity(req: Request, res: Response) {
  try {
    const { stopId } = req.params;
    const { name, category, cost, durationMins, description, imageUrl } = req.body;

    // Verify stop exists and user owns the trip
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
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

    const activity = await prisma.activity.create({
      data: {
        stopId,
        name,
        category: category || 'other',
        cost: cost || 0,
        durationMins: durationMins || null,
        description: description || null,
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({ data: activity });
  } catch (err) {
    console.error('Add activity error:', err);
    res.status(500).json({ error: { message: 'Failed to add activity' } });
  }
}

// ─── Update Activity ─────────────────────────────────────────

export async function updateActivity(req: Request, res: Response) {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
      include: { stop: { include: { trip: true } } },
    });

    if (!activity) {
      res.status(404).json({ error: { message: 'Activity not found' } });
      return;
    }
    if (activity.stop.trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    const updateData: Record<string, any> = {};
    const { name, category, cost, durationMins, description, imageUrl } = req.body;

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (cost !== undefined) updateData.cost = cost;
    if (durationMins !== undefined) updateData.durationMins = durationMins;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    const updated = await prisma.activity.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ data: updated });
  } catch (err) {
    console.error('Update activity error:', err);
    res.status(500).json({ error: { message: 'Failed to update activity' } });
  }
}

// ─── Delete Activity ─────────────────────────────────────────

export async function deleteActivity(req: Request, res: Response) {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
      include: { stop: { include: { trip: true } } },
    });

    if (!activity) {
      res.status(404).json({ error: { message: 'Activity not found' } });
      return;
    }
    if (activity.stop.trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    await prisma.activity.delete({ where: { id: req.params.id } });

    res.json({ data: { message: 'Activity deleted successfully' } });
  } catch (err) {
    console.error('Delete activity error:', err);
    res.status(500).json({ error: { message: 'Failed to delete activity' } });
  }
}
