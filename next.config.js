/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdf-parse'],
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    config.module.rules.push({
      test: /\.html$/,
      type: 'asset/source',
    });
    return config;
  },
};

module.exports = nextConfig;
