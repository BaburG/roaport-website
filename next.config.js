const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'img.roaport.com'],
  },
}

module.exports = withNextIntl(nextConfig); 