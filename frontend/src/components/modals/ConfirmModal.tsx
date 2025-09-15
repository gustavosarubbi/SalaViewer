'use client';

import { AlertTriangle, X } from 'lucide-react';
import { getModalClasses, getConfirmClasses, getIconClasses } from '@/styles/modal-styles';
import ModalPortal from '@/components/common/ModalPortal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm, 
  onCancel, 
  isLoading = false,
  variant = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  // Usar o sistema modular de estilos
  const theme = 'dark'; // Baseado no design do projeto
  const modalClasses = getModalClasses(theme);
  const confirmClasses = getConfirmClasses(variant);
  const iconClasses = getIconClasses(variant);

  return (
    <ModalPortal isOpen={isOpen}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className={`${modalClasses.container} ${isOpen ? 'animate-fadeIn' : ''}`}>
        {/* Header */}
        <div className={modalClasses.header}>
          <div className="flex items-center space-x-3">
            <div className={iconClasses.container}>
              <AlertTriangle className={`h-5 w-5 ${iconClasses.color}`} />
            </div>
            <h3 className={modalClasses.title}>
              {title}
            </h3>
          </div>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={modalClasses.closeButton}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className={modalClasses.content}>
          <p className={modalClasses.text}>
            {message}
          </p>
          
          {/* Actions */}
          <div className={modalClasses.buttons.container}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className={modalClasses.buttons.cancel}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={confirmClasses}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
