'use client';

import { useState, useEffect } from 'react';
import { CarouselFloorSection } from './CarouselFloorSection';
import { getScreenItems } from '@/utils/distribution';

interface AnimatedCarouselProps {
  salasPorAndar: Array<{
    andar: {
      id: number;
      numero_andar: number;
      nome_identificador?: string;
    };
    salas: Array<{
      id: number;
      numero_sala: string;
      nome_ocupante: string | null;
      andarId: number;
      andar: {
        id: number;
        numero_andar: number;
        nome_identificador?: string;
      };
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
  screenCount: number;
  autoRotateInterval?: number;
  currentScreen?: number;
}

export function AnimatedCarousel({ 
  salasPorAndar, 
  screenCount, 
  autoRotateInterval = 10000, 
  currentScreen = 1 
}: AnimatedCarouselProps) {
  const [currentAndarIndex, setCurrentAndarIndex] = useState(0);

  // Ordenar andares por número crescente
  const andaresOrdenados = [...salasPorAndar].sort((a, b) => a.andar.numero_andar - b.andar.numero_andar);
  
  // Se há múltiplas telas, dividir andares entre elas
  const validScreenCount = Math.max(1, screenCount); // Garantir que seja pelo menos 1
  const andaresParaEstaTela = validScreenCount > 1 ? 
    getScreenItems(andaresOrdenados, validScreenCount, currentScreen) : 
    andaresOrdenados;

  // Auto-rotação simplificada
  useEffect(() => {
    if (andaresParaEstaTela.length > 1) {
      const interval = setInterval(() => {
        setCurrentAndarIndex(prev => (prev + 1) % andaresParaEstaTela.length);
      }, autoRotateInterval);
      return () => clearInterval(interval);
    }
  }, [andaresParaEstaTela.length, autoRotateInterval]);

  const currentAndar = andaresParaEstaTela[currentAndarIndex];

  return (
    <div className="relative">
      {currentAndar && (
        <CarouselFloorSection 
          andar={currentAndar.andar} 
          salas={currentAndar.salas || []} 
        />
      )}
    </div>
  );
}
