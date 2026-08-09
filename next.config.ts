import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable React strict mode to catch issues
  reactStrictMode: true,
  
  // Cache static pages
  staticPageGenerationTimeout: 60,
};

export default nextConfig;