import type { User, LoginPayload, SignupPayload, UpdateProfilePayload, ChangePasswordPayload } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data.data as T;
}

export async function login(payload: LoginPayload): Promise<User> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse<User>(res);
}

export async function signup(payload: SignupPayload): Promise<User> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse<User>(res);
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data as User;
  } catch {
    return null;
  }
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse<User>(res);
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/auth/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  return handleResponse<{ message: string }>(res);
}

