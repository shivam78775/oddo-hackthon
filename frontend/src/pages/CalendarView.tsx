import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTrips } from '../api/trips';
import type { Trip } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Color palette for trips
const TRIP_COLORS = [
  'bg-blue-500/20 border-blue-500/40 text-blue-300',
  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'bg-amber-500/20 border-amber-500/40 text-amber-300',
  'bg-purple-500/20 border-purple-500/40 text-purple-300',
  'bg-rose-500/20 border-rose-500/40 text-rose-300',
  'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
];

function dateToStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export default function CalendarView() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    fetchTrips()
      .then(setTrips)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Build a map of date → trips for the current month
  const tripsByDate = useMemo(() => {
    const map = new Map<string, { trip: Trip; colorClass: string }[]>();

    trips.forEach((trip, i) => {
      const colorClass = TRIP_COLORS[i % TRIP_COLORS.length];
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const current = new Date(start);

      while (current <= end) {
        const key = dateToStr(current);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ trip, colorClass });
        current.setDate(current.getDate() + 1);
      }
    });

    return map;
  }, [trips]);

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    // Leading empty cells
    for (let i = 0; i < firstDay; i++) days.push(null);
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [currentMonth]);

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() });
  };

  if (loading) return <LoadingSpinner />;

  const todayStr = dateToStr(new Date());
  const { year, month } = currentMonth;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary-400" />
            Trip Calendar
          </h1>
          <p className="text-surface-400">See all your trips at a glance.</p>
        </div>

        <button
          onClick={goToToday}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-surface-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          Today
        </button>
      </div>

      {/* Calendar Card */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <button onClick={goToPrevMonth} className="p-2 rounded-xl hover:bg-white/10 text-surface-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button onClick={goToNextMonth} className="p-2 rounded-xl hover:bg-white/10 text-surface-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {WEEKDAYS.map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-surface-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[100px] border-r border-b border-white/5 bg-white/[0.01]" />;
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTrips = tripsByDate.get(dateStr) || [];
            const isToday = dateStr === todayStr;

            return (
              <div
                key={dateStr}
                className={`min-h-[100px] border-r border-b border-white/5 p-1.5 transition-colors hover:bg-white/5 ${
                  isToday ? 'bg-primary-500/5' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-primary-500 text-white' : 'text-surface-400'
                }`}>
                  {day}
                </div>

                <div className="space-y-0.5">
                  {dayTrips.slice(0, 2).map(({ trip, colorClass }) => (
                    <button
                      key={trip.id}
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className={`w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded border truncate ${colorClass} hover:opacity-80 transition-opacity`}
                    >
                      {trip.name}
                    </button>
                  ))}
                  {dayTrips.length > 2 && (
                    <p className="text-[10px] text-surface-500 pl-1.5">+{dayTrips.length - 2} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {trips.length > 0 && (
        <div className="glass-card rounded-xl border border-white/10 p-5">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Your Trips</h3>
          <div className="flex flex-wrap gap-3">
            {trips.map((trip, i) => (
              <button
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${TRIP_COLORS[i % TRIP_COLORS.length]} hover:opacity-80 transition-opacity`}
              >
                <MapPin className="w-3 h-3" />
                {trip.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
