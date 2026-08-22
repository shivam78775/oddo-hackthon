import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

// ─── Activity Catalog (static dataset served from API) ───────
// These are template activities for discovery/search, not user-specific.

const CATALOG_ACTIVITIES = [
  // Sightseeing (10)
  { id: 'cat-1', name: 'Eiffel Tower Visit', category: 'sightseeing', cost: 26, durationMins: 120, description: 'Iconic iron lattice tower on the Champ de Mars, offering stunning panoramic views of Paris.', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80' },
  { id: 'cat-2', name: 'Colosseum Tour', category: 'sightseeing', cost: 18, durationMins: 150, description: 'Ancient amphitheatre in the heart of Rome, a symbol of Roman engineering and history.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
  { id: 'cat-3', name: 'Statue of Liberty Ferry', category: 'sightseeing', cost: 24, durationMins: 180, description: 'Ferry ride to Liberty Island with views of the iconic statue and Manhattan skyline.', imageUrl: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400&q=80' },
  { id: 'cat-4', name: 'Sagrada Familia Tour', category: 'sightseeing', cost: 26, durationMins: 120, description: 'Gaudí\'s masterpiece basilica, an architectural wonder still under construction since 1882.', imageUrl: 'https://images.unsplash.com/photo-1583779457094-ab6f9164a1f8?w=400&q=80' },
  { id: 'cat-5', name: 'Tower Bridge Walk', category: 'sightseeing', cost: 12, durationMins: 90, description: 'Walk across the glass floor of London\'s iconic bascule bridge over the Thames.', imageUrl: 'https://images.unsplash.com/photo-1471874276752-65e2d717604a?w=400&q=80' },
  { id: 'cat-6', name: 'Grand Palace Visit', category: 'sightseeing', cost: 15, durationMins: 120, description: 'The official residence of the Kings of Siam, featuring intricate Thai architecture.', imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80' },
  { id: 'cat-7', name: 'Sydney Opera House Tour', category: 'sightseeing', cost: 28, durationMins: 90, description: 'Behind-the-scenes tour of one of the world\'s most famous performing arts venues.', imageUrl: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=400&q=80' },
  { id: 'cat-8', name: 'Burj Khalifa Observation', category: 'sightseeing', cost: 40, durationMins: 60, description: 'Visit the observation deck of the world\'s tallest building for breathtaking views.', imageUrl: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&q=80' },
  { id: 'cat-9', name: 'Machu Picchu Trek', category: 'sightseeing', cost: 50, durationMins: 480, description: 'Explore the ancient Incan citadel set high in the Andes Mountains of Peru.', imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&q=80' },
  { id: 'cat-10', name: 'Santorini Sunset at Oia', category: 'sightseeing', cost: 0, durationMins: 120, description: 'Watch the world-famous sunset from Oia village on the caldera rim.', imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  // Food (10)
  { id: 'cat-11', name: 'Parisian Croissant Tour', category: 'food', cost: 35, durationMins: 150, description: 'Walk through Parisian bakeries tasting the finest croissants, pain au chocolat, and pastries.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80' },
  { id: 'cat-12', name: 'Tokyo Ramen Crawl', category: 'food', cost: 25, durationMins: 180, description: 'Visit three legendary ramen shops in different Tokyo neighborhoods.', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80' },
  { id: 'cat-13', name: 'Bangkok Street Food Tour', category: 'food', cost: 15, durationMins: 180, description: 'Explore Chinatown\'s vibrant street food scene with pad thai, mango sticky rice, and more.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: 'cat-14', name: 'Italian Pasta Making Class', category: 'food', cost: 55, durationMins: 180, description: 'Learn to make fresh pasta from scratch with a local Italian chef in Rome.', imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&q=80' },
  { id: 'cat-15', name: 'Tapas Walking Tour', category: 'food', cost: 40, durationMins: 180, description: 'Sample the best tapas bars in Barcelona\'s Gothic Quarter with a local guide.', imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&q=80' },
  { id: 'cat-16', name: 'Turkish Breakfast Experience', category: 'food', cost: 20, durationMins: 120, description: 'Enjoy a traditional Turkish breakfast with dozens of small dishes by the Bosphorus.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80' },
  { id: 'cat-17', name: 'Sushi Omakase in Kyoto', category: 'food', cost: 80, durationMins: 90, description: 'Chef\'s choice multi-course sushi dinner at a traditional Kyoto counter.', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
  { id: 'cat-18', name: 'Marrakech Spice Market Tour', category: 'food', cost: 18, durationMins: 120, description: 'Explore the aromatic spice souks and learn about Moroccan culinary traditions.', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' },
  { id: 'cat-19', name: 'Mexican Taco Tour', category: 'food', cost: 22, durationMins: 150, description: 'Hit the best taco stands in Mexico City for al pastor, carnitas, and more.', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
  { id: 'cat-20', name: 'Wine Tasting in Lisbon', category: 'food', cost: 45, durationMins: 120, description: 'Sample Portuguese wines including Vinho Verde and Port at a historic wine bar.', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80' },
  // Adventure (10)
  { id: 'cat-21', name: 'Bali Surfing Lesson', category: 'adventure', cost: 35, durationMins: 120, description: 'Learn to surf on the gentle waves of Kuta Beach with experienced local instructors.', imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40cef78?w=400&q=80' },
  { id: 'cat-22', name: 'Queenstown Bungee Jump', category: 'adventure', cost: 150, durationMins: 60, description: 'Jump from the historic Kawarau Bridge, birthplace of commercial bungee jumping.', imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80' },
  { id: 'cat-23', name: 'Cape Town Table Mountain Hike', category: 'adventure', cost: 10, durationMins: 240, description: 'Hike up the iconic flat-topped mountain for panoramic views of the city and ocean.', imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
  { id: 'cat-24', name: 'Iceland Golden Circle Tour', category: 'adventure', cost: 85, durationMins: 480, description: 'Visit Þingvellir, Geysir geothermal area, and the thundering Gullfoss waterfall.', imageUrl: 'https://images.unsplash.com/photo-1509225770129-c88e3a50f0d7?w=400&q=80' },
  { id: 'cat-25', name: 'Dubai Desert Safari', category: 'adventure', cost: 65, durationMins: 360, description: 'Dune bashing, camel rides, and a desert dinner under the stars.', imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&q=80' },
  { id: 'cat-26', name: 'Rio Hang Gliding', category: 'adventure', cost: 120, durationMins: 60, description: 'Tandem hang glide over Rio with views of Copacabana, Ipanema, and Christ the Redeemer.', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80' },
  { id: 'cat-27', name: 'Petra Night Walk', category: 'adventure', cost: 20, durationMins: 120, description: 'Walk through the Siq to the Treasury illuminated by thousands of candles.', imageUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=400&q=80' },
  { id: 'cat-28', name: 'Amsterdam Canal Kayaking', category: 'adventure', cost: 30, durationMins: 120, description: 'Paddle through Amsterdam\'s historic canal ring, a UNESCO World Heritage Site.', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80' },
  { id: 'cat-29', name: 'Singapore Night Safari', category: 'adventure', cost: 45, durationMins: 180, description: 'World\'s first nocturnal zoo, home to over 900 animals in natural habitats.', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { id: 'cat-30', name: 'Seoul DMZ Tour', category: 'adventure', cost: 55, durationMins: 480, description: 'Visit the Korean Demilitarized Zone, one of the most heavily fortified borders in the world.', imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80' },
  // Culture (10)
  { id: 'cat-31', name: 'Louvre Museum Tour', category: 'culture', cost: 17, durationMins: 180, description: 'Explore the world\'s largest art museum, home to the Mona Lisa and Venus de Milo.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
  { id: 'cat-32', name: 'Tokyo Meiji Shrine Visit', category: 'culture', cost: 0, durationMins: 90, description: 'Serene Shinto shrine in a forest clearing, dedicated to Emperor Meiji.', imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80' },
  { id: 'cat-33', name: 'Flamenco Show in Barcelona', category: 'culture', cost: 35, durationMins: 90, description: 'Experience passionate flamenco dancing and music in an intimate tablao setting.', imageUrl: 'https://images.unsplash.com/photo-1594913503906-f36b05c7e8d1?w=400&q=80' },
  { id: 'cat-34', name: 'Havana Vintage Car Tour', category: 'culture', cost: 40, durationMins: 120, description: 'Cruise through Havana in a colorful 1950s American convertible with a local guide.', imageUrl: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400&q=80' },
  { id: 'cat-35', name: 'Vienna Opera Performance', category: 'culture', cost: 60, durationMins: 180, description: 'Attend a world-class opera performance at the historic Vienna State Opera.', imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=80' },
  { id: 'cat-36', name: 'Jaipur Amber Fort', category: 'culture', cost: 8, durationMins: 180, description: 'Explore the magnificent hilltop fort with its blend of Hindu and Mughal architecture.', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { id: 'cat-37', name: 'Buenos Aires Tango Lesson', category: 'culture', cost: 25, durationMins: 120, description: 'Learn the passionate art of Argentine tango in the birthplace of the dance.', imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400&q=80' },
  { id: 'cat-38', name: 'Prague Castle Tour', category: 'culture', cost: 14, durationMins: 150, description: 'Tour the largest ancient castle complex in the world, overlooking the Vltava River.', imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80' },
  { id: 'cat-39', name: 'Seoul K-Pop Experience', category: 'culture', cost: 30, durationMins: 120, description: 'Visit K-Pop studios, learn dance moves, and explore the vibrant Hallyu culture.', imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80' },
  { id: 'cat-40', name: 'Cusco Inca Museum', category: 'culture', cost: 5, durationMins: 120, description: 'Discover pre-Columbian artifacts and learn about the ancient Inca civilization.', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&q=80' },
  // Other (10)
  { id: 'cat-41', name: 'Bali Spa Day', category: 'other', cost: 45, durationMins: 240, description: 'Full-day traditional Balinese spa experience with massage, facial, and flower bath.', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
  { id: 'cat-42', name: 'Singapore Shopping at Orchard', category: 'other', cost: 0, durationMins: 180, description: 'Browse luxury and local brands along Singapore\'s famous shopping boulevard.', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { id: 'cat-43', name: 'Amsterdam Coffee Shop Tour', category: 'other', cost: 20, durationMins: 120, description: 'Visit Amsterdam\'s most famous coffee shops and learn about Dutch café culture.', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80' },
  { id: 'cat-44', name: 'Istanbul Hammam Experience', category: 'other', cost: 35, durationMins: 90, description: 'Traditional Turkish bath experience in a historic hammam dating back centuries.', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80' },
  { id: 'cat-45', name: 'Dubai Mall & Fountain Show', category: 'other', cost: 0, durationMins: 120, description: 'Explore the world\'s largest shopping mall and watch the spectacular Dubai Fountain.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { id: 'cat-46', name: 'Lisbon Tram 28 Ride', category: 'other', cost: 3, durationMins: 45, description: 'Ride the iconic yellow tram through Lisbon\'s oldest and most picturesque neighborhoods.', imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&q=80' },
  { id: 'cat-47', name: 'Reykjavik Blue Lagoon', category: 'other', cost: 70, durationMins: 180, description: 'Relax in the milky-blue geothermal waters surrounded by volcanic landscapes.', imageUrl: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&q=80' },
  { id: 'cat-48', name: 'Cape Town Penguin Colony', category: 'other', cost: 8, durationMins: 90, description: 'Visit the adorable African penguin colony at Boulders Beach near Simon\'s Town.', imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
  { id: 'cat-49', name: 'Mexico City Xochimilco Boats', category: 'other', cost: 15, durationMins: 180, description: 'Float along the ancient Aztec canals on colorful trajineras with food and music.', imageUrl: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&q=80' },
  { id: 'cat-50', name: 'Kyoto Tea Ceremony', category: 'other', cost: 30, durationMins: 60, description: 'Experience a traditional Japanese tea ceremony in a serene Kyoto tea house.', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
];

// GET /api/catalog/activities?q=&category=&maxCost=&maxDuration=&page=&limit=

router.get('/activities', (req: Request, res: Response) => {
  try {
    const { q, category, maxCost, maxDuration, page: pageStr, limit: limitStr } = req.query;

    let results = [...CATALOG_ACTIVITIES];

    // Filter
    if (q) {
      const search = (q as string).toLowerCase();
      results = results.filter(
        a => a.name.toLowerCase().includes(search) || a.description?.toLowerCase().includes(search)
      );
    }
    if (category) {
      results = results.filter(a => a.category === category);
    }
    if (maxCost !== undefined && maxCost !== '') {
      const mc = parseFloat(maxCost as string);
      if (!isNaN(mc)) results = results.filter(a => a.cost <= mc);
    }
    if (maxDuration !== undefined && maxDuration !== '') {
      const md = parseInt(maxDuration as string);
      if (!isNaN(md)) results = results.filter(a => (a.durationMins || 0) <= md);
    }

    // Paginate
    const page = Math.max(1, parseInt(pageStr as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(limitStr as string) || 12));
    const total = results.length;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    res.json({
      data: {
        data: paged,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Search activities error:', err);
    res.status(500).json({ error: { message: 'Failed to search activities' } });
  }
});

export default router;
