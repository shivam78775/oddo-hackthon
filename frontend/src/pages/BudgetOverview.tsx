import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchOverallBudget } from '../api/trips';
import type { OverallBudget, BudgetCategory } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { PieChart as PieChartIcon, DollarSign, Wallet } from 'lucide-react';

const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  transport: '#3b82f6', // blue-500
  stay: '#8b5cf6',      // violet-500
  activity: '#f59e0b',  // amber-500
  meal: '#10b981',      // emerald-500
};

export default function BudgetOverview() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<OverallBudget | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchOverallBudget();
        setBudget(data);
      } catch (err) {
        console.error('Failed to load overall budget:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!budget || budget.byTrip.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass-card p-12 text-center rounded-2xl border border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No spending data yet</h2>
          <p className="text-surface-400 mb-6">
            Create a trip and add some activities or budget items to see your overview.
          </p>
          <button onClick={() => navigate('/create-trip')} className="btn-primary">
            Plan New Trip
          </button>
        </div>
      </div>
    );
  }

  // Format data for PieChart
  const pieData = Object.entries(budget.byCategory)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <PieChartIcon className="w-8 h-8 text-primary-400" />
              Budget Overview
            </h1>
            <p className="text-surface-400 mt-2">
              Aggregate spending across all your {budget.byTrip.length} planned trips.
            </p>
          </div>
          <div className="bg-surface-900/50 p-6 rounded-2xl border border-white/5 text-center min-w-[200px]">
            <p className="text-surface-400 text-sm uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-4xl font-bold text-white flex items-center justify-center gap-1">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              {budget.total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Spending by Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name as BudgetCategory] || '#8884d8'} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#ffffff1a', borderRadius: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Legend 
                  formatter={(value) => <span className="text-surface-200 capitalize">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trip Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Spending by Trip</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budget.byTrip} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8' }} />
                <YAxis 
                  type="category" 
                  dataKey="tripName" 
                  tick={{ fill: '#e2e8f0' }} 
                  width={100} 
                  tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                />
                <Tooltip
                  cursor={{ fill: '#ffffff0a' }}
                  contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#ffffff1a', borderRadius: '12px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {budget.byTrip.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(220, 80%, ${60 - (index % 3) * 10}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
