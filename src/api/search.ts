import type { City, Activity, CitySearchParams, ActivitySearchParams, PaginatedResponse } from '../types';
import { CITIES, ACTIVITIES } from './mockData';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function searchCities(params: CitySearchParams = {}): Promise<PaginatedResponse<City>> {
  await delay();
  let results = [...CITIES];

  if (params.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }
  if (params.region) {
    results = results.filter(c => c.region === params.region);
  }
  if (params.country) {
    results = results.filter(c => c.country === params.country);
  }

  switch (params.sort) {
    case 'popularity':
      results.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
      break;
    case 'cost':
      results.sort((a, b) => (a.costIndex || 0) - (b.costIndex || 0));
      break;
    case 'name':
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      results.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return {
    data: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function searchActivities(params: ActivitySearchParams = {}): Promise<PaginatedResponse<Activity>> {
  await delay();
  let results = [...ACTIVITIES];

  if (params.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      a => a.name.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
    );
  }
  if (params.category) {
    results = results.filter(a => a.category === params.category);
  }
  if (params.maxCost !== undefined) {
    results = results.filter(a => a.cost <= params.maxCost!);
  }
  if (params.maxDuration !== undefined) {
    results = results.filter(a => (a.durationMins || 0) <= params.maxDuration!);
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return {
    data: paged,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function getUniqueRegions(): string[] {
  return [...new Set(CITIES.map(c => c.region).filter(Boolean) as string[])];
}

export function getUniqueCountries(): string[] {
  return [...new Set(CITIES.map(c => c.country))].sort();
}
