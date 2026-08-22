import type { User, LoginPayload, SignupPayload } from '../types';
import { SAMPLE_USERS } from './mockData';

const AUTH_KEY = 'globetrotter_auth';
const USERS_KEY = 'globetrotter_users';

// Simulate network delay
const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

function getStoredUsers(): (User & { passwordHash: string })[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  // Seed with sample users
  const seeded = SAMPLE_USERS.map(u => ({
    ...u,
    passwordHash: 'demo123', // plain text for demo mock
  }));
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveUsers(users: (User & { passwordHash: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user: User) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

export async function login(payload: LoginPayload): Promise<User> {
  await delay(600);
  const users = getStoredUsers();
  const found = users.find(
    u => u.email === payload.email && u.passwordHash === payload.password
  );
  if (!found) {
    throw { error: { message: 'Invalid email or password' } };
  }
  const { passwordHash: _, ...user } = found;
  setSession(user);
  return user;
}

export async function signup(payload: SignupPayload): Promise<User> {
  await delay(800);
  const users = getStoredUsers();
  if (users.find(u => u.email === payload.email)) {
    throw { error: { message: 'Email already in use', fields: { email: 'This email is already registered' } } };
  }
  const newUser = {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    name: `${payload.firstName} ${payload.lastName}`,
    email: payload.email,
    phone: payload.phone,
    city: payload.city,
    country: payload.country,
    photoUrl: undefined,
    createdAt: new Date().toISOString(),
    passwordHash: payload.password,
  };
  users.push(newUser);
  saveUsers(users);
  const { passwordHash: _, ...user } = newUser;
  setSession(user);
  return user;
}

export async function logout(): Promise<void> {
  await delay(200);
  clearSession();
}

export async function getMe(): Promise<User | null> {
  await delay(300);
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}
