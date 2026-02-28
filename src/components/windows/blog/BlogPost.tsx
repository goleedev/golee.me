import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import type { BlogPost as BlogPostType } from '../../../types';
import { formatDate } from '../../../utils/dateFormatter';
import { markdownComponents } from '../../../utils/markdownComponents';

interface BlogPostProps {
  post: BlogPostType;
  content: string;
  isLoading: boolean;
  onBack: () => void;
}

export const BlogPost = ({
  post,
  content,
  isLoading,
  onBack,
}: BlogPostProps) => {
  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 h-full overflow-y-scroll bg-white/95 backdrop-blur-xl">
      <div className="w-full mx-auto min-w-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to all posts</span>
        </button>

        <article className="mb-8 min-h-screen">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-light mb-4 text-gray-900">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar size={16} className="flex-shrink-0" />
                <span className="truncate">{formatDate(post.date)}</span>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2 min-w-0">
                  <Clock size={16} className="flex-shrink-0" />
                  <span className="truncate">{post.readTime}</span>
                </div>
              )}
            </div>

            {post.thumbnailUrl && (
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full max-w-full h-48 sm:h-full sm:max-h-96 object-cover rounded-lg mb-6"
              />
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-48 sm:h-64 bg-gray-100 rounded-lg animate-pulse w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse"></div>
              <div className="h-48 sm:h-64 bg-gray-100 rounded-lg animate-pulse mt-6 w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
            </div>
          ) : (
            <div className="overflow-x-hidden">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents(post.slug)}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
