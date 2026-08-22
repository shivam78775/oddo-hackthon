import { useAuth } from '../context/AuthContext';
import { User, MapPin, Mail, Phone, Globe, Calendar } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const infoItems = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone || 'Not provided' },
    { icon: MapPin, label: 'City', value: user.city || 'Not provided' },
    { icon: Globe, label: 'Country', value: user.country || 'Not provided' },
    { icon: Calendar, label: 'Member Since', value: memberSince },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 pointer-events-none" />

        <div className="relative z-10">
          {user.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-primary-500/30 shadow-xl shadow-primary-500/20"
            />
          ) : (
            <div className="w-28 h-28 rounded-full gradient-primary flex items-center justify-center mx-auto text-4xl font-bold text-white shadow-xl shadow-primary-500/20 border-4 border-primary-500/30">
              {initials}
            </div>
          )}

          <h1 className="text-3xl font-bold text-white mt-6 mb-1">{user.name}</h1>
          <p className="text-surface-400 text-lg">{user.email}</p>

          {(user.city || user.country) && (
            <p className="text-surface-500 mt-2 flex items-center justify-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {[user.city, user.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-primary-400" />
            Profile Details
          </h2>
        </div>

        <div className="divide-y divide-white/5">
          {infoItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-surface-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-surface-500 uppercase tracking-wider">{item.label}</p>
                  <p className="text-white font-medium truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Actions */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Account</h2>
        <p className="text-surface-400 text-sm mb-4">
          Manage your account settings and preferences.
        </p>
        <div className="flex flex-wrap gap-3">
          <button disabled className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-surface-400 text-sm cursor-not-allowed opacity-60">
            Edit Profile (Coming Soon)
          </button>
          <button disabled className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-surface-400 text-sm cursor-not-allowed opacity-60">
            Change Password (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
