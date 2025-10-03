'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ModernBackground, 
  ModernFloorSection, 
  LoadingScreen,
  useDisplayData
} from '@/components/display';
import { AnimatedCarousel } from '@/components/display/AnimatedCarousel';
import { getScreenItems } from '@/utils/distribution';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { CompanyLogo } from '@/components';

function CarouselDisplayContent() {
  // Parâmetros da URL
  const searchParams = useSearchParams();
  const screenParam = searchParams.get('screen');
  const totalScreensParam = searchParams.get('totalScreens');

  // Hook para carregar dados
  const { salasPorAndar, loading, error } = useDisplayData();
  
  // Hook para atualizações em tempo real
  const { config: realTimeConfig } = useRealTimeUpdates();

  // Estados do carrossel - carregar do localStorage
  const [screenCount, setScreenCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carousel-screen-count');
      return saved ? parseInt(saved) : 2; // Valor padrão 2 se não houver configuração
    }
    return 2;
  });
  const [fixedScreen, setFixedScreen] = useState<number | null>(null);
  const [carouselSpeed, setCarouselSpeed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carousel-speed');
      return saved ? parseFloat(saved) * 1000 : 10000; // Converter segundos para milissegundos
    }
    return 10000;
  });
  const [showLogo, setShowLogo] = useState<boolean>(true);

  // Carregar configurações da logo do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedShowLogo = localStorage.getItem('display-show-logo');
      if (savedShowLogo !== null) setShowLogo(savedShowLogo === 'true');
    }
  }, []);

  // Escutar mudanças em tempo real via eventos customizados
  useEffect(() => {
    const handleConfigChange = (e: CustomEvent) => {
      const { type, data } = e.detail;
      if (type === 'screens') {
        setScreenCount(data);
      } else if (type === 'speed') {
        setCarouselSpeed(data * 1000); // Converter segundos para milissegundos
      }
    };

    window.addEventListener('salaViewer:configChange', handleConfigChange as EventListener);
    
    return () => {
      window.removeEventListener('salaViewer:configChange', handleConfigChange as EventListener);
    };
  }, []);

  // Configurar carrossel baseado nos parâmetros da URL (apenas se não houver configuração em tempo real)
  useEffect(() => {
    if (screenParam) {
      const screenNumber = parseInt(screenParam);
      if (screenNumber >= 1) {
        // Com parâmetros URL: usar carrossel com distribuição
        setFixedScreen(null);
      }
    } else {
      // Sem parâmetros URL: usar carrossel (mostrar todos os andares com rotação)
      setFixedScreen(null);
    }

    // Aplicar parâmetros da URL apenas se não houver configuração em tempo real
    if (!realTimeConfig) {
      if (totalScreensParam) {
        const totalScreens = parseInt(totalScreensParam);
        if (totalScreens >= 1) {
          setScreenCount(totalScreens);
        }
      }

      // Remover aplicação da velocidade da URL - usar apenas configuração salva
      // A velocidade já é carregada do localStorage na inicialização do estado
    }
  }, [screenParam, totalScreensParam, realTimeConfig]);

  // Escutar mudanças em tempo real
  useEffect(() => {
    if (realTimeConfig) {
      if (realTimeConfig.totalScreens !== screenCount) {
        setScreenCount(realTimeConfig.totalScreens);
      }
      // Comparar velocidade em segundos (realTimeConfig.carouselSpeed está em segundos)
      const currentSpeedInSeconds = carouselSpeed / 1000;
      if (realTimeConfig.carouselSpeed !== currentSpeedInSeconds) {
        setCarouselSpeed(realTimeConfig.carouselSpeed * 1000); // Converter para milissegundos
      }
    }
  }, [realTimeConfig, screenCount, carouselSpeed]);

  // Obter andares da tela atual
  let currentScreenAndares;
  
  if (fixedScreen) {
    // Se tela fixa, usar distribuição equilibrada
    currentScreenAndares = getScreenItems(salasPorAndar, screenCount, fixedScreen);
  } else {
    // Usar carrossel animado
    currentScreenAndares = salasPorAndar;
  }

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <ModernBackground>
        <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar dados</h2>
            <p className="text-white/70">{error}</p>
        </div>
      </div>
      </ModernBackground>
    );
  }

  return (
    <ModernBackground>
      {/* Logo da Empresa - Canto Superior Esquerdo */}
      {showLogo && (
        <div className="absolute top-4 left-4 z-10">
          <CompanyLogo 
            maxWidth="200px" 
            maxHeight="80px"
            placeholderText=""
            showPlaceholder={false}
          />
        </div>
      )}

      {/* EletroON - Canto Superior Direito */}
      <div className="absolute top-4 right-4 z-10">
        <div className="text-white/40 text-xs font-medium tracking-wider">
          EletroON
        </div>
      </div>

      <div className="p-6">
        {fixedScreen ? (
          /* Tela fixa - mostrar apenas os andares da tela específica */
          <div className="space-y-12">
            {currentScreenAndares.map(({ andar, salas: salasDoAndar }) => (
              <div
                key={andar.id} 
                className="transform transition-all duration-500"
              >
                <ModernFloorSection 
                  andar={andar} 
                  salas={salasDoAndar} 
                />
              </div>
            ))}
          </div>
        ) : (
          /* Carrossel animado - sempre usar carrossel */
          <AnimatedCarousel
            salasPorAndar={salasPorAndar}
            screenCount={screenCount}
            autoRotateInterval={carouselSpeed}
            currentScreen={screenParam ? parseInt(screenParam) : 1}
          />
        )}
      </div>
    </ModernBackground>
  );
}

export default function CarouselDisplayPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CarouselDisplayContent />
    </Suspense>
  );
}
