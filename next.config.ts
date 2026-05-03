/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,

  basePath: '/porsche-product-landpage',
  assetPrefix: '/porsche-product-landpage/',

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;