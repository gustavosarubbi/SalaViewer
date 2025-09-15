'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export default function ModalPortal({ children, isOpen }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);
  
  // Usar o hook personalizado para gerenciar o scroll
  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) {
    return null;
  }

  // Renderizar diretamente no body para evitar problemas de z-index
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>,
    document.body
  );
}
