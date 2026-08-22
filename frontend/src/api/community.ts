const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw data;
  return data.data !== undefined ? data.data : data;
}

export const getCommunityPosts = (query?: string) => {
  const url = query ? `${API_URL}/community/posts?q=${encodeURIComponent(query)}` : `${API_URL}/community/posts`;
  return fetch(url, { credentials: 'include' }).then(handleResponse);
};

export const createCommunityPost = (content: string) => {
  return fetch(`${API_URL}/community/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  }).then(handleResponse);
};
