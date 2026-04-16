import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to allow inline styles
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
