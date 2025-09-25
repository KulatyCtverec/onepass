import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Vypnout TypeScript checking při buildu
    ignoreBuildErrors: true,
  },
  eslint: {
    // Vypnout ESLint checking při buildu
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
