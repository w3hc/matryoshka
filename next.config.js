/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/gcfa': { page: '/gcfa' },
    }
  },
}

module.exports = nextConfig
