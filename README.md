# GlobeTrotter 🌍

A personalized, intelligent platform for planning and visualizing multi-city trips — itinerary building, budget estimation, and sharing, all in one flow.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + React Router + Recharts
- **Backend:** Node.js + Express 5 + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT in httpOnly cookies + bcrypt
- **Validation:** Zod (client + server)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally (or a cloud PostgreSQL URL)

### 1. Clone and install

```bash
git clone https://github.com/shivam78775/oddo-hackthon.git
cd oddo-hackthon
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install
npx prisma db push        # Create tables
npm run db:seed            # Seed 30 cities
npm run dev                # Starts on http://localhost:4000
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # Starts on http://localhost:5173
```

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/globetrotter` |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `PORT` | Backend server port | `4000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000/api` |

## Project Structure

```
/globetrotter
  /backend          # Express + Prisma API
    /src
      /routes       # Route definitions
      /controllers  # Business logic
      /middleware   # Auth, validation, error handling
      /prisma       # Schema + seed
      /lib          # DB client, JWT helpers
  /frontend         # React + Vite UI
    /src
      /pages        # Page components
      /components   # Reusable UI components
      /api          # Typed fetch wrappers
      /context      # React context (auth)
      /hooks        # Custom hooks
      /types        # TypeScript types
```

## Features

- 🔐 Sign up / Login with secure JWT auth
- ✈️ Create and manage multi-city trips
- 🗺️ Build itineraries with stops and activities
- 💰 Auto-computed budget breakdown with charts
- 📅 Day-wise itinerary view
- 🔍 Search cities and activities
- 📱 Fully responsive design
