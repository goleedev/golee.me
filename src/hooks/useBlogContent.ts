import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import type { BlogPost } from '../types';

export const useBlogContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postContent, setPostContent] = useState<string>('');
  const [isLoadingPost, setIsLoadingPost] = useState(false);

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

  // Load post content
  useEffect(() => {
    if (selectedPost) {
      setIsLoadingPost(true);
      setPostContent('');

      fetch(`/posts/${selectedPost.slug}.mdx`)
        .then((res) => res.text())
        .then((text) => {
          const content = text.replace(/^---[\s\S]*?---/, '').trim();
          setPostContent(content);
          setIsLoadingPost(false);
        })
        .catch((err) => {
          console.error('Error loading post:', err);
          setPostContent('Failed to load post content.');
          setIsLoadingPost(false);
        });
    }
  }, [selectedPost]);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    navigate(`/blog/${post.slug}`);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
    setPostContent('');
    navigate('/blog');
  };

  return {
    selectedPost,
    isLoading,
    postContent,
    isLoadingPost,
    blogPosts,
    handlePostClick,
    handleBackClick,
  };
};
