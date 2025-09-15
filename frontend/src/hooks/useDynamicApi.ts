'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { getCurrentNetworkInfo } from '@/utils/network-detector';

interface ApiStatus {
  isConnected: boolean;
  apiUrl: string;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export function useDynamicApi() {
  // Detectar informações da rede dinamicamente
  const networkInfo = getCurrentNetworkInfo();
  const defaultApiUrl = `http://${networkInfo.hostname}:1337/api`;
  
  const [status, setStatus] = useState<ApiStatus>({
    isConnected: false,
    apiUrl: defaultApiUrl,
    isLoading: true,
    error: null,
    lastChecked: null
  });

  const checkConnection = useCallback(async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Recarregar conexão com a API
      await apiService.refreshApiConnection();
      
      // Testar conexão fazendo uma requisição simples
      await apiService.getAndares();
      
      const currentUrl = apiService.getCurrentApiUrl();
      
      setStatus({
        isConnected: true,
        apiUrl: currentUrl,
        isLoading: false,
        error: null,
        lastChecked: new Date()
      });
      
      console.log('✅ Conexão com API estabelecida:', currentUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setStatus({
        isConnected: false,
        apiUrl: status.apiUrl,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date()
      });
      
      console.error('❌ Erro ao conectar com API:', errorMessage);
    }
  }, [status.apiUrl]);

  const refreshConnection = useCallback(async () => {
    await checkConnection();
  }, [checkConnection]);

  // Verificar conexão automaticamente ao montar o componente
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Verificar conexão periodicamente (a cada 30 segundos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!status.isLoading) {
        checkConnection();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [checkConnection, status.isLoading]);

  return {
    ...status,
    refreshConnection,
    checkConnection
  };
}
