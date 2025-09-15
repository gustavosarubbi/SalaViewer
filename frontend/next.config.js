/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  // Corrigir aviso de múltiplos package-lock.json
  outputFileTracingRoot: path.join(__dirname, '../'),
}

module.exports = nextConfig

