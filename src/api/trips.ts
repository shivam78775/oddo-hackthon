import type { Trip, Stop, Activity, BudgetItem } from '../types';
import { SAMPLE_TRIPS, SAMPLE_STOPS, SAMPLE_BUDGET_ITEMS } from './mockData';

const TRIPS_KEY = 'globetrotter_trips';
const STOPS_KEY = 'globetrotter_stops';
const BUDGET_KEY = 'globetrotter_budget';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

function uuid(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Trip Storage ────────────────────────────────────────────

function getTrips(): Trip[] {
  const raw = localStorage.getItem(TRIPS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(TRIPS_KEY, JSON.stringify(SAMPLE_TRIPS));
  return SAMPLE_TRIPS;
}

function saveTrips(trips: Trip[]) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

function getStops(): Stop[] {
  const raw = localStorage.getItem(STOPS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(STOPS_KEY, JSON.stringify(SAMPLE_STOPS));
  return SAMPLE_STOPS;
}

function saveStops(stops: Stop[]) {
  localStorage.setItem(STOPS_KEY, JSON.stringify(stops));
}

function getBudgetItems(): BudgetItem[] {
  const raw = localStorage.getItem(BUDGET_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(BUDGET_KEY, JSON.stringify(SAMPLE_BUDGET_ITEMS));
  return SAMPLE_BUDGET_ITEMS;
}

function saveBudgetItems(items: BudgetItem[]) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(items));
}

// ─── Trip CRUD ───────────────────────────────────────────────

export async function fetchTrips(userId: string): Promise<Trip[]> {
  await delay();
  const trips = getTrips().filter(t => t.userId === userId);
  const stops = getStops();
  return trips.map(t => ({
    ...t,
    stops: stops.filter(s => s.tripId === t.id),
  }));
}

export async function fetchTrip(tripId: string): Promise<Trip> {
  await delay();
  const trips = getTrips();
  const trip = trips.find(t => t.id === tripId);
  if (!trip) throw { error: { message: 'Trip not found' } };
  const stops = getStops().filter(s => s.tripId === tripId);
  return { ...trip, stops };
}

export async function createTrip(userId: string, data: Partial<Trip>): Promise<Trip> {
  await delay(500);
  const trips = getTrips();
  const newTrip: Trip = {
    id: uuid(),
    userId,
    name: data.name || 'Untitled Trip',
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate || new Date().toISOString(),
    description: data.description,
    coverPhotoUrl: data.coverPhotoUrl,
    isPublic: false,
    createdAt: new Date().toISOString(),
    stops: [],
  };
  trips.push(newTrip);
  saveTrips(trips);
  return newTrip;
}

export async function updateTrip(tripId: string, data: Partial<Trip>): Promise<Trip> {
  await delay();
  const trips = getTrips();
  const idx = trips.findIndex(t => t.id === tripId);
  if (idx === -1) throw { error: { message: 'Trip not found' } };
  trips[idx] = { ...trips[idx], ...data };
  saveTrips(trips);
  return trips[idx];
}

export async function deleteTrip(tripId: string): Promise<void> {
  await delay();
  const trips = getTrips().filter(t => t.id !== tripId);
  saveTrips(trips);
  // Also delete related stops
  const stops = getStops().filter(s => s.tripId !== tripId);
  saveStops(stops);
  const budget = getBudgetItems().filter(b => b.tripId !== tripId);
  saveBudgetItems(budget);
}

// ─── Stop CRUD ───────────────────────────────────────────────

export async function addStop(tripId: string, data: Partial<Stop>): Promise<Stop> {
  await delay();
  const stops = getStops();
  const tripStops = stops.filter(s => s.tripId === tripId);
  const newStop: Stop = {
    id: uuid(),
    tripId,
    cityId: data.cityId || '',
    city: data.city,
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate || new Date().toISOString(),
    orderIndex: tripStops.length,
    activities: [],
  };
  stops.push(newStop);
  saveStops(stops);
  return newStop;
}

export async function updateStop(stopId: string, data: Partial<Stop>): Promise<Stop> {
  await delay();
  const stops = getStops();
  const idx = stops.findIndex(s => s.id === stopId);
  if (idx === -1) throw { error: { message: 'Stop not found' } };
  stops[idx] = { ...stops[idx], ...data };
  saveStops(stops);
  return stops[idx];
}

export async function deleteStop(stopId: string): Promise<void> {
  await delay();
  const stops = getStops().filter(s => s.id !== stopId);
  saveStops(stops);
}

export async function reorderStops(tripId: string, stopIds: string[]): Promise<void> {
  await delay();
  const stops = getStops();
  stopIds.forEach((id, index) => {
    const stop = stops.find(s => s.id === id && s.tripId === tripId);
    if (stop) stop.orderIndex = index;
  });
  saveStops(stops);
}

// ─── Activity CRUD ───────────────────────────────────────────

export async function addActivity(stopId: string, data: Partial<Activity>): Promise<Activity> {
  await delay();
  const stops = getStops();
  const stop = stops.find(s => s.id === stopId);
  if (!stop) throw { error: { message: 'Stop not found' } };
  const newActivity: Activity = {
    id: uuid(),
    stopId,
    name: data.name || 'New Activity',
    category: data.category || 'other',
    cost: data.cost || 0,
    durationMins: data.durationMins,
    description: data.description,
    imageUrl: data.imageUrl,
  };
  if (!stop.activities) stop.activities = [];
  stop.activities.push(newActivity);
  saveStops(stops);
  return newActivity;
}

export async function updateActivity(stopId: string, activityId: string, data: Partial<Activity>): Promise<Activity> {
  await delay();
  const stops = getStops();
  const stop = stops.find(s => s.id === stopId);
  if (!stop) throw { error: { message: 'Stop not found' } };
  const actIdx = (stop.activities || []).findIndex(a => a.id === activityId);
  if (actIdx === -1) throw { error: { message: 'Activity not found' } };
  stop.activities![actIdx] = { ...stop.activities![actIdx], ...data };
  saveStops(stops);
  return stop.activities![actIdx];
}

export async function deleteActivity(stopId: string, activityId: string): Promise<void> {
  await delay();
  const stops = getStops();
  const stop = stops.find(s => s.id === stopId);
  if (!stop) throw { error: { message: 'Stop not found' } };
  stop.activities = (stop.activities || []).filter(a => a.id !== activityId);
  saveStops(stops);
}

// ─── Budget ──────────────────────────────────────────────────

export async function addBudgetItem(tripId: string, data: Partial<BudgetItem>): Promise<BudgetItem> {
  await delay();
  const items = getBudgetItems();
  const newItem: BudgetItem = {
    id: uuid(),
    tripId,
    stopId: data.stopId,
    category: data.category || 'activity',
    amount: data.amount || 0,
  };
  items.push(newItem);
  saveBudgetItems(items);
  return newItem;
}

export async function fetchBudgetItems(tripId: string): Promise<BudgetItem[]> {
  await delay();
  return getBudgetItems().filter(b => b.tripId === tripId);
}
