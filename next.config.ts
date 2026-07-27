import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable SWC minification
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable production optimizations in dev
  productionBrowserSourceMaps: false,
  
  // Reduce output traces
  outputFileTracing: true,
  
  // Enable React strict mode to catch issues
  reactStrictMode: true,
  
  // Cache static pages
  staticPageGenerationTimeout: 60,
};

export default nextConfig;