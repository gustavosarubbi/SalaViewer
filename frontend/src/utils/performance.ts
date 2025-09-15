// Sistema de monitoramento de performance hiper minucioso
import { audit } from './audit';

// Tipos de métricas
export enum MetricType {
  LCP = 'LCP',           // Largest Contentful Paint
  FID = 'FID',           // First Input Delay
  CLS = 'CLS',           // Cumulative Layout Shift
  FCP = 'FCP',           // First Contentful Paint
  TTFB = 'TTFB',         // Time to First Byte
  TTI = 'TTI',           // Time to Interactive
  TBT = 'TBT',           // Total Blocking Time
  SI = 'SI',             // Speed Index
  CUSTOM = 'CUSTOM'      // Métricas customizadas
}

// Interface para métricas
interface PerformanceMetric {
  name: string;
  value: number;
  type: MetricType;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  viewport?: {
    width: number;
    height: number;
  };
  metadata?: Record<string, unknown>;
}

// Interface para configuração
interface PerformanceConfig {
  enableRealUserMonitoring: boolean;
  enableSyntheticMonitoring: boolean;
  enableResourceTiming: boolean;
  enableNavigationTiming: boolean;
  enablePaintTiming: boolean;
  enableLayoutShift: boolean;
  enableFirstInput: boolean;
  enableLongTask: boolean;
  enableMemoryInfo: boolean;
  enableConnectionInfo: boolean;
  sampleRate: number;
  batchSize: number;
  flushInterval: number;
  maxMetrics: number;
  enableAudit: boolean;
}

