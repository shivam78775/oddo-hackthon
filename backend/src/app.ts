import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import tripRoutes from './routes/trips.js';
import stopRoutes from './routes/stops.js';
import activityRoutes from './routes/activities.js';
import cityRoutes from './routes/cities.js';
import budgetRoutes from './routes/budget.js';
import catalogRoutes from './routes/catalogActivities.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/catalog', catalogRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
