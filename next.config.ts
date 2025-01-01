import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    loader: 'custom',
    loaderFile: 'src/lib/loader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.roaport.com',
      },
    ],
  },
};

export default nextConfig;
