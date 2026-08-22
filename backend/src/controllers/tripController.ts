import type { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// ─── Create Trip ─────────────────────────────────────────────

export async function createTrip(req: Request, res: Response) {
  try {
    const { name, startDate, endDate, description, coverPhotoUrl } = req.body;

    const trip = await prisma.trip.create({
      data: {
        userId: req.user!.id,
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description: description || null,
        coverPhotoUrl: coverPhotoUrl || null,
      },
      include: {
        stops: {
          include: { city: true, activities: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.status(201).json({ data: trip });
  } catch (err) {
    console.error('Create trip error:', err);
    res.status(500).json({ error: { message: 'Failed to create trip' } });
  }
}

// ─── Get User's Trips ────────────────────────────────────────

export async function getTrips(req: Request, res: Response) {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user!.id },
      include: {
        stops: {
          include: { city: true, activities: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: trips });
  } catch (err) {
    console.error('Get trips error:', err);
    res.status(500).json({ error: { message: 'Failed to fetch trips' } });
  }
}

// ─── Get Single Trip ─────────────────────────────────────────

export async function getTrip(req: Request, res: Response) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        stops: {
          include: { city: true, activities: true },
          orderBy: { orderIndex: 'asc' },
        },
        budgetItems: true,
      },
    });

    if (!trip) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }

    // Check ownership (allow public trips later)
    if (trip.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    res.json({ data: trip });
  } catch (err) {
    console.error('Get trip error:', err);
    res.status(500).json({ error: { message: 'Failed to fetch trip' } });
  }
}

// ─── Update Trip ─────────────────────────────────────────────

export async function updateTrip(req: Request, res: Response) {
  try {
    // Check ownership
    const existing = await prisma.trip.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (existing.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    const updateData: Record<string, any> = {};
    const { name, startDate, endDate, description, coverPhotoUrl, isPublic } = req.body;

    if (name !== undefined) updateData.name = name;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (description !== undefined) updateData.description = description;
    if (coverPhotoUrl !== undefined) updateData.coverPhotoUrl = coverPhotoUrl || null;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const trip = await prisma.trip.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        stops: {
          include: { city: true, activities: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.json({ data: trip });
  } catch (err) {
    console.error('Update trip error:', err);
    res.status(500).json({ error: { message: 'Failed to update trip' } });
  }
}

// ─── Delete Trip ─────────────────────────────────────────────

export async function deleteTrip(req: Request, res: Response) {
  try {
    const existing = await prisma.trip.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: { message: 'Trip not found' } });
      return;
    }
    if (existing.userId !== req.user!.id) {
      res.status(403).json({ error: { message: 'Access denied' } });
      return;
    }

    await prisma.trip.delete({ where: { id: req.params.id } });

    res.json({ data: { message: 'Trip deleted successfully' } });
  } catch (err) {
    console.error('Delete trip error:', err);
    res.status(500).json({ error: { message: 'Failed to delete trip' } });
  }
}
