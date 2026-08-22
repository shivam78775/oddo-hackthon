import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTrips } from '../api/trips';
import { searchCities } from '../api/search';
import type { Trip, City } from '../types';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, MapPinIcon } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [recommendedCities, setRecommendedCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tripsData, citiesData] = await Promise.all([
          fetchTrips(),
          searchCities({ sort: 'popularity', limit: 4 })
        ]);
        
        // Only show top 3 recent trips on dashboard
        setRecentTrips(tripsData.slice(0, 3));
        setRecommendedCities(citiesData.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero / Welcome Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-20 bg-cover bg-center" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Welcome back, {user?.name.split(' ')[0]}! 🌍
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Ready for your next adventure? Let's plan something amazing today.
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <PlusIcon className="w-6 h-6" />
            Plan New Trip
          </button>
        </div>
      </section>

      {/* Recent Trips */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Recent Trips</h2>
          {recentTrips.length > 0 && (
            <button
              onClick={() => navigate('/my-trips')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              View all →
            </button>
          )}
        </div>
        
        {recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl border border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPinIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No trips planned yet</h3>
            <p className="text-gray-400 mb-6">Your next great adventure begins with a single click.</p>
            <button
              onClick={() => navigate('/create-trip')}
              className="btn-primary"
            >
              Start Planning
            </button>
          </div>
        )}
      </section>

      {/* Recommended Destinations */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Trending Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedCities.map(city => (
            <div
              key={city.id}
              onClick={() => navigate(`/search/cities?q=${city.name}`)}
              className="group cursor-pointer relative h-64 rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1"
            >
              <img
                src={city.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                <p className="text-sm text-gray-300">{city.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
