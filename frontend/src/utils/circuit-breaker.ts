// Sistema de Circuit Breaker e Retry para tratamento robusto de falhas
import { audit } from './audit';

// Estados do Circuit Breaker
export enum CircuitState {
  CLOSED = 'CLOSED',     // Funcionando normalmente
  OPEN = 'OPEN',         // Circuito aberto, falhas frequentes
  HALF_OPEN = 'HALF_OPEN' // Testando se o serviço recuperou
}

// Configuração do Circuit Breaker
export interface CircuitBreakerConfig {
  failureThreshold: number;        // Número de falhas para abrir o circuito
  successThreshold: number;        // Número de sucessos para fechar o circuito
  timeout: number;                 // Tempo para tentar novamente (ms)
  resetTimeout: number;            // Tempo para resetar o circuito (ms)
  monitoringPeriod: number;        // Período de monitoramento (ms)
  enableAudit: boolean;            // Habilitar auditoria
}

// Configuração padrão
const defaultConfig: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 3,
  timeout: 5000,
  resetTimeout: 30000,
  monitoringPeriod: 60000,
  enableAudit: true
};

// Interface para métricas do Circuit Breaker
interface CircuitMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  stateChanges: number;
  circuitOpens: number;
  circuitCloses: number;
}

// Classe Circuit Breaker
export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private state: CircuitState = CircuitState.CLOSED;
  private metrics: CircuitMetrics;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: number;
  private nextAttemptTime?: number;
  private monitoringTimer?: NodeJS.Timeout;

  constructor(
    private name: string,
    config: Partial<CircuitBreakerConfig> = {}
  ) {
    this.config = { ...defaultConfig, ...config };
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      stateChanges: 0,
      circuitOpens: 0,
      circuitCloses: 0
    };
    
    this.startMonitoring();
  }

  // Iniciar monitoramento
  private startMonitoring() {
    this.monitoringTimer = setInterval(() => {
      this.monitor();
    }, this.config.monitoringPeriod);
  }

  // Monitorar estado do circuito
  private monitor() {
    const now = Date.now();
    
    // Resetar contadores se passou muito tempo
    if (this.lastFailureTime && (now - this.lastFailureTime) > this.config.monitoringPeriod) {
      this.failureCount = 0;
      this.successCount = 0;
    }
    
    // Verificar se deve tentar fechar o circuito
    if (this.state === CircuitState.OPEN && this.nextAttemptTime && now >= this.nextAttemptTime) {
      this.setState(CircuitState.HALF_OPEN);
    }
  }

  // Alterar estado do circuito
  private setState(newState: CircuitState) {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      this.metrics.stateChanges++;
      
      if (newState === CircuitState.OPEN) {
        this.metrics.circuitOpens++;
        this.nextAttemptTime = Date.now() + this.config.resetTimeout;
        
        if (this.config.enableAudit) {
          audit.securityViolation(`Circuit Breaker opened: ${this.name}`, {
            oldState,
            newState,
            failureCount: this.failureCount,
            metrics: this.metrics
          });
        }
      } else if (newState === CircuitState.CLOSED) {
        this.metrics.circuitCloses++;
        this.failureCount = 0;
        this.successCount = 0;
        
        if (this.config.enableAudit) {
          audit.securityViolation(`Circuit Breaker closed: ${this.name}`, {
            oldState,
            newState,
            metrics: this.metrics
          });
        }
      }
      
      console.log(`[CIRCUIT BREAKER] ${this.name}: ${oldState} -> ${newState}`);
    }
  }

  // Executar função com proteção do Circuit Breaker
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.metrics.totalRequests++;
    
    // Verificar se o circuito está aberto
    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      if (!this.nextAttemptTime || now < this.nextAttemptTime) {
        throw new Error(`Circuit breaker is OPEN for ${this.name}. Next attempt at ${new Date(this.nextAttemptTime || 0).toISOString()}`);
      }
    }
    
    try {
      // Executar função com timeout
      const result = await this.executeWithTimeout(fn);
      
      // Sucesso
      this.onSuccess();
      return result;
      
    } catch (error) {
      // Falha
      this.onFailure();
      throw error;
    }
  }

  // Executar função com timeout
  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Circuit breaker timeout for ${this.name}`));
      }, this.config.timeout);
      
      fn()
        .then(result => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  // Tratar sucesso
  private onSuccess() {
    this.metrics.successfulRequests++;
    this.metrics.lastSuccessTime = Date.now();
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      
      if (this.successCount >= this.config.successThreshold) {
        this.setState(CircuitState.CLOSED);
      }
    } else if (this.state === CircuitState.CLOSED) {
      // Resetar contador de falhas em caso de sucesso
      this.failureCount = 0;
    }
  }

  // Tratar falha
  private onFailure() {
    this.metrics.failedRequests++;
    this.lastFailureTime = Date.now();
    this.failureCount++;
    
    if (this.state === CircuitState.CLOSED) {
      if (this.failureCount >= this.config.failureThreshold) {
        this.setState(CircuitState.OPEN);
      }
    } else if (this.state === CircuitState.HALF_OPEN) {
      // Se falhou no estado HALF_OPEN, voltar para OPEN
      this.setState(CircuitState.OPEN);
    }
  }

  // Obter estado atual
  getState(): CircuitState {
    return this.state;
  }

  // Obter métricas
  getMetrics(): CircuitMetrics {
    return { ...this.metrics };
  }

  // Obter taxa de sucesso
  getSuccessRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.successfulRequests / this.metrics.totalRequests;
  }

  // Obter taxa de falha
  getFailureRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.failedRequests / this.metrics.totalRequests;
  }

  // Resetar circuito
  reset() {
    this.setState(CircuitState.CLOSED);
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttemptTime = undefined;
    this.lastFailureTime = undefined;
    this.metrics.lastSuccessTime = undefined;
  }

  // Destruir circuito
  destroy() {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
    }
  }
}

// Gerenciador de Circuit Breakers
export class CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map();

  // Obter ou criar Circuit Breaker
  getBreaker(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, config));
    }
    return this.breakers.get(name)!;
  }

  // Executar função com Circuit Breaker
  async execute<T>(
    name: string,
    fn: () => Promise<T>,
    config?: Partial<CircuitBreakerConfig>
  ): Promise<T> {
    const breaker = this.getBreaker(name, config);
    return breaker.execute(fn);
  }

  // Obter todos os Circuit Breakers
  getAllBreakers(): Map<string, CircuitBreaker> {
    return new Map(this.breakers);
  }

  // Obter estatísticas de todos os Circuit Breakers
  getAllStats() {
    const stats: Record<string, unknown> = {};
    
    for (const [name, breaker] of this.breakers) {
      stats[name] = {
        state: breaker.getState(),
        metrics: breaker.getMetrics(),
        successRate: breaker.getSuccessRate(),
        failureRate: breaker.getFailureRate()
      };
    }
    
    return stats;
  }

  // Resetar todos os Circuit Breakers
  resetAll() {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  // Destruir todos os Circuit Breakers
  destroyAll() {
    for (const breaker of this.breakers.values()) {
      breaker.destroy();
    }
    this.breakers.clear();
  }
}

// Instância global do gerenciador
export const circuitBreakerManager = new CircuitBreakerManager();

// Funções de conveniência
export const withCircuitBreaker = <T>(
  name: string,
  fn: () => Promise<T>,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> => {
  return circuitBreakerManager.execute(name, fn, config);
};

// Circuit Breakers específicos para diferentes serviços
export const apiCircuitBreaker = circuitBreakerManager.getBreaker('api', {
  failureThreshold: 3,
  successThreshold: 2,
  timeout: 10000,
  resetTimeout: 30000
});

export const authCircuitBreaker = circuitBreakerManager.getBreaker('auth', {
  failureThreshold: 2,
  successThreshold: 1,
  timeout: 5000,
  resetTimeout: 60000
});

export const dataCircuitBreaker = circuitBreakerManager.getBreaker('data', {
  failureThreshold: 5,
  successThreshold: 3,
  timeout: 15000,
  resetTimeout: 45000
});

// Hook para React
export function useCircuitBreaker(name: string, config?: Partial<CircuitBreakerConfig>) {
  const breaker = circuitBreakerManager.getBreaker(name, config);
  
  return {
    execute: <T>(fn: () => Promise<T>) => breaker.execute(fn),
    getState: () => breaker.getState(),
    getMetrics: () => breaker.getMetrics(),
    getSuccessRate: () => breaker.getSuccessRate(),
    getFailureRate: () => breaker.getFailureRate(),
    reset: () => breaker.reset()
  };
}
