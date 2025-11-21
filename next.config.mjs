/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: false
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;

