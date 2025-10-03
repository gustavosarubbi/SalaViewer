'use client';

import { useState, useEffect } from 'react';
import { Monitor, List } from 'lucide-react';

type DisplayMode = 'lista' | 'carrossel';

export default function DisplayModeToggle() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('lista');

  useEffect(() => {
    // Carregar modo salvo do localStorage
    const savedMode = localStorage.getItem('display-mode');
    if (savedMode === 'carrossel' || savedMode === 'lista') {
      setDisplayMode(savedMode);
    }
  }, []);

  const handleModeChange = (mode: DisplayMode) => {
    setDisplayMode(mode);
    localStorage.setItem('display-mode', mode);
    
    // Disparar evento customizado para atualizar displays em tempo real
    window.dispatchEvent(new CustomEvent('display-mode-changed', { 
      detail: { mode } 
    }));
  };

  return (
    <div className="border-t border-white/10 pt-4 mt-4">
      <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
        Modo de Display
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => handleModeChange('lista')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            displayMode === 'lista'
              ? 'text-blue-200 bg-blue-500/15 border border-blue-500/30 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40'
              : 'text-white/70 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20'
          }`}
        >
          <List className="h-4 w-4" />
          Lista
        </button>
        
        <button
          onClick={() => handleModeChange('carrossel')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
            displayMode === 'carrossel'
              ? 'text-green-200 bg-green-500/15 border border-green-500/30 hover:text-green-100 hover:bg-green-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-400/40'
              : 'text-white/70 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20'
          }`}
        >
          <Monitor className="h-4 w-4" />
          Carrossel
        </button>
      </div>
    </div>
  );
}
