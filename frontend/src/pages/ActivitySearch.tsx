import { useState, useEffect } from 'react';
import { searchActivities } from '../api/search';
import type { Activity } from '../types';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { DollarSignIcon, ClockIcon } from 'lucide-react';

export default function ActivitySearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [category, setCategory] = useState<string>('');
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Search activities when query or filters change
  useEffect(() => {
    async function doSearch() {
      setLoading(true);
      try {
        const data = await searchActivities({ 
          q: debouncedQuery, 
          category: (category as any) || undefined,
          limit: 20 
        });
        setActivities(data.data);
      } catch (err) {
        console.error('Failed to search activities', err);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [debouncedQuery, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
        <div className="flex-1 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Activities</h1>
          <SearchBar 
            value={query} 
            onChange={setQuery} 
            placeholder="Search tours, attractions, food..." 
          />
        </div>
        
        {/* Filters */}
        <div className="w-full md:w-auto flex gap-4">
          <select 
            className="input-field min-w-[200px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="food">Food & Dining</option>
            <option value="adventure">Adventure</option>
            <option value="culture">Culture</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : activities.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-gray-400 text-lg">No activities found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map(act => (
            <div key={act.id} className="glass-card-hover group rounded-2xl overflow-hidden h-[380px] flex flex-col">
              <div className="relative h-48 flex-shrink-0">
                <img 
                  src={act.imageUrl || 'https://images.unsplash.com/photo-1527631746610-bca00a040d60'} 
                  alt={act.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  <span className="badge-warning capitalize shadow-lg">{act.category}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{act.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                  {act.description}
                </p>
                <div className="flex items-center justify-between text-sm mt-auto pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1.5 text-green-400 font-bold">
                    <DollarSignIcon className="w-4 h-4" /> {act.cost}
                  </span>
                  {act.durationMins && (
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <ClockIcon className="w-4 h-4" /> {act.durationMins}m
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