// Configuração padrão
const defaultConfig: PerformanceConfig = {
  enableRealUserMonitoring: true,
  enableSyntheticMonitoring: true,
  enableResourceTiming: true,
  enableNavigationTiming: true,
  enablePaintTiming: true,
  enableLayoutShift: true,
  enableFirstInput: true,
  enableLongTask: true,
  enableMemoryInfo: true,
  enableConnectionInfo: true,
  sampleRate: 1.0,
  batchSize: 50,
  flushInterval: 30000,
  maxMetrics: 1000,
  enableAudit: true
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private flushTimer?: NodeJS.Timeout;
  private isInitialized = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initialize();
  }

  // Inicializar monitoramento
  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Configurar observadores
      this.setupObservers();
      
      // Configurar timer de flush
      this.setupFlushTimer();
      
      // Configurar listeners de página
      this.setupPageListeners();
      
      // Configurar métricas de navegação
      this.setupNavigationMetrics();
      
      // Configurar métricas de paint
      this.setupPaintMetrics();
      
      // Configurar métricas de layout shift
      this.setupLayoutShiftMetrics();
      
      // Configurar métricas de first input
      this.setupFirstInputMetrics();
      
      // Configurar métricas de long task
      this.setupLongTaskMetrics();
      
      // Configurar métricas de recursos
      this.setupResourceMetrics();
      
      // Configurar métricas customizadas
      this.setupCustomMetrics();
      
      this.isInitialized = true;
      
      if (this.config.enableAudit) {
        audit.securityViolation('Performance monitor initialized', {
          config: this.config
        });
      }
    } catch (error) {
      console.error('Failed to initialize performance monitor:', error);
    }
  }

  // Configurar observadores
  private setupObservers() {
    // Observer para layout shift
    if (this.config.enableLayoutShift) {
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
            if (!entry.hadRecentInput && entry.value !== undefined) {
              this.recordMetric({
                name: 'layout-shift',
                value: entry.value,
                type: MetricType.CLS,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                metadata: {
                  entryType: entry.entryType
                }
              });
            }
          });
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (error) {
        console.warn('Layout shift observer not supported:', error);
      }
    }

    // Observer para first input
    if (this.config.enableFirstInput) {
      try {
        const firstInputObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: PerformanceEntry & { processingStart?: number; startTime?: number }) => {
            if (entry.processingStart !== undefined && entry.startTime !== undefined) {
              this.recordMetric({
                name: 'first-input',
                value: entry.processingStart - entry.startTime,
                type: MetricType.FID,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                metadata: {
                  entryType: entry.entryType,
                  processingStart: entry.processingStart,
                  startTime: entry.startTime
                }
              });
            }
          });
        });
        firstInputObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(firstInputObserver);
      } catch (error) {
        console.warn('First input observer not supported:', error);
      }
    }
  }

  // Configurar timer de flush
  private setupFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flushMetrics();
    }, this.config.flushInterval);
  }

  // Configurar listeners de página
  private setupPageListeners() {
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.flushMetrics();
    });

    // Visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushMetrics();
      }
    });
  }

  // Configurar métricas de navegação
  private setupNavigationMetrics() {
    if (!this.config.enableNavigationTiming) return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        // TTFB
        this.recordMetric({
          name: 'ttfb',
          value: navigation.responseStart - navigation.requestStart,
          type: MetricType.TTFB,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            requestStart: navigation.requestStart,
            responseStart: navigation.responseStart
          }
        });

        // TTI (aproximação)
        this.recordMetric({
          name: 'tti',
          value: navigation.loadEventEnd - navigation.fetchStart,
          type: MetricType.TTI,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            fetchStart: navigation.fetchStart,
            loadEventEnd: navigation.loadEventEnd
          }
        });
      }
    });
  }

  // Configurar métricas de paint
  private setupPaintMetrics() {
    if (!this.config.enablePaintTiming) return;

    window.addEventListener('load', () => {
      const paintEntries = performance.getEntriesByType('paint');
      
      paintEntries.forEach((entry) => {
        this.recordMetric({
          name: entry.name,
          value: entry.startTime,
          type: entry.name === 'first-contentful-paint' ? MetricType.FCP : MetricType.CUSTOM,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            entryType: entry.entryType,
            startTime: entry.startTime
          }
        });
      });
    });
  }

  // Configurar métricas de layout shift
  private setupLayoutShiftMetrics() {
    if (!this.config.enableLayoutShift) return;

    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
        if (!entry.hadRecentInput && entry.value !== undefined) {
          this.recordMetric({
            name: 'layout-shift-cumulative',
            value: entry.value,
            type: MetricType.CLS,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metadata: {
              entryType: entry.entryType
            }
          });
        }
      });
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }
  }

  // Configurar métricas de first input
  private setupFirstInputMetrics() {
    if (!this.config.enableFirstInput) return;

    const firstInputObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceEntry & { processingStart?: number; startTime?: number }) => {
        if (entry.processingStart !== undefined && entry.startTime !== undefined) {
          this.recordMetric({
            name: 'first-input-delay',
            value: entry.processingStart - entry.startTime,
            type: MetricType.FID,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metadata: {
              entryType: entry.entryType,
              processingStart: entry.processingStart,
              startTime: entry.startTime
            }
          });
        }
      });
    });

    try {
      firstInputObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(firstInputObserver);
    } catch (error) {
      console.warn('First input observer not supported:', error);
    }
  }

  // Configurar métricas de long task
  private setupLongTaskMetrics() {
    if (!this.config.enableLongTask) return;

    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric({
          name: 'long-task',
          value: entry.duration,
          type: MetricType.TBT,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            entryType: entry.entryType,
            startTime: entry.startTime,
            duration: entry.duration
          }
        });
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }
  }

  // Configurar métricas de recursos
  private setupResourceMetrics() {
    if (!this.config.enableResourceTiming) return;

    window.addEventListener('load', () => {
      const resourceEntries = performance.getEntriesByType('resource');
      
      resourceEntries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        this.recordMetric({
          name: `resource-${resourceEntry.name.split('/').pop()}`,
          value: resourceEntry.duration,
          type: MetricType.CUSTOM,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            entryType: resourceEntry.entryType,
            initiatorType: resourceEntry.initiatorType,
            transferSize: resourceEntry.transferSize,
            encodedBodySize: resourceEntry.encodedBodySize,
            decodedBodySize: resourceEntry.decodedBodySize
          }
        });
      });
    });
  }

  // Configurar métricas customizadas
  private setupCustomMetrics() {
    // Métricas de memória
    if (this.config.enableMemoryInfo && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memory) {
        this.recordMetric({
          name: 'memory-used',
          value: memory.usedJSHeapSize,
          type: MetricType.CUSTOM,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
          }
        });
      }
    }

    // Métricas de conexão
    if (this.config.enableConnectionInfo && 'connection' in navigator) {
      const connection = (navigator as { connection?: { effectiveType: string; downlink: number; rtt: number; saveData?: boolean } }).connection;
      if (connection) {
        this.recordMetric({
          name: 'connection-type',
          value: connection.effectiveType === '4g' ? 4 : connection.effectiveType === '3g' ? 3 : 2,
          type: MetricType.CUSTOM,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          metadata: {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
          }
        });
      }
    }
  }

  // Registrar métrica
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Limitar número de métricas
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics.shift();
    }
    
    // Flush se atingir batch size
    if (this.metrics.length >= this.config.batchSize) {
      this.flushMetrics();
    }
  }

  // Registrar métrica customizada
  recordCustomMetric(name: string, value: number, metadata?: Record<string, unknown>) {
    this.recordMetric({
      name,
      value,
      type: MetricType.CUSTOM,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata
    });
  }

  // Flush métricas
  private flushMetrics() {
    if (this.metrics.length === 0) return;

    const metricsToFlush = [...this.metrics];
    this.metrics = [];

    if (this.config.enableAudit) {
      audit.securityViolation('Performance metrics flushed', {
        count: metricsToFlush.length,
        metrics: metricsToFlush.map(m => ({ name: m.name, value: m.value, type: m.type }))
      });
    }

    // Aqui você pode enviar as métricas para um serviço de monitoramento
    console.log('Performance metrics:', metricsToFlush);
  }

  // Obter estatísticas de performance
  getPerformanceStats() {
    const stats: Record<string, unknown> = {};
    
    // Agrupar por tipo
    const byType = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.type]) {
        acc[metric.type] = [];
      }
      acc[metric.type].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    // Calcular estatísticas para cada tipo
    Object.entries(byType).forEach(([type, values]) => {
      const sorted = values.sort((a, b) => a - b);
      const count = sorted.length;
      const sum = sorted.reduce((a, b) => a + b, 0);
      
      stats[type] = {
        count,
        min: sorted[0],
        max: sorted[count - 1],
        avg: sum / count,
        p50: sorted[Math.floor(count * 0.5)],
        p75: sorted[Math.floor(count * 0.75)],
        p90: sorted[Math.floor(count * 0.9)],
        p95: sorted[Math.floor(count * 0.95)],
        p99: sorted[Math.floor(count * 0.99)]
      };
    });

    return stats;
  }

  // Verificar se métrica é boa
  isMetricGood(type: MetricType, value: number): boolean {
    const thresholds: Record<string, number> = {
      [MetricType.LCP]: 2500,    // < 2.5s
      [MetricType.FID]: 100,     // < 100ms
      [MetricType.CLS]: 0.1,     // < 0.1
      [MetricType.FCP]: 1800,    // < 1.8s
      [MetricType.TTFB]: 800,    // < 800ms
      [MetricType.TTI]: 3800,    // < 3.8s
      [MetricType.TBT]: 200,     // < 200ms
      [MetricType.SI]: 3400      // < 3.4s
    };

    const threshold = thresholds[type];
    return threshold ? value <= threshold : true;
  }

  // Obter score de performance
  getPerformanceScore(): number {
    const stats = this.getPerformanceStats();
    let score = 100;

    // Penalizar por métricas ruins
    Object.entries(stats).forEach(([type, stat]) => {
      if (stat && typeof stat === 'object' && 'avg' in stat && typeof stat.avg === 'number') {
        if (!this.isMetricGood(type as MetricType, stat.avg)) {
          score -= 10;
        }
      }
    });

    return Math.max(0, score);
  }

  // Destruir monitor
  destroy() {
    // Limpar observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Limpar timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Flush métricas restantes
    this.flushMetrics();

    this.isInitialized = false;
  }
}

// Instância global do monitor
export const performanceMonitor = new PerformanceMonitor();

// Funções de conveniência
export const recordCustomMetric = (name: string, value: number, metadata?: Record<string, unknown>) => 
  performanceMonitor.recordCustomMetric(name, value, metadata);

export const getPerformanceStats = () => 
  performanceMonitor.getPerformanceStats();

export const getPerformanceScore = () => 
  performanceMonitor.getPerformanceScore();

export const isMetricGood = (type: MetricType, value: number) =>
  performanceMonitor.isMetricGood(type, value);
