/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // distDir: 'build',
  // basePath: '/users/test',
//  basePath: '/users/bonz',
eslint: {
    ignoreDuringBuilds: true
  },
 env:{
     IMAGE_URL: process.env.IMAGE_URL || "https://hoyojo-new.dynax.co.jp/users/bonz",
     API_URL: process.env.API_URL || "https://hoyojo-new.dynax.co.jp/api/"
   }
}

module.exports = nextConfig
