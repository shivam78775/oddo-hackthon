import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTrip, fetchBudgetBreakdown } from '../api/trips';
import type { Trip, BudgetBreakdown } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { CalendarIcon, MapPinIcon, DollarSignIcon, ActivityIcon, ArrowLeftIcon, PieChartIcon, ListIcon } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ItineraryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget'>('itinerary');

  useEffect(() => {
    async function loadData() {
      try {
        const [tripData, budgetData] = await Promise.all([
          fetchTrip(id!),
          fetchBudgetBreakdown(id!)
        ]);
        setTrip(tripData);
        setBudget(budgetData);
      } catch (err) {
        console.error(err);
        alert('Failed to load trip data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading || !trip) return <LoadingSpinner />;

  // Prepare itinerary days
  const allDays = new Map<string, any[]>();
  
  trip.stops?.forEach(stop => {
    // Generate dates between start and end
    let current = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (!allDays.has(dateStr)) {
        allDays.set(dateStr, []);
      }
      // Add stop info to this day
      allDays.get(dateStr)!.push({ type: 'stop', data: stop });
      
      current.setDate(current.getDate() + 1);
    }
    
    // Add activities (for simplicity, we just attach them to the stop's days evenly or list them all on the first day. Let's just group by stop for now, day-by-day is tricky if activities don't have dates. Actually, the spec says "day-wise list grouped by city/stop". So we iterate stops, then list activities.)
  });

  // Prepare budget chart data
  const pieData = budget ? Object.entries(budget.byCategory).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <button 
        onClick={() => navigate('/trips')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to My Trips
      </button>

      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
        {trip.coverPhotoUrl ? (
          <img src={trip.coverPhotoUrl} alt={trip.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4" /> {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><MapPinIcon className="w-4 h-4" /> {trip.stops?.length || 0} Destinations</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/trips/${trip.id}/build`)}
            className="btn-primary whitespace-nowrap"
          >
            Edit Itinerary
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'itinerary' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <ListIcon className="w-4 h-4" /> Itinerary
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${activeTab === 'budget' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <PieChartIcon className="w-4 h-4" /> Budget & Costs
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'itinerary' ? (
        <div className="space-y-8">
          {trip.stops?.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl">
              <p className="text-gray-400 text-lg mb-4">No destinations added yet.</p>
              <button onClick={() => navigate(`/trips/${trip.id}/build`)} className="btn-primary">Add Destinations</button>
            </div>
          ) : (
            trip.stops?.map((stop, index) => (
              <div key={stop.id} className="relative pl-8 pb-8 last:pb-0">
                {/* Timeline line */}
                {index !== trip.stops!.length - 1 && (
                  <div className="absolute top-10 bottom-0 left-[11px] w-0.5 bg-white/10" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute top-2 left-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-surface-900 shadow-lg" />
                
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                  <h3 className="text-2xl font-bold text-white mb-1">{stop.city?.name}, {stop.city?.country}</h3>
                  <p className="text-blue-400 font-medium mb-6">
                    {new Date(stop.startDate).toLocaleDateString()} — {new Date(stop.endDate).toLocaleDateString()}
                  </p>
                  
                  {stop.activities && stop.activities.length > 0 ? (
                    <div className="space-y-3">
                      {stop.activities.map(act => (
                        <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                              <ActivityIcon className="w-5 h-5 text-gray-300" />
                            </div>
                            <div>
                              <p className="font-bold text-white">{act.name}</p>
                              <p className="text-sm text-gray-400 capitalize">{act.category} • {act.durationMins} mins</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-400">${act.cost}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No activities planned.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <p className="text-gray-400 mb-1">Total Estimated Cost</p>
              <p className="text-4xl font-bold text-white">${budget?.total.toFixed(2)}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5">
              <p className="text-gray-400 mb-1">Average Per Day</p>
              <p className="text-4xl font-bold text-white">${budget?.averagePerDay.toFixed(2)}</p>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-900/50 to-indigo-900/50">
              <div className="flex items-center gap-3 mb-2">
                <DollarSignIcon className="w-6 h-6 text-green-400" />
                <h3 className="font-bold text-white">Add Budget Item</h3>
              </div>
              <p className="text-sm text-gray-400">Track custom expenses like flights or visas.</p>
              {/* Not fully implemented for hackathon time limits, but backend supports it */}
              <button disabled className="mt-3 w-full py-2 bg-white/10 rounded-lg text-white opacity-50 cursor-not-allowed text-sm">Coming Soon</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5 h-[400px]">
              <h3 className="font-bold text-white mb-6">Expenses by Category</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                    itemStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 -mt-8">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm text-gray-300 capitalize">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 h-[400px]">
              <h3 className="font-bold text-white mb-6">Daily Breakdown</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budget?.byDay || []}>
                  <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                    cursor={{ fill: '#334155' }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
