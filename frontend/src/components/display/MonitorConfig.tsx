'use client';

import { getScreenItems } from '@/utils/distribution';

interface Andar {
  id: number;
  numero_andar: number;
  nome_identificador?: string;
}

interface MonitorConfigProps {
  totalScreens: number;
  maxMonitores: number;
  onScreensChange: (screens: number) => void;
  andares: Andar[];
  loading: boolean;
  carouselSpeed?: number;
  onCarouselSpeedChange?: (speed: number) => void;
  onNotifyChange?: (type: 'screens' | 'speed' | 'andares', data: number | Andar[]) => void;
}

export function MonitorConfig({ 
  totalScreens, 
  maxMonitores, 
  onScreensChange, 
  andares, 
  loading,
  carouselSpeed = 2,
  onCarouselSpeedChange,
  onNotifyChange
}: MonitorConfigProps) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
            <span className="text-blue-400 text-lg">⚙️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Configuração de Monitores</h3>
            <p className="text-white/60 text-sm">Configure quantos monitores serão utilizados</p>
          </div>
        </div>
        
        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Seletor de Monitores */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="mb-2">
              <span className="text-white/80 text-sm font-medium">Número de Monitores</span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => {
                  const newScreens = Math.max(1, totalScreens - 1);
                  onScreensChange(newScreens);
                  onNotifyChange?.('screens', newScreens);
                }}
                disabled={totalScreens <= 1}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Diminuir número de monitores"
              >
                <span className="text-sm font-bold group-hover:scale-110 transition-transform">−</span>
              </button>
              
              <div className="bg-white/10 rounded-lg w-8 h-8 border border-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {totalScreens}
                </span>
              </div>
              
              <button
                onClick={() => {
                  const newScreens = Math.min(maxMonitores, totalScreens + 1);
                  onScreensChange(newScreens);
                  onNotifyChange?.('screens', newScreens);
                }}
                disabled={totalScreens >= maxMonitores}
                className="w-8 h-8 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg flex items-center justify-center text-green-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                title="Aumentar número de monitores"
              >
                <span className="text-sm font-bold group-hover:scale-110 transition-transform">+</span>
              </button>
            </div>
            
            {/* Barra de Progresso */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-white/60 mb-1">
                <span>1</span>
                <span>{maxMonitores}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(totalScreens / maxMonitores) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

                  {/* Seletor de Velocidade do Carrossel */}
                  {onCarouselSpeedChange && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="mb-2">
                        <span className="text-white/80 text-sm font-medium">Velocidade do Carrossel</span>
                      </div>
              
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => {
                    const newSpeed = Math.max(0.5, carouselSpeed - 0.5);
                    console.log('[MonitorConfig] Diminuindo velocidade:', carouselSpeed, '->', newSpeed);
                    onCarouselSpeedChange?.(newSpeed);
                    onNotifyChange?.('speed', newSpeed);
                  }}
                  disabled={carouselSpeed <= 0.5}
                  className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg flex items-center justify-center text-orange-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                  title="Diminuir velocidade"
                >
                  <span className="text-sm font-bold group-hover:scale-110 transition-transform">−</span>
                </button>
                
                <div className="bg-white/10 rounded-lg w-10 h-8 border border-white/20 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {carouselSpeed}s
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    const newSpeed = Math.min(5, carouselSpeed + 0.5);
                    console.log('[MonitorConfig] Aumentando velocidade:', carouselSpeed, '->', newSpeed);
                    onCarouselSpeedChange?.(newSpeed);
                    onNotifyChange?.('speed', newSpeed);
                  }}
                  disabled={carouselSpeed >= 5}
                  className="w-8 h-8 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg flex items-center justify-center text-orange-400 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                  title="Aumentar velocidade"
                >
                  <span className="text-sm font-bold group-hover:scale-110 transition-transform">+</span>
                </button>
              </div>
              
              {/* Indicador de Velocidade */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>0.5s</span>
                  <span>5s</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((carouselSpeed - 0.5) / 4.5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center text-xs text-white/60 mt-1">
                  {carouselSpeed} segundo{carouselSpeed > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aviso de Limite */}
      {andares.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="text-yellow-400 text-sm font-medium">
            Máximo: {maxMonitores} monitor{maxMonitores > 1 ? 'es' : ''} 
            <span className="text-yellow-300 ml-1">(não pode exceder o número de andares)</span>
          </div>
        </div>
      )}

      {/* Distribuição dos Andares */}
      <div>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
            <span className="text-purple-400 text-lg">📊</span>
          </div>
          <h4 className="text-lg font-bold text-white">Distribuição dos Andares</h4>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-white/60">Carregando andares...</span>
          </div>
        ) : andares.length > 0 ? (
          <>
            <p className="mb-4 text-white/70">
              <span className="text-purple-400 font-semibold">{totalScreens} monitor{totalScreens > 1 ? 'es' : ''}</span> 
              {' '}distribuindo {andares.length} andares de forma equilibrada:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: totalScreens }, (_, i) => {
                const andaresDoMonitor = getScreenItems(andares, totalScreens, i + 1);
                
                return (
                  <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-purple-400 font-semibold text-sm">Monitor {i + 1}</div>
                      <div className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                        {andaresDoMonitor.length} andar{andaresDoMonitor.length > 1 ? 'es' : ''}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {andaresDoMonitor.map((andar) => (
                        <span 
                          key={andar.id} 
                          className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
                        >
                          {andar.nome_identificador || `A${andar.numero_andar}`}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-yellow-400 text-3xl mb-3">⚠️</div>
            <p className="text-white/60 text-lg mb-2">Nenhum andar encontrado</p>
            <p className="text-white/40 text-sm">Verifique se o backend está rodando</p>
          </div>
        )}
      </div>
    </div>
  );
}
