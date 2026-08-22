import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/db.js';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '../lib/jwt.js';

// ─── Signup ──────────────────────────────────────────────────

export async function signup(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, phone, city, country } = req.body;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({
        error: {
          message: 'Email already in use',
          fields: { email: 'This email is already registered' },
        },
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        passwordHash,
        phone: phone || null,
        city: city || null,
        country: country || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        phone: true,
        city: true,
        country: true,
        createdAt: true,
      },
    });

    // Set JWT cookie
    const token = signToken({ userId: user.id });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(201).json({ data: user });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: { message: 'Failed to create account' } });
  }
}

// ─── Login ───────────────────────────────────────────────────

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: { message: 'Invalid email or password' } });
      return;
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: { message: 'Invalid email or password' } });
      return;
    }

    // Set JWT cookie
    const token = signToken({ userId: user.id });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        phone: user.phone,
        city: user.city,
        country: user.country,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: { message: 'Login failed' } });
  }
}

// ─── Logout ──────────────────────────────────────────────────

export async function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ data: { message: 'Logged out successfully' } });
}

// ─── Get Current User ────────────────────────────────────────

export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Not authenticated' } });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        photoUrl: true,
        phone: true,
        city: true,
        country: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: { message: 'User not found' } });
      return;
    }

    res.json({ data: user });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: { message: 'Failed to get user' } });
  }
}
