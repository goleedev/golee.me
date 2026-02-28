import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '../../../types';
import { formatDate } from '../../../utils/dateFormatter';

interface BlogListProps {
  posts: BlogPost[];
  isLoading: boolean;
  onPostClick: (post: BlogPost) => void;
}

export const BlogList = ({ posts, isLoading, onPostClick }: BlogListProps) => {
  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">Blog</h2>
          <p className="text-gray-600 font-light">
            Thoughts on development, career, and community building
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                onClick={() => onPostClick(post)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {post.thumbnailUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1 min-w-0">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span className="truncate">{formatDate(post.date)}</span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center gap-1 min-w-0">
                        <Clock size={14} className="flex-shrink-0" />
                        <span className="truncate">{post.readTime}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 font-light line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
