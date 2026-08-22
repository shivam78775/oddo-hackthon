<div align="center">
  <h1>🌍 GlobeTrotter</h1>
  
  <p><strong>A sophisticated, intelligent platform for planning, visualizing, and budgeting multi-city trips seamlessly.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <br/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  </p>
</div>

---

## 📖 Overview

GlobeTrotter was developed from the ground up during a 24-hour hackathon to demonstrate a complete, production-ready full-stack monorepo application. It transforms the chaotic process of trip planning into a visually stunning, dynamic, and intuitive experience. Users can build itineraries step-by-step, manage daily activities across multiple cities, and automatically calculate categorical budgets based on real-time backend data.

Unlike standard mock applications, GlobeTrotter utilizes a real Express+Prisma backend connected to a SQLite database. It implements full CRUD operations, JWT-based authentication, and runtime data validation using Zod.

---

## ✨ Features Deep-Dive

### 1. Dynamic Itinerary Builder
- **Multi-City Planning:** Users can add multiple destination "Stops" to a single trip. The app connects to a real database of seeded cities with geographical and popularity metrics.
- **Chronological Sorting:** The itinerary builder dynamically reorders stops chronologically based on user-selected start and end dates.
- **Activity Engine:** Within each stop, users can seamlessly add inline activities (Sightseeing, Food, Adventure, Transport). The backend actively recalculates totals and durations.

### 2. Comprehensive Budget Engine
- **Automated Cost Aggregation:** The backend aggregates the costs of all activities and base expenses (like flights and hotels) across all stops to provide a total estimated trip expense.
- **Categorical Breakdown:** Expenses are grouped by category. The frontend utilizes `recharts` to render a dynamic Pie Chart showing the distribution of costs visually.
- **Budget Tracking:** Dedicated endpoints ensure that the user's allocated budget is compared against actual estimated expenses.

### 3. Global Discovery & Search
- **City Search Engine:** A high-performance search engine to discover cities based on regions. Features debounced searching and backend pagination.
- **Activity Catalog:** Browse a predefined catalog of 50 real-world activities, filterable by category and cost index.

### 4. Interactive & Premium UI/UX
- **Glassmorphism Design:** Custom Tailwind CSS configuration offering a dark-themed, glass-like aesthetic with subtle gradients and drop shadows.
- **Micro-Animations:** Fluid page transitions, hover effects, and loading states provide a premium application feel.
- **Responsive Layout:** fully optimized for mobile devices, tablets, and desktop viewports.

---

## 🏗️ Architecture & Workflow

GlobeTrotter follows a strict client-server separation within a monorepo structure.

### High-Level Architecture Flowchart

```mermaid
graph TD
    subgraph Client [Frontend - React + Vite]
        UI[React Components / Pages]
        State[React Context / Custom Hooks]
        API_Layer[Axios / Fetch Wrappers]
        
        UI -->|Triggers Action| State
        State -->|Invokes| API_Layer
    end

    subgraph Server [Backend - Express + Node.js]
        Router[Express Routers]
        Auth[JWT Middleware]
        Zod[Zod Request Validation]
        Controllers[Business Logic Controllers]
        
        API_Layer -- HTTP REST / JSON --> Router
        Router --> Auth
        Auth -->|Authorized| Zod
        Zod -->|Validated| Controllers
    end

    subgraph Database [Data Layer]
        ORM[Prisma ORM Client]
        DB[(SQLite dev.db)]
        
        Controllers -->|Prisma Queries| ORM
        ORM -->|SQL| DB
    end
    
    classDef frontend fill:#1e1e3f,stroke:#61DAFB,stroke-width:2px,color:#fff;
    classDef backend fill:#1e1e3f,stroke:#68a063,stroke-width:2px,color:#fff;
    classDef database fill:#1e1e3f,stroke:#3982CE,stroke-width:2px,color:#fff;
    
    class Client frontend;
    class Server backend;
    class Database database;
```

### User Journey Workflow

