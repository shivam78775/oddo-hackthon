import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import UserProfile from './pages/UserProfile';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import Community from './pages/Community';
import AdminDashboard from './pages/AdminDashboard';
import CalendarView from './pages/CalendarView';
import BudgetOverview from './pages/BudgetOverview';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Trips */}
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/trips/:id/edit" element={<ItineraryBuilder />} />
            <Route path="/trips/:id" element={<ItineraryView />} />
            
            {/* Search */}
            <Route path="/search" element={<CitySearch />} />
            <Route path="/search/activities" element={<ActivitySearch />} />
            
            {/* Other */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/budget" element={<BudgetOverview />} />

            <Route path="/community" element={<Community />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
