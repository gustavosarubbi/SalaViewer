/**
 * Utilitários para detecção de ambiente
 */

/**
 * Detecta se está rodando em desenvolvimento
 */
export function isDevelopmentEnvironment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Detecta se está rodando em produção (build estático)
 */
export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Obtém a URL base da API baseado no ambiente
 */
export function getApiBaseUrl(): string {
  // Se estiver em desenvolvimento, detectar dinamicamente
  if (isDevelopmentEnvironment()) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      return `http://${hostname}:1337/api`;
    }
  }
  
  // Fallback para produção
  return 'http://localhost:1337/api';
}

/**
 * Obtém hosts possíveis baseado no ambiente
 */
export function getPossibleHosts(): string[] {
  const hosts = ['localhost', '127.0.0.1'];
  
  // Se estiver em desenvolvimento, detectar rede
  if (isDevelopmentEnvironment() && typeof window !== 'undefined') {
    const currentHost = window.location.hostname;
    if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      hosts.unshift(currentHost);
    }
  }
  
  return hosts;
}

/**
 * Obtém portas possíveis baseado no ambiente
 */
export function getPossiblePorts(): number[] {
  // Desenvolvimento pode usar portas dinâmicas
  return [1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350];
}

/**
 * Log do ambiente detectado
 */
export function logEnvironmentInfo(): void {
  console.log('🔍 Informações do ambiente:');
  console.log(`   • Desenvolvimento: ${isDevelopmentEnvironment()}`);
  console.log(`   • Produção: ${isProductionEnvironment()}`);
  console.log(`   • API URL: ${getApiBaseUrl()}`);
  console.log(`   • Hosts possíveis: ${getPossibleHosts().join(', ')}`);
  console.log(`   • Portas possíveis: ${getPossiblePorts().join(', ')}`);
}

