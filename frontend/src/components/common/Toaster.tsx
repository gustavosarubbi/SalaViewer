'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToasterType = 'success' | 'error' | 'warning' | 'info';

interface ToasterProps {
  type: ToasterType;
  title: string;
  description?: string;
  duration?: number;
  onClose: () => void;
}

const toasterStyles = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-400',
    iconBg: 'bg-green-500/20',
    title: 'text-green-100',
    description: 'text-green-200/80',
    accent: 'bg-green-500'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-400',
    iconBg: 'bg-red-500/20',
    title: 'text-red-100',
    description: 'text-red-200/80',
    accent: 'bg-red-500'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20',
    title: 'text-yellow-100',
    description: 'text-yellow-200/80',
    accent: 'bg-yellow-500'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    title: 'text-blue-100',
    description: 'text-blue-200/80',
    accent: 'bg-blue-500'
  }
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

export default function Toaster({ 
  type, 
  title, 
  description, 
  duration = 1000, 
  onClose 
}: ToasterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = icons[type];
  const styles = toasterStyles[type];

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // Mostrar toaster com delay
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    
    // Auto-fechar após duração
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, handleClose]);

  return (
    <div className={`transform transition-all duration-300 ease-out ${
      isVisible && !isLeaving 
        ? 'translate-x-0 opacity-100 scale-100' 
        : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`
        ${styles.bg} ${styles.border} 
        border rounded-lg p-3 shadow-lg backdrop-blur-xl
        max-w-xs min-w-72
        relative overflow-hidden
        ${isLeaving ? 'animate-pulse' : ''}
      `}>
        {/* Barra de progresso */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-black/20">
          <div 
            className={`h-full ${styles.accent} transition-all ease-linear`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className={`${styles.iconBg} rounded-full p-1.5 flex-shrink-0`}>
            <Icon className={`h-4 w-4 ${styles.icon}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${styles.title} mb-0.5`}>
              {title}
            </h4>
            {description && (
              <p className={`text-xs ${styles.description} leading-tight`}>
                {description}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-0.5 rounded-full hover:bg-white/10 flex-shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
