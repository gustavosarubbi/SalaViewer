'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { ArrowLeft, Eye, RotateCcw, Save, Check, Droplets, Monitor, Gauge } from 'lucide-react';
import Link from 'next/link';
import { useDisplayData } from '@/components/display';
import { useSearchParams } from 'next/navigation';
import LogoManager from '@/components/dashboard/LogoManager';
import { useCompanyLogo } from '@/hooks/useCompanyLogo';

type DisplayMode = 'lista' | 'carrossel';

function DisplaySetupContent() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('lista');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Estados para configuração de cores baseados no sistema padrão
  const [salaDisponivelCor, setSalaDisponivelCor] = useState<string>('#10b981');
  const [salaOcupadaCor, setSalaOcupadaCor] = useState<string>('#3b82f6');
  const [andarAccentCor, setAndarAccentCor] = useState<string>('#3b82f6');
  const [backgroundPrimario, setBackgroundPrimario] = useState<string>('#000000');
  const [particulaPrimaria, setParticulaPrimaria] = useState<string>('#00fff7');
  const [particulaSecundaria, setParticulaSecundaria] = useState<string>('#00eaff');
  const [screenCount, setScreenCount] = useState<number>(2);
  const [carouselSpeed, setCarouselSpeed] = useState<number>(0.5);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  
  // Estados para animações das barras de progresso
  const [speedAnimation, setSpeedAnimation] = useState<'increasing' | 'decreasing' | null>(null);
  const [monitorAnimation, setMonitorAnimation] = useState<'increasing' | 'decreasing' | null>(null);
  const [previousSpeed, setPreviousSpeed] = useState<number>(0.5);
  const [previousScreenCount, setPreviousScreenCount] = useState<number>(2);

  // Hook para carregar dados reais
  const { salasPorAndar, loading: dataLoading } = useDisplayData();
  
  // Hook para gerenciar logo da empresa
  const { logoUrl } = useCompanyLogo();

  // Função para resetar cores para os valores padrão do sistema
  const resetToDefaultColors = () => {
    setSalaDisponivelCor('#10b981');  // Verde esmeralda
    setSalaOcupadaCor('#3b82f6');     // Azul royal
    setAndarAccentCor('#3b82f6');     // Azul royal
    setBackgroundPrimario('#000000'); // Preto
    setParticulaPrimaria('#00fff7');  // Cyan
    setParticulaSecundaria('#00eaff'); // Azul cyan
  };
  
  // Parâmetros da URL
  const searchParams = useSearchParams();

  // Função para controlar animação da velocidade
  const handleSpeedChange = (newSpeed: number) => {
    if (newSpeed > previousSpeed) {
      setSpeedAnimation('increasing');
    } else if (newSpeed < previousSpeed) {
      setSpeedAnimation('decreasing');
    }
    setPreviousSpeed(newSpeed);
    setCarouselSpeed(newSpeed);
    
    // Limpar animação após 1 segundo
    setTimeout(() => setSpeedAnimation(null), 1000);
  };

  // Função para controlar animação do número de monitores
  const handleScreenCountChange = (newCount: number) => {
    if (newCount > previousScreenCount) {
      setMonitorAnimation('increasing');
    } else if (newCount < previousScreenCount) {
      setMonitorAnimation('decreasing');
    }
    setPreviousScreenCount(newCount);
    setScreenCount(newCount);
    
    // Limpar animação após 1 segundo
    setTimeout(() => setMonitorAnimation(null), 1000);
  };

  // Função para atualizar o background do slider personalizado
  const updateSliderBackground = (value: number, max: number) => {
    const percentage = ((value - 1) / (max - 1)) * 100;
    return `${percentage}% 100%, ${percentage}% 100%`;
  };

  // Função para atualizar o background do slider de velocidade
  const updateSpeedSliderBackground = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `${percentage}% 100%, ${percentage}% 100%`;
  };


  // Carregar configuração salva
  useEffect(() => {
    const savedMode = localStorage.getItem('display-mode') as DisplayMode;
    if (savedMode && (savedMode === 'lista' || savedMode === 'carrossel')) {
      setDisplayMode(savedMode);
    }
    const savedSalaDisponivelCor = localStorage.getItem('display-color-available');
    const savedSalaOcupadaCor = localStorage.getItem('display-color-occupied');
    const savedParticulaPrimaria = localStorage.getItem('display-color-particle-primary');
    const savedParticulaSecundaria = localStorage.getItem('display-color-particle-secondary');
    const savedAccent = localStorage.getItem('display-color-accent');
    const savedBackground = localStorage.getItem('display-color-background');
    const savedScreenCount = localStorage.getItem('carousel-screen-count');
    const savedCarouselSpeed = localStorage.getItem('carousel-speed');
    const savedShowLogo = localStorage.getItem('display-show-logo');
    if (savedSalaDisponivelCor) setSalaDisponivelCor(savedSalaDisponivelCor);
    if (savedSalaOcupadaCor) setSalaOcupadaCor(savedSalaOcupadaCor);
    if (savedParticulaPrimaria) setParticulaPrimaria(savedParticulaPrimaria);
    if (savedParticulaSecundaria) setParticulaSecundaria(savedParticulaSecundaria);
    if (savedAccent) setAndarAccentCor(savedAccent);
    if (savedBackground) setBackgroundPrimario(savedBackground);
    if (savedScreenCount) setScreenCount(parseInt(savedScreenCount));
    if (savedCarouselSpeed) setCarouselSpeed(parseFloat(savedCarouselSpeed));
    if (savedShowLogo !== null) setShowLogo(savedShowLogo === 'true');
  }, []);

  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    try {
      localStorage.setItem('display-mode', mode);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {}
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simular delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Salvar no localStorage
    localStorage.setItem('display-mode', displayMode);
    localStorage.setItem('display-color-available', salaDisponivelCor);
    localStorage.setItem('display-color-occupied', salaOcupadaCor);
    localStorage.setItem('display-color-accent', andarAccentCor);
    localStorage.setItem('display-color-background', backgroundPrimario);
    localStorage.setItem('display-color-particle-primary', particulaPrimaria);
    localStorage.setItem('display-color-particle-secondary', particulaSecundaria);
    localStorage.setItem('carousel-screen-count', screenCount.toString());
    localStorage.setItem('carousel-speed', carouselSpeed.toString());
    localStorage.setItem('display-show-logo', showLogo.toString());
    
    // Disparar evento customizado para notificar mudanças em tempo real
    window.dispatchEvent(new CustomEvent('salaViewer:configChange', {
      detail: { type: 'speed', data: carouselSpeed, timestamp: Date.now() }
    }));
    
    setIsSaving(false);
    setSaved(true);
    
    // Resetar indicador de salvamento após 2 segundos
    setTimeout(() => setSaved(false), 2000);
  };

  const getDisplayUrl = () => {
    if (displayMode === 'carrossel') {
      return `/display?mode=carrossel&totalScreens=${screenCount}`;
    }
    return '/display';
  };

  // Calcular distribuição usando dados reais
  const getDistribution = () => {
    if (!salasPorAndar || salasPorAndar.length === 0) {
      return [];
    }

    // Ordenar andares por número
    const andaresOrdenados = [...salasPorAndar].sort((a, b) => a.andar.numero_andar - b.andar.numero_andar);
    const totalAndares = andaresOrdenados.length;
    const distribution = [];
    
    // Distribuição equilibrada - garantir que todos os monitores tenham pelo menos 1 andar
    const andaresPorTela = Math.floor(totalAndares / screenCount);
    const andaresExtras = totalAndares % screenCount;
    
    let andarIndex = 0;
    
    for (let i = 0; i < screenCount; i++) {
      // Cada monitor recebe andaresPorTela andares, alguns recebem 1 extra
      const andaresNesteMonitor = andaresPorTela + (i < andaresExtras ? 1 : 0);
      const andaresDaTela = andaresOrdenados.slice(andarIndex, andarIndex + andaresNesteMonitor);
      
      distribution.push({
        tela: i + 1,
        andares: andaresDaTela.map(item => item.andar),
        total: andaresDaTela.length
      });
      
      andarIndex += andaresNesteMonitor;
    }
    
    return distribution;
  };

  // Verificar se o número de monitores é válido
  const maxMonitores = 5; // Limite fixo de 5 monitores
  const andaresDisponiveis = salasPorAndar ? salasPorAndar.length : 0;
  const isScreenCountValid = andaresDisponiveis === 0 || screenCount <= andaresDisponiveis;

  // Ajustar automaticamente o número de monitores se exceder o limite de andares
  useEffect(() => {
    if (salasPorAndar && salasPorAndar.length > 0 && screenCount > salasPorAndar.length) {
      setScreenCount(salasPorAndar.length);
    }
  }, [salasPorAndar, screenCount]);

  // Ler parâmetros da URL e aplicar nas configurações
  useEffect(() => {
    const totalScreensParam = searchParams.get('totalScreens');
    const modeParam = searchParams.get('mode');

    if (totalScreensParam) {
      const totalScreens = parseInt(totalScreensParam);
      if (totalScreens >= 1 && totalScreens <= 5) {
        setScreenCount(totalScreens);
      }
    }

    if (modeParam === 'carrossel') {
      setDisplayMode('carrossel');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <style jsx>{`
        input[type="color"] {
          -webkit-appearance: none;
          appearance: none;
          background: none;
          border: none;
          outline: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
        }
        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 50%;
        }
        input[type="color"]::-moz-color-swatch {
          border: none;
          border-radius: 50%;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px currentColor;
          }
          50% {
            box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
          }
          100% {
            box-shadow: 0 0 5px currentColor;
          }
        }
        
        /* Estilos para o slider personalizado de monitores */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          cursor: pointer;
          outline: none;
        }
        
        /* Slider de monitores - azul */
        input[type="range"]:not([step="0.5"])::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: grab;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.7);
          transition: box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        
        input[type="range"]:not([step="0.5"])::-webkit-slider-thumb:active {
          cursor: grabbing;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.9);
        }
        
        input[type="range"]:not([step="0.5"])::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: grab;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.7);
          transition: box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        
        input[type="range"]:not([step="0.5"])::-moz-range-thumb:active {
          cursor: grabbing;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.9);
        }
        
        /* Slider de velocidade - amarelo/dourado */
        input[type="range"][step="0.5"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #ffd700;
          border-radius: 50%;
          cursor: grab;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.7);
          transition: box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        
        input[type="range"][step="0.5"]::-webkit-slider-thumb:active {
          cursor: grabbing;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
        }
        
        input[type="range"][step="0.5"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #ffd700;
          border-radius: 50%;
          cursor: grab;
          border: 2px solid #fff;
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.7);
          transition: box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        
        input[type="range"][step="0.5"]::-moz-range-thumb:active {
          cursor: grabbing;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
        }
        
        /* Estilo para slider inválido */
        input[type="range"]:disabled::-webkit-slider-thumb {
          background-color: #fca5a5;
          box-shadow: 0 0 8px rgba(252, 165, 165, 0.7);
        }
        
        input[type="range"]:disabled::-moz-range-thumb {
          background-color: #fca5a5;
          box-shadow: 0 0 8px rgba(252, 165, 165, 0.7);
        }
        
      `}</style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Configuração do Display</h1>
              <p className="text-white/70">Configure como o display público será exibido</p>
            </div>
            
            {/* Botões de ação no header */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                    <span>Salvando...</span>
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4 text-blue-300" />
                    <span>Salvo!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-blue-300" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
              
              <Link
                href={getDisplayUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 hover:text-emerald-100 hover:bg-emerald-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all"
              >
                <Eye className="h-4 w-4 text-emerald-300" />
                <span>Abrir Display</span>
              </Link>
            </div>
          </div>
        </div>
      
        {/* Configuração Principal */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Modo de Exibição</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modo Lista */}
            <div 
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                displayMode === 'lista' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => handleModeChange('lista')}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  displayMode === 'lista' ? 'bg-blue-500' : 'bg-white/10'
                }`}>
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Lista Digital</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Exibe todas as salas em uma lista organizada por andares, ideal para visualização completa.
                  </p>
                  {displayMode === 'lista' && (
                    <div className="flex items-center text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        Modo Atual
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {displayMode === 'lista' && (
                <div className="absolute top-4 right-4">
                  <Check className="h-5 w-5 text-blue-500" />
                </div>
              )}
            </div>

            {/* Modo Carrossel */}
            <div 
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                displayMode === 'carrossel' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => handleModeChange('carrossel')}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  displayMode === 'carrossel' ? 'bg-green-500' : 'bg-white/10'
                }`}>
                  <RotateCcw className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Carrossel Automático</h3>
                  <p className="text-white/70 text-sm mb-4">
                    Alterna automaticamente entre diferentes telas, ideal para monitores em locais públicos.
                  </p>
                  {displayMode === 'carrossel' && (
                    <div className="flex items-center text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                        Modo Atual
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {displayMode === 'carrossel' && (
                <div className="absolute top-4 right-4">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configurações do Carrossel */}
        {displayMode === 'carrossel' && (
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <RotateCcw className="h-5 w-5 mr-2" />
              Configurações do Carrossel
            </h2>
            
            <div className="grid grid-cols-1 gap-8">
              {/* Configurações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/80 mb-2 flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Número de Monitores
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative mr-2">
                      <input
                        type="range"
                        min="1"
                        max={maxMonitores}
                        value={screenCount}
                        onChange={(e) => handleScreenCountChange(parseInt(e.target.value))}
                        className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer outline-none ${
                          isScreenCountValid ? 'bg-gray-400 border border-gray-500' : 'bg-red-500/30 border border-red-500'
                        }`}
                        disabled={!isScreenCountValid}
                        style={{
                          backgroundImage: isScreenCountValid 
                            ? `linear-gradient(to right, #3b82f6, #3b82f6), repeating-linear-gradient(to right, #7a7a7a 0, #7a7a7a 4px, transparent 4px, transparent 10%)`
                            : `linear-gradient(to right, #ef4444, #ef4444), repeating-linear-gradient(to right, #7a7a7a 0, #7a7a7a 4px, transparent 4px, transparent 10%)`,
                          backgroundSize: updateSliderBackground(screenCount, maxMonitores),
                          backgroundPosition: '0% 0%',
                          backgroundRepeat: 'no-repeat',
                          boxShadow: isScreenCountValid ? 'inset 0 0 5px rgba(0, 0, 0, 0.3)' : 'inset 0 0 5px rgba(239, 68, 68, 0.3)',
                          transition: 'background-size 0.2s ease-out'
                        }}
                      />
                    </div>
                    <div className="w-10 text-left relative">
                      <span className={`font-bold text-lg transition-colors duration-300 ${
                        isScreenCountValid ? 'text-white' : 'text-red-400'
                      } ${monitorAnimation ? 'animate-pulse' : ''}`}>
                        {screenCount}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    {isScreenCountValid 
                      ? `Quantos monitores serão usados no carrossel (máx: ${maxMonitores})`
                      : `Máximo permitido: ${andaresDisponiveis} monitores (você tem ${andaresDisponiveis} andares)`
                    }
                  </p>
                  {!isScreenCountValid && (
                    <p className="text-xs text-red-400 mt-1">
                      ⚠️ Reduza o número de monitores ou adicione mais andares
                    </p>
                  )}
                </div>
                
                  <div>
                  <label className="block text-sm text-white/80 mb-2 flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Velocidade de Rotação (segundos)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={carouselSpeed}
                      onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                      className="flex-1 h-2.5 rounded-lg appearance-none cursor-pointer outline-none bg-gray-400 border border-gray-500"
                      style={{
                        backgroundImage: `linear-gradient(to right, #ffd700, #ffd700), repeating-linear-gradient(to right, #7a7a7a 0, #7a7a7a 4px, transparent 4px, transparent 10%)`,
                        backgroundSize: updateSpeedSliderBackground(carouselSpeed, 0.5, 10),
                        backgroundPosition: '0% 0%',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
                        transition: 'background-size 0.2s ease-out'
                      }}
                    />
                    <div className="w-16 text-center relative">
                      <span className={`text-white font-bold text-lg transition-colors duration-300 ${
                        speedAnimation ? 'animate-pulse' : ''
                      }`}>{carouselSpeed}s</span>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 mt-1">Tempo entre cada mudança de tela (0.5s a 10s)</p>
                </div>
              </div>

              {/* Distribuição */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Distribuição dos Andares</h3>
                {dataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-3 text-white/70">Carregando dados...</span>
                  </div>
                ) : salasPorAndar && salasPorAndar.length > 0 ? (
                  <>
                    <div className={`grid gap-3 ${
                      screenCount === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
                      screenCount === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
                      screenCount === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' :
                      screenCount === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto' :
                      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                    }`}>
                      {getDistribution().map((item) => (
                        <div key={item.tela} className={`rounded-lg p-3 border ${
                          item.total > 0 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`text-xs font-medium ${
                              item.total > 0 ? 'text-white' : 'text-red-400'
                            }`}>
                              Monitor {item.tela}
                            </h4>
                            <span className={`text-xs ${
                              item.total > 0 ? 'text-white/60' : 'text-red-400/70'
                            }`}>
                              {item.total}
                            </span>
                          </div>
                          {item.total > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.andares.map((andar) => (
                                <div
                                  key={andar.id}
                                  className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30 flex-shrink-0"
                                  title={andar.nome_identificador || `${andar.numero_andar}º Andar`}
                                >
                                  {andar.nome_identificador || `${andar.numero_andar}º`}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-red-400/70 text-xs">
                              ⚠️ Sem andares
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs text-white/60">
                        Total: {salasPorAndar.length} andares distribuídos em {screenCount} monitor(es)
                      </p>
                      {!isScreenCountValid && (
                        <p className="text-xs text-red-400 mt-1">
                          ⚠️ Alguns monitores ficarão sem andares. Reduza o número de monitores.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-white/50 text-sm">Nenhum andar encontrado</div>
                    <p className="text-white/40 text-xs mt-1">Adicione andares no sistema para ver a distribuição</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cores do Display */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Droplets className="h-5 w-5 mr-2"/> 
              Cores do Display
            </h2>
            <button
              onClick={() => {
                setSalaDisponivelCor('#10b981');
                setSalaOcupadaCor('#3b82f6');
                setAndarAccentCor('#3b82f6');
                setBackgroundPrimario('#000000');
                setParticulaPrimaria('#00fff7');
                setParticulaSecundaria('#00eaff');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4"/>
              Resetar Cores
            </button>
          </div>
          
          {/* Preview dos Cards */}
          <div className="mb-8 p-6 bg-black/20 rounded-xl border border-white/10">
            <h3 className="text-lg font-medium text-white mb-4">Preview das Cores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview Sala Disponível */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-emerald-300">Sala Disponível</h4>
                <div className="relative h-12 bg-black/40 rounded-lg border border-white/20 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-10" style={{ background: `linear-gradient(180deg, ${salaDisponivelCor} 0%, ${salaDisponivelCor}80 50%, ${salaDisponivelCor} 100%)` }}></div>
                  <div className="ml-10 h-full flex items-center px-4" style={{ background: `linear-gradient(90deg, ${salaDisponivelCor}15 0%, ${salaDisponivelCor}08 100%)` }}>
                    <span className="text-sm font-mono" style={{ color: salaDisponivelCor }}>Sala Disponível</span>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${salaDisponivelCor}95 0%, ${salaDisponivelCor} 100%)` }}>
                    <span className="text-sm font-bold text-white">101</span>
                  </div>
                </div>
              </div>
              
              {/* Preview Sala Ocupada */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-blue-300">Sala Ocupada</h4>
                <div className="relative h-12 bg-black/40 rounded-lg border border-white/20 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-10" style={{ background: `linear-gradient(180deg, ${salaOcupadaCor} 0%, ${salaOcupadaCor}80 50%, ${salaOcupadaCor} 100%)` }}></div>
                  <div className="ml-10 h-full flex items-center px-4" style={{ background: `linear-gradient(90deg, ${salaOcupadaCor}15 0%, ${salaOcupadaCor}08 100%)` }}>
                    <span className="text-sm font-mono" style={{ color: salaOcupadaCor }}>João Silva</span>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${salaOcupadaCor}95 0%, ${salaOcupadaCor} 100%)` }}>
                    <span className="text-sm font-bold text-white">102</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* === NOVA SEÇÃO DE CORES DO DISPLAY === */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Droplets className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Cores do Display</h3>
              </div>
              <button
                onClick={resetToDefaultColors}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white/80 hover:text-white transition-all duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                Resetar Cores
              </button>
            </div>

            {/* Preview das Cores */}
            <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Preview das Cores
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preview Sala Disponível */}
                <div className="relative">
                  <div 
                    className="p-4 rounded-lg border-2 transition-all duration-300"
                      style={{ 
                      backgroundColor: `${salaDisponivelCor}15`,
                      borderColor: `${salaDisponivelCor}40`,
                      boxShadow: `0 0 20px ${salaDisponivelCor}20`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: salaDisponivelCor }}
                        />
                        <span 
                          className="font-medium"
                          style={{ color: salaDisponivelCor }}
                        >
                          Sala Disponível
                        </span>
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-sm font-mono"
                        style={{ 
                          backgroundColor: `${salaDisponivelCor}20`,
                          color: salaDisponivelCor
                        }}
                      >
                        101
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Sala Ocupada */}
                <div className="relative">
                  <div 
                    className="p-4 rounded-lg border-2 transition-all duration-300"
                      style={{ 
                      backgroundColor: `${salaOcupadaCor}15`,
                      borderColor: `${salaOcupadaCor}40`,
                      boxShadow: `0 0 20px ${salaOcupadaCor}20`
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: salaOcupadaCor }}
                        />
                        <span 
                          className="font-medium"
                          style={{ color: salaOcupadaCor }}
                        >
                          João Silva
                        </span>
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-sm font-mono"
                        style={{ 
                          backgroundColor: `${salaOcupadaCor}20`,
                          color: salaOcupadaCor
                        }}
                      >
                        102
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Configurações de Cores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Cores das Salas */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-white mb-4">Cores das Salas</h4>
                
                {/* Sala Disponível */}
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: salaDisponivelCor }}
                    />
                    <h5 className="font-medium text-emerald-300">Salas Disponíveis</h5>
                  </div>
                  
                  <div className="space-y-4">
                <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Cor Principal
                      </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                          value={salaDisponivelCor}
                          onChange={(e) => setSalaDisponivelCor(e.target.value)}
                          className="h-12 w-12 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer hover:border-white/40 transition-colors"
                    />
                    <input
                      type="text"
                          value={salaDisponivelCor}
                          onChange={(e) => setSalaDisponivelCor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                      placeholder="#10b981"
                    />
                  </div>
                      <p className="text-xs text-white/60 mt-2">
                        Usada em bordas, textos e efeitos visuais das salas disponíveis
                      </p>
                  </div>
                </div>
              </div>
            
              {/* Sala Ocupada */}
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: salaOcupadaCor }}
                    />
                    <h5 className="font-medium text-blue-300">Salas Ocupadas</h5>
                  </div>
                  
                  <div className="space-y-4">
                <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Cor Principal
                      </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                          value={salaOcupadaCor}
                          onChange={(e) => setSalaOcupadaCor(e.target.value)}
                          className="h-12 w-12 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer hover:border-white/40 transition-colors"
                    />
                    <input
                      type="text"
                          value={salaOcupadaCor}
                          onChange={(e) => setSalaOcupadaCor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                          placeholder="#3b82f6"
                    />
                  </div>
                      <p className="text-xs text-white/60 mt-2">
                        Usada em bordas, textos e efeitos visuais das salas ocupadas
                      </p>
                  </div>
                </div>
              </div>
            </div>

              {/* Cores do Sistema */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-white mb-4">Cores do Sistema</h4>
                
                {/* Andar Accent */}
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: andarAccentCor }}
                    />
                    <h5 className="font-medium text-white">Cards de Andar</h5>
                  </div>
                  
                  <div className="space-y-4">
                <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Cor de Destaque
                      </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                          value={andarAccentCor}
                          onChange={(e) => setAndarAccentCor(e.target.value)}
                          className="h-12 w-12 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer hover:border-white/40 transition-colors"
                    />
                    <input
                      type="text"
                          value={andarAccentCor}
                          onChange={(e) => setAndarAccentCor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                          placeholder="#3b82f6"
                    />
                  </div>
                      <p className="text-xs text-white/60 mt-2">
                        Cor principal dos cards de andar e divisores
                      </p>
                  </div>
                </div>
              </div>

              {/* Background */}
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: backgroundPrimario }}
                    />
                    <h5 className="font-medium text-white">Fundo do Display</h5>
                  </div>
                  
                  <div className="space-y-4">
                <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Cor de Fundo
                      </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                          value={backgroundPrimario}
                          onChange={(e) => setBackgroundPrimario(e.target.value)}
                          className="h-12 w-12 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer hover:border-white/40 transition-colors"
                    />
                    <input
                      type="text"
                          value={backgroundPrimario}
                          onChange={(e) => setBackgroundPrimario(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                          placeholder="#000000"
                    />
                  </div>
                      <p className="text-xs text-white/60 mt-2">
                        Cor de fundo principal do display
                      </p>
                  </div>
                </div>
              </div>

              {/* Partículas */}
                <div className="p-5 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: particulaPrimaria }}
                      />
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: particulaSecundaria }}
                      />
                    </div>
                    <h5 className="font-medium text-white">Efeitos e Partículas</h5>
          </div>

                  <div className="grid grid-cols-1 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Partícula Primária
                      </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                          value={particulaPrimaria}
                          onChange={(e) => setParticulaPrimaria(e.target.value)}
                      className="h-10 w-10 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer hover:border-white/40 transition-colors"
                  />
                    <input
                      type="text"
                          value={particulaPrimaria}
                          onChange={(e) => setParticulaPrimaria(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                          placeholder="#00fff7"
                    />
                  </div>
                  </div>
                    
                  <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        Partícula Secundária
                      </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                          value={particulaSecundaria}
                          onChange={(e) => setParticulaSecundaria(e.target.value)}
                      className="h-10 w-10 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer hover:border-white/40 transition-colors"
                  />
                  <input
                    type="text"
                          value={particulaSecundaria}
                          onChange={(e) => setParticulaSecundaria(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                          placeholder="#00eaff"
                  />
                  </div>
                </div>
                  </div>
                  <p className="text-xs text-white/60 mt-2">
                    Cores dos efeitos visuais e animações de fundo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuração da Logo */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Logo da Empresa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna: Controles */}
            <div className="space-y-6">
              {/* Mostrar/Ocultar Logo (movido para cima) */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLogo}
                    onChange={(e) => setShowLogo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white/80">Exibir logo da empresa no display</span>
                </label>
                <p className="text-xs text-white/60 mt-2">
                  A logo ficará posicionada no topo do display público.
                </p>
              </div>

              {/* Gerenciador de Logo */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <label className="block text-sm text-white/80 mb-3">Logo da Empresa</label>
                <div className="flex items-center gap-4">
                  <LogoManager showButton={true} />
                  <div className="flex-1 min-w-0">
                    <span className="text-white/60 text-sm block truncate">
                      {logoUrl ? 'Logo configurada' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna: Preview */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Preview da Logo</h3>
              <div className="relative bg-black/50 rounded-xl p-6 border border-white/10 flex items-center justify-center min-h-[140px]">
                {!showLogo && (
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/10 border border-white/20 text-white/70">
                    Oculta
                  </span>
                )}
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Preview da logo"
                    width={420}
                    height={120}
                    className={`max-w-[260px] sm:max-w-[320px] md:max-w-[360px] max-h-20 object-contain ${showLogo ? '' : 'opacity-40'}`}
                  />
                ) : (
                  <div className={`inline-flex flex-col items-center justify-center bg-white/5 border border-white/15 rounded-lg px-6 py-8 ${showLogo ? '' : 'opacity-40'}`}>
                    <div className="text-white/60 text-sm">Logo da Empresa</div>
                    <div className="text-white/40 text-xs mt-1">Tamanho automático</div>
                  </div>
                )}
              </div>
              <p className="text-xs text-white/50 mt-3">
                A imagem será redimensionada automaticamente para caber com qualidade no cabeçalho do display.
              </p>
            </div>
          </div>
        </div>

        
        {/* Botões flutuantes para ações rápidas */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          {/* Botão Salvar */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full p-4 bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group relative"
            title="Salvar configuração"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
            ) : saved ? (
              <Check className="h-5 w-5 text-blue-300" />
            ) : (
              <Save className="h-5 w-5 text-blue-300" />
            )}
            {/* Tooltip */}
            <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {isSaving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
            </div>
          </button>
          
          {/* Botão Abrir Display */}
          <Link
            href={getDisplayUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 hover:text-emerald-100 hover:bg-emerald-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all flex items-center justify-center group relative"
            title="Abrir display"
          >
            <Eye className="h-5 w-5 text-emerald-300" />
            {/* Tooltip */}
            <div className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Abrir Display
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DisplaySetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    }>
      <DisplaySetupContent />
    </Suspense>
  );
}