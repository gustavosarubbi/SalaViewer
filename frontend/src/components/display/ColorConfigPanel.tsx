'use client';

import React, { useState, useEffect } from 'react';
import { ColorConfigManager, DisplayColorConfig, DEFAULT_COLOR_CONFIG } from './ColorConfig';

interface ColorConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColorConfigPanel({ isOpen, onClose }: ColorConfigPanelProps) {
  const [config, setConfig] = useState<DisplayColorConfig>(DEFAULT_COLOR_CONFIG);
  const [colorManager] = useState(() => ColorConfigManager.getInstance());

  useEffect(() => {
    if (isOpen) {
      setConfig(colorManager.getConfig());
    }
  }, [isOpen, colorManager]);

  const handleColorChange = (key: keyof DisplayColorConfig, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    colorManager.updateConfig({ [key]: value });
  };

  const handleReset = () => {
    setConfig(DEFAULT_COLOR_CONFIG);
    colorManager.resetToDefault();
  };

  const ColorInput = ({ 
    label, 
    value, 
    onChange, 
    description 
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    description?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/90">
        {label}
        {description && <span className="block text-xs text-white/60">{description}</span>}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-white/20 bg-white/10 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Configuração de Cores do Display</h2>
            <p className="text-white/60 mt-1">Personalize as cores dos componentes de display</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Cores dos Cards de Sala */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-lg">🏢</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Cards de Sala</h3>
              </div>
              
              <div className="space-y-4 pl-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white/80 mb-3">Sala Disponível</h4>
                    <div className="space-y-3">
                      <ColorInput
                        label="Texto"
                        value={config.cardTextAvailable}
                        onChange={(value) => handleColorChange('cardTextAvailable', value)}
                        description="Cor do texto quando a sala está disponível"
                      />
                      <ColorInput
                        label="Background"
                        value={config.cardBackgroundAvailable}
                        onChange={(value) => handleColorChange('cardBackgroundAvailable', value)}
                        description="Cor de fundo do card"
                      />
                      <ColorInput
                        label="Borda"
                        value={config.cardBorderAvailable}
                        onChange={(value) => handleColorChange('cardBorderAvailable', value)}
                        description="Cor da borda principal"
                      />
                      <ColorInput
                        label="Divisões"
                        value={config.cardDivisionAvailable}
                        onChange={(value) => handleColorChange('cardDivisionAvailable', value)}
                        description="Cor das divisões internas"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white/80 mb-3">Sala Ocupada</h4>
                    <div className="space-y-3">
                      <ColorInput
                        label="Texto"
                        value={config.cardTextOccupied}
                        onChange={(value) => handleColorChange('cardTextOccupied', value)}
                        description="Cor do texto quando a sala está ocupada"
                      />
                      <ColorInput
                        label="Background"
                        value={config.cardBackgroundOccupied}
                        onChange={(value) => handleColorChange('cardBackgroundOccupied', value)}
                        description="Cor de fundo do card"
                      />
                      <ColorInput
                        label="Borda"
                        value={config.cardBorderOccupied}
                        onChange={(value) => handleColorChange('cardBorderOccupied', value)}
                        description="Cor da borda principal"
                      />
                      <ColorInput
                        label="Divisões"
                        value={config.cardDivisionOccupied}
                        onChange={(value) => handleColorChange('cardDivisionOccupied', value)}
                        description="Cor das divisões internas"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cores dos Cards de Andar */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400 text-lg">🏗️</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Cards de Andar</h3>
              </div>
              
              <div className="space-y-4 pl-4">
                <ColorInput
                  label="Texto"
                  value={config.floorText}
                  onChange={(value) => handleColorChange('floorText', value)}
                  description="Cor do texto do título do andar"
                />
                <ColorInput
                  label="Background"
                  value={config.floorBackground}
                  onChange={(value) => handleColorChange('floorBackground', value)}
                  description="Cor de fundo do card de andar"
                />
                <ColorInput
                  label="Borda"
                  value={config.floorBorder}
                  onChange={(value) => handleColorChange('floorBorder', value)}
                  description="Cor da borda do card"
                />
                <ColorInput
                  label="Divisões"
                  value={config.floorDivision}
                  onChange={(value) => handleColorChange('floorDivision', value)}
                  description="Cor das linhas decorativas"
                />
                <ColorInput
                  label="Destaque"
                  value={config.floorAccent}
                  onChange={(value) => handleColorChange('floorAccent', value)}
                  description="Cor de destaque e efeitos especiais"
                />
              </div>
            </div>

            {/* Cores do Background */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">🌌</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Background</h3>
              </div>
              
              <div className="space-y-4 pl-4">
                <ColorInput
                  label="Cor Principal"
                  value={config.backgroundPrimary}
                  onChange={(value) => handleColorChange('backgroundPrimary', value)}
                  description="Cor de fundo principal"
                />
                <ColorInput
                  label="Cor Secundária"
                  value={config.backgroundSecondary}
                  onChange={(value) => handleColorChange('backgroundSecondary', value)}
                  description="Cor de fundo secundária"
                />
                <ColorInput
                  label="Grid"
                  value={config.backgroundGrid}
                  onChange={(value) => handleColorChange('backgroundGrid', value)}
                  description="Cor das linhas do grid"
                />
                <ColorInput
                  label="Gradiente Radial"
                  value={config.backgroundRadial}
                  onChange={(value) => handleColorChange('backgroundRadial', value)}
                  description="Cor do gradiente radial"
                />
              </div>
            </div>

            {/* Cores das Partículas */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-400 text-lg">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Partículas</h3>
              </div>
              
              <div className="space-y-4 pl-4">
                <ColorInput
                  label="Cor Primária"
                  value={config.particlePrimary}
                  onChange={(value) => handleColorChange('particlePrimary', value)}
                  description="Cor principal das partículas"
                />
                <ColorInput
                  label="Cor Secundária"
                  value={config.particleSecondary}
                  onChange={(value) => handleColorChange('particleSecondary', value)}
                  description="Cor secundária das partículas"
                />
                <ColorInput
                  label="Cor Terciária"
                  value={config.particleTertiary}
                  onChange={(value) => handleColorChange('particleTertiary', value)}
                  description="Cor terciária das partículas"
                />
                <ColorInput
                  label="Cor Quaternária"
                  value={config.particleQuaternary}
                  onChange={(value) => handleColorChange('particleQuaternary', value)}
                  description="Cor quaternária das partículas"
                />
                <ColorInput
                  label="Brilho"
                  value={config.particleGlow}
                  onChange={(value) => handleColorChange('particleGlow', value)}
                  description="Cor do brilho das partículas"
                />
                <ColorInput
                  label="Conexões"
                  value={config.particleConnections}
                  onChange={(value) => handleColorChange('particleConnections', value)}
                  description="Cor das linhas conectando partículas"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition-colors"
          >
            Resetar para Padrão
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            Aplicar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

