export interface RoomCardProps {
  sala: {
    id: number;
    numero_sala: string;
    nome_ocupante: string | null;
    andarId: number;
    andar: {
      id: number;
      numero_andar: number;
      nome_identificador?: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export interface FloorSectionProps {
  andar: {
    id: number;
    numero_andar: number;
    nome_identificador?: string;
  };
  salas: Array<{
    id: number;
    numero_sala: string;
    nome_ocupante: string | null;
    andarId: number;
    andar: {
      id: number;
      numero_andar: number;
      nome_identificador?: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface ModernBackgroundProps {
  children: React.ReactNode;
}

export interface LoadingScreenProps {
  children?: React.ReactNode;
}

export interface DisplayHeaderProps {
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
