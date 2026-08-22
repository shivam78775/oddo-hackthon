import { useEffect, useState } from 'react';
import { getAdminStats, getAdminUsers } from '../api/admin';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, MapPin, Activity, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getAdminUsers()
      ]);
      setStats(statsData);
      setUsersList(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-200">Access Denied</h1>
        <p className="text-slate-400 mt-2">You do not have permission to view the admin panel.</p>
      </div>
    );
  }

  if (loading || !stats) {
    return <div className="text-center py-20 text-slate-400">Loading admin data...</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
          <ShieldAlert size={32} className="text-red-400" />
          Admin Panel
        </h1>
        <p className="text-slate-400 mt-2">Manage users, view platform statistics, and track popular destinations.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-slate-100">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex items-center gap-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Trips Created</p>
            <p className="text-2xl font-bold text-slate-100">{stats.totalTrips}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Most Popular City</p>
            <p className="text-lg font-bold text-slate-100 truncate">{stats.popularCities[0]?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">User Growth Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userGrowth}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                <Bar dataKey="users" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Cities Chart */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">Popular Destinations</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.popularCities}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.popularCities.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-200">Manage Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800/50 text-slate-400 text-sm">
              <tr>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Trips Created</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{u._count.trips}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
