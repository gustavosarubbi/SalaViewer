'use client';

import { useState, useEffect } from 'react';
import { Activity, Clock, Cpu, Wifi, Download, AlertTriangle, RefreshCw, Trash2, Eye, EyeOff } from 'lucide-react';
import { monitoring, getMonitoringStats, exportMonitoringData } from '@/utils/monitoring';

interface MonitoringDashboardProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  compact?: boolean;
}

export function MonitoringDashboard({ 
  show = false, 
  position = 'top-right',
  compact = false 
}: MonitoringDashboardProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [stats, setStats] = useState(getMonitoringStats());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setStats(getMonitoringStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const handleExport = () => {
    const data = exportMonitoringData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    monitoring.clear();
    setStats(getMonitoringStats());
  };

  const toggleEnabled = () => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    monitoring.setEnabled(newEnabled);
  };

  // Evitar erros de hidratação: não renderizar até hidratar no cliente
  if (!isVisible || !isHydrated) return null;

  if (compact) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-green-400" />
            <span>Events: {stats.events}</span>
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
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 text-white text-xs font-mono max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center">
            <Activity className="w-4 h-4 mr-2 text-green-400" />
            Monitoring Dashboard
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={toggleEnabled}
              className={`p-1 rounded ${isEnabled ? 'bg-green-600' : 'bg-red-600'}`}
              title={isEnabled ? 'Monitoring ON' : 'Monitoring OFF'}
            >
              {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1 rounded ${autoRefresh ? 'bg-green-600' : 'bg-gray-600'}`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={handleExport}
              className="p-1 rounded bg-blue-600 hover:bg-blue-700"
              title="Export data"
            >
              <Download className="w-3 h-3" />
            </button>
            <button
              onClick={handleClear}
              className="p-1 rounded bg-red-600 hover:bg-red-700"
              title="Clear data"
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

        <div className="space-y-3">
          {/* Session Info */}
          <div className="bg-gray-800/50 rounded p-2">
            <div className="text-gray-400 text-xs mb-1">Session</div>
            <div className="text-xs">{isHydrated ? stats.sessionId : 'Loading...'}</div>
          </div>

          {/* Events */}
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
            <span>Events: {stats.events}</span>
          </div>

          {/* Performance Metrics */}
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Performance: {stats.performanceMetrics} metrics</span>
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

          {/* Status */}
          <div className="pt-2 border-t border-gray-600">
            <div className="flex items-center justify-between text-gray-400">
              <span>Status: {isEnabled ? 'Active' : 'Disabled'}</span>
              <span>Refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para usar o dashboard de monitoramento
export function useMonitoringDashboard(show = false) {
  const [isVisible, setIsVisible] = useState(show);

  return {
    isVisible,
    show: () => setIsVisible(true),
    hide: () => setIsVisible(false),
    toggle: () => setIsVisible(!isVisible)
  };
}
