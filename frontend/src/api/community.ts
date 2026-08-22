import { apiFetch } from './index';

export const getCommunityPosts = (query?: string) => {
  const url = query ? `/community/posts?q=${encodeURIComponent(query)}` : '/community/posts';
  return apiFetch(url);
};

export const createCommunityPost = (content: string) => {
  return apiFetch('/community/posts', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};
