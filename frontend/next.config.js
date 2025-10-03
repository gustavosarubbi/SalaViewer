/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  basePath: '',
  distDir: 'out',
  outputFileTracingRoot: path.join(__dirname, '..'),
  
  // Configuração para permitir origens de desenvolvimento
  allowedDevOrigins: [
    '192.168.1.101',
    'localhost',
    '127.0.0.1'
  ],
  
  // Configurações específicas para Electron
  env: {
    ELECTRON: 'true',
    IS_DESKTOP: 'true'
  },
  
  // Desabilitar otimizações que não funcionam bem no Electron
  compress: false,
  
  // Configurações de webpack para Electron
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configurações específicas para o renderer process
      config.target = 'electron-renderer'
      
      // Definir global para compatibilidade com Node.js
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.DefinePlugin({
          global: 'globalThis',
        })
      )
      
      // Resolver módulos do Electron
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
        buffer: false,
        process: false
      }
    }
    
    return config
  }
}

module.exports = nextConfig