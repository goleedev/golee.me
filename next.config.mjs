import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 2592000, // 30일 (30 * 24 * 60 * 60)
  },
};

export default withContentlayer(nextConfig);
