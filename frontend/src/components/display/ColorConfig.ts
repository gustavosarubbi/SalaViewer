/**
 * Sistema de Cores Padrão do Display E-Salas
 * Baseado nas cores atuais dos componentes de display
 * Refatorado do zero para usar as cores identificadas nos componentes
 */

// Cores base do sistema extraídas dos componentes atuais
export const DISPLAY_COLORS = {
  // Cores principais para salas (extraídas dos componentes)
  SALA_DISPONIVEL: '#10b981',      // Verde esmeralda
  SALA_OCUPADA: '#3b82f6',         // Azul royal
  
  // Cores para andares (extraídas do CarouselFloorCard)
  ANDAR_ACCENT: '#3b82f6',         // Azul royal (padrão dos andares)
  
  // Cores de texto
  TEXTO_BRANCO: '#ffffff',
  TEXTO_DISPONIVEL: '#10b981',
  TEXTO_OCUPADA: '#3b82f6',
  
  // Cores de fundo
  FUNDO_PRETO: '#000000',
  FUNDO_TRANSPARENTE: 'transparent',
  
  // Partículas e efeitos (mantidas do sistema atual)
  PARTICULA_CYAN: '#00fff7',
  PARTICULA_AZUL: '#00eaff',
  PARTICULA_AZUL_CLARO: '#00b4ff',
  PARTICULA_VERDE_CYAN: '#00ffc8',
} as const;

// Interface para configuração de cores do display
export interface DisplayColorConfig {
  // === CORES DOS CARDS DE SALA ===
  sala: {
    disponivel: {
      texto: string;
      fundo: string;
      borda: string;
      divisao: string;
      brilho: string;
      sombra: string;
    };
    ocupada: {
      texto: string;
      fundo: string;
      borda: string;
      divisao: string;
      brilho: string;
      sombra: string;
    };
  };
  
  // === CORES DOS CARDS DE ANDAR ===
  andar: {
    texto: string;
    fundo: string;
    borda: string;
    divisao: string;
    accent: string;
    brilho: string;
    sombra: string;
  };
  
  // === CORES DO BACKGROUND ===
  background: {
    primario: string;
    secundario: string;
    grid: string;
    radial: string;
  };
  
  // === CORES DAS PARTÍCULAS ===
  particulas: {
    primaria: string;
    secundaria: string;
    terciaria: string;
    quaternaria: string;
    brilho: string;
    conexoes: string;
  };
}

// Configuração padrão baseada nas cores atuais do display
export const DEFAULT_DISPLAY_COLORS: DisplayColorConfig = {
  // === CORES DOS CARDS DE SALA ===
  sala: {
    disponivel: {
      texto: DISPLAY_COLORS.SALA_DISPONIVEL,
      fundo: 'linear-gradient(135deg, rgba(16, 185, 129, 0.42) 0%, rgba(52, 211, 153, 0.48) 50%, rgba(16, 185, 129, 0.42) 100%)',
      borda: 'rgba(52, 211, 153, 0.4)',
      divisao: 'linear-gradient(180deg, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 1) 50%, rgba(52, 211, 153, 1) 100%)',
      brilho: 'rgba(16, 185, 129, 0.7)',
      sombra: 'rgba(16, 185, 129, 0.7)',
    },
    ocupada: {
      texto: DISPLAY_COLORS.SALA_OCUPADA,
      fundo: 'linear-gradient(135deg, rgba(37, 99, 235, 0.42) 0%, rgba(59, 130, 246, 0.48) 50%, rgba(37, 99, 235, 0.42) 100%)',
      borda: 'rgba(59, 130, 246, 0.4)',
      divisao: 'linear-gradient(180deg, rgba(59, 130, 246, 1) 0%, rgba(37, 99, 235, 1) 50%, rgba(59, 130, 246, 1) 100%)',
      brilho: 'rgba(37, 99, 235, 0.7)',
      sombra: 'rgba(37, 99, 235, 0.7)',
    },
  },
  
  // === CORES DOS CARDS DE ANDAR ===
  andar: {
    texto: DISPLAY_COLORS.TEXTO_BRANCO,
    fundo: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.7) 50%, rgba(59, 130, 246, 0.5) 100%)',
    borda: `${DISPLAY_COLORS.ANDAR_ACCENT}80`,
    divisao: DISPLAY_COLORS.ANDAR_ACCENT,
    accent: DISPLAY_COLORS.ANDAR_ACCENT,
    brilho: `${DISPLAY_COLORS.ANDAR_ACCENT}40`,
    sombra: `${DISPLAY_COLORS.ANDAR_ACCENT}40`,
  },
  
  // === CORES DO BACKGROUND ===
  background: {
    primario: DISPLAY_COLORS.FUNDO_PRETO,
    secundario: 'rgba(255, 255, 255, 0.06)',
    grid: 'rgba(255, 255, 255, 0.08)',
    radial: 'rgba(255, 255, 255, 0.06)',
  },
  
  // === CORES DAS PARTÍCULAS ===
  particulas: {
    primaria: 'rgba(0, 255, 255, 0.85)',
    secundaria: 'rgba(0, 180, 255, 0.7)',
    terciaria: 'rgba(0, 120, 255, 0.6)',
    quaternaria: 'rgba(0, 255, 200, 0.7)',
    brilho: DISPLAY_COLORS.PARTICULA_CYAN,
    conexoes: DISPLAY_COLORS.PARTICULA_AZUL,
  },
};

