/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // distDir: 'build',
  // basePath: '/users/test',
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
