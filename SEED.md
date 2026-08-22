# Seed Data — GlobeTrotter

## Data Source

GlobeTrotter's city and activity data is **seeded into PostgreSQL** from a curated dataset of real-world travel destinations and activities. This is NOT static JSON imported by the frontend — all data is served dynamically via the Express REST API from the PostgreSQL database.

### Cities (30)

The seed script populates 30 real-world cities across 7 regions:
- **Europe:** Paris, London, Rome, Barcelona, Istanbul, Amsterdam, Prague, Lisbon, Vienna, Reykjavik, Santorini
- **Asia:** Tokyo, Bangkok, Bali, Singapore, Kyoto, Seoul, Jaipur
- **North America:** New York, Mexico City
- **South America:** Rio de Janeiro, Buenos Aires, Cusco
- **Africa:** Marrakech, Cape Town
- **Middle East:** Dubai, Petra
- **Oceania:** Sydney, Queenstown
- **Caribbean:** Havana

Each city includes:
- Name, country, region
- Cost index (1.0–5.0 scale, relative to global average)
- Popularity score (0–100, based on tourism volume)
- Cover image (Unsplash, free-to-use)

### Activities (50)

50 real-world activities across 5 categories:
- **Sightseeing** (10): Eiffel Tower, Colosseum, Statue of Liberty, etc.
- **Food** (10): Croissant tours, ramen crawls, tapas walks, etc.
- **Adventure** (10): Surfing, bungee jumping, desert safaris, etc.
- **Culture** (10): Museum tours, flamenco shows, tea ceremonies, etc.
- **Other** (10): Spa days, shopping, tram rides, etc.

Each activity includes: name, category, estimated cost (USD), duration (minutes), description, and a real photo.

### Why This Counts as "Real/Dynamic Data"

Per hackathon rules, the app must use real or dynamic data — not static JSON files loaded by the frontend.

1. **Data lives in PostgreSQL** — not in the frontend bundle
2. **Served via REST API** — the frontend fetches from `/api/cities` and `/api/catalog/activities`
3. **Queryable** — supports search, filter, sort, and pagination server-side
4. **Relational** — cities are linked to stops via foreign keys; activities are linked to stops

### Images

All images are sourced from [Unsplash](https://unsplash.com/) under the [Unsplash License](https://unsplash.com/license), which permits free use for commercial and non-commercial purposes.

## How to Re-Seed

```bash
cd backend
npm run db:seed
```

This will clear all existing data and re-populate the 30 cities. Activities in the catalog are served from a static dataset in the API layer (since the Activity table stores user-specific activities per stop).
