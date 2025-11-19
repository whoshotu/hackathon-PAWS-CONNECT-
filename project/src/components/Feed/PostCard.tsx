import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from '../utils/dateUtils';

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    content: string;
    media_urls: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
    profiles: {
      username: string;
      display_name: string;
      avatar_url: string | null;
    };
  };
  onUpdate: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);

    try {
      if (liked) {
        await supabase
          .from('likes')
          .delete()
          .match({ post_id: post.id, user_id: user.id });
        setLiked(false);
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: post.id, user_id: user.id });
        setLiked(true);
      }
      onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const isOwner = user?.id === post.user_id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3">
          {post.profiles.avatar_url ? (
            <img src={post.profiles.avatar_url} alt={post.profiles.display_name} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">{post.profiles.display_name[0]}</span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{post.profiles.display_name}</h3>
            <p className="text-sm text-gray-500">@{post.profiles.username} · {formatDistanceToNow(post.created_at)}</p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            liked
              ? 'text-red-600 bg-red-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likes_count}</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments_count}</span>
        </button>
      </div>
    </div>
  );
}
