import type { User, Trip, City, Stop, Activity, BudgetItem } from '../types';

// ─── Helper ──────────────────────────────────────────────────

function uuid(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Cities (30 real world cities) ───────────────────────────

export const CITIES: City[] = [
  { id: uuid(), name: 'Paris', country: 'France', region: 'Europe', costIndex: 4.2, popularityScore: 98, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { id: uuid(), name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 3.8, popularityScore: 95, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { id: uuid(), name: 'New York', country: 'USA', region: 'North America', costIndex: 4.5, popularityScore: 97, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  { id: uuid(), name: 'London', country: 'United Kingdom', region: 'Europe', costIndex: 4.3, popularityScore: 96, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: uuid(), name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 3.5, popularityScore: 92, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  { id: uuid(), name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 1.8, popularityScore: 90, imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: uuid(), name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 3.2, popularityScore: 91, imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&q=80' },
  { id: uuid(), name: 'Istanbul', country: 'Turkey', region: 'Europe', costIndex: 2.1, popularityScore: 88, imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80' },
  { id: uuid(), name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 4.0, popularityScore: 93, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: uuid(), name: 'Sydney', country: 'Australia', region: 'Oceania', costIndex: 4.1, popularityScore: 89, imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80' },
  { id: uuid(), name: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 3.7, popularityScore: 87, imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80' },
  { id: uuid(), name: 'Prague', country: 'Czech Republic', region: 'Europe', costIndex: 2.5, popularityScore: 85, imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: uuid(), name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 1.5, popularityScore: 94, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: uuid(), name: 'Marrakech', country: 'Morocco', region: 'Africa', costIndex: 1.8, popularityScore: 82, imageUrl: 'https://images.unsplash.com/photo-1597211684565-dca64d72c5ac?w=600&q=80' },
  { id: uuid(), name: 'Cape Town', country: 'South Africa', region: 'Africa', costIndex: 2.3, popularityScore: 84, imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
  { id: uuid(), name: 'Rio de Janeiro', country: 'Brazil', region: 'South America', costIndex: 2.8, popularityScore: 86, imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80' },
  { id: uuid(), name: 'Singapore', country: 'Singapore', region: 'Asia', costIndex: 3.9, popularityScore: 91, imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
  { id: uuid(), name: 'Lisbon', country: 'Portugal', region: 'Europe', costIndex: 2.7, popularityScore: 88, imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&q=80' },
  { id: uuid(), name: 'Buenos Aires', country: 'Argentina', region: 'South America', costIndex: 2.0, popularityScore: 80, imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80' },
  { id: uuid(), name: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 3.5, popularityScore: 89, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
  { id: uuid(), name: 'Vienna', country: 'Austria', region: 'Europe', costIndex: 3.4, popularityScore: 83, imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80' },
  { id: uuid(), name: 'Seoul', country: 'South Korea', region: 'Asia', costIndex: 3.0, popularityScore: 87, imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&q=80' },
  { id: uuid(), name: 'Havana', country: 'Cuba', region: 'Caribbean', costIndex: 1.5, popularityScore: 78, imageUrl: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=600&q=80' },
  { id: uuid(), name: 'Reykjavik', country: 'Iceland', region: 'Europe', costIndex: 4.5, popularityScore: 81, imageUrl: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&q=80' },
  { id: uuid(), name: 'Mexico City', country: 'Mexico', region: 'North America', costIndex: 1.9, popularityScore: 85, imageUrl: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&q=80' },
  { id: uuid(), name: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 3.8, popularityScore: 93, imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80' },
  { id: uuid(), name: 'Jaipur', country: 'India', region: 'Asia', costIndex: 1.2, popularityScore: 79, imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80' },
  { id: uuid(), name: 'Petra', country: 'Jordan', region: 'Middle East', costIndex: 2.5, popularityScore: 77, imageUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=600&q=80' },
  { id: uuid(), name: 'Cusco', country: 'Peru', region: 'South America', costIndex: 1.6, popularityScore: 82, imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80' },
  { id: uuid(), name: 'Queenstown', country: 'New Zealand', region: 'Oceania', costIndex: 3.9, popularityScore: 80, imageUrl: 'https://images.unsplash.com/photo-1589871973318-9ca1258faa7d?w=600&q=80' },
];

// ─── Activities (50 real-world activities) ───────────────────

export const ACTIVITIES: Activity[] = [
  // Sightseeing
  { id: uuid(), stopId: '', name: 'Eiffel Tower Visit', category: 'sightseeing', cost: 26, durationMins: 120, description: 'Iconic iron lattice tower on the Champ de Mars, offering stunning panoramic views of Paris.', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Colosseum Tour', category: 'sightseeing', cost: 18, durationMins: 150, description: 'Ancient amphitheatre in the heart of Rome, a symbol of Roman engineering and history.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Statue of Liberty Ferry', category: 'sightseeing', cost: 24, durationMins: 180, description: 'Ferry ride to Liberty Island with views of the iconic statue and Manhattan skyline.', imageUrl: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Sagrada Familia Tour', category: 'sightseeing', cost: 26, durationMins: 120, description: 'Gaudí's masterpiece basilica, an architectural wonder still under construction since 1882.', imageUrl: 'https://images.unsplash.com/photo-1583779457094-ab6f9164a1f8?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Tower Bridge Walk', category: 'sightseeing', cost: 12, durationMins: 90, description: 'Walk across the glass floor of London's iconic bascule bridge over the Thames.', imageUrl: 'https://images.unsplash.com/photo-1471874276752-65e2d717604a?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Grand Palace Visit', category: 'sightseeing', cost: 15, durationMins: 120, description: 'The official residence of the Kings of Siam, featuring intricate Thai architecture.', imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Sydney Opera House Tour', category: 'sightseeing', cost: 28, durationMins: 90, description: 'Behind-the-scenes tour of one of the world's most famous performing arts venues.', imageUrl: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Burj Khalifa Observation', category: 'sightseeing', cost: 40, durationMins: 60, description: 'Visit the observation deck of the world's tallest building for breathtaking views.', imageUrl: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Machu Picchu Trek', category: 'sightseeing', cost: 50, durationMins: 480, description: 'Explore the ancient Incan citadel set high in the Andes Mountains of Peru.', imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Santorini Sunset at Oia', category: 'sightseeing', cost: 0, durationMins: 120, description: 'Watch the world-famous sunset from Oia village on the caldera rim.', imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  
  // Food
  { id: uuid(), stopId: '', name: 'Parisian Croissant Tour', category: 'food', cost: 35, durationMins: 150, description: 'Walk through Parisian bakeries tasting the finest croissants, pain au chocolat, and pastries.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Tokyo Ramen Crawl', category: 'food', cost: 25, durationMins: 180, description: 'Visit three legendary ramen shops in different Tokyo neighborhoods.', imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Bangkok Street Food Tour', category: 'food', cost: 15, durationMins: 180, description: 'Explore Chinatown's vibrant street food scene with pad thai, mango sticky rice, and more.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Italian Pasta Making Class', category: 'food', cost: 55, durationMins: 180, description: 'Learn to make fresh pasta from scratch with a local Italian chef in Rome.', imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Tapas Walking Tour', category: 'food', cost: 40, durationMins: 180, description: 'Sample the best tapas bars in Barcelona's Gothic Quarter with a local guide.', imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Turkish Breakfast Experience', category: 'food', cost: 20, durationMins: 120, description: 'Enjoy a traditional Turkish breakfast with dozens of small dishes by the Bosphorus.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Sushi Omakase in Kyoto', category: 'food', cost: 80, durationMins: 90, description: 'Chef's choice multi-course sushi dinner at a traditional Kyoto counter.', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Marrakech Spice Market Tour', category: 'food', cost: 18, durationMins: 120, description: 'Explore the aromatic spice souks and learn about Moroccan culinary traditions.', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Mexican Taco Tour', category: 'food', cost: 22, durationMins: 150, description: 'Hit the best taco stands in Mexico City for al pastor, carnitas, and more.', imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Wine Tasting in Lisbon', category: 'food', cost: 45, durationMins: 120, description: 'Sample Portuguese wines including Vinho Verde and Port at a historic wine bar.', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80' },
  
  // Adventure
  { id: uuid(), stopId: '', name: 'Bali Surfing Lesson', category: 'adventure', cost: 35, durationMins: 120, description: 'Learn to surf on the gentle waves of Kuta Beach with experienced local instructors.', imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40cef78?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Queenstown Bungee Jump', category: 'adventure', cost: 150, durationMins: 60, description: 'Jump from the historic Kawarau Bridge, birthplace of commercial bungee jumping.', imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Cape Town Table Mountain Hike', category: 'adventure', cost: 10, durationMins: 240, description: 'Hike up the iconic flat-topped mountain for panoramic views of the city and ocean.', imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Iceland Golden Circle Tour', category: 'adventure', cost: 85, durationMins: 480, description: 'Visit Þingvellir, Geysir geothermal area, and the thundering Gullfoss waterfall.', imageUrl: 'https://images.unsplash.com/photo-1509225770129-c88e3a50f0d7?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Dubai Desert Safari', category: 'adventure', cost: 65, durationMins: 360, description: 'Dune bashing, camel rides, and a desert dinner under the stars.', imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Rio Hang Gliding', category: 'adventure', cost: 120, durationMins: 60, description: 'Tandem hang glide over Rio with views of Copacabana, Ipanema, and Christ the Redeemer.', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Petra Night Walk', category: 'adventure', cost: 20, durationMins: 120, description: 'Walk through the Siq to the Treasury illuminated by thousands of candles.', imageUrl: 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Amsterdam Canal Kayaking', category: 'adventure', cost: 30, durationMins: 120, description: 'Paddle through Amsterdam's historic canal ring, a UNESCO World Heritage Site.', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Singapore Night Safari', category: 'adventure', cost: 45, durationMins: 180, description: 'World's first nocturnal zoo, home to over 900 animals in natural habitats.', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Seoul DMZ Tour', category: 'adventure', cost: 55, durationMins: 480, description: 'Visit the Korean Demilitarized Zone, one of the most heavily fortified borders in the world.', imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80' },

  // Culture
  { id: uuid(), stopId: '', name: 'Louvre Museum Tour', category: 'culture', cost: 17, durationMins: 180, description: 'Explore the world's largest art museum, home to the Mona Lisa and Venus de Milo.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Tokyo Meiji Shrine Visit', category: 'culture', cost: 0, durationMins: 90, description: 'Serene Shinto shrine in a forest clearing, dedicated to Emperor Meiji.', imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Flamenco Show in Barcelona', category: 'culture', cost: 35, durationMins: 90, description: 'Experience passionate flamenco dancing and music in an intimate tablao setting.', imageUrl: 'https://images.unsplash.com/photo-1594913503906-f36b05c7e8d1?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Havana Vintage Car Tour', category: 'culture', cost: 40, durationMins: 120, description: 'Cruise through Havana in a colorful 1950s American convertible with a local guide.', imageUrl: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Vienna Opera Performance', category: 'culture', cost: 60, durationMins: 180, description: 'Attend a world-class opera performance at the historic Vienna State Opera.', imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Jaipur Amber Fort', category: 'culture', cost: 8, durationMins: 180, description: 'Explore the magnificent hilltop fort with its blend of Hindu and Mughal architecture.', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Buenos Aires Tango Lesson', category: 'culture', cost: 25, durationMins: 120, description: 'Learn the passionate art of Argentine tango in the birthplace of the dance.', imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Prague Castle Tour', category: 'culture', cost: 14, durationMins: 150, description: 'Tour the largest ancient castle complex in the world, overlooking the Vltava River.', imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Seoul K-Pop Experience', category: 'culture', cost: 30, durationMins: 120, description: 'Visit K-Pop studios, learn dance moves, and explore the vibrant Hallyu culture.', imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Cusco Inca Museum', category: 'culture', cost: 5, durationMins: 120, description: 'Discover pre-Columbian artifacts and learn about the ancient Inca civilization.', imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&q=80' },

  // Other
  { id: uuid(), stopId: '', name: 'Bali Spa Day', category: 'other', cost: 45, durationMins: 240, description: 'Full-day traditional Balinese spa experience with massage, facial, and flower bath.', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Singapore Shopping at Orchard', category: 'other', cost: 0, durationMins: 180, description: 'Browse luxury and local brands along Singapore's famous shopping boulevard.', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Amsterdam Coffee Shop Tour', category: 'other', cost: 20, durationMins: 120, description: 'Visit Amsterdam's most famous coffee shops and learn about Dutch café culture.', imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Istanbul Hammam Experience', category: 'other', cost: 35, durationMins: 90, description: 'Traditional Turkish bath experience in a historic hammam dating back centuries.', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Dubai Mall & Fountain Show', category: 'other', cost: 0, durationMins: 120, description: 'Explore the world's largest shopping mall and watch the spectacular Dubai Fountain.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Lisbon Tram 28 Ride', category: 'other', cost: 3, durationMins: 45, description: 'Ride the iconic yellow tram through Lisbon's oldest and most picturesque neighborhoods.', imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Reykjavik Blue Lagoon', category: 'other', cost: 70, durationMins: 180, description: 'Relax in the milky-blue geothermal waters surrounded by volcanic landscapes.', imageUrl: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Cape Town Penguin Colony', category: 'other', cost: 8, durationMins: 90, description: 'Visit the adorable African penguin colony at Boulders Beach near Simon's Town.', imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Mexico City Xochimilco Boats', category: 'other', cost: 15, durationMins: 180, description: 'Float along the ancient Aztec canals on colorful trajineras with food and music.', imageUrl: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=400&q=80' },
  { id: uuid(), stopId: '', name: 'Kyoto Tea Ceremony', category: 'other', cost: 30, durationMins: 60, description: 'Experience a traditional Japanese tea ceremony in a serene Kyoto tea house.', imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80' },
];

// ─── Sample Users ────────────────────────────────────────────

export const SAMPLE_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Alex Traveler',
    email: 'alex@demo.com',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    city: 'San Francisco',
    country: 'USA',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Priya Wanderlust',
    email: 'priya@demo.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    city: 'Mumbai',
    country: 'India',
    createdAt: '2024-03-10T00:00:00Z',
  },
];

// ─── Sample Trips ────────────────────────────────────────────

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const SAMPLE_TRIPS: Trip[] = [
  {
    id: 'trip-1',
    userId: 'user-1',
    name: 'European Summer Adventure',
    startDate: daysFromNow(-5),
    endDate: daysFromNow(10),
    description: 'A 15-day tour through the best of Europe — Paris, Barcelona, and Rome.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    isPublic: true,
    publicSlug: 'european-summer-2024',
    createdAt: daysFromNow(-30),
    stops: [],
  },
  {
    id: 'trip-2',
    userId: 'user-1',
    name: 'Japan Cultural Journey',
    startDate: daysFromNow(30),
    endDate: daysFromNow(44),
    description: 'Exploring Tokyo and Kyoto — temples, food, and the art of zen.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    isPublic: false,
    createdAt: daysFromNow(-15),
    stops: [],
  },
  {
    id: 'trip-3',
    userId: 'user-1',
    name: 'Southeast Asia Backpacking',
    startDate: daysFromNow(-45),
    endDate: daysFromNow(-30),
    description: 'Budget-friendly adventure through Bangkok and Bali.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    isPublic: true,
    publicSlug: 'se-asia-backpack',
    createdAt: daysFromNow(-60),
    stops: [],
  },
  {
    id: 'trip-4',
    userId: 'user-1',
    name: 'Dubai & Istanbul Explorer',
    startDate: daysFromNow(60),
    endDate: daysFromNow(70),
    description: 'Modern luxury meets ancient history — a 10-day cross-cultural trip.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    isPublic: false,
    createdAt: daysFromNow(-5),
    stops: [],
  },
  {
    id: 'trip-5',
    userId: 'user-2',
    name: 'South America Discovery',
    startDate: daysFromNow(15),
    endDate: daysFromNow(30),
    description: 'Rio, Buenos Aires, and Cusco — 15 days of Latin American magic.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    isPublic: true,
    publicSlug: 'south-america-discovery',
    createdAt: daysFromNow(-10),
    stops: [],
  },
];

// Build stops for trip-1 (European Summer Adventure)
const parisCity = CITIES.find(c => c.name === 'Paris')!;
const barcelonaCity = CITIES.find(c => c.name === 'Barcelona')!;
const romeCity = CITIES.find(c => c.name === 'Rome')!;

export const SAMPLE_STOPS: Stop[] = [
  {
    id: 'stop-1',
    tripId: 'trip-1',
    cityId: parisCity.id,
    city: parisCity,
    startDate: daysFromNow(-5),
    endDate: daysFromNow(0),
    orderIndex: 0,
    activities: [
      { id: 'act-1', stopId: 'stop-1', name: 'Eiffel Tower Visit', category: 'sightseeing', cost: 26, durationMins: 120, description: 'Visit the iconic Eiffel Tower.', imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=400&q=80' },
      { id: 'act-2', stopId: 'stop-1', name: 'Louvre Museum Tour', category: 'culture', cost: 17, durationMins: 180, description: 'Explore the world\'s largest art museum.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
      { id: 'act-3', stopId: 'stop-1', name: 'Parisian Croissant Tour', category: 'food', cost: 35, durationMins: 150, description: 'Taste the finest Parisian pastries.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80' },
    ],
  },
  {
    id: 'stop-2',
    tripId: 'trip-1',
    cityId: barcelonaCity.id,
    city: barcelonaCity,
    startDate: daysFromNow(1),
    endDate: daysFromNow(5),
    orderIndex: 1,
    activities: [
      { id: 'act-4', stopId: 'stop-2', name: 'Sagrada Familia Tour', category: 'sightseeing', cost: 26, durationMins: 120, description: 'Gaudí\'s masterpiece basilica.', imageUrl: 'https://images.unsplash.com/photo-1583779457094-ab6f9164a1f8?w=400&q=80' },
      { id: 'act-5', stopId: 'stop-2', name: 'Tapas Walking Tour', category: 'food', cost: 40, durationMins: 180, description: 'Sample tapas in the Gothic Quarter.', imageUrl: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&q=80' },
      { id: 'act-6', stopId: 'stop-2', name: 'Flamenco Show', category: 'culture', cost: 35, durationMins: 90, description: 'Passionate flamenco in an intimate tablao.', imageUrl: 'https://images.unsplash.com/photo-1594913503906-f36b05c7e8d1?w=400&q=80' },
    ],
  },
  {
    id: 'stop-3',
    tripId: 'trip-1',
    cityId: romeCity.id,
    city: romeCity,
    startDate: daysFromNow(6),
    endDate: daysFromNow(10),
    orderIndex: 2,
    activities: [
      { id: 'act-7', stopId: 'stop-3', name: 'Colosseum Tour', category: 'sightseeing', cost: 18, durationMins: 150, description: 'Ancient Roman amphitheatre.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&q=80' },
      { id: 'act-8', stopId: 'stop-3', name: 'Italian Pasta Making Class', category: 'food', cost: 55, durationMins: 180, description: 'Learn to make fresh pasta from scratch.', imageUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=400&q=80' },
    ],
  },
];

// Attach stops to trip-1
SAMPLE_TRIPS[0].stops = SAMPLE_STOPS;

// ─── Sample Budget Items ─────────────────────────────────────

export const SAMPLE_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'bi-1', tripId: 'trip-1', stopId: 'stop-1', category: 'stay', amount: 450 },
  { id: 'bi-2', tripId: 'trip-1', stopId: 'stop-1', category: 'transport', amount: 120 },
  { id: 'bi-3', tripId: 'trip-1', stopId: 'stop-1', category: 'meal', amount: 180 },
  { id: 'bi-4', tripId: 'trip-1', stopId: 'stop-2', category: 'stay', amount: 380 },
  { id: 'bi-5', tripId: 'trip-1', stopId: 'stop-2', category: 'transport', amount: 85 },
  { id: 'bi-6', tripId: 'trip-1', stopId: 'stop-2', category: 'meal', amount: 200 },
  { id: 'bi-7', tripId: 'trip-1', stopId: 'stop-3', category: 'stay', amount: 400 },
  { id: 'bi-8', tripId: 'trip-1', stopId: 'stop-3', category: 'transport', amount: 95 },
  { id: 'bi-9', tripId: 'trip-1', stopId: 'stop-3', category: 'meal', amount: 160 },
  { id: 'bi-10', tripId: 'trip-1', category: 'transport', amount: 350 },
];
