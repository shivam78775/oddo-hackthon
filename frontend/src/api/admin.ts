const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw data;
  // If the backend wraps in { data: ... }, extract it, else return data
  return data.data !== undefined ? data.data : data;
}

export const getAdminStats = () => fetch(`${API_URL}/admin/stats`, { credentials: 'include' }).then(handleResponse);
export const getAdminUsers = () => fetch(`${API_URL}/admin/users`, { credentials: 'include' }).then(handleResponse);
