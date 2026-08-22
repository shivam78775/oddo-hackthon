import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createTrip } from '../api/trips';
import FormField from '../components/FormField';
import { CalendarIcon, MapIcon, ImageIcon, ArrowRightIcon } from 'lucide-react';
import { z } from 'zod';

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
  coverPhotoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    coverPhotoUrl: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      // Validate
      const validated = tripSchema.parse(formData);
      
      // Ensure end date >= start date
      if (new Date(validated.endDate) < new Date(validated.startDate)) {
        setErrors({ endDate: 'End date must be after start date' });
        return;
      }

      setIsSubmitting(true);
      
      const newTrip = await createTrip(user!.id, validated);
      
      // Navigate to the newly created trip's itinerary builder
      navigate(`/trips/${newTrip.id}/build`);
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) newErrors[e.path[0].toString()] = e.message;
        });
        setErrors(newErrors);
      } else {
        console.error('Failed to create trip:', err);
        setErrors({ form: 'Failed to create trip. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Plan a New Trip</h1>
        <p className="text-gray-400 text-lg">Give your adventure a name and set the dates.</p>
      </div>

      <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {errors.form}
            </div>
          )}

          <FormField
            label="Trip Name"
            name="name"
            placeholder="e.g. Summer in Europe, Tokyo 2024"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            icon={<MapIcon className="w-5 h-5" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              error={errors.startDate}
              icon={<CalendarIcon className="w-5 h-5" />}
            />

            <FormField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              error={errors.endDate}
              icon={<CalendarIcon className="w-5 h-5" />}
            />
          </div>

          <FormField
            label="Cover Photo URL (Optional)"
            name="coverPhotoUrl"
            type="url"
            placeholder="https://..."
            value={formData.coverPhotoUrl}
            onChange={(e) => setFormData({ ...formData, coverPhotoUrl: e.target.value })}
            error={errors.coverPhotoUrl}
            icon={<ImageIcon className="w-5 h-5" />}
          />

          <FormField
            label="Description (Optional)"
            name="description"
            type="textarea"
            placeholder="What's the vibe of this trip?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            error={errors.description}
          />

          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 px-8"
            >
              {isSubmitting ? 'Creating...' : 'Continue to Itinerary'}
              {!isSubmitting && <ArrowRightIcon className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
