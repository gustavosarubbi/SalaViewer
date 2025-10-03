/**
 * Exportações principais do sistema de display
 * Facilita o uso dos componentes e hooks
 */

// === COMPONENTES ===
export { CarouselFloorCard } from './CarouselFloorCard';
export { CarouselRoomCard } from './CarouselRoomCard';
export { ModernRoomCard } from './ModernRoomCard';
export { DisplayBackground } from './DisplayBackground';
export { ModernFloorSection } from './ModernFloorSection';
export { LoadingScreen } from './LoadingScreen';
export { ModernBackground } from './ModernBackground';
export { AnimatedCarousel } from './AnimatedCarousel';
export { MonitorSelectCard } from './MonitorSelectCard';

// === SISTEMA DE CORES ===
export {
  DisplayColorManager,
  DEFAULT_DISPLAY_COLORS,
  DISPLAY_COLORS,
  hexToRgba,
  generateColorVariations,
} from './ColorConfig';

export type { DisplayColorConfig } from './ColorConfig';

// === HOOKS DE CORES ===
export {
  useDisplayColors,
  useSalaColors,
  useAndarColors,
  useBackgroundColors,
  useParticleColors,
  useColorManager,
} from './ColorConfig';

export {
  useReactiveDisplayColors,
  useSalaColorsWithFallback,
  useAndarColorsWithFallback,
  useColorVariations,
  useDisplayTheme,
  useDisplayCSSColors,
  useDisplayAnimationColors,
} from './hooks/useDisplayColors';

// === HOOKS DE DADOS ===
export { useDisplayData } from '../../hooks/useDisplayData';

// === TIPOS ===
export type { RoomCardProps } from './types';