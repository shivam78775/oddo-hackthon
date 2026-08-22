import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips } from '../api/trips';
import { searchCities } from '../api/search';
import type { Trip, City } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Globe, MapPin, Compass, TrendingUp, Share2, Heart, MessageCircle } from 'lucide-react';

export default function Community() {
  const navigate = useNavigate();
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cities, trips] = await Promise.all([
          searchCities({ sort: 'popularity', limit: 6 }),
          fetchTrips(),
        ]);
        setPopularCities(cities.data);
        setRecentTrips(trips.slice(0, 3));
      } catch (err) {
        console.error('Community load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Mock community stats (in production, these would come from a backend endpoint)
  const stats = [
    { icon: Users, label: 'Active Travelers', value: '2,847', color: 'text-blue-400' },
    { icon: Globe, label: 'Countries Covered', value: '94', color: 'text-emerald-400' },
    { icon: MapPin, label: 'Trips Planned', value: '12,503', color: 'text-amber-400' },
    { icon: Compass, label: 'Activities Shared', value: '45,291', color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop')] mix-blend-overlay opacity-15 bg-cover bg-center" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Travel <span className="text-gradient">Community</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Connect with fellow travelers, share your itineraries, and discover inspiration from adventurers around the globe.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-2xl border border-white/10 p-6 text-center hover:border-white/20 transition-colors">
              <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-surface-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Trending Destinations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            Trending Destinations
          </h2>
          <button
            onClick={() => navigate('/search')}
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors text-sm"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCities.map(city => (
            <div
              key={city.id}
              onClick={() => navigate('/search')}
              className="group cursor-pointer glass-card-hover rounded-2xl overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{city.name}</h3>
                    <p className="text-sm text-gray-300">{city.country}</p>
                  </div>
                  <span className="badge-primary text-xs">{city.popularityScore} pts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Shared Trips / Community Feed */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Share2 className="w-6 h-6 text-blue-400" />
          Community Feed
        </h2>

        {recentTrips.length > 0 ? (
          <div className="space-y-4">
            {recentTrips.map(trip => {
              const stopCount = trip.stops?.length || 0;
              const cities = trip.stops?.map(s => s.city?.name).filter(Boolean).join(', ') || 'No stops yet';

              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="glass-card rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">{trip.name}</h3>
                      <p className="text-sm text-surface-400 mt-1">
                        {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()} · {stopCount} destinations
                      </p>
                      {cities && <p className="text-xs text-surface-500 mt-1 truncate">{cities}</p>}
                    </div>
                    <div className="flex items-center gap-3 text-surface-500 flex-shrink-0">
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors" onClick={e => e.stopPropagation()}>
                        <Heart className="w-4 h-4" /> <span className="text-xs">—</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-400 transition-colors" onClick={e => e.stopPropagation()}>
                        <MessageCircle className="w-4 h-4" /> <span className="text-xs">—</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-white/10 p-12 text-center">
            <Share2 className="w-12 h-12 text-surface-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No trips to share yet</h3>
            <p className="text-surface-400 mb-6">Create your first trip and share it with the community!</p>
            <button onClick={() => navigate('/create-trip')} className="btn-primary">
              Plan a Trip
            </button>
          </div>
        )}
      </section>

      {/* Coming Soon Banner */}
      <div className="glass-card rounded-2xl border border-white/10 p-8 text-center bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5">
        <h3 className="text-xl font-bold text-white mb-2">More Community Features Coming Soon</h3>
        <p className="text-surface-400 max-w-lg mx-auto">
          Trip sharing, traveler profiles, group planning, live chat, and travel tips — all on the way!
        </p>
      </div>
    </div>
  );
}
