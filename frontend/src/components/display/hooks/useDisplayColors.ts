/**
 * Hooks especializados para cores do display
 * Facilitam o uso das cores nos componentes
 */

import { useState, useEffect } from 'react';
import { 
  DisplayColorManager, 
  DisplayColorConfig,
  DISPLAY_COLORS,
  hexToRgba 
} from '../ColorConfig';

/**
 * Hook reativo para cores do display
 * Atualiza automaticamente quando as cores mudam
 */
export function useReactiveDisplayColors() {
  const [config, setConfig] = useState<DisplayColorConfig>(() => 
    DisplayColorManager.getInstance().getConfig()
  );

  useEffect(() => {
    const colorManager = DisplayColorManager.getInstance();
    const unsubscribe = colorManager.subscribe(() => {
      setConfig(colorManager.getConfig());
    });

    return unsubscribe;
  }, []);

  return config;
}

/**
 * Hook para cores de sala com fallback para localStorage (compatibilidade)
 */
export function useSalaColorsWithFallback(isOcupada: boolean) {
  const colorManager = DisplayColorManager.getInstance();
  const salaColors = colorManager.getSalaColors(isOcupada);

  // Fallback para o sistema antigo (localStorage direto)
  const fallbackColors = {
    texto: isOcupada 
      ? (typeof window !== 'undefined' && localStorage.getItem('display-text-color-occupied')) || DISPLAY_COLORS.SALA_OCUPADA
      : (typeof window !== 'undefined' && localStorage.getItem('display-text-color-available')) || DISPLAY_COLORS.SALA_DISPONIVEL,
  };

  return {
    ...salaColors,
    // Mantém compatibilidade com sistema antigo
    textColor: salaColors.texto || fallbackColors.texto,
  };
}

/**
 * Hook para cores de andar com fallback para localStorage (compatibilidade)
 */
export function useAndarColorsWithFallback() {
  const colorManager = DisplayColorManager.getInstance();
  const andarColors = colorManager.getAndarColors();

  // Fallback para o sistema antigo (localStorage direto)
  const fallbackAccentColor = (typeof window !== 'undefined' && localStorage.getItem('display-color-accent')) || DISPLAY_COLORS.ANDAR_ACCENT;

  return {
    ...andarColors,
    // Mantém compatibilidade com sistema antigo
    accentColor: andarColors.accent || fallbackAccentColor,
  };
}

/**
 * Hook para gerar variações de cores dinamicamente
 */
export function useColorVariations(baseColor: string) {
  return {
    base: baseColor,
    alpha10: hexToRgba(baseColor, 0.1),
    alpha20: hexToRgba(baseColor, 0.2),
    alpha30: hexToRgba(baseColor, 0.3),
    alpha40: hexToRgba(baseColor, 0.4),
    alpha50: hexToRgba(baseColor, 0.5),
    alpha60: hexToRgba(baseColor, 0.6),
    alpha70: hexToRgba(baseColor, 0.7),
    alpha80: hexToRgba(baseColor, 0.8),
    alpha90: hexToRgba(baseColor, 0.9),
  };
}

/**
 * Hook para cores de tema do display
 */
export function useDisplayTheme() {
  const colors = useReactiveDisplayColors();
  
  return {
    // Cores principais
    primary: {
      salaDisponivel: colors.sala.disponivel,
      salaOcupada: colors.sala.ocupada,
      andar: colors.andar,
    },
    
    // Cores de fundo
    background: colors.background,
    
    // Cores de efeitos
    effects: colors.particulas,
    
    // Utilitários
    isLight: colors.background.primario !== '#000000',
    isDark: colors.background.primario === '#000000',
  };
}

/**
 * Hook para cores CSS customizadas
 */
export function useDisplayCSSColors() {
  const colors = useReactiveDisplayColors();
  
  return {
    // CSS Custom Properties
    '--display-sala-disponivel': colors.sala.disponivel.texto,
    '--display-sala-ocupada': colors.sala.ocupada.texto,
    '--display-andar-accent': colors.andar.accent,
    '--display-background': colors.background.primario,
    '--display-text': colors.andar.texto,
    
    // Gradientes prontos
    '--display-sala-disponivel-bg': colors.sala.disponivel.fundo,
    '--display-sala-ocupada-bg': colors.sala.ocupada.fundo,
    '--display-andar-bg': colors.andar.fundo,
  };
}

/**
 * Hook para animações baseadas em cores
 */
export function useDisplayAnimationColors() {
  const colors = useReactiveDisplayColors();
  
  return {
    // Cores para animações de brilho
    glowColors: {
      salaDisponivel: colors.sala.disponivel.brilho,
      salaOcupada: colors.sala.ocupada.brilho,
      andar: colors.andar.brilho,
    },
    
    // Cores para sombras
    shadowColors: {
      salaDisponivel: colors.sala.disponivel.sombra,
      salaOcupada: colors.sala.ocupada.sombra,
      andar: colors.andar.sombra,
    },
    
    // Cores para partículas
    particleColors: [
      colors.particulas.primaria,
      colors.particulas.secundaria,
      colors.particulas.terciaria,
      colors.particulas.quaternaria,
    ],
  };
}
