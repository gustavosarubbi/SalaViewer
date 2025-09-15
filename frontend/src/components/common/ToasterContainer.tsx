'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Toaster from './Toaster';

interface ToasterData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToasterContainerProps {
  toasters: ToasterData[];
  onRemove: (id: string) => void;
}

export default function ToasterContainer({ toasters, onRemove }: ToasterContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Renderizar diretamente no body para ficar sempre no canto superior direito
  return createPortal(
    <div 
      className="fixed top-4 right-4 z-[10000] space-y-2 pointer-events-none"
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 10000,
        pointerEvents: 'none'
      }}
    >
      {toasters.map((toaster, index) => (
        <div
          key={toaster.id}
          className="transform transition-all duration-300 ease-out pointer-events-auto"
          style={{
            transform: `translateY(${index * 8}px)`,
            zIndex: 10000 - index
          }}
        >
          <Toaster
            type={toaster.type}
            title={toaster.title}
            description={toaster.description}
            duration={toaster.duration}
            onClose={() => onRemove(toaster.id)}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}
