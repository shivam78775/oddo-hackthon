import { useEffect, useState } from 'react';
import { fetchTrips } from '../api/trips';
import type { Trip } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarView() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Determine if a day has a trip
  const getTripsForDay = (day: number) => {
    const date = new Date(year, month, day);
    // Normalize to midnight for accurate comparison
    const compareTime = date.getTime();

    return trips.filter(trip => {
      const start = new Date(trip.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(trip.endDate);
      end.setHours(23, 59, 59, 999);
      
      return compareTime >= start.getTime() && compareTime <= end.getTime();
    });
  };

  const getTripColorClass = (index: number) => {
    const classes = [
      'bg-blue-500/80',
      'bg-purple-500/80',
      'bg-cyan-500/80',
      'bg-emerald-500/80',
      'bg-rose-500/80'
    ];
    return classes[index % classes.length];
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading calendar...</div>;
  }

  // Generate blank cells for days before the 1st of the month
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  // Generate actual day cells
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-3">
          <CalendarIcon size={32} className="text-purple-400" />
          Calendar View
        </h1>
        <p className="text-slate-400 mt-2">Get a high-level view of your travel schedule.</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-semibold text-slate-100">
            {monthNames[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-700/50 rounded-lg overflow-hidden border border-slate-700">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="bg-slate-800/80 py-3 text-center text-xs font-semibold tracking-wider text-slate-400">
              {day}
            </div>
          ))}

          {/* Grid Cells */}
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="bg-slate-900/50 min-h-[120px] p-2"></div>
          ))}

          {days.map(day => {
            const dayTrips = getTripsForDay(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            
            return (
              <div key={`day-${day}`} className={`min-h-[120px] p-2 bg-slate-800/40 relative group hover:bg-slate-800/60 transition-colors ${
                isToday ? 'ring-2 ring-inset ring-cyan-500' : ''
              }`}>
                <span className={`inline-block w-7 h-7 text-center leading-7 rounded-full text-sm font-medium ${
                  isToday ? 'bg-cyan-500 text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {day}
                </span>

                <div className="mt-2 space-y-1">
                  {dayTrips.map((trip, idx) => (
                    <div 
                      key={`${day}-${trip.id}`}
                      className={`text-[10px] md:text-xs px-2 py-1 rounded shadow-sm text-white truncate font-medium ${getTripColorClass(idx)}`}
                      title={trip.name}
                    >
                      {trip.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
