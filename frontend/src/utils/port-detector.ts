/**
 * Utilitário para detectar portas disponíveis e configurar URLs dinamicamente
 */

export interface PortInfo {
  port: number;
  host: string;
  apiUrl: string;
  timestamp: string;
}

/**
 * Detecta uma porta disponível a partir de uma porta inicial
 */
export async function findAvailablePort(startPort: number = 3003): Promise<number> {
  // No navegador, não podemos detectar portas diretamente
  // Retornamos a porta solicitada ou uma porta padrão
  return startPort;
}

/**
 * Obtém informações da API a partir do arquivo port-info.json gerado pelo backend
 */
export async function getBackendPortInfo(): Promise<PortInfo | null> {
  try {
    // Tentar obter informações do arquivo port-info.json
    const response = await fetch('/port-info.json');
    if (response.ok) {
      const portInfo: PortInfo = await response.json();
      return portInfo;
    }
  } catch (error) {
    console.warn('Não foi possível obter informações da porta do backend:', error);
  }
  
  return null;
}

/**
 * Obtém a URL da API dinamicamente
 */
export async function getDynamicApiUrl(): Promise<string> {
  // Primeiro, tentar usar variáveis de ambiente
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Tentar obter informações do backend
  const portInfo = await getBackendPortInfo();
  if (portInfo) {
    return portInfo.apiUrl;
  }
  
  // Fallback para configuração padrão
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'localhost';
  const apiPort = process.env.NEXT_PUBLIC_API_PORT || '1337';
  
  return `http://${apiHost}:${apiPort}/api`;
}

/**
 * Obtém a porta do frontend dinamicamente
 */
export function getFrontendPort(): number {
  return parseInt(process.env.NEXT_PUBLIC_FRONTEND_PORT || '3003');
}

/**
 * Obtém o host do frontend dinamicamente
 */
export function getFrontendHost(): string {
  return process.env.NEXT_PUBLIC_FRONTEND_HOST || 'localhost';
}

/**
 * Obtém a URL completa do frontend
 */
export function getFrontendUrl(): string {
  const host = getFrontendHost();
  const port = getFrontendPort();
  return `http://${host}:${port}`;
}
