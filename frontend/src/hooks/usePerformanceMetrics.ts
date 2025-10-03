'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
}

interface PerformanceConfig {
  enableWebVitals: boolean;
  enableCustomMetrics: boolean;
  enableMemoryMetrics: boolean;
  enableNetworkMetrics: boolean;
  sampleRate: number;
  maxMetrics: number;
}

const defaultConfig: PerformanceConfig = {
  enableWebVitals: true,
  enableCustomMetrics: true,
  enableMemoryMetrics: true,
  enableNetworkMetrics: true,
  sampleRate: 1.0,
  maxMetrics: 100
};

export function usePerformanceMetrics(config: Partial<PerformanceConfig> = {}) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const configRef = useRef({ ...defaultConfig, ...config });

  // Verificar suporte do navegador
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
      'performance' in window &&
      'PerformanceObserver' in window
    );
  }, []);

  // Coletar Web Vitals
  useEffect(() => {
    if (!isSupported || !configRef.current.enableWebVitals) return;

    const collectWebVitals = () => {
      // LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              addMetric('LCP', lastEntry.startTime, 'timing');
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP not supported:', e);
        }

        // FID (First Input Delay)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              addMetric('FID', (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime, 'timing');
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID not supported:', e);
        }

        // CLS (Cumulative Layout Shift)
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
              if (!layoutShiftEntry.hadRecentInput) {
                clsValue += layoutShiftEntry.value;
              }
            });
            addMetric('CLS', clsValue, 'gauge');
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS not supported:', e);
        }
      }
    };

    collectWebVitals();
  }, [isSupported]);

  // Coletar métricas de memória
  useEffect(() => {
    if (!isSupported || !configRef.current.enableMemoryMetrics) return;

    const collectMemoryMetrics = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        addMetric('usedJSHeapSize', memory.usedJSHeapSize, 'gauge');
        addMetric('totalJSHeapSize', memory.totalJSHeapSize, 'gauge');
        addMetric('jsHeapSizeLimit', memory.jsHeapSizeLimit, 'gauge');
      }
    };

    const interval = setInterval(collectMemoryMetrics, 5000);
    return () => clearInterval(interval);
  }, [isSupported]);

  // Coletar métricas de rede
  useEffect(() => {
    if (!isSupported || !configRef.current.enableNetworkMetrics) return;

    const collectNetworkMetrics = () => {
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection: { effectiveType: string; downlink: number; rtt: number } }).connection;
        addMetric('effectiveType', connection.effectiveType === '4g' ? 4 : 3, 'gauge');
        addMetric('downlink', connection.downlink, 'gauge');
        addMetric('rtt', connection.rtt, 'timing');
      }
    };

    collectNetworkMetrics();
  }, [isSupported]);

  // Adicionar métrica customizada
  const addMetric = (name: string, value: number, type: PerformanceMetric['type'] = 'timing') => {
    if (Math.random() > configRef.current.sampleRate) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type
    };

    setMetrics(prev => {
      const newMetrics = [...prev, metric];
      return newMetrics.slice(-configRef.current.maxMetrics);
    });
  };

  // Medir tempo de execução
  const measureTime = (name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    addMetric(name, end - start, 'timing');
  };

  // Medir tempo de execução assíncrono
  const measureAsyncTime = async (name: string, fn: () => Promise<unknown>) => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    addMetric(name, end - start, 'timing');
    return result;
  };

  // Obter métricas por tipo
  const getMetricsByType = (type: PerformanceMetric['type']) => {
    return metrics.filter(metric => metric.type === type);
  };

  // Obter métricas por nome
  const getMetricsByName = (name: string) => {
    return metrics.filter(metric => metric.name === name);
  };

  // Obter estatísticas
  const getStats = () => {
    const timingMetrics = getMetricsByType('timing');
    const gaugeMetrics = getMetricsByType('gauge');
    
    return {
      total: metrics.length,
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
  };

  // Limpar métricas
  const clearMetrics = () => {
    setMetrics([]);
  };

  return {
    metrics,
    isSupported,
    addMetric,
    measureTime,
    measureAsyncTime,
    getMetricsByType,
    getMetricsByName,
    getStats,
    clearMetrics
  };
}
