# GlobeTrotter 🌍

A personalized, intelligent platform for planning and visualizing multi-city trips — itinerary building, budget estimation, and sharing, all in one seamless flow. Built from the ground up for a 24-hour hackathon to demonstrate a complete full-stack web application.

## 🚀 Features & Implementation

GlobeTrotter was evolved from a mock frontend prototype into a **production-ready full-stack monorepo**, fulfilling all hackathon requirements for dynamic data, responsive UI, and backend robustness.

### Frontend (React 18 + Vite + Tailwind CSS)
- **Stunning UI/UX**: Built with a sleek dark theme, glassmorphism design (translucent cards), gradient text, and micro-animations for a premium feel.
- **Dynamic Dashboards**: User dashboard and "My Trips" pages segmented by Ongoing, Upcoming, and Past trips.
- **Interactive Itinerary Builder**: Real-time interface to add cities as stops, assign travel dates, reorder stops (up/down), and inline creation of activities (sightseeing, food, adventure, etc.).
- **Budget Data Visualization**: Integrated `recharts` to render a Pie chart for categorical expenses (food vs. transport) and a Bar chart for daily expense breakdowns.
- **Global Search Engine**: Real-time debounce searching with filtering by Region and Category for both Cities and Activities.

### Backend (Node.js + Express 5 + TypeScript)
- **Robust REST API**: Fully typed Express API with modular controllers, routes, and middleware.
- **Authentication**: JWT-based secure authentication using `httpOnly` cookies and `bcrypt` password hashing.
- **Validation**: Strict input validation on both client and server using `Zod` schemas.
- **Database Architecture**: PostgreSQL relational database managed via Prisma ORM. Strict foreign key constraints and cascading deletes ensure data integrity (e.g., deleting a trip deletes its stops and activities).

### Data Layer (PostgreSQL + Prisma)
- **Real-World Seed Data**: The database is seeded with 30 real-world cities across the globe (complete with popularity scores, cost indices, and images) and 50 global activities. This satisfies the strict hackathon requirement of using real database records rather than static JSON files on the frontend.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router, Recharts, Lucide Icons
- **Backend:** Node.js, Express 5, TypeScript, JWT, bcrypt, Zod
- **Database:** PostgreSQL, Prisma ORM

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (running locally or a cloud database URL)

### 1. Clone the repository
```bash
git clone https://github.com/shivam78775/oddo-hackthon.git
cd oddo-hackthon
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure your environment variables
cp .env.example .env
# Important: Update the DATABASE_URL in .env to match your PostgreSQL password!

# Push the schema and seed the database
npx prisma db push
npm run db:seed

# Start the API server
npm run dev
# The backend will start on http://localhost:4000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install

# Configure your environment variables
cp .env.example .env

# Start the Vite development server
npm run dev
# The frontend will start on http://localhost:5173
```

### 4. Experience GlobeTrotter
Visit **[http://localhost:5173](http://localhost:5173)** in your browser. Create an account, explore cities, and start building your first itinerary!

## 📂 Project Structure

```text
/oddo-hackthon
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── controllers/      # Business logic (auth, trips, stops, budget)
│   │   ├── middleware/       # JWT auth guard, Zod validation, error handling
│   │   ├── prisma/           # Schema definitions and DB seed scripts
│   │   ├── routes/           # Express route definitions
│   │   ├── lib/              # DB connection and JWT utilities
│   │   └── app.ts            # App entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React + Vite UI
│   ├── src/
│   │   ├── api/              # Typed fetch wrappers calling the backend
│   │   ├── components/       # Reusable UI elements (NavBar, TripCard, Forms)
│   │   ├── context/          # React context (Auth session state)
│   │   ├── pages/            # View components (Dashboard, Builder, Search)
│   │   ├── types/            # Shared TypeScript interfaces
│   │   └── index.css         # Tailwind directives and custom animations
│   ├── package.json
│   └── vite.config.ts
│
├── SEED.md                   # Documentation on the seeded real-world dataset
└── README.md                 # You are here!
```
