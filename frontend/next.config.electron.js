/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
  basePath: '',
  distDir: 'out',
  
  // Configurações específicas para Electron
  env: {
    ELECTRON: 'true',
    IS_DESKTOP: 'true'
  },
  
  // Desabilitar otimizações que não funcionam bem no Electron
  swcMinify: false,
  compress: false,
  
  // Configurações de headers para Electron
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },
  
  // Configurações de redirecionamento
  async redirects() {
    return []
  },
  
  // Configurações de rewrites
  async rewrites() {
    return []
  },
  
  // Configurações de webpack para Electron
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configurações específicas para o renderer process
      config.target = 'electron-renderer'
      
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