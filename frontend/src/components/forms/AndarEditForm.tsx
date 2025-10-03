'use client';

import { useState } from 'react';
import { Andar } from '@/services/api';

export interface AndarEditFormData {
  numero_andar: number;
}

interface AndarEditFormErrors {
  numero_andar?: string;
}

interface AndarEditFormProps {
  andar: Andar;
  onSubmit: (data: AndarEditFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingAndares?: number[];
}

export default function AndarEditForm({ andar, onSubmit, onCancel, isLoading = false, existingAndares = [] }: AndarEditFormProps) {
  const [formData, setFormData] = useState<AndarEditFormData>({
    numero_andar: andar.numero_andar
  });
  
  const [errors, setErrors] = useState<AndarEditFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: AndarEditFormErrors = {};

    if (!formData.numero_andar || formData.numero_andar <= 0) {
      newErrors.numero_andar = 'Número do andar é obrigatório e deve ser maior que zero';
    } else if (!Number.isInteger(formData.numero_andar)) {
      newErrors.numero_andar = 'Use apenas números inteiros (sem pontos ou vírgulas)';
    } else if (formData.numero_andar !== andar.numero_andar && existingAndares.includes(formData.numero_andar)) {
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

  const handleInputChange = (field: keyof AndarEditFormData, value: string | number | null) => {
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
            step="1"
            inputMode="numeric"
            pattern="\\d*"
            onKeyDown={(e) => {
              const allowed = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
              if (allowed.includes(e.key)) return;
              if (!/^[0-9]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData('text');
              if (!/^\d+$/.test(text)) {
                e.preventDefault();
              }
            }}
            className={`w-full px-3 py-2 bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
              errors.numero_andar ? 'border-red-500' : 'border-white/20'
            }`}
            disabled={isLoading}
          />
          {!errors.numero_andar && (
            <p className="mt-1 text-xs text-white/50">Apenas números inteiros são permitidos.</p>
          )}
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
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all disabled:opacity-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </div>
          ) : (
            'Salvar Alterações'
          )}
        </button>
      </div>
    </form>
  );
}
