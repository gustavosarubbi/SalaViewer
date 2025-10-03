/**
 * Sistema de configuração dinâmica para o backend
 */

import * as os from 'os';

export interface DynamicConfig {
  host: string;
  port: number;
  corsOrigins: string[];
  databasePath: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  realHost: string;
  nodeEnv: string;
  throttleTtl: number;
  throttleLimit: number;
}

/**
 * Detecta IP da rede local automaticamente
 */
function detectNetworkIP(): string {
  const detectedIPs: string[] = [];
  
  try {
    const interfaces = os.networkInterfaces();
    
    console.log('🔍 Detectando IPs da rede...');
    
    for (const [name, iface] of Object.entries(interfaces)) {
      if (iface) {
        console.log(`📡 Interface: ${name}`);
        for (const alias of iface) {
          console.log(`   - ${alias.family} ${alias.address} (internal: ${alias.internal})`);
          if (alias.family === 'IPv4' && !alias.internal) {
            detectedIPs.push(alias.address);
          }
        }
      }
    }
    
    if (detectedIPs.length > 0) {
      const primaryIP = detectedIPs[0];
      console.log(`✅ IPs da rede detectados: ${detectedIPs.join(', ')}`);
      console.log(`🎯 Usando IP principal: ${primaryIP}`);
      return primaryIP;
    }
  } catch (error) {
    console.warn('⚠️ Não foi possível detectar IP da rede:', error);
  }
  
  console.log('⚠️ Nenhum IP da rede detectado, usando localhost');
  return 'localhost';
}

/**
 * Gera origens CORS dinamicamente
 */
function generateCorsOrigins(): string[] {
  const origins = new Set<string>();
  const networkIP = detectNetworkIP();
  
  // Portas comuns do frontend
  const frontendPorts = ['3000', '3001', '3002', '3003', '3004', '3005'];
  
  // 1. Adicionar localhost
  frontendPorts.forEach(port => {
    origins.add(`http://localhost:${port}`);
    origins.add(`http://127.0.0.1:${port}`);
  });
  
  // 2. Adicionar IP da rede local
  if (networkIP !== 'localhost') {
    frontendPorts.forEach(port => {
      origins.add(`http://${networkIP}:${port}`);
    });
  }
  
  // 2.1. Sempre adicionar localhost para compatibilidade
  frontendPorts.forEach(port => {
    origins.add(`http://localhost:${port}`);
    origins.add(`http://127.0.0.1:${port}`);
  });
  
  // 3. Gerar IPs de rede local dinamicamente baseado no IP detectado
  if (networkIP !== 'localhost') {
    const parts = networkIP.split('.');
    if (parts.length === 4) {
      // Gerar IPs da mesma sub-rede dinamicamente
      for (let i = 1; i <= 10; i++) {
        const generatedIP = `${parts[0]}.${parts[1]}.${parts[2]}.${i}`;
        frontendPorts.forEach(port => {
          origins.add(`http://${generatedIP}:${port}`);
        });
      }
    }
  } else {
    // Se não detectou IP da rede, tentar detectar automaticamente
    // usando diferentes estratégias de descoberta de rede
    const possibleRanges = [
      '192.168.0', '192.168.1', '192.168.2',
      '10.0.0', '172.16.0', '172.17.0'
    ];
    
    possibleRanges.forEach(range => {
      for (let i = 1; i <= 10; i++) {
        const generatedIP = `${range}.${i}`;
        frontendPorts.forEach(port => {
          origins.add(`http://${generatedIP}:${port}`);
        });
      }
    });
  }
  
  // 4. Adicionar variáveis de ambiente se existirem
  const corsOrigins = process.env.CORS_ORIGINS;
  if (corsOrigins) {
    corsOrigins.split(',').forEach(origin => {
      origins.add(origin.trim());
    });
  }
  
  return Array.from(origins);
}

/**
 * Detecta porta disponível dinamicamente
 * Esta função apenas retorna a porta inicial - a detecção real acontece no main.ts
 */
function detectAvailablePort(startPort: number = 1337): number {
  // Se a porta estiver especificada nas variáveis de ambiente, usar ela
  const envPort = process.env.PORT;
  if (envPort) {
    const port = parseInt(envPort);
    if (!isNaN(port) && port > 0 && port <= 65535) {
      return port;
    }
  }
  
  // Caso contrário, usar a porta padrão
  // A detecção real de porta disponível acontece no main.ts
  return startPort;
}

/**
 * Gera configuração dinâmica
 */
export function generateDynamicConfig(): DynamicConfig {
  const networkIP = detectNetworkIP();
  const port = detectAvailablePort();
  const corsOrigins = generateCorsOrigins();
  
  // Usar 0.0.0.0 para aceitar conexões de qualquer IP, mas salvar o IP real para o frontend
  const host = process.env.HOST || '0.0.0.0';
  const realHost = networkIP; // IP real para o frontend se conectar
  
  return {
    host,
    port,
    corsOrigins,
    databasePath: process.env.DATABASE_PATH || './database/salaviewer.db',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    realHost,
    nodeEnv: process.env.NODE_ENV || 'development',
    throttleTtl: parseInt(process.env.THROTTLE_TTL || '60000'),
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100')
  };
}

/**
 * Log da configuração dinâmica
 */
export function logDynamicConfig(config: DynamicConfig): void {
  console.log('\n' + '='.repeat(60));
  console.log('🔧 CONFIGURAÇÃO DINÂMICA');
  console.log('='.repeat(60));
  console.log(`🌐 Host: ${config.host}`);
  console.log(`🔌 Porta: ${config.port}`);
  console.log(`🔒 CORS: ${config.corsOrigins.length} origens`);
  console.log(`📁 Database: ${config.databasePath}`);
  console.log(`🔑 JWT: ${config.jwtSecret.substring(0, 10)}...`);
  console.log(`⚡ Throttle: ${config.throttleLimit} req/${config.throttleTtl/1000}s`);
  console.log(`🌍 Env: ${config.nodeEnv}`);
  console.log('='.repeat(60));
}
