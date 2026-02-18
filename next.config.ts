import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/plant-mage',
  assetPrefix: '/plant-mage/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
