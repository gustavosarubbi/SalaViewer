'use client';

import { useState, useEffect } from 'react';
import { apiService, Sala as ApiSala, Andar as ApiAndar } from '@/services/api';
import { DisplayBackground, FloorSection } from '@/components/display';

export default function PublicDisplayPage() {
  const [salas, setSalas] = useState<ApiSala[]>([]);
  const [andares, setAndares] = useState<ApiAndar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allSalas, allAndares] = await Promise.all([
          apiService.getSalas(),
          apiService.getAndares()
        ]);
        
        setSalas(allSalas);
        setAndares(allAndares);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Atualizar dados a cada 10 segundos
    const interval = setInterval(loadData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Agrupar salas por andar
  const salasPorAndar = andares
    .sort((a, b) => a.numero_andar - b.numero_andar)
    .map(andar => ({
      andar,
      salas: salas
        .filter(sala => sala.andar && sala.andar.id === andar.id)
        .sort((a, b) => {
          // Extrair números da string da sala (ex: "101" de "Sala 101")
          const numA = parseInt(a.numero_sala.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.numero_sala.replace(/\D/g, '')) || 0;
          // Ordenação numérica correta para números > 100
          return numA - numB;
        })
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <DisplayBackground>
      <div className="relative w-full space-y-8 p-6">
        {salasPorAndar.map(({ andar, salas: salasDoAndar }) => (
          <FloorSection 
            key={andar.id} 
            andar={andar} 
            salas={salasDoAndar} 
          />
        ))}
      </div>
    </DisplayBackground>
  );
}