import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  // async redirects() {
  //   return [
  //     {
  //       source: '/jobs',
  //       destination: '/job-openings/na/na/na/na/na',
  //       permanent: true, // use false for temporary redirect (307)
  //     },
  //   ];
  // },
};

export default nextConfig;
