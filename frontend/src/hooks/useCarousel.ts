import { useState, useEffect, useCallback } from 'react';
import { getScreenItems as getBalancedScreenItems } from '@/utils/distribution';

interface UseCarouselProps {
  totalItems: number;
  screenCount: number;
  isEnabled: boolean;
  autoRotateInterval?: number; // em milissegundos
}

export function useCarousel({ 
  totalItems, 
  screenCount, 
  isEnabled, 
  autoRotateInterval = 10000 
}: UseCarouselProps) {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [itemsPerScreen, setItemsPerScreen] = useState(0);

  // Calcular quantos itens por tela usando distribuição equilibrada
  useEffect(() => {
    if (isEnabled && screenCount > 0) {
      // Para a primeira tela, calcular quantos itens ela terá
      const firstScreenItems = getBalancedScreenItems(
        Array(totalItems).fill(null), 
        screenCount, 
        1
      ).length;
      setItemsPerScreen(firstScreenItems);
    } else {
      setItemsPerScreen(totalItems);
    }
  }, [totalItems, screenCount, isEnabled]);

  // Função para obter os itens da tela atual
  const getCurrentScreenItems = useCallback((allItems: unknown[]): unknown[] => {
    if (!isEnabled || screenCount <= 1) {
      return allItems;
    }

    return getBalancedScreenItems(allItems, screenCount, currentScreen);
  }, [currentScreen, isEnabled, screenCount]);

  // Função para obter os itens de uma tela específica (para animações)
  const getScreenItems = useCallback((screen: number, allItems: unknown[]): unknown[] => {
    if (!isEnabled || screenCount <= 1) {
      return allItems;
    }

    return getBalancedScreenItems(allItems, screenCount, screen);
  }, [isEnabled, screenCount]);

  // Função para ir para a próxima tela
  const nextScreen = useCallback(() => {
    if (!isEnabled || screenCount <= 1) return;
    
    setCurrentScreen(prev => {
      const next = prev + 1;
      return next > screenCount ? 1 : next;
    });
  }, [isEnabled, screenCount]);

  // Função para ir para a tela anterior
  const prevScreen = useCallback(() => {
    if (!isEnabled || screenCount <= 1) return;
    
    setCurrentScreen(prev => {
      const prevScreen = prev - 1;
      return prevScreen < 1 ? screenCount : prevScreen;
    });
  }, [isEnabled, screenCount]);

  // Função para ir para uma tela específica
  const goToScreen = useCallback((screen: number) => {
    if (!isEnabled || screenCount <= 1) return;
    
    const targetScreen = Math.max(1, Math.min(screen, screenCount));
    setCurrentScreen(targetScreen);
  }, [isEnabled, screenCount]);

  // Função para iniciar o carrossel
  const startCarousel = useCallback(() => {
    if (isEnabled && screenCount >= 1) {
      setIsRunning(true);
    }
  }, [isEnabled, screenCount]);

  // Função para parar o carrossel
  const stopCarousel = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Função para resetar o carrossel
  const resetCarousel = useCallback(() => {
    setCurrentScreen(1);
    setIsRunning(false);
  }, []);

  // Auto-rotação
  useEffect(() => {
    if (isRunning && isEnabled && screenCount >= 1) {
      const interval = setInterval(nextScreen, autoRotateInterval);
      return () => clearInterval(interval);
    }
  }, [isRunning, isEnabled, screenCount, nextScreen, autoRotateInterval]);

  // Reset quando desabilitar
  useEffect(() => {
    if (!isEnabled) {
      setCurrentScreen(1);
      setIsRunning(false);
    }
  }, [isEnabled]);

  return {
    currentScreen,
    totalScreens: screenCount,
    isRunning,
    itemsPerScreen,
    getCurrentScreenItems,
    getScreenItems,
    nextScreen,
    prevScreen,
    goToScreen,
    startCarousel,
    stopCarousel,
    resetCarousel
  };
}
