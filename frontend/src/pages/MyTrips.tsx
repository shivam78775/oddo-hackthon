import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips, deleteTrip } from '../api/trips';
import type { Trip } from '../types';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, PlaneIcon } from 'lucide-react';

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert('Failed to delete trip. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const upcomingTrips = trips.filter(t => new Date(t.startDate) > new Date());
  const ongoingTrips = trips.filter(t => new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date());
  const pastTrips = trips.filter(t => new Date(t.endDate) < new Date());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Trips</h1>
          <p className="text-gray-400 text-lg">Manage all your travel itineraries in one place.</p>
        </div>
        <button
          onClick={() => navigate('/create-trip')}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <PlusIcon className="w-5 h-5" />
          Plan New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center max-w-2xl mx-auto border border-white/10">
          <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlaneIcon className="w-12 h-12 text-blue-400 transform -rotate-45" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">No trips found</h2>
          <p className="text-gray-400 mb-8 text-lg">
            You haven't planned any trips yet. Start building your dream itinerary today!
          </p>
          <button onClick={() => navigate('/create-trip')} className="btn-primary text-lg px-8">
            Start Planning
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {ongoingTrips.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                Happening Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onDelete={() => handleDelete(trip.id)} />
                ))}
              </div>
            </section>
          )}

          {upcomingTrips.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Adventures</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onDelete={() => handleDelete(trip.id)} />
                ))}
              </div>
            </section>
          )}

          {pastTrips.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 opacity-75">Past Trips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                {pastTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} onDelete={() => handleDelete(trip.id)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
