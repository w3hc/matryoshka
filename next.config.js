/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/gcfa': { page: '/gcfa' },
    }
  },
}

module.exports = nextConfig
