// ─── Core Data Models ────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  phone?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  coverPhotoUrl?: string;
  isPublic: boolean;
  publicSlug?: string;
  createdAt: string;
  stops?: Stop[];
  budgetItems?: BudgetItem[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  region?: string;
  costIndex?: number;
  popularityScore?: number;
  imageUrl?: string;
}

export interface Stop {
  id: string;
  tripId: string;
  cityId: string;
  city?: City;
  startDate: string;
  endDate: string;
  orderIndex: number;
  activities?: Activity[];
}

export type ActivityCategory = 'sightseeing' | 'food' | 'adventure' | 'culture' | 'other';

export interface Activity {
  id: string;
  stopId: string;
  name: string;
  category: ActivityCategory;
  cost: number;
  durationMins?: number;
  description?: string;
  imageUrl?: string;
}

export type BudgetCategory = 'transport' | 'stay' | 'activity' | 'meal';

export interface BudgetItem {
  id: string;
  tripId: string;
  stopId?: string;
  category: BudgetCategory;
  amount: number;
}

// ─── API Response Envelopes ──────────────────────────────────

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: {
    message: string;
    fields?: Record<string, string>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Budget Aggregation ──────────────────────────────────────

export interface BudgetBreakdown {
  byCategory: Record<BudgetCategory, number>;
  byDay: { date: string; total: number }[];
  total: number;
  averagePerDay: number;
  overBudgetDays?: string[];
}

// ─── Auth ────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  country?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ─── Search / Filter ─────────────────────────────────────────

export interface CitySearchParams {
  q?: string;
  region?: string;
  country?: string;
  sort?: 'popularity' | 'cost' | 'name';
  page?: number;
  limit?: number;
}

export interface ActivitySearchParams {
  q?: string;
  category?: ActivityCategory;
  maxCost?: number;
  maxDuration?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Trip Status ─────────────────────────────────────────────

export type TripStatus = 'ongoing' | 'upcoming' | 'completed';

export function getTripStatus(trip: Trip): TripStatus {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now >= start && now <= end) return 'ongoing';
  if (now < start) return 'upcoming';
  return 'completed';
}

// ─── Utility Types ───────────────────────────────────────────

export type SortOption = {
  label: string;
  value: string;
};

export type FilterOption = {
  label: string;
  value: string;
};

// ─── Profile & Password ──────────────────────────────────────

export interface UpdateProfilePayload {
  name: string;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ─── Overall Budget ──────────────────────────────────────────

export interface OverallBudget {
  byCategory: Record<BudgetCategory, number>;
  byTrip: { tripId: string; tripName: string; total: number }[];
  total: number;
}
