import type { Trip, Stop, Activity, BudgetItem, BudgetBreakdown } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data.data as T;
}

// ─── Trip CRUD ───────────────────────────────────────────────

export async function fetchTrips(_userId?: string): Promise<Trip[]> {
  const res = await fetch(`${API_URL}/trips`, {
    credentials: 'include',
  });
  return handleResponse<Trip[]>(res);
}

export async function fetchTrip(tripId: string): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${tripId}`, {
    credentials: 'include',
  });
  return handleResponse<Trip>(res);
}

export async function createTrip(_userId: string, data: Partial<Trip>): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<Trip>(res);
}

export async function updateTrip(tripId: string, data: Partial<Trip>): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${tripId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<Trip>(res);
}

export async function deleteTrip(tripId: string): Promise<void> {
  const res = await fetch(`${API_URL}/trips/${tripId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
}

// ─── Stop CRUD ───────────────────────────────────────────────

export async function addStop(tripId: string, data: Partial<Stop>): Promise<Stop> {
  const res = await fetch(`${API_URL}/trips/${tripId}/stops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<Stop>(res);
}

export async function updateStop(stopId: string, data: Partial<Stop>): Promise<Stop> {
  const res = await fetch(`${API_URL}/stops/${stopId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<Stop>(res);
}

export async function deleteStop(stopId: string): Promise<void> {
  const res = await fetch(`${API_URL}/stops/${stopId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
}

export async function reorderStops(tripId: string, stopIds: string[]): Promise<void> {
  const res = await fetch(`${API_URL}/trips/${tripId}/stops/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ stopIds }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
}

// ─── Activity CRUD ───────────────────────────────────────────

export async function addActivity(stopId: string, data: Partial<Activity>): Promise<Activity> {
  const res = await fetch(`${API_URL}/stops/${stopId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<Activity>(res);
}

export async function updateActivity(_stopId: string, activityId: string, data: Partial<Activity>): Promise<Activity> {
  const res = await fetch(`${API_URL}/activities/${activityId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<Activity>(res);
}

export async function deleteActivity(_stopId: string, activityId: string): Promise<void> {
  const res = await fetch(`${API_URL}/activities/${activityId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json();
    throw data;
  }
}

// ─── Budget ──────────────────────────────────────────────────

export async function addBudgetItem(tripId: string, data: Partial<BudgetItem>): Promise<BudgetItem> {
  const res = await fetch(`${API_URL}/trips/${tripId}/budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<BudgetItem>(res);
}

export async function fetchBudgetItems(tripId: string): Promise<BudgetItem[]> {
  const res = await fetch(`${API_URL}/trips/${tripId}/budget/items`, {
    credentials: 'include',
  });
  return handleResponse<BudgetItem[]>(res);
}

export async function fetchBudgetBreakdown(tripId: string): Promise<BudgetBreakdown> {
  const res = await fetch(`${API_URL}/budget/trips/${tripId}`, {
    credentials: 'include',
  });
  return handleResponse<BudgetBreakdown>(res);
}
