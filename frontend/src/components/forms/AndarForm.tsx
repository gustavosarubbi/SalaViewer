'use client';

import { useState } from 'react';

export interface AndarFormData {
  numero_andar: number;
}

interface AndarFormErrors {
  numero_andar?: string;
}

interface AndarFormProps {
  onSubmit: (data: AndarFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingAndares?: number[];
}

export default function AndarForm({ onSubmit, onCancel, isLoading = false, existingAndares = [] }: AndarFormProps) {
  const [formData, setFormData] = useState<AndarFormData>({
    numero_andar: 0
  });
  
  const [errors, setErrors] = useState<AndarFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: AndarFormErrors = {};

    if (!formData.numero_andar || formData.numero_andar <= 0) {
      newErrors.numero_andar = 'Número do andar é obrigatório e deve ser maior que zero';
    } else if (existingAndares.includes(formData.numero_andar)) {
      newErrors.numero_andar = 'Já existe um andar com este número';
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

  const handleInputChange = (field: keyof AndarFormData, value: string | number | null) => {
    const numericValue = typeof value === 'string' ? parseInt(value) || 0 : (value || 0);
    setFormData(prev => ({ ...prev, [field]: numericValue }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Número do Andar */}
        <div>
          <label htmlFor="numero_andar" className="block text-sm font-medium text-gray-200 mb-2">
            Número do Andar *
          </label>
          <input
            type="number"
            id="numero_andar"
            value={formData.numero_andar || ''}
            onChange={(e) => handleInputChange('numero_andar', parseInt(e.target.value) || 0)}
            placeholder="Ex: 15, 17, 20"
            min="1"
            className={`w-full px-3 py-2 bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
              errors.numero_andar ? 'border-red-500' : 'border-white/20'
            }`}
            disabled={isLoading}
          />
          {errors.numero_andar && (
            <p className="mt-1 text-sm text-red-400">{errors.numero_andar}</p>
          )}
        </div>

      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/10 border border-white/20 rounded-lg shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 border border-transparent rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/25"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Criando...
            </div>
          ) : (
            'Criar Andar'
          )}
        </button>
      </div>
    </form>
  );
}
