import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { Loader2 } from 'lucide-react';

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  visibility: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        () => loadPosts()
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((current) =>
            current.map((post) =>
              post.id === payload.new.id ? { ...post, likes_count: payload.new.likes_count, comments_count: payload.new.comments_count } : post
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadPosts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <CreatePost onPostCreated={handlePostCreated} />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={loadPosts} />
        ))
      )}
    </div>
  );
}
