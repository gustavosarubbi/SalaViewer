'use client';

import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useDynamicApi } from '@/hooks/useDynamicApi';

export default function ApiStatusIndicator() {
  const { isConnected, apiUrl, isLoading, error, lastChecked, refreshConnection } = useDynamicApi();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (isLoading) {
      return 'Conectando...';
    }
    if (isConnected) {
      return 'Conectado';
    }
    return 'Desconectado';
  };


  return (
    <div className="relative">
      <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-2">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium text-white ${isLoading ? 'opacity-70' : ''}`}>
            {getStatusText()}
          </span>
          
          <button
            onClick={refreshConnection}
            disabled={isLoading}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
            title="Recarregar conexão"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
            title={isExpanded ? 'Ocultar detalhes' : 'Mostrar detalhes'}
          >
            <Wifi className="h-4 w-4" />
          </button>
        </div>

        {isExpanded && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-white/20 p-4 z-50">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">API URL:</span>
                <div className="flex items-center gap-1">
                  <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 text-xs">
                    {apiUrl}
                  </code>
                  <a
                    href={apiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="Abrir API em nova aba"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              
              {lastChecked && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Última verificação:</span>
                  <span className="text-gray-500">
                    {lastChecked.toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              )}
              
              {error && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-red-600 text-xs">
                    {error}
                  </span>
                </div>
              )}
              
              {isConnected && (
                <div className="text-green-600 text-xs font-medium">
                  ✅ Conexão dinâmica funcionando
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
