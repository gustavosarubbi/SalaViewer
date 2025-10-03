// Sistema de monitoramento e analytics para SalaViewer

interface MonitoringEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
}

class MonitoringService {
  private events: MonitoringEvent[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private sessionId: string;
  private maxEvents = 1000;
  private maxMetrics = 500;
  private isEnabled = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.setupUserInteractionTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorHandling() {
    if (typeof window === 'undefined') return;

    // Capturar erros JavaScript
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Capturar promises rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_promise_rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  private setupPerformanceMonitoring() {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    // Monitorar Core Web Vitals
    this.observeWebVitals();
    
    // Monitorar métricas de memória
    this.observeMemoryUsage();
    
    // Monitorar métricas de rede
    this.observeNetworkMetrics();
  }

  private observeWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.addPerformanceMetric('LCP', lastEntry.startTime, 'timing');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring not supported:', e);
    }

    try {
      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart: number };
          this.addPerformanceMetric('FID', fidEntry.processingStart - entry.startTime, 'timing');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported:', e);
    }

    try {
      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        });
        this.addPerformanceMetric('CLS', clsValue, 'gauge');
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported:', e);
    }
  }

  private observeMemoryUsage() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      this.addPerformanceMetric('usedJSHeapSize', memory.usedJSHeapSize, 'gauge');
      this.addPerformanceMetric('totalJSHeapSize', memory.totalJSHeapSize, 'gauge');
      this.addPerformanceMetric('jsHeapSizeLimit', memory.jsHeapSizeLimit, 'gauge');
    };

    // Verificar memória a cada 30 segundos
    setInterval(checkMemory, 30000);
    checkMemory(); // Verificação inicial
  }

  private observeNetworkMetrics() {
    if (!('connection' in navigator)) return;

        const connection = (navigator as Navigator & { connection: { effectiveType: string; downlink: number; rtt: number } }).connection;
    this.addPerformanceMetric('effectiveType', connection.effectiveType === '4g' ? 4 : 3, 'gauge');
    this.addPerformanceMetric('downlink', connection.downlink, 'gauge');
    this.addPerformanceMetric('rtt', connection.rtt, 'timing');
  }

  private setupUserInteractionTracking() {
    if (typeof window === 'undefined') return;

    // Rastrear cliques
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.trackEvent('click', {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.substring(0, 100)
      });
    });

    // Rastrear mudanças de página
    window.addEventListener('beforeunload', () => {
      this.trackEvent('page_unload', {
        timeOnPage: Date.now() - this.getSessionStartTime()
      });
    });

    // Rastrear visibilidade da página
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      });
    });
  }

  private getSessionStartTime(): number {
    return parseInt(this.sessionId.split('_')[1]);
  }

  // Rastrear eventos customizados
  trackEvent(type: string, data: Record<string, unknown> = {}, userId?: string) {
    if (!this.isEnabled) return;

    const event: MonitoringEvent = {
      type,
      data,
      timestamp: Date.now(),
      userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.events.push(event);

    // Manter apenas os últimos eventos
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Em desenvolvimento, log no console
    if (process.env.NODE_ENV === 'development') {
      console.log('[MONITORING]', event);
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(event);
    }
  }

  // Adicionar métrica de performance
  addPerformanceMetric(name: string, value: number, type: PerformanceMetric['type'] = 'timing') {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type
    };

    this.performanceMetrics.push(metric);

    // Manter apenas as últimas métricas
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }
  }

  // Medir tempo de execução
  measureTime(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();
    this.addPerformanceMetric(name, end - start, 'timing');
  }

  // Medir tempo de execução assíncrono
  async measureAsyncTime(name: string, fn: () => Promise<unknown>) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    this.addPerformanceMetric(name, end - start, 'timing');
    return result;
  }

  // Obter estatísticas
  getStats() {
    const timingMetrics = this.performanceMetrics.filter(m => m.type === 'timing');
    const gaugeMetrics = this.performanceMetrics.filter(m => m.type === 'gauge');
    
    return {
      sessionId: this.sessionId,
      events: this.events.length,
      performanceMetrics: this.performanceMetrics.length,
      timing: {
        count: timingMetrics.length,
        average: timingMetrics.length > 0 
          ? timingMetrics.reduce((sum, m) => sum + m.value, 0) / timingMetrics.length 
          : 0,
        min: timingMetrics.length > 0 ? Math.min(...timingMetrics.map(m => m.value)) : 0,
        max: timingMetrics.length > 0 ? Math.max(...timingMetrics.map(m => m.value)) : 0
      },
      gauge: {
        count: gaugeMetrics.length,
        latest: gaugeMetrics.length > 0 ? gaugeMetrics[gaugeMetrics.length - 1].value : 0
      }
    };
  }

  // Obter eventos por tipo
  getEventsByType(type: string) {
    return this.events.filter(event => event.type === type);
  }

  // Obter métricas por nome
  getMetricsByName(name: string) {
    return this.performanceMetrics.filter(metric => metric.name === name);
  }

  // Enviar para serviço de monitoramento (desabilitado - rota não existe no backend)
  private async sendToMonitoringService(event: MonitoringEvent) {
    // Desabilitado temporariamente - rota /api/monitoring não existe no backend
    // TODO: Implementar rota de monitoramento no backend se necessário
    console.log('Monitoring data (not sent):', event);
  }

  // Habilitar/desabilitar monitoramento
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Limpar dados
  clear() {
    this.events = [];
    this.performanceMetrics = [];
  }

  // Exportar dados para debug
  exportData() {
    return {
      events: this.events,
      performanceMetrics: this.performanceMetrics,
      stats: this.getStats()
    };
  }
}

// Instância singleton
export const monitoring = new MonitoringService();

// Funções de conveniência
export const trackEvent = (type: string, data?: Record<string, unknown>, userId?: string) => 
  monitoring.trackEvent(type, data, userId);

export const trackPerformance = (name: string, value: number, type?: PerformanceMetric['type']) => 
  monitoring.addPerformanceMetric(name, value, type);

export const measureTime = (name: string, fn: () => void) => 
  monitoring.measureTime(name, fn);

export const measureAsyncTime = (name: string, fn: () => Promise<unknown>) => 
  monitoring.measureAsyncTime(name, fn);

export const getMonitoringStats = () => 
  monitoring.getStats();

export const exportMonitoringData = () => 
  monitoring.exportData();
