/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['apex-front-end-puce.vercel.app'],
    unoptimized: true, // This allows serving static images from public folder
  },
}

module.exports = nextConfig