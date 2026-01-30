/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  // Optional: Add site name
  env: {
    SITE_NAME: 'Thesis Archive Management System',
  },
}

module.exports = nextConfig