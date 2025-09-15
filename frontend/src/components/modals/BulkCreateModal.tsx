'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import ModalPortal from '@/components/common/ModalPortal';

interface BulkCreateData {
  quantidadeAndares: number;
  salasPorAndar: number;
  andarInicial: number;
}

interface BulkCreateErrors {
  quantidadeAndares?: string;
  salasPorAndar?: string;
  andarInicial?: string;
}

interface BulkCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BulkCreateData) => Promise<void>;
  isLoading?: boolean;
  progress?: { current: number; total: number };
}

export default function BulkCreateModal({ isOpen, onClose, onSubmit, isLoading = false, progress }: BulkCreateModalProps) {
  const [formData, setFormData] = useState<BulkCreateData>({
    quantidadeAndares: 1,
    salasPorAndar: 1,
    andarInicial: 1
  });
  
  const [errors, setErrors] = useState<BulkCreateErrors>({});

  const validateForm = (): boolean => {
    const newErrors: BulkCreateErrors = {};

    if (!formData.quantidadeAndares || formData.quantidadeAndares <= 0) {
      newErrors.quantidadeAndares = 'Quantidade de andares deve ser maior que zero';
    }

    if (!formData.salasPorAndar || formData.salasPorAndar <= 0) {
      newErrors.salasPorAndar = 'Salas por andar deve ser maior que zero';
    }

    if (!formData.andarInicial || formData.andarInicial <= 0) {
      newErrors.andarInicial = 'Andar inicial deve ser maior que zero';
    }

    // Validar limite total de salas
    const totalSalas = formData.quantidadeAndares * formData.salasPorAndar;
    if (totalSalas > 1000) {
      newErrors.quantidadeAndares = 'Máximo de 1000 salas por operação';
      newErrors.salasPorAndar = 'Máximo de 1000 salas por operação';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    }
  };

  const handleInputChange = (field: keyof BulkCreateData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const calcularTotal = () => {
    return formData.quantidadeAndares * formData.salasPorAndar;
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-xl bg-white/20 border border-white/30 shadow-2xl transition-all backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div>
              <h3 className="text-lg font-semibold text-white">Criação em Massa</h3>
              <p className="text-xs text-white/70 mt-1">
                Crie múltiplos andares e salas de uma vez
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-3">
              {/* Andar Inicial */}
              <div>
                <label htmlFor="andarInicial" className="block text-xs font-medium text-gray-200 mb-1">
                  Andar Inicial *
                </label>
                <input
                  type="number"
                  id="andarInicial"
                  value={formData.andarInicial}
                  onChange={(e) => handleInputChange('andarInicial', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 1, 5, 10"
                  min="1"
                  className={`w-full px-3 py-2 text-sm bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
                    errors.andarInicial ? 'border-red-500' : 'border-white/20'
                  }`}
                  disabled={isLoading}
                />
                {errors.andarInicial && (
                  <p className="mt-1 text-xs text-red-400">{errors.andarInicial}</p>
                )}
              </div>

              {/* Quantidade de Andares */}
              <div>
                <label htmlFor="quantidadeAndares" className="block text-xs font-medium text-gray-200 mb-1">
                  Quantidade de Andares *
                </label>
                <input
                  type="number"
                  id="quantidadeAndares"
                  value={formData.quantidadeAndares}
                  onChange={(e) => handleInputChange('quantidadeAndares', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 5, 10, 20"
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 text-sm bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
                    errors.quantidadeAndares ? 'border-red-500' : 'border-white/20'
                  }`}
                  disabled={isLoading}
                />
                {errors.quantidadeAndares && (
                  <p className="mt-1 text-xs text-red-400">{errors.quantidadeAndares}</p>
                )}
              </div>

              {/* Salas por Andar */}
              <div>
                <label htmlFor="salasPorAndar" className="block text-xs font-medium text-gray-200 mb-1">
                  Salas por Andar *
                </label>
                <input
                  type="number"
                  id="salasPorAndar"
                  value={formData.salasPorAndar}
                  onChange={(e) => handleInputChange('salasPorAndar', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 5, 10, 15"
                  min="1"
                  max="100"
                  className={`w-full px-3 py-2 text-sm bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
                    errors.salasPorAndar ? 'border-red-500' : 'border-white/20'
                  }`}
                  disabled={isLoading}
                />
                {errors.salasPorAndar && (
                  <p className="mt-1 text-xs text-red-400">{errors.salasPorAndar}</p>
                )}
              </div>

              {/* Resumo */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h4 className="text-xs font-medium text-white mb-2">Resumo da Criação</h4>
                <div className="space-y-1 text-xs text-white/80">
                  <p>• Andares: {formData.andarInicial} até {formData.andarInicial + formData.quantidadeAndares - 1}</p>
                  <p>• Salas por andar: {formData.salasPorAndar}</p>
                  <p className="font-semibold text-blue-400">
                    • Total de salas: {calcularTotal()}
                  </p>
                </div>
                
                {/* Indicador de Progresso */}
                {isLoading && progress && progress.total > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                      <span>Criando salas...</span>
                      <span>{progress.current}/{progress.total}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      {Math.round((progress.current / progress.total) * 100)}% concluído
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-medium text-gray-300 bg-white/10 border border-white/20 rounded-lg shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-600 border border-transparent rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-green-500/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Criando...
                  </div>
                ) : (
                  'Criar em Massa'
                )}
              </button>
            </div>
          </form>
      </div>
    </ModalPortal>
  );
}
