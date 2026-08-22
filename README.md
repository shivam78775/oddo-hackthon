<div align="center">
  <img src="frontend/src/assets/hero.png" alt="GlobeTrotter Banner" width="100%" />

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

GlobeTrotter was developed during a 24-hour hackathon to demonstrate a complete, full-stack monorepo application. It transforms the chaotic process of trip planning into a visually stunning, dynamic, and intuitive experience. Users can build itineraries step-by-step, manage daily activities, and automatically calculate categorical budgets based on real-time data.

---

## ✨ Core Features

*   **Dynamic Itinerary Builder:** Create trips with multiple stops. Reorder them chronologically with an intuitive drag-and-drop interface.
*   **Activity Engine:** Add specific activities (Sightseeing, Food, Adventure) to each stop, tied to real-world catalog data.
*   **Automated Budgeting:** Automatically calculates and aggregates costs across all stops. Visualizes expenses via interactive Recharts (Pie and Bar graphs).
*   **Global Discovery:** Search and filter through a seeded database of international cities and curated activities.
*   **Personalized Dashboard:** A customized landing page showcasing upcoming trips and trending destinations.

---

## 🏗️ Architecture & Workflow

GlobeTrotter follows a strict client-server separation within a monorepo structure.

### High-Level Architecture Flowchart

```mermaid
graph TD
    subgraph Client [Frontend - React + Vite]
        UI[User Interface]
        State[React Context / Hooks]
        API_Layer[API Fetch Wrappers]
        
        UI --> State
        State --> API_Layer
    end

    subgraph Server [Backend - Express + Node.js]
        Router[Express Routers]
        Controllers[Business Logic Controllers]
        Auth[JWT Middleware]
        Zod[Zod Validation]
        
        API_Layer -- HTTP REST --> Router
        Router --> Auth
        Auth --> Zod
        Zod --> Controllers
    end

    subgraph Database [Data Layer]
        ORM[Prisma ORM]
        DB[(SQLite dev.db)]
        
        Controllers --> ORM
        ORM --> DB
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
    title Planning a Trip on GlobeTrotter
    section Authentication
      Sign Up / Log In: 5: User
      JWT Token Issued: 5: System
    section Discovery
      View Dashboard: 4: User
      Search for Cities: 5: User
    section Itinerary Building
      Create New Trip: 5: User
      Add Stops (Cities): 4: User
      Add Activities to Stops: 4: User
    section Budget & Review
      View Budget Charts: 5: User
      Finalize Itinerary: 5: User
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

## 🚀 Getting Started

Follow these steps to spin up the entire full-stack environment locally.

### Prerequisites
*   Node.js v18+
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/shivam78775/oddo-hackthon.git
cd oddo-hackthon
```

### 2. Backend Setup
The backend serves the REST API and connects to SQLite.
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate SQLite DB and Prisma Client
npx prisma db push

# Seed the database with 30 cities and 50 activities
npm run db:seed

# Start the dev server (Runs on port 4000)
npm run dev
```

### 3. Frontend Setup
Open a **new terminal window** and navigate to the frontend directory.
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the Vite development server (Runs on port 5173)
npm run dev
```

### 4. Experience GlobeTrotter
Navigate to `http://localhost:5173` in your browser. Create an account, build a trip, and watch the budget dynamically generate!

---

<div align="center">
  <p>Built with ❤️ during the Odoo Hackathon.</p>
</div>
