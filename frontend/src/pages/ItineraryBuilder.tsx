import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTrip, addStop, deleteStop, reorderStops, addActivity, deleteActivity } from '../api/trips';
import { searchCities } from '../api/search';
import type { Trip, City } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, MapPinIcon, CalendarIcon, DollarSignIcon, ActivityIcon, ExternalLinkIcon } from 'lucide-react';

export default function ItineraryBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // New Stop Form State
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({ cityId: '', startDate: '', endDate: '' });

  // New Activity Form State (keyed by stopId)
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState({ name: '', category: 'sightseeing', cost: 0, durationMins: 60 });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [tripData, citiesData] = await Promise.all([
        fetchTrip(id!),
        searchCities({ limit: 100 }) // Load all cities for the dropdown
      ]);
      setTrip(tripData);
      setCities(citiesData.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load trip data');
    } finally {
      setLoading(false);
    }
  }

  // --- Stops ---

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStop.cityId || !newStop.startDate || !newStop.endDate) return;
    try {
      await addStop(id!, newStop);
      setShowAddStop(false);
      setNewStop({ cityId: '', startDate: '', endDate: '' });
      await loadData();
    } catch (err) {
      alert('Failed to add stop');
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!window.confirm('Delete this stop and all its activities?')) return;
    try {
      await deleteStop(stopId);
      await loadData();
    } catch (err) {
      alert('Failed to delete stop');
    }
  };

  const handleMoveStop = async (index: number, direction: 'up' | 'down') => {
    if (!trip) return;
    const stops = [...(trip.stops || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = stops[index];
    stops[index] = stops[targetIndex];
    stops[targetIndex] = temp;
    
    const stopIds = stops.map(s => s.id);
    
    try {
      // Optimistic update
      setTrip({ ...trip, stops });
      await reorderStops(id!, stopIds);
    } catch (err) {
      alert('Failed to reorder stops');
      loadData(); // Revert on failure
    }
  };

  // --- Activities ---

  const handleAddActivity = async (e: React.FormEvent, stopId: string) => {
    e.preventDefault();
    if (!newActivity.name) return;
    try {
      await addActivity(stopId, newActivity);
      setActiveStopId(null);
      setNewActivity({ name: '', category: 'sightseeing', cost: 0, durationMins: 60 });
      await loadData();
    } catch (err) {
      alert('Failed to add activity');
    }
  };

  const handleDeleteActivity = async (stopId: string, activityId: string) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await deleteActivity(stopId, activityId);
      await loadData();
    } catch (err) {
      alert('Failed to delete activity');
    }
  };

  if (loading || !trip) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-8 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{trip.name}</h1>
          <p className="text-gray-400 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="btn-primary flex items-center gap-2"
        >
          View Full Itinerary <ExternalLinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Builder Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPinIcon className="w-6 h-6 text-blue-400" />
          Itinerary Stops
        </h2>

        {/* Stops List */}
        <div className="space-y-8">
          {trip.stops?.map((stop, index) => (
            <div key={stop.id} className="glass-card rounded-xl border border-white/10 overflow-hidden">
              {/* Stop Header */}
              <div className="bg-white/5 p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-6">
                  {/* Order Controls */}
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleMoveStop(index, 'up')}
                      disabled={index === 0}
                      className="text-gray-500 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUpIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleMoveStop(index, 'down')}
                      disabled={index === (trip.stops?.length || 1) - 1}
                      className="text-gray-500 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDownIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Stop Info */}
                  <div>
                    <h3 className="text-xl font-bold text-white">{stop.city?.name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(stop.startDate).toLocaleDateString()} — {new Date(stop.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteStop(stop.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Activities */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {stop.activities?.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <ActivityIcon className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{activity.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{activity.category} • {activity.durationMins} mins</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-400 font-medium">${activity.cost}</span>
                        <button 
                          onClick={() => handleDeleteActivity(stop.id, activity.id)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!stop.activities || stop.activities.length === 0) && (
                    <p className="text-gray-500 text-sm italic">No activities added yet.</p>
                  )}
                </div>

                {/* Add Activity Form */}
                {activeStopId === stop.id ? (
                  <form onSubmit={(e) => handleAddActivity(e, stop.id)} className="bg-black/20 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="Activity name"
                        className="input-field"
                        value={newActivity.name}
                        onChange={e => setNewActivity({...newActivity, name: e.target.value})}
                        required
                      />
                      <select
                        className="input-field"
                        value={newActivity.category}
                        onChange={e => setNewActivity({...newActivity, category: e.target.value})}
                      >
                        <option value="sightseeing">Sightseeing</option>
                        <option value="food">Food</option>
                        <option value="adventure">Adventure</option>
                        <option value="culture">Culture</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="relative">
                        <DollarSignIcon className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Cost"
                          min="0"
                          className="input-field pl-9"
                          value={newActivity.cost || ''}
                          onChange={e => setNewActivity({...newActivity, cost: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <input
                        type="number"
                        placeholder="Duration (mins)"
                        min="0"
                        className="input-field"
                        value={newActivity.durationMins || ''}
                        onChange={e => setNewActivity({...newActivity, durationMins: parseInt(e.target.value) || 60})}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setActiveStopId(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                      <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Activity</button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setActiveStopId(stop.id)}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
                  >
                    <PlusIcon className="w-4 h-4" /> Add Activity
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Stop Button / Form */}
        {showAddStop ? (
          <form onSubmit={handleAddStop} className="glass-card p-6 rounded-xl border border-blue-500/30 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Add New Destination</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">City</label>
                <select 
                  className="input-field w-full"
                  value={newStop.cityId}
                  onChange={e => setNewStop({...newStop, cityId: e.target.value})}
                  required
                >
                  <option value="">Select a city...</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}, {city.country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Arrival Date</label>
                <input 
                  type="date" 
                  className="input-field w-full"
                  value={newStop.startDate}
                  onChange={e => setNewStop({...newStop, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Departure Date</label>
                <input 
                  type="date" 
                  className="input-field w-full"
                  value={newStop.endDate}
                  onChange={e => setNewStop({...newStop, endDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowAddStop(false)} className="px-6 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="btn-primary">Save Destination</button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setShowAddStop(true)}
            className="w-full py-6 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <PlusIcon className="w-5 h-5" /> Add Another Destination
          </button>
        )}

      </div>
    </div>
  );
}
