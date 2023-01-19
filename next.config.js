/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // distDir: 'build',
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
