import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  thumbnailUrl: string;
  readTime?: string;
}

export const BlogContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postContent, setPostContent] = useState<string>('');

  const blogPosts: BlogPost[] = [
    {
      slug: 'building-wit-community',
      title: '6 Years Building a Women-in-Tech Community',
      date: '2025-07-06',
      description: 'Reflections on Growth, Struggles, and Purpose',
      thumbnailUrl: '/thumbnails/building-wit-community.png',
      readTime: '8 min read',
    },
    {
      slug: 'reflecting-on-2024',
      title: 'Reflecting on 2024 ✨',
      date: '2024-12-24',
      description:
        'How a year of milestones shaped my personal and professional growth.',
      thumbnailUrl: '/thumbnails/reflecting-on-2024.png',
      readTime: '10 min read',
    },
    {
      slug: 'how-living-around-the-world-made-me-a-better-developer',
      title: 'How Living Around the World Made Me a Better Developer',
      date: '2024-11-15',
      description:
        'Exploring how international experiences shaped my perspective, problem-solving skills, and career as a developer.',
      thumbnailUrl:
        '/thumbnails/how-living-around-the-world-made-me-a-better-developer.png',
      readTime: '12 min read',
    },
    {
      slug: 'testing-startup',
      title:
        'Testing in Startups with Jest, React Testing Library, and Cypress',
      date: '2024-10-05',
      description:
        'A practical guide to balancing test coverage and resources in startup projects.',
      thumbnailUrl: '/thumbnails/testing-startup.png',
      readTime: '15 min read',
    },
    {
      slug: 'cost-effective-tech-stacks',
      title: 'Series A Startup Tech Stack for Under $100/Month',
      date: '2024-09-06',
      description:
        "Cost-effective cloud services powering our Series A startup's growth.",
      thumbnailUrl: '/thumbnails/cost-effective.gif',
      readTime: '10 min read',
    },
    {
      slug: 'why-supabase-is-ideal-for-startups',
      title: 'Why Supabase is the Ideal Choice for Startups',
      date: '2024-08-02',
      description:
        'Discover how Supabase is revolutionizing backend development for startups.',
      thumbnailUrl: '/thumbnails/why-supabase-is-ideal-for-startups.png',
      readTime: '8 min read',
    },
    {
      slug: 'time-management',
      title: 'Maximizing Productivity Through Systems',
      date: '2024-07-08',
      description:
        'A success strategy for multitasking professionals with time management.',
      thumbnailUrl: '/thumbnails/time-management.png',
      readTime: '12 min read',
    },
    {
      slug: 'uol-bsc-computer-science',
      title: 'Discover the UoL Computer Science Degree on Coursera',
      date: '2024-06-18',
      description:
        'Dive into the University of London (UoL) Computer Science degree program on Coursera.',
      thumbnailUrl: '/thumbnails/uol-bsc-computer-science.png',
      readTime: '10 min read',
    },
    {
      slug: 'global-accessibility-awareness-day',
      title: 'Celebrating Global Accessibility Awareness Day 2024',
      date: '2024-05-19',
      description:
        'Championing digital accessibility and inclusivity with Next.js for a more equitable web experience.',
      thumbnailUrl: '/thumbnails/gaad.png',
      readTime: '8 min read',
    },
    {
      slug: 'early-stage-startup-tech-stack',
      title: 'How Two Front-End Developers Built an E-Commerce App in 10 Weeks',
      date: '2024-05-03',
      description:
        'From Solo MVP to Scaled Success - Building a $70k+/Month Transactions E-Commerce App',
      thumbnailUrl: '/thumbnails/early-stage-startup-tech-stack.png',
      readTime: '15 min read',
    },
    {
      slug: 'css-2024',
      title: '5 Must-Know CSS Features of 2024',
      date: '2024-04-14',
      description:
        'Dive into the latest CSS advancements that streamline web design!',
      thumbnailUrl: '/thumbnails/css-2024.png',
      readTime: '7 min read',
    },
    {
      slug: 'server-actions',
      title: 'Server Actions in Next.js 14 - Enhance Your Applications',
      date: '2024-04-07',
      description:
        'Leverage server actions for secure and efficient data handling',
      thumbnailUrl: '/thumbnails/server-actions.png',
      readTime: '10 min read',
    },
    {
      slug: 'scroll-snap',
      title: 'Make Scrolling Smooth with CSS Scroll-Snap',
      date: '2024-04-01',
      description:
        "Take control of your web page's scrolling experience with scroll-snap.",
      thumbnailUrl: '/thumbnails/scroll-snap.png',
      readTime: '6 min read',
    },
    {
      slug: 'lottie-with-nextjs',
      title: 'Unpopular Opinion — Everyone Needs Animations',
      date: '2024-03-27',
      description:
        'Learn how to integrate lightweight animations into your Next.js applications using Lottie.',
      thumbnailUrl: '/thumbnails/lottie.gif',
      readTime: '8 min read',
    },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Handle URL-based navigation
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'blog' && pathParts[2]) {
      const slug = pathParts[2];
      const post = blogPosts.find((p) => p.slug === slug);
      if (post) {
        setSelectedPost(post);
      }
    } else if (pathParts[1] === 'blog' && !pathParts[2]) {
      setSelectedPost(null);
      setPostContent('');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (selectedPost) {
      fetch(`/posts/${selectedPost.slug}.mdx`)
        .then((res) => res.text())
        .then((text) => {
          const content = text.replace(/^---[\s\S]*?---/, '').trim();
          setPostContent(content);
        })
        .catch((err) => {
          console.error('Error loading post:', err);
          setPostContent('Failed to load post content.');
        });
    }
  }, [selectedPost]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    navigate(`/blog/${post.slug}`);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    setPostContent('');
    navigate('/blog');
  };

  const markdownComponents: Components = {
    h1: ({ children }) => (
      <h1 className="text-3xl font-medium text-gray-900 mt-8 mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => {
      let imageSrc = src || '';

      if (!imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
        imageSrc = `/posts/${selectedPost?.slug}/${imageSrc}`;
      }

      return (
        <img
          src={imageSrc}
          alt={alt || ''}
          className="w-full rounded-lg my-6"
        />
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
        {children}
      </blockquote>
    ),
    code: ({
      inline,
      children,
    }: {
      inline?: boolean;
      children?: React.ReactNode;
    }) => {
      if (inline) {
        return (
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {children}
          </code>
        );
      }
      return (
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm font-mono">{children}</code>
        </pre>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => <li className="text-gray-700 ml-4">{children}</li>,
    hr: () => <hr className="my-8 border-gray-300" />,
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-300">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-300 px-4 py-2">{children}</td>
    ),
  };

  if (selectedPost) {
    return (
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to all posts</span>
          </button>

          <article className="mb-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-light mb-4 text-gray-900">
                {selectedPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{formatDate(selectedPost.date)}</span>
                </div>
                {selectedPost.readTime && (
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>{selectedPost.readTime}</span>
                  </div>
                )}
              </div>

              {selectedPost.thumbnailUrl && (
                <img
                  src={selectedPost.thumbnailUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
            </div>

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}
            >
              {postContent}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto">
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
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                onClick={() => handlePostClick(post)}
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

                  <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    {post.readTime && (
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
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
