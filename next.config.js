/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
  eslint: {
    // Disable ESLint during builds for now (Phase 1)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds for now  
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig