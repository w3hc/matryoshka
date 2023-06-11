/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/gcfa': { page: '/gcfa' },
      '/redeem': { page: '/redeem' },
    }
  },
}

module.exports = nextConfig
