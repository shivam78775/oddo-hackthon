import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Globe,
  LayoutDashboard,
  Map,
  Search,
  PieChart,
  CalendarDays,
  Users,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Plane,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/my-trips', label: 'My Trips', icon: Map },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/community', label: 'Community', icon: Users },
];

const ADMIN_NAV = { path: '/admin', label: 'Admin', icon: ShieldCheck };

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <span className="font-display font-bold text-xl text-white hidden sm:block">
                Globe<span className="text-gradient">Trotter</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/15 text-primary-300 shadow-sm'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              {user?.role === 'ADMIN' && (
                <Link
                  to={ADMIN_NAV.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    location.pathname === ADMIN_NAV.path
                      ? 'bg-primary-500/15 text-primary-300 shadow-sm'
                      : 'text-surface-400 hover:text-white hover:bg-surface-800/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {ADMIN_NAV.label}
                </Link>
              )}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* New Trip button */}
              <Link
                to="/create-trip"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <Plane className="w-4 h-4" />
                New Trip
              </Link>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-800/60 transition-all"
                >
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-surface-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  )}
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 z-50 glass-card border border-surface-700 rounded-xl shadow-2xl animate-fade-in-down py-2">
                      <div className="px-4 py-3 border-b border-surface-700/50">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800/60 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/budget"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-800/60 transition-colors"
                      >
                        <PieChart className="w-4 h-4" />
                        Budget Overview
                      </Link>
                      <div className="border-t border-surface-700/50 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden btn-icon"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-800/60 bg-surface-950/95 backdrop-blur-xl animate-fade-in-down">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-500/15 text-primary-300'
                        : 'text-surface-400 hover:text-white hover:bg-surface-800/60'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              {user?.role === 'ADMIN' && (
                <Link
                  to={ADMIN_NAV.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === ADMIN_NAV.path
                      ? 'bg-primary-500/15 text-primary-300'
                      : 'text-surface-400 hover:text-white hover:bg-surface-800/60'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  {ADMIN_NAV.label}
                </Link>
              )}
              <Link
                to="/create-trip"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white gradient-primary mt-2"
              >
                <Plane className="w-5 h-5" />
                Plan New Trip
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
