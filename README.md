# 🌍 GlobeTrotter

GlobeTrotter is a complete, full-stack monorepo application built during a 24-hour hackathon. It is a smart travel itinerary builder designed to help users plan, visualize, and budget their multi-city trips in one seamless experience.

---

## ✨ Key Features

### 1. Dynamic Trip & Itinerary Builder
- **Multi-City Planning:** Add multiple destinations (Stops) to a single trip, linked to a real-world database of seeded cities.
- **Drag & Drop Organization:** The itinerary builder allows you to dynamically reorder stops chronologically.
- **Activity Management:** Seamlessly add inline activities (Sightseeing, Food, Adventure) within each stop.

### 2. Comprehensive Budget Engine
- **Automated Cost Aggregation:** The backend actively aggregates activity costs across stops to provide total estimated trip expenses.
- **Categorical Breakdown:** Expenses are grouped by category, utilizing `recharts` to render a dynamic Pie Chart showing the distribution of costs.
- **Daily Spending Trends:** A dynamic Bar Chart illustrates how the budget is distributed day-by-day across the trip timeline.

### 3. Global Discovery
- **City Search Engine:** Discover cities based on regions using debounced searching and backend pagination.
- **Activity Catalog:** Browse a predefined catalog of 50 real-world activities, filterable by category and cost.

### 4. Interactive Dashboards
- **User Dashboard:** A personalized landing page showing a greeting, recent trips, and trending destinations.
- **Trip Management (My Trips):** Organizes trips into "Happening Now", "Upcoming", and "Past", with intuitive delete actions.

---

## 🏗️ Technical Architecture

GlobeTrotter uses a modern, strictly-typed monorepo architecture, clearly separating frontend client code from backend API logic.

### Frontend (`/frontend`)
- **Framework:** React 18 powered by Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom glassmorphism components, gradients, and micro-animations.
- **Routing:** React Router v7
- **State & Data Fetching:** React Hooks, Context API, and modular API wrapper functions.
- **Data Visualization:** Recharts

### Backend (`/backend`)
- **Framework:** Express 5 (Node.js)
- **Language:** TypeScript
- **Authentication:** JSON Web Tokens (JWT) stored securely in `httpOnly` cookies. Passwords hashed using `bcryptjs`.
- **Validation:** Strict type safety and runtime validation using `zod` schemas.

### Database Layer (`/backend/src/prisma`)
- **Database:** SQLite (Migrated from PostgreSQL for frictionless local development)
- **ORM:** Prisma
- **Data Model:**
  - `User`, `Trip`, `City`, `Stop`, `Activity`, `BudgetItem`
- **Seed Data:** Ships with a powerful `seed.ts` script that inserts **30 real-world cities** and **50 activities** into the database.

---

## 🚀 Getting Started

Follow these steps to run the complete full-stack environment locally on your machine.

### Prerequisites
- **Node.js:** v18 or higher

### 1. Repository Setup
```bash
git clone https://github.com/shivam78775/oddo-hackthon.git
cd oddo-hackthon
```

### 2. Backend Initialization
The backend serves the API and connects to the SQLite database.

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push the Prisma schema to generate the SQLite database (dev.db)
npx prisma db push

# Seed the database with the 30 real-world cities
npm run db:seed

# Start the development server
npm run dev
```
*The backend API is now running on `http://localhost:4000`.*

### 3. Frontend Initialization
Open a **new terminal window** and navigate to the frontend directory.

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the Vite development server
npm run dev
```
*The frontend is now running on `http://localhost:5173`.*

### 4. Testing the Application
1. Open your browser and navigate to **http://localhost:5173**.
2. Click **Sign Up** to create a new user account.
3. Explore the Dashboard, search for cities, and create your first Trip!

---

## 🏆 Hackathon Context

This project was built to demonstrate full-stack capabilities within a restricted 24-hour time frame. 
- All data is dynamic and stored via SQLite (no static frontend JSON files).
- The UI is highly responsive and designed with a premium, animated aesthetic.
- Form inputs across the application are validated strictly via Zod on the server.
