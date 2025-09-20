import React from 'react';
import { blogPosts } from '../data/blogPosts';

export interface OGImageConfig {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * 현재 URL 경로를 기반으로 적절한 OG 이미지를 결정합니다.
 * @param pathname 현재 페이지의 경로
 * @param baseUrl 웹사이트의 기본 URL
 * @returns OG 이미지 설정
 */
export const getOGImageConfig = (
  pathname: string,
  baseUrl: string = ''
): OGImageConfig => {
  // 기본 설정
  const defaultConfig: OGImageConfig = {
    title: 'Go Lee | Code, Speak, Empower',
    description:
      'Developer, Speaker, and Community Builder. Sharing insights on tech and personal growth.',
    image: `${baseUrl}/opengraph-image.png`,
    url: `${baseUrl}${pathname}`,
  };

  // 루트 경로인 경우
  if (pathname === '/' || pathname === '') {
    return defaultConfig;
  }

  // 경로 분석
  const pathSegments = pathname.split('/').filter(Boolean);
  const basePath = pathSegments[0];

  // 블로그 포스트인지 확인
  if (basePath === 'blog' && pathSegments.length > 1) {
    const postSlug = pathSegments[1];
    const blogPost = blogPosts.find((post) => post.slug === postSlug);

    if (blogPost) {
      return {
        title: `${blogPost.title} | Go Lee`,
        description: blogPost.description,
        image: `${baseUrl}${blogPost.thumbnailUrl}`,
        url: `${baseUrl}${pathname}`,
      };
    }
  }

  if (basePath) {
    // 특별한 케이스 처리
    const getDisplayName = (path: string) => {
      switch (path) {
        case 'guestbook':
          return 'Guest Book';
        case 'community':
          return 'Community Journey';
        default:
          return path.charAt(0).toUpperCase() + path.slice(1);
      }
    };

    const categoryTitle = `Go Lee - ${getDisplayName(basePath)}`;
    return {
      title: categoryTitle,
      description: defaultConfig.description,
      image: `${baseUrl}/opengraph-image.png`,
      url: `${baseUrl}${pathname}`,
    };
  }

  // 다른 페이지들에 대한 기본 설정
  return defaultConfig;
};

/**
 * HTML head에 OG 메타 태그를 동적으로 추가합니다.
 * @param config OG 이미지 설정
 */
export const updateOGMetaTags = (config: OGImageConfig): void => {
  // 기존 OG 메타 태그 제거
  const existingTags = document.querySelectorAll(
    'meta[property^="og:"], meta[name^="twitter:"]'
  );
  existingTags.forEach((tag) => tag.remove());

  // 새로운 메타 태그 생성
  const metaTags = [
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:image', content: config.image },
    { property: 'og:url', content: config.url },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: config.image },
  ];

  // 메타 태그를 head에 추가
  metaTags.forEach(({ property, name, content }) => {
    const meta = document.createElement('meta');
    if (property) {
      meta.setAttribute('property', property);
    }
    if (name) {
      meta.setAttribute('name', name);
    }
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });

  // 페이지 제목도 업데이트
  document.title = config.title;
};

/**
 * URL 변경 시 OG 이미지를 업데이트하는 훅
 * @param pathname 현재 경로
 * @param baseUrl 기본 URL
 */
export const useOGImageUpdater = (pathname: string, baseUrl: string = '') => {
  const config = getOGImageConfig(pathname, baseUrl);

  // useEffect를 사용하여 컴포넌트가 마운트되거나 pathname이 변경될 때만 실행
  React.useEffect(() => {
    updateOGMetaTags(config);
  }, [pathname, baseUrl]);

  return config;
};
