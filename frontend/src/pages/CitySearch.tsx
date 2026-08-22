import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCities, getUniqueRegions } from '../api/search';
import type { City } from '../types';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { MapPinIcon, GlobeIcon, TrendingUpIcon } from 'lucide-react';

export default function CitySearch() {
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<string[]>([]);
  
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Load regions on mount
  useEffect(() => {
    getUniqueRegions().then(setRegions).catch(console.error);
  }, []);

  // Search cities when query or filters change
  useEffect(() => {
    async function doSearch() {
      setLoading(true);
      try {
        const data = await searchCities({ 
          q: debouncedQuery, 
          region: selectedRegion || undefined,
          limit: 20 
        });
        setCities(data.data);
      } catch (err) {
        console.error('Failed to search cities', err);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [debouncedQuery, selectedRegion]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
        <div className="flex-1 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Destinations</h1>
          <SearchBar 
            value={query} 
            onChange={setQuery} 
            placeholder="Search cities, countries..." 
          />
        </div>
        
        {/* Filters */}
        <div className="w-full md:w-auto flex gap-4">
          <select 
            className="input-field min-w-[200px]"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : cities.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl">
          <p className="text-gray-400 text-lg">No destinations found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map(city => (
            <div 
              key={city.id} 
              className="glass-card-hover group rounded-2xl overflow-hidden cursor-pointer h-[320px] flex flex-col"
              onClick={() => {
                // In a real app, this might open a city detail modal or just allow adding to a trip
                // We'll navigate to create trip with this city as a query param (hypothetically)
                navigate('/create-trip');
              }}
            >
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img 
                  src={city.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} 
                  alt={city.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="badge-primary flex items-center gap-1">
                    <TrendingUpIcon className="w-3 h-3" /> 
                    {city.popularityScore} Pop
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-1.5">
                  <MapPinIcon className="w-5 h-5 text-blue-400" /> {city.name}
                </h3>
                <p className="text-gray-400 flex items-center gap-1.5 text-sm">
                  <GlobeIcon className="w-4 h-4" /> {city.country}
                </p>
                <div className="mt-auto flex justify-between items-center text-sm">
                  <span className="text-gray-500">{city.region}</span>
                  <span className="text-green-400 font-medium">Cost: {city.costIndex}/5</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
