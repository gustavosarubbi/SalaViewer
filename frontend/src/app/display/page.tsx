'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ModernFloorSection, 
  LoadingScreen,
  useDisplayData
} from '@/components/display';
import { ModernBackground } from '@/components/display/ModernBackground';
import { AnimatedCarousel } from '@/components/display/AnimatedCarousel';
import { getScreenItems } from '@/utils/distribution';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { CompanyLogo, AnimatedStars } from '@/components';
import { Monitor } from 'lucide-react';
import { MonitorSelectCard } from '@/components/display/MonitorSelectCard';
import BackgroundLogin from '@/components/BackgroundLogin';

function PublicDisplayContent() {
  // Parâmetros da URL
  const searchParams = useSearchParams();
  const screenParam = searchParams.get('screen');
  const totalScreensParam = searchParams.get('totalScreens');
  const modeParam = searchParams.get('mode');

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
      return saved ? parseFloat(saved) * 1000 : 10000;
    }
    return 10000;
  });
  const [showScreenSelector, setShowScreenSelector] = useState(false);
  const [showLogo, setShowLogo] = useState<boolean>(true);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const savedShowLogo = localStorage.getItem('display-show-logo');
    if (savedShowLogo !== null) setShowLogo(savedShowLogo === 'true');
  }, []);

  // Escutar mudanças no localStorage e eventos customizados
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carousel-screen-count' && e.newValue) {
        const newCount = parseInt(e.newValue);
        setScreenCount(newCount > 0 ? newCount : 1); // Garantir que seja pelo menos 1
      }
      if (e.key === 'carousel-speed' && e.newValue) {
        const speed = parseFloat(e.newValue);
        setCarouselSpeed(speed * 1000); // Converter segundos para milissegundos
      }
    };

    const handleConfigChange = (e: CustomEvent) => {
      const { type, data } = e.detail;
      if (type === 'screens') {
        setScreenCount(data);
      } else if (type === 'speed') {
        setCarouselSpeed(data * 1000); // Converter segundos para milissegundos
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('salaViewer:configChange', handleConfigChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('salaViewer:configChange', handleConfigChange as EventListener);
    };
  }, []);

  // Limpar apenas configurações conflitantes, manter background personalizado
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Remover apenas configurações conflitantes
      localStorage.removeItem('display-color-card-background');
      
      // Remover classes conflitantes
      document.body.classList.remove('display-solid-bg', 'display-login-bg');
      
      // Limpar estilos inline
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
    }
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
      // Sem parâmetros URL: usar lista digital (mostrar todos os andares sem rotação)
      setFixedScreen(1);
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
      
      // Carregar configurações da logo
      const savedShowLogo = localStorage.getItem('display-show-logo');
      if (savedShowLogo !== null) setShowLogo(savedShowLogo === 'true');
    }
  }, [screenParam, totalScreensParam, realTimeConfig]);

  // Escutar mudanças em tempo real
  useEffect(() => {
    if (realTimeConfig) {
      if (realTimeConfig.totalScreens && realTimeConfig.totalScreens > 0 && realTimeConfig.totalScreens !== screenCount) {
        setScreenCount(realTimeConfig.totalScreens);
      }
      
      if (realTimeConfig.carouselSpeed && realTimeConfig.carouselSpeed > 0) {
        const currentSpeedInSeconds = carouselSpeed / 1000;
        if (Math.abs(realTimeConfig.carouselSpeed - currentSpeedInSeconds) > 0.1) {
          setCarouselSpeed(realTimeConfig.carouselSpeed * 1000);
        }
      }
    }
  }, [realTimeConfig, screenCount, carouselSpeed]);

  // Obter andares da tela atual
  let currentScreenAndares;
  
  // Determinar modo baseado no parâmetro ou localStorage
  const [isCarouselMode, setIsCarouselMode] = useState(false);
  
  useEffect(() => {
    const checkMode = () => {
      const savedMode = typeof window !== 'undefined' ? localStorage.getItem('display-mode') : null;
      const shouldBeCarousel = modeParam === 'carrossel' || savedMode === 'carrossel';
      setIsCarouselMode(shouldBeCarousel);
      
      // Se for modo carrossel e não tiver parâmetro de tela, mostrar seletor
      if (shouldBeCarousel && !screenParam) {
        setShowScreenSelector(true);
      } else {
        setShowScreenSelector(false);
      }
    };
    
    checkMode();
  }, [modeParam, screenParam]);
  
  // Determinar o que renderizar baseado no modo
  if (isCarouselMode) {
    // Modo carrossel: sempre usar carrossel animado
    currentScreenAndares = null;
  } else if (fixedScreen) {
    if (screenParam) {
      // Se tela fixa com parâmetro, usar distribuição equilibrada
      currentScreenAndares = getScreenItems(salasPorAndar, screenCount, fixedScreen);
    } else {
      // Lista digital: mostrar todos os andares
      currentScreenAndares = salasPorAndar;
    }
  } else {
    // Lista digital: mostrar todos os andares
    currentScreenAndares = salasPorAndar;
  }

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen relative" style={{ background: '#000' }}>
        <AnimatedStars />
        
        {/* Background decorativo moderno */}
        <div className="absolute inset-0">
          {/* Gradientes radiais animados */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/12 to-indigo-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Linhas decorativas */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          
          {/* Grid pattern sutil */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar dados</h2>
            <p className="text-white/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Tela de seleção de monitor (modo carrossel)
  if (showScreenSelector) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
        <BackgroundLogin />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          {/* Header reorganizado */}
          <div className="text-center mb-16">
            {/* Logo da Empresa */}
            {showLogo && (
              <div className="mb-8">
                <CompanyLogo 
                  maxWidth="200px" 
                  maxHeight="80px"
                  placeholderText=""
                  showPlaceholder={false}
                />
              </div>
            )}

            {/* Título e descrição centralizados */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                <Monitor className="h-16 w-16 text-white" />
                <h1 className="text-6xl font-bold text-white bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Selecionar Monitor
                </h1>
              </div>
              <p className="text-white/80 text-2xl">
                Escolha qual monitor visualizar no modo carrossel
              </p>
            </div>
          </div>

          {/* Grid de monitores - enfileirados horizontalmente */}
          <div className="flex justify-center gap-4 max-w-7xl mx-auto mb-16 overflow-x-auto pb-3">
            {Array.from({ length: Math.max(1, screenCount) }, (_, i) => i + 1).map((screenNumber) => (
              <MonitorSelectCard
                key={screenNumber}
                screenNumber={screenNumber}
                onSelect={(sn) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('screen', sn.toString());
                  window.location.href = url.toString();
                }}
              />
            ))}
          </div>

      </div>
      </div>
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

      <div className={isCarouselMode ? "p-1" : "p-3"}>
        {isCarouselMode ? (
          /* Carrossel animado - quando em modo carrossel */
          <AnimatedCarousel
            salasPorAndar={salasPorAndar}
            screenCount={screenCount}
            autoRotateInterval={carouselSpeed}
            currentScreen={screenParam ? parseInt(screenParam) : 1}
          />
        ) : fixedScreen ? (
          /* Tela fixa - mostrar apenas os andares da tela específica */
          <div className="space-y-6">
            {currentScreenAndares?.map(({ andar, salas: salasDoAndar }) => (
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
          /* Lista digital - mostrar todos os andares */
          <div className="space-y-6">
            {currentScreenAndares?.map(({ andar, salas: salasDoAndar }) => (
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
        )}
      </div>
    </ModernBackground>
  );
}

export default function PublicDisplayPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PublicDisplayContent />
    </Suspense>
  );
}