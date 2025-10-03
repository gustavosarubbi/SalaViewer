/**
 * Utilitário para detecção automática de configurações de rede
 */

export interface NetworkInfo {
  hostname: string;
  port: number;
  protocol: string;
  isLocalhost: boolean;
  isNetworkAccess: boolean;
  possibleHosts: string[];
}

/**
 * Detecta informações da rede atual
 */
export function getCurrentNetworkInfo(): NetworkInfo {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return {
      hostname: 'localhost',
      port: 3000,
      protocol: 'http',
      isLocalhost: true,
      isNetworkAccess: false,
      possibleHosts: ['localhost']
    };
  }

  const hostname = window.location.hostname;
  const port = parseInt(window.location.port) || 3000;
  const protocol = window.location.protocol.replace(':', '');
  
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isNetworkAccess = !isLocalhost;

  // Detectar possíveis hosts para API
  const possibleHosts = getPossibleApiHosts(hostname);

  return {
    hostname,
    port,
    protocol,
    isLocalhost,
    isNetworkAccess,
    possibleHosts
  };
}

/**
 * Detecta possíveis hosts para a API baseado no host atual
 */
function getPossibleApiHosts(currentHost: string): string[] {
  const hosts = new Set<string>();
  
  // Adicionar host atual
  hosts.add(currentHost);
  
  // Se for localhost, tentar detectar IP da rede
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    // Tentar detectar IP da rede usando WebRTC (método mais confiável no browser)
    detectNetworkIP().then(ip => {
      if (ip) {
        hosts.add(ip);
      }
    }).catch(() => {
      // Fallback: adicionar IPs comuns de rede local
      const commonIPs = [
        '192.168.0.1', '192.168.1.1', '192.168.2.1',
        '10.0.0.1', '172.16.0.1'
      ];
      commonIPs.forEach(ip => hosts.add(ip));
    });
  }
  
  // Adicionar localhost como fallback
  hosts.add('localhost');
  hosts.add('127.0.0.1');
  
  return Array.from(hosts);
}

/**
 * Detecta IP da rede local usando WebRTC
 */
async function detectNetworkIP(): Promise<string | null> {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    pc.createDataChannel('');
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
        if (ipMatch) {
          const ip = ipMatch[1];
          // Verificar se é IP de rede local
          if (isLocalNetworkIP(ip)) {
            pc.close();
            resolve(ip);
            return;
          }
        }
      }
    };
    
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    
    // Timeout após 3 segundos
    setTimeout(() => {
      pc.close();
      resolve(null);
    }, 3000);
  });
}

/**
 * Verifica se um IP é de rede local
 */
function isLocalNetworkIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  
  if (parts.length !== 4) return false;
  
  // Verificar se é IP privado
  return (
    (parts[0] === 192 && parts[1] === 168) || // 192.168.x.x
    (parts[0] === 10) || // 10.x.x.x
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) // 172.16.x.x - 172.31.x.x
  );
}

/**
 * Detecta portas comuns para API baseado no ambiente
 */
export function getCommonApiPorts(): number[] {
  const ports = new Set<number>();
  
  // Adicionar porta das variáveis de ambiente
  const envPort = process.env.NEXT_PUBLIC_API_PORT;
  if (envPort) {
    ports.add(parseInt(envPort));
  }
  
  // Adicionar portas comuns
  const commonPorts = [1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350];
  commonPorts.forEach(port => ports.add(port));
  
  return Array.from(ports);
}

/**
 * Gera URLs possíveis para a API
 */
export function generatePossibleApiUrls(): string[] {
  const networkInfo = getCurrentNetworkInfo();
  const ports = getCommonApiPorts();
  const urls = new Set<string>();
  
  // Priorizar localhost em desenvolvimento
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // Adicionar localhost primeiro
    ports.forEach(port => {
      urls.add(`http://localhost:${port}/api`);
      urls.add(`http://127.0.0.1:${port}/api`);
    });
  }
  
  // Gerar URLs para todos os hosts e portas possíveis
  networkInfo.possibleHosts.forEach(host => {
    ports.forEach(port => {
      urls.add(`http://${host}:${port}/api`);
    });
  });
  
  return Array.from(urls);
}
