'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import SalaForm, { SalaFormData } from '@/components/forms/SalaForm';
import { getModalClasses } from '@/styles/modal-styles';
import ModalPortal from '@/components/common/ModalPortal';

interface SalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SalaFormData) => Promise<void>;
  existingSalas?: string[];
}

export default function SalaModal({ isOpen, onClose, onSubmit, existingSalas = [] }: SalaModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (data: SalaFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose(); // Fechar modal após sucesso
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      // O erro será tratado pelo componente pai
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Usar o sistema modular de estilos
  const theme = 'dark';
  const modalClasses = getModalClasses(theme);

  return (
    <ModalPortal isOpen={isOpen}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`${modalClasses.container} ${isOpen ? 'animate-fadeIn' : ''}`}>
        {/* Header */}
        <div className={modalClasses.header}>
          <h3 className={modalClasses.title}>
            Nova Sala
          </h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={modalClasses.closeButton}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className={modalClasses.content}>
          <p className={modalClasses.text}>
            Preencha as informações abaixo para criar uma nova sala no sistema.
          </p>
          
          <SalaForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={isLoading}
            existingSalas={existingSalas}
          />
        </div>
      </div>
    </ModalPortal>
  );
}
