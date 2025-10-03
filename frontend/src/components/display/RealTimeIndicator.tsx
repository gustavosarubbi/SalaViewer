'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected: boolean;
  lastUpdate: Date | null;
  className?: string;
}

export function RealTimeIndicator({ 
  isConnected, 
  lastUpdate, 
  className = '' 
}: RealTimeIndicatorProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (lastUpdate) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return `${seconds}s atrás`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m atrás`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h atrás`;
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <div className="flex items-center space-x-1">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Conectado</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <WifiOff className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">Desconectado</span>
          </div>
        )}
      </div>
      
      {lastUpdate && (
        <div className="flex items-center space-x-2">
          {isUpdating ? (
            <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
          ) : (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          )}
          <span className="text-xs text-white/60">
            {formatLastUpdate(lastUpdate)}
          </span>
        </div>
      )}
    </div>
  );
}
