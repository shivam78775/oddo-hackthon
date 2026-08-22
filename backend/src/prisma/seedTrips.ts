import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const alex = await prisma.user.findUnique({ where: { email: 'alex@example.com' } });
  const sarah = await prisma.user.findUnique({ where: { email: 'sarah@example.com' } });
  const admin = await prisma.user.findUnique({ where: { email: 'admin@globetrotter.com' } });

  const cities = await prisma.city.findMany({ take: 10 });
  if (cities.length < 5) {
    console.error('Not enough cities found. Please run the main seed script first.');
    return;
  }

  const activities = await prisma.activity.findMany({ take: 20 });
  
  if (!alex || !sarah) {
    console.error('Test users not found. Please run the main seed script first.');
    return;
  }

  console.log('Clearing old test trips...');
  await prisma.trip.deleteMany(); // Clear all trips first to avoid duplicates

  console.log('🌱 Seeding trips for test users...');

  // 1. Alex's Ongoing Trip (Paris & London)
  const alexOngoing = await prisma.trip.create({
    data: {
      userId: alex.id,
      name: 'European Getaway',
      description: 'A two-week adventure exploring the best of Paris and London.',
      startDate: new Date(new Date().setDate(new Date().getDate() - 2)), // Started 2 days ago
      endDate: new Date(new Date().setDate(new Date().getDate() + 10)),  // Ends in 10 days
      coverPhotoUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      isPublic: true,
      publicSlug: 'alex-europe-2026',
      stops: {
        create: [
          {
            cityId: cities[0].id, // Paris
            startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 4)),
            orderIndex: 0,
            activities: {
              create: [
                { name: 'Eiffel Tower Tour', category: 'sightseeing', cost: 45, durationMins: 120 },
                { name: 'Seine Dinner Cruise', category: 'food', cost: 120, durationMins: 180 }
              ]
            }
          },
          {
            cityId: cities[3].id, // London
            startDate: new Date(new Date().setDate(new Date().getDate() + 4)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
            orderIndex: 1,
            activities: {
              create: [
                { name: 'London Eye', category: 'sightseeing', cost: 35, durationMins: 60 }
              ]
            }
          }
        ]
      },
      budgetItems: {
        create: [
          { category: 'transport', amount: 800 },
          { category: 'stay', amount: 1200 },
          { category: 'meal', amount: 500 }
        ]
      }
    }
  });

  // 2. Alex's Upcoming Trip (Tokyo)
  await prisma.trip.create({
    data: {
      userId: alex.id,
      name: 'Japan Tech & Culture',
      startDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
      coverPhotoUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      isPublic: false,
      stops: {
        create: [
          {
            cityId: cities[1].id, // Tokyo
            startDate: new Date(new Date().setDate(new Date().getDate() + 45)),
            endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
            orderIndex: 0
          }
        ]
      },
      budgetItems: {
        create: [
          { category: 'transport', amount: 1500 },
          { category: 'stay', amount: 900 }
        ]
      }
    }
  });

  // 3. Sarah's Past Trip (Bali)
  await prisma.trip.create({
    data: {
      userId: sarah.id,
      name: 'Bali Retreat',
      description: 'Relaxing beaches, yoga, and amazing food in Indonesia.',
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(new Date().setDate(new Date().getDate() - 15)),
      coverPhotoUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      isPublic: true,
      stops: {
        create: [
          {
            cityId: cities[4].id, // Bali (approx index based on main seed)
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
            endDate: new Date(new Date().setDate(new Date().getDate() - 15)),
            orderIndex: 0
          }
        ]
      }
    }
  });

  // 4. Admin's Trip
  if (admin) {
    await prisma.trip.create({
      data: {
        userId: admin.id,
        name: 'Admin Global Tour',
        startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        coverPhotoUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
        isPublic: true,
        stops: {
          create: [
            {
              cityId: cities[2].id, // NY
              startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
              endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
              orderIndex: 0
            }
          ]
        },
        budgetItems: {
          create: [
            { category: 'transport', amount: 400 },
            { category: 'stay', amount: 2000 }
          ]
        }
      }
    });
  }

  console.log('✅ Created 4 trips successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
