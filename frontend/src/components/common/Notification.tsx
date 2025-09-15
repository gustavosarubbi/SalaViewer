'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

const notificationStyles = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    iconBg: 'bg-green-500/10',
    title: 'text-green-400',
    message: 'text-green-300'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    iconBg: 'bg-red-500/10',
    title: 'text-red-400',
    message: 'text-red-300'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
    title: 'text-yellow-400',
    message: 'text-yellow-300'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    title: 'text-blue-400',
    message: 'text-blue-300'
  }
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

export default function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[type];
  const styles = notificationStyles[type];

  useEffect(() => {
    // Mostrar notificação
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fechar após duração
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aguardar animação
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed top-4 right-4 z-[10000] transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${styles.bg} ${styles.border} border rounded-lg p-4 shadow-lg backdrop-blur-sm max-w-sm`}>
        <div className="flex items-start space-x-3">
          <div className={`${styles.iconBg} rounded-full p-1`}>
            <Icon className={`h-5 w-5 ${styles.icon}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${styles.title}`}>
              {title}
            </h4>
            {message && (
              <p className={`text-xs mt-1 ${styles.message}`}>
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
