import { useState, useEffect } from 'react';
import { apiService, Sala, Andar } from '@/services/api';

export function useDisplayData() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [andares, setAndares] = useState<Andar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [allSalas, allAndares] = await Promise.all([
        apiService.getSalas(),
        apiService.getAndares()
      ]);
      
      setSalas(allSalas);
      setAndares(allAndares);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados das salas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Agrupar salas por andar
  const salasPorAndar = andares
    .sort((a, b) => a.numero_andar - b.numero_andar)
    .map(andar => ({
      andar,
      salas: salas
        .filter(sala => sala.andarId === andar.id)
        .sort((a, b) => {
          const numA = parseInt(a.numero_sala.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.numero_sala.replace(/\D/g, '')) || 0;
          return numA - numB;
        })
    }));

  return {
    salas,
    andares,
    salasPorAndar,
    loading,
    error,
    refetch: loadData
  };
}
