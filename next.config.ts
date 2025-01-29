import path from 'path';

import type { NextConfig } from 'next';

import { STUDIO_BUILD_STATIC } from '@/lib/env';

const nextConfig: NextConfig = {
  output: STUDIO_BUILD_STATIC ? 'export' : undefined,
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
  webpack: STUDIO_BUILD_STATIC
    ? (config) => {
        return {
          ...config,
          resolve: {
            ...config.resolve,
            alias: {
              ...config.resolve.alias,
              [path.resolve(__dirname, 'src/components/live')]: path.resolve(
                __dirname,
                'src/lib/shims/live'
              ),
              [path.resolve(__dirname, 'src/lib/sanity/live')]: path.resolve(
                __dirname,
                'src/lib/shims/live'
              ),
            },
          },
        };
      }
    : undefined,
};

export default nextConfig;
