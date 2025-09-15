'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Andar } from '@/services/api';
import AndarEditForm, { AndarEditFormData } from '@/components/forms/AndarEditForm';
import { getModalClasses } from '@/styles/modal-styles';
import ModalPortal from '@/components/common/ModalPortal';

interface AndarEditModalProps {
  isOpen: boolean;
  andar: Andar | null;
  onClose: () => void;
  onSubmit: (data: AndarEditFormData) => Promise<void>;
  existingAndares?: number[];
}

export default function AndarEditModal({ isOpen, andar, onClose, onSubmit, existingAndares = [] }: AndarEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !andar) return null;

  const handleSubmit = async (data: AndarEditFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose(); // Fechar modal após sucesso
    } catch (error) {
      console.error('Erro ao editar andar:', error);
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
            Editar Andar - {andar.numero_andar}º Andar
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
            Edite as informações do andar abaixo.
          </p>
          
          <AndarEditForm
            andar={andar}
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
