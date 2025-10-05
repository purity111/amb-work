import type { NextConfig } from "next";
import { columnRedirectMap } from "./src/utils/redirectMap";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true, // URL末尾にスラッシュを統一
  images: {
    domains: [
      'amb-project-assets.s3.ap-northeast-1.amazonaws.com',
      'amb-project-assets.s3.amazonaws.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'amb-project-assets.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'amb-project-assets.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    // Generate redirects from the mapping
    const redirects = Object.entries(columnRedirectMap).map(([slug, columnId]) => ({
      source: `/column/${slug}`,
      destination: `/column/column-${columnId}/`,
      permanent: true, // 301 redirect for SEO
    }));

    return redirects;
  },
};

export default nextConfig;
