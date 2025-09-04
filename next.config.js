/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    unoptimized: true,
  },
  // 改善 CSS 預載行為
  experimental: {
    optimisticClientCache: false,
  },
  // 減少不必要的預載資源警告
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 在客戶端環境中忽略 Node.js 專用模組
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        dns: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
