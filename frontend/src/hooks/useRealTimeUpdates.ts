import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

interface Andar {
  id: number;
  numero_andar: number;
  nome_identificador?: string;
}

interface RealTimeConfig {
  totalScreens: number;
  carouselSpeed: number;
  andares: Andar[];
}

export function useRealTimeUpdates() {
  const [config, setConfig] = useState<RealTimeConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Função para buscar configuração atual
  const fetchConfig = useCallback(async () => {
    try {
      const [andaresData] = await Promise.all([
        apiService.getAndares()
      ]);
      
      const andaresOrdenados = andaresData.sort((a, b) => a.numero_andar - b.numero_andar);
      
      // Carregar configurações salvas do localStorage
      const savedScreens = localStorage.getItem('carousel-screen-count');
      const savedSpeed = localStorage.getItem('carousel-speed');
      
      setConfig({
        totalScreens: savedScreens ? parseInt(savedScreens) : 2,
        carouselSpeed: savedSpeed ? parseFloat(savedSpeed) : 2,
        andares: andaresOrdenados
      });
      
      setLastUpdate(new Date());
      setIsConnected(true); // Marcar como conectado quando dados são carregados com sucesso
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      setIsConnected(false); // Marcar como desconectado em caso de erro
    }
  }, []);

  // Função para atualizar configuração
  const updateConfig = useCallback((newConfig: Partial<RealTimeConfig>) => {
    setConfig(prev => {
      const newState = prev ? { ...prev, ...newConfig } : null;
      return newState;
    });
    setLastUpdate(new Date());
    setIsConnected(true); // Manter conectado para mudanças locais
  }, []);

  // Função para notificar mudanças
  const notifyChange = useCallback((type: 'screens' | 'speed' | 'andares', data: number | Andar[]) => {
    // Salvar no localStorage para persistência
    if (type === 'screens') {
      localStorage.setItem('carousel-screen-count', data.toString());
    } else if (type === 'speed') {
      localStorage.setItem('carousel-speed', data.toString());
    }
    
    // Atualizar configuração local também
    updateConfig({ [type === 'screens' ? 'totalScreens' : 'carouselSpeed']: data });
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('salaViewer:configChange', {
      detail: { type, data, timestamp: Date.now() }
    }));
  }, [updateConfig]);

  // Carregar configuração inicial
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Escutar mudanças de configuração
  useEffect(() => {
    const handleConfigChange = (event: CustomEvent) => {
      const { type, data } = event.detail;
      
      if (type === 'screens') {
        updateConfig({ totalScreens: data });
      } else if (type === 'speed') {
        updateConfig({ carouselSpeed: data });
      } else if (type === 'andares') {
        fetchConfig(); // Recarregar andares do servidor
      }
    };

    window.addEventListener('salaViewer:configChange', handleConfigChange as EventListener);
    
    return () => {
      window.removeEventListener('salaViewer:configChange', handleConfigChange as EventListener);
    };
  }, [updateConfig, fetchConfig]);

  // Polling para verificar mudanças no servidor (andares/salas)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConfig();
    }, 5000); // Verificar a cada 5 segundos

    return () => clearInterval(interval);
  }, [fetchConfig]);

  return {
    config,
    isConnected,
    lastUpdate,
    updateConfig,
    notifyChange,
    refetch: fetchConfig
  };
}
