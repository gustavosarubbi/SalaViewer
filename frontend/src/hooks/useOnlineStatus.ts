import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkOnline = () => setIsOnline(navigator.onLine);
    
    // Verificar status inicial
    checkOnline();
    
    // Adicionar listeners
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);
    
    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);

  return isOnline;
}

