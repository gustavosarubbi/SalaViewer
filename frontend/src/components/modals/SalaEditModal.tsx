'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Sala } from '@/services/api';
import SalaEditForm, { SalaEditFormData } from '@/components/forms/SalaEditForm';
import { getModalClasses } from '@/styles/modal-styles';
import ModalPortal from '@/components/common/ModalPortal';

interface SalaEditModalProps {
  isOpen: boolean;
  sala: Sala | null;
  onClose: () => void;
  onSubmit: (data: SalaEditFormData) => Promise<void>;
  existingSalas?: string[];
}

export default function SalaEditModal({ isOpen, sala, onClose, onSubmit, existingSalas = [] }: SalaEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !sala) return null;

  const handleSubmit = async (data: SalaEditFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose(); // Fechar modal após sucesso
    } catch (error) {
      console.error('Erro ao editar sala:', error);
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
            Editar Sala - {sala.numero_sala}
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
            Edite as informações da sala abaixo.
          </p>
          
          <SalaEditForm
            sala={sala}
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