```mermaid
journey
    title Complete GlobeTrotter User Journey
    section 1. Authentication
      Visit Landing Page: 5: User
      Sign Up / Log In: 5: User
      JWT Cookie Issued: 5: Backend
    section 2. Discovery
      View Personalized Dashboard: 4: User
      Search Trending Cities: 5: User
    section 3. Itinerary Building
      Create New Trip (Dates/Name): 5: User
      Add Stops (Cities to Visit): 4: User
      Add Activities to Stops: 4: User
      Backend Validates Dates: 5: Backend
    section 4. Budget & Review
      View Budget Distribution Charts: 5: User
      Finalize Itinerary & Save: 5: User
```

---

## 🗄️ Database Structure

The application uses Prisma ORM connected to a SQLite database. The schema is highly normalized to handle complex many-to-many travel relationships.

### Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ TRIP : creates
    USER ||--o{ POST : writes
    
    TRIP ||--o{ STOP : contains
    TRIP ||--o{ BUDGET_ITEM : manages
    
    CITY ||--o{ STOP : "is location for"
    
    STOP ||--o{ ACTIVITY : includes
    
    USER {
        String id PK
        String name
        String email UK
        String passwordHash
        String role "USER/ADMIN"
    }
    
    TRIP {
        String id PK
        String userId FK
        String name
        DateTime startDate
        DateTime endDate
        Boolean isPublic
    }
    
    CITY {
        String id PK
        String name
        String country
        Float costIndex
        Float popularityScore
    }
    
    STOP {
        String id PK
        String tripId FK
        String cityId FK
        DateTime startDate
        DateTime endDate
        Int orderIndex
    }
    
    ACTIVITY {
        String id PK
        String stopId FK
        String name
        String category
        Float cost
        Int durationMins
    }
    
    BUDGET_ITEM {
        String id PK
        String tripId FK
        String category
        Float amount
    }
```

---

## 📡 Core API Reference

The backend exposes a comprehensive RESTful API. Below is a high-level overview of the primary routes. All routes (except `/api/auth/login` and `/register`) require a valid JWT cookie.

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | Registers a new user and returns a JWT |
| **POST** | `/api/auth/login` | Authenticates a user and sets an `httpOnly` cookie |
| **GET**  | `/api/auth/me` | Returns the currently authenticated user profile |
| **GET**  | `/api/trips` | Fetches all trips belonging to the authenticated user |
| **POST** | `/api/trips` | Creates a new trip |
| **GET**  | `/api/trips/:id` | Fetches a specific trip, including all nested stops and activities |
| **GET**  | `/api/cities/search` | Queries the database for cities (supports `?q=` query parameters) |
| **GET**  | `/api/budget/:tripId` | Calculates and returns aggregated categorical budget data for a trip |

---

## 🚀 Getting Started

Follow these steps to spin up the entire full-stack environment locally.

### Prerequisites
*   **Node.js:** v18 or higher
*   **Git:** Version control

### 1. Clone the Repository
```bash
git clone https://github.com/shivam78775/oddo-hackthon.git
cd oddo-hackthon
```

### 2. Backend Setup
The backend serves the REST API, handles authentication, and connects to the SQLite database.
```bash
cd backend

# Install all backend dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate SQLite DB schema and Prisma Client types
npx prisma db push

# Seed the database with 30 cities and 50 activities for testing
npm run db:seed

# Start the Express development server (Runs on port 4000)
npm run dev
```

### 3. Frontend Setup
Open a **new terminal window** and navigate to the frontend directory.
```bash
cd frontend

# Install all frontend dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the Vite development server (Runs on port 5173)
npm run dev
```

### 4. Experience GlobeTrotter
1. Open your browser and navigate to `http://localhost:5173`.
2. Click **Sign Up** to create a test account (or use the seeded demo credentials if provided).
3. Experience the full flow: Create a trip, add cities, assign activities, and watch the budget charts render dynamically!

---

<div align="center">
  <p>Built with ❤️ during the Odoo Hackathon.</p>
</div>
