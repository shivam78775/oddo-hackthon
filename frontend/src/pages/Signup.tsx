import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';
import { Globe, UserPlus, Loader2 } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  additionalInfo: z.string().optional(),
});

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    city: '', country: '', password: '', additionalInfo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(i => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(result.data);
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.error?.fields) {
        setErrors(err.error.fields);
      } else {
        setGlobalError(err?.error?.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 gradient-subtle">
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-2xl animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary-500/30 mb-4">
            <Globe className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create an account</h1>
          <p className="text-surface-400 mt-1">Start planning your next journey today</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {globalError && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {globalError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="First Name"
                value={form.firstName}
                onChange={e => setForm({ ...form, firstName: e.target.value })}
                error={errors.firstName}
                placeholder="John"
              />
              <FormField
                label="Last Name"
                value={form.lastName}
                onChange={e => setForm({ ...form, lastName: e.target.value })}
                error={errors.lastName}
                placeholder="Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Email Address"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                error={errors.email}
                placeholder="john@example.com"
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <FormField
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              placeholder="Create a strong password"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="City"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                error={errors.city}
                placeholder="e.g. New York"
              />
              <FormField
                label="Country"
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                error={errors.country}
                placeholder="e.g. USA"
              />
            </div>

            <FormField
              label="Additional Information"
              multiline
              rows={3}
              value={form.additionalInfo}
              onChange={e => setForm({ ...form, additionalInfo: e.target.value })}
              error={errors.additionalInfo}
              placeholder="Tell us a bit about your travel style..."
            />

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-4">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Register User'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
