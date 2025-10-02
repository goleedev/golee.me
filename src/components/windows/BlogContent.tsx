import { useBlogContent } from '../../hooks/useBlogContent';
import { BlogList } from './blog/BlogList';
import { BlogPost } from './blog/BlogPost';

export const BlogContent = () => {
  const {
    selectedPost,
    isLoading,
    postContent,
    isLoadingPost,
    blogPosts,
    handlePostClick,
    handleBackClick,
  } = useBlogContent();

  if (selectedPost) {
    return (
      <BlogPost
        post={selectedPost}
        content={postContent}
        isLoading={isLoadingPost}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <BlogList
      posts={blogPosts}
      isLoading={isLoading}
      onPostClick={handlePostClick}
    />
  );
};
