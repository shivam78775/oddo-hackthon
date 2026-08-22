import { apiFetch } from './index';

export const getAdminStats = () => apiFetch('/admin/stats');
export const getAdminUsers = () => apiFetch('/admin/users');