/**
 * Gerenciador de configuração de cores do display
 * Singleton para gerenciar as cores de forma centralizada
 */
export class DisplayColorManager {
  private static instance: DisplayColorManager;
  private config: DisplayColorConfig;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): DisplayColorManager {
    if (!DisplayColorManager.instance) {
      DisplayColorManager.instance = new DisplayColorManager();
    }
    return DisplayColorManager.instance;
  }

  private loadConfig(): DisplayColorConfig {
    if (typeof window === 'undefined') {
      return DEFAULT_DISPLAY_COLORS;
    }

    try {
      const savedConfig = localStorage.getItem('display-colors-config');
      if (savedConfig) {
        return { ...DEFAULT_DISPLAY_COLORS, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração de cores:', error);
    }

    return DEFAULT_DISPLAY_COLORS;
  }

  public getConfig(): DisplayColorConfig {
    return this.config;
  }

  public updateConfig(updates: Partial<DisplayColorConfig>): void {
    this.config = this.mergeDeep(this.config, updates);
    this.clearCache();
    this.saveConfig();
    this.notifyListeners();
  }

  private mergeDeep(target: any, source: any): any {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  private saveConfig(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('display-colors-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Erro ao salvar configuração de cores:', error);
    }
  }

  public resetToDefault(): void {
    this.config = JSON.parse(JSON.stringify(DEFAULT_DISPLAY_COLORS));
    this.clearCache();
    this.saveConfig();
    this.notifyListeners();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  private clearCache(): void {
    this._cardColorsCache.clear();
    this._floorColorsCache = null;
    this._backgroundColorsCache = null;
    this._particleColorsCache = null;
  }

  // Cache para otimização de performance
  private _cardColorsCache = new Map<boolean, any>();
  private _floorColorsCache: any = null;
  private _backgroundColorsCache: any = null;
  private _particleColorsCache: any = null;

  public getSalaColors(isOcupada: boolean) {
    if (!this._cardColorsCache.has(isOcupada)) {
      const colors = isOcupada ? this.config.sala.ocupada : this.config.sala.disponivel;
      this._cardColorsCache.set(isOcupada, colors);
    }
    return this._cardColorsCache.get(isOcupada);
  }

  public getAndarColors() {
    if (!this._floorColorsCache) {
      this._floorColorsCache = this.config.andar;
    }
    return this._floorColorsCache;
  }

  public getBackgroundColors() {
    if (!this._backgroundColorsCache) {
      this._backgroundColorsCache = this.config.background;
    }
    return this._backgroundColorsCache;
  }

  public getParticleColors() {
    if (!this._particleColorsCache) {
      this._particleColorsCache = this.config.particulas;
    }
    return this._particleColorsCache;
  }
}

// === HOOKS PARA USO NOS COMPONENTES ===

/**
 * Hook principal para acessar todas as cores do display
 */
export function useDisplayColors() {
  const colorManager = DisplayColorManager.getInstance();
  return colorManager.getConfig();
}

/**
 * Hook para cores específicas de salas
 */
export function useSalaColors(isOcupada: boolean) {
  const colorManager = DisplayColorManager.getInstance();
  return colorManager.getSalaColors(isOcupada);
}

/**
 * Hook para cores de andares
 */
export function useAndarColors() {
  const colorManager = DisplayColorManager.getInstance();
  return colorManager.getAndarColors();
}

/**
 * Hook para cores de background
 */
export function useBackgroundColors() {
  const colorManager = DisplayColorManager.getInstance();
  return colorManager.getBackgroundColors();
}

/**
 * Hook para cores de partículas
 */
export function useParticleColors() {
  const colorManager = DisplayColorManager.getInstance();
  return colorManager.getParticleColors();
}

/**
 * Hook para gerenciar configurações de cores
 */
export function useColorManager() {
  const colorManager = DisplayColorManager.getInstance();
  
  return {
    config: colorManager.getConfig(),
    updateConfig: (updates: Partial<DisplayColorConfig>) => colorManager.updateConfig(updates),
    resetToDefault: () => colorManager.resetToDefault(),
    subscribe: (listener: () => void) => colorManager.subscribe(listener),
  };
}

// === UTILITÁRIOS ===

/**
 * Converte uma cor hex para rgba
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Gera variações de uma cor base
 */
export function generateColorVariations(baseColor: string) {
  return {
    base: baseColor,
    light: hexToRgba(baseColor, 0.7),
    lighter: hexToRgba(baseColor, 0.5),
    lightest: hexToRgba(baseColor, 0.3),
    dark: hexToRgba(baseColor, 0.9),
    darker: hexToRgba(baseColor, 0.8),
  };
}