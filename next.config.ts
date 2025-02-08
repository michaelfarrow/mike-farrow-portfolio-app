import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [160, 320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;
