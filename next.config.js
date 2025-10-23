/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: { unoptimized: true },
};

module.exports = nextConfig;
