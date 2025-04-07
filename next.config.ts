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
  reactStrictMode: true,
  compiler: {
    // Enables Server and Client component reuse (instead of re-rendering)
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-.*$', '^bis_.*$', '^__processed_.*$'] } : false,
  },
};

export default nextConfig;
