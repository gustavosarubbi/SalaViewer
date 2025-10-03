'use client';

import { useState, useEffect } from 'react';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';

interface DisplayHeaderProps {
  onCarouselToggle: (enabled: boolean) => void;
  onScreenCountChange: (count: number) => void;
  onStartCarousel: () => void;
  onStopCarousel: () => void;
  onResetCarousel: () => void;
  isCarouselEnabled: boolean;
  screenCount: number;
  isCarouselRunning: boolean;
  currentScreen: number;
  totalScreens: number;
}

export function DisplayHeader({
  onCarouselToggle,
  onScreenCountChange,
  onStartCarousel,
  onStopCarousel,
  onResetCarousel,
  isCarouselEnabled,
  screenCount,
  isCarouselRunning,
  currentScreen,
  totalScreens
}: DisplayHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(false);
        setShowSettings(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      {/* Header principal */}
      <div className="bg-black/80 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">SalaViewer Display</h1>
              <p className="text-white/60 text-sm">
                {isCarouselEnabled 
                  ? `Tela ${currentScreen} de ${totalScreens} - Carrossel ${isCarouselRunning ? 'Ativo' : 'Pausado'}`
                  : 'Modo Normal'
                }
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-4">
            {/* Botão de configurações */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>

            {/* Controles do carrossel */}
            {isCarouselEnabled && (
              <div className="flex items-center space-x-2">
                {!isCarouselRunning ? (
                  <button
                    onClick={onStartCarousel}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-all duration-200 text-green-400"
                  >
                    <Play className="w-4 h-4" />
                    <span>Iniciar</span>
                  </button>
                ) : (
                  <button
                    onClick={onStopCarousel}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-200 text-red-400"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pausar</span>
                  </button>
                )}
                
                <button
                  onClick={onResetCarousel}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all duration-200 text-blue-400"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Painel de configurações */}
        {showSettings && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Configuração do carrossel */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Configuração do Carrossel</h3>
                
                {/* Ativar carrossel */}
                <div className="flex items-center justify-between">
                  <label className="text-white/80 text-sm">Ativar função carrossel</label>
                  <button
                    onClick={() => onCarouselToggle(!isCarouselEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      isCarouselEnabled ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        isCarouselEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Número de telas */}
                {isCarouselEnabled && (
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm">Quantas telas são?</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onScreenCountChange(Math.max(1, screenCount - 1))}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white"
                        disabled={screenCount <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={screenCount}
                        onChange={(e) => onScreenCountChange(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                        className="w-16 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center"
                      />
                      <button
                        onClick={() => onScreenCountChange(Math.min(10, screenCount + 1))}
                        className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white"
                        disabled={screenCount >= 10}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Informações do carrossel */}
              {isCarouselEnabled && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg">Status do Carrossel</h3>
                  <div className="space-y-2 text-sm text-white/80">
                    <div>Telas configuradas: <span className="text-blue-400 font-semibold">{screenCount}</span></div>
                    <div>Tela atual: <span className="text-green-400 font-semibold">{currentScreen}</span></div>
                    <div>Status: <span className={`font-semibold ${isCarouselRunning ? 'text-green-400' : 'text-yellow-400'}`}>
                      {isCarouselRunning ? 'Rodando' : 'Pausado'}
                    </span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}