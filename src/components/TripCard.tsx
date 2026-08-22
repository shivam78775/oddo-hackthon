import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Trip } from '../types';
import { getTripStatus } from '../types';

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
}

const STATUS_STYLES = {
  ongoing: { label: 'Ongoing', class: 'badge-success' },
  upcoming: { label: 'Upcoming', class: 'badge-primary' },
  completed: { label: 'Completed', class: 'badge-warning' },
};

export default function TripCard({ trip, onDelete }: TripCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const status = getTripStatus(trip);
  const statusStyle = STATUS_STYLES[status];
  const stopCount = trip.stops?.length || 0;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="glass-card-hover group overflow-hidden animate-fade-in-up">
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        {trip.coverPhotoUrl ? (
          <img
            src={trip.coverPhotoUrl}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full gradient-hero flex items-center justify-center">
            <MapPin className="w-12 h-12 text-surface-600" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={statusStyle.class}>{statusStyle.label}</span>
        </div>

        {/* Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 rounded-lg bg-surface-900/60 backdrop-blur-sm border border-surface-700/50 flex items-center justify-center text-surface-300 hover:text-white transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-40 z-50 glass-card border border-surface-700 rounded-xl shadow-2xl py-1 animate-scale-in">
                <button
                  onClick={() => { setMenuOpen(false); navigate(`/trips/${trip.id}`); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-800/60"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate(`/trips/${trip.id}/edit`); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-300 hover:text-white hover:bg-surface-800/60"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete?.(trip.id); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-display font-semibold text-lg text-white truncate cursor-pointer hover:text-primary-300 transition-colors"
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          {trip.name}
        </h3>

        {trip.description && (
          <p className="text-sm text-surface-400 mt-1 line-clamp-2">{trip.description}</p>
        )}

        <div className="flex items-center gap-4 mt-3 text-xs text-surface-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
          </span>
        </div>
      </div>
    </div>
  );
}
