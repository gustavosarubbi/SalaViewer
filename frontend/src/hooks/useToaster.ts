import { useState, useCallback } from 'react';
import { ToasterType } from '@/components/common/Toaster';

interface ToasterData {
  id: string;
  type: ToasterType;
  title: string;
  description?: string;
  duration?: number;
}

export function useToaster() {
  const [toasters, setToasters] = useState<ToasterData[]>([]);

  const addToaster = useCallback((
    type: ToasterType,
    title: string,
    description?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toaster: ToasterData = {
      id,
      type,
      title,
      description,
      duration
    };

    setToasters(prev => [...prev, toaster]);
  }, []);

  const removeToaster = useCallback((id: string) => {
    setToasters(prev => prev.filter(toaster => toaster.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, description?: string, duration?: number) => {
    addToaster('success', title, description, duration);
  }, [addToaster]);

  const showError = useCallback((title: string, description?: string, duration?: number) => {
    addToaster('error', title, description, duration);
  }, [addToaster]);

  const showWarning = useCallback((title: string, description?: string, duration?: number) => {
    addToaster('warning', title, description, duration);
  }, [addToaster]);

  const showInfo = useCallback((title: string, description?: string, duration?: number) => {
    addToaster('info', title, description, duration);
  }, [addToaster]);

  return {
    toasters,
    addToaster,
    removeToaster,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}
