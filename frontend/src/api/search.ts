import type { City, Activity, CitySearchParams, ActivitySearchParams, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function buildQuery(params: Record<string, any>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      sp.set(k, String(v));
    }
  });
  return sp.toString();
}

export async function searchCities(params: CitySearchParams = {}): Promise<PaginatedResponse<City>> {
  const query = buildQuery(params);
  const res = await fetch(`${API_URL}/cities?${query}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data as PaginatedResponse<City>;
}

export async function searchActivities(params: ActivitySearchParams = {}): Promise<PaginatedResponse<Activity>> {
  const query = buildQuery(params);
  const res = await fetch(`${API_URL}/catalog/activities?${query}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data as PaginatedResponse<Activity>;
}

export async function getUniqueRegions(): Promise<string[]> {
  const res = await fetch(`${API_URL}/cities/regions`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data as string[];
}

export async function getUniqueCountries(): Promise<string[]> {
  const res = await fetch(`${API_URL}/cities/countries`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data as string[];
}
