import { useState, useEffect } from 'react';
import { fetchTrips } from '../api/trips';
import { searchCities } from '../api/search';
import type { Trip, City } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShieldCheck, MapPin, Globe, Activity, TrendingUp, BarChart3, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tripsData, citiesData] = await Promise.all([
          fetchTrips(),
          searchCities({ limit: 50 }),
        ]);
        setTrips(tripsData);
        setCities(citiesData.data);
      } catch (err) {
        console.error('Admin load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Compute stats
  const totalStops = trips.reduce((sum, t) => sum + (t.stops?.length || 0), 0);
  const totalActivities = trips.reduce(
    (sum, t) => sum + (t.stops?.reduce((s, stop) => s + (stop.activities?.length || 0), 0) || 0),
    0
  );
  const totalCost = trips.reduce(
    (sum, t) => sum + (t.stops?.reduce((s, stop) => s + (stop.activities?.reduce((a, act) => a + act.cost, 0) || 0), 0) || 0),
    0
  );

  const uniqueRegions = new Set(cities.map(c => c.region).filter(Boolean));

  // Trips by status
  const now = new Date();
  const ongoing = trips.filter(t => new Date(t.startDate) <= now && new Date(t.endDate) >= now).length;
  const upcoming = trips.filter(t => new Date(t.startDate) > now).length;
  const completed = trips.filter(t => new Date(t.endDate) < now).length;

  // Most popular cities (cities with most stops)
  const cityStopCount = new Map<string, { city: City; count: number }>();
  trips.forEach(trip => {
    trip.stops?.forEach(stop => {
      if (stop.city) {
        const existing = cityStopCount.get(stop.city.id);
        if (existing) {
          existing.count++;
        } else {
          cityStopCount.set(stop.city.id, { city: stop.city, count: 1 });
        }
      }
    });
  });
  const topCities = Array.from(cityStopCount.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const statCards = [
    { icon: MapPin, label: 'Total Trips', value: trips.length, color: 'text-blue-400', bg: 'from-blue-500/10 to-blue-500/5' },
    { icon: Globe, label: 'Cities in DB', value: cities.length, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5' },
    { icon: Activity, label: 'Total Stops', value: totalStops, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5' },
    { icon: TrendingUp, label: 'Activities Added', value: totalActivities, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-500/5' },
    { icon: BarChart3, label: 'Total Activity Cost', value: `$${totalCost.toLocaleString()}`, color: 'text-green-400', bg: 'from-green-500/10 to-green-500/5' },
    { icon: Calendar, label: 'Regions', value: uniqueRegions.size, color: 'text-rose-400', bg: 'from-rose-500/10 to-rose-500/5' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-surface-400">Platform overview and statistics.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`glass-card rounded-2xl border border-white/10 p-6 bg-gradient-to-br ${stat.bg}`}>
              <div className="flex items-center gap-3 mb-3">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <p className="text-sm text-surface-400">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trip Status Breakdown */}
        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Trip Status Breakdown</h2>
          <div className="space-y-4">
            {[
              { label: 'Ongoing', count: ongoing, color: 'bg-green-500', total: trips.length },
              { label: 'Upcoming', count: upcoming, color: 'bg-blue-500', total: trips.length },
              { label: 'Completed', count: completed, color: 'bg-gray-500', total: trips.length },
            ].map(item => {
              const pct = trips.length > 0 ? Math.round((item.count / item.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-surface-300 font-medium">{item.label}</span>
                    <span className="text-sm text-surface-400">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Visited Cities */}
        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Most Visited Cities</h2>
          {topCities.length > 0 ? (
            <div className="space-y-3">
              {topCities.map(({ city, count }, index) => (
                <div
                  key={city.id}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-surface-400">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={city.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100'}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{city.name}</p>
                    <p className="text-xs text-surface-500">{city.country}</p>
                  </div>
                  <span className="text-sm text-primary-400 font-semibold">{count} {count === 1 ? 'visit' : 'visits'}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-500 italic">No trip data yet.</p>
          )}
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Recent Trips</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-3 text-surface-500 font-medium">Trip Name</th>
                <th className="text-left px-6 py-3 text-surface-500 font-medium">Dates</th>
                <th className="text-left px-6 py-3 text-surface-500 font-medium">Stops</th>
                <th className="text-left px-6 py-3 text-surface-500 font-medium">Activities</th>
                <th className="text-left px-6 py-3 text-surface-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.slice(0, 10).map(trip => {
                const stopCount = trip.stops?.length || 0;
                const actCount = trip.stops?.reduce((s, stop) => s + (stop.activities?.length || 0), 0) || 0;
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                let status = 'Upcoming';
                let statusClass = 'badge-primary';
                if (now >= start && now <= end) { status = 'Ongoing'; statusClass = 'badge-success'; }
                else if (now > end) { status = 'Completed'; statusClass = 'badge-warning'; }

                return (
                  <tr key={trip.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{trip.name}</td>
                    <td className="px-6 py-4 text-surface-400">
                      {start.toLocaleDateString()} — {end.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-surface-400">{stopCount}</td>
                    <td className="px-6 py-4 text-surface-400">{actCount}</td>
                    <td className="px-6 py-4">
                      <span className={statusClass}>{status}</span>
                    </td>
                  </tr>
                );
              })}
              {trips.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-surface-500">No trips found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
