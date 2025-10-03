'use client';

import { useState, useEffect } from 'react';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { Activity, Clock, Cpu, Wifi, Trash2, RefreshCw } from 'lucide-react';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

export function PerformanceMonitor({ 
  show = false, 
  position = 'top-right',
  compact = false 
}: PerformanceMonitorProps) {
  const { isSupported, getStats, clearMetrics } = usePerformanceMetrics();
  const [isVisible, setIsVisible] = useState(show);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const stats = getStats();

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Força re-render para atualizar métricas
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (!isSupported || !isVisible) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (compact) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-green-400" />
            <span>Perf: {stats.timing.average.toFixed(1)}ms</span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white text-xs font-mono max-w-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center">
            <Activity className="w-4 h-4 mr-2 text-green-400" />
            Performance Monitor
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1 rounded ${autoRefresh ? 'bg-green-600' : 'bg-gray-600'}`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={clearMetrics}
              className="p-1 rounded bg-red-600 hover:bg-red-700"
              title="Clear metrics"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded bg-gray-600 hover:bg-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {/* Timing Metrics */}
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Timing: {stats.timing.count} samples</span>
          </div>
          
          {stats.timing.count > 0 && (
            <div className="ml-5 space-y-1">
              <div>Avg: {stats.timing.average.toFixed(2)}ms</div>
              <div>Min: {stats.timing.min.toFixed(2)}ms</div>
              <div>Max: {stats.timing.max.toFixed(2)}ms</div>
            </div>
          )}

          {/* Memory Metrics */}
          <div className="flex items-center space-x-2">
            <Cpu className="w-3 h-3 text-yellow-400" />
            <span>Memory: {stats.gauge.latest > 0 ? `${(stats.gauge.latest / 1024 / 1024).toFixed(1)}MB` : 'N/A'}</span>
          </div>

          {/* Network Metrics */}
          <div className="flex items-center space-x-2">
            <Wifi className="w-3 h-3 text-purple-400" />
            <span>Network: {(navigator as Navigator & { connection?: { effectiveType: string } }).connection?.effectiveType || 'N/A'}</span>
          </div>

          {/* Total Metrics */}
          <div className="pt-2 border-t border-gray-600">
            <div className="text-gray-400">
              Total: {stats.total} metrics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para usar o monitor de performance
export function usePerformanceMonitor(show = false) {
  const [isVisible, setIsVisible] = useState(show);

  return {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible(!isVisible)
  };
}
