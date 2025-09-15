'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import AndarForm, { AndarFormData } from '@/components/forms/AndarForm';
import { getModalClasses } from '@/styles/modal-styles';
import ModalPortal from '@/components/common/ModalPortal';

interface AndarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AndarFormData) => Promise<void>;
  existingAndares?: number[];
}

export default function AndarModal({ isOpen, onClose, onSubmit, existingAndares = [] }: AndarModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (data: AndarFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose(); // Fechar modal após sucesso
    } catch (error) {
      console.error('Erro ao criar andar:', error);
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
            Novo Andar
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
            Preencha as informações abaixo para criar um novo andar no sistema.
          </p>
          
          <AndarForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isLoading={isLoading}
            existingAndares={existingAndares}
          />
        </div>
      </div>
    </ModalPortal>
  );
}
