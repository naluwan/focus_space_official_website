/** @type {import('next').NextConfig} */

const debug = process.env.NODE_ENV !== 'production';
const nextConfig = {
  images: {
    domains: ['utfs.io'],
  },
  assetPrefix: !debug ? 'https://focusspace-fa98b8543b50.herokuapp.com/' : '',
};

module.exports = nextConfig;
