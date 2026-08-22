import { useEffect, useState } from 'react';
import { getCommunityPosts, createCommunityPost } from '../api/community';
import type { Post } from '../types';
import { Search, Send, User, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (searchQuery?: string) => {
    try {
      const data = await getCommunityPosts(searchQuery);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(query);
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    try {
      const post = await createCommunityPost(newPost);
      setPosts([post, ...posts]);
      setNewPost('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Community Tab
        </h1>
        <p className="text-slate-400 mt-2">Share your experiences and discover inspiration from other travelers.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search community posts (e.g., 'Paris', 'street food')..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-12 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <button type="submit" className="absolute right-3 top-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">
            Search
          </button>
        </div>
      </form>

      <form onSubmit={handleSubmitPost} className="mb-10 glass-card p-4 rounded-xl">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your travel experience, ask for recommendations, or post a review..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 min-h-[100px] resize-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!newPost.trim()}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <Send size={18} />
            Post
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-slate-400 py-10">Loading community...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-slate-400 py-10 glass-card rounded-xl">No posts found. Be the first to share!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="glass-card rounded-xl p-6 transition-all hover:border-cyan-500/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200">{post.user.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.user.city && post.user.country && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {post.user.city}, {post.user.country}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
