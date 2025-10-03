'use client';

import { useState, useEffect } from 'react';
import { apiService, Andar, Sala } from '@/services/api';

export interface SalaEditFormData {
  numero_sala: string;
  nome_ocupante: string | null;
  andarId: number;
}

interface SalaEditFormErrors {
  numero_sala?: string;
  nome_ocupante?: string;
  andarId?: string;
}

interface SalaEditFormProps {
  sala: Sala;
  onSubmit: (data: SalaEditFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  existingSalas?: string[];
}

export default function SalaEditForm({ sala, onSubmit, onCancel, isLoading = false, existingSalas = [] }: SalaEditFormProps) {
  const [formData, setFormData] = useState<SalaEditFormData>({
    numero_sala: sala.numero_sala,
    nome_ocupante: sala.nome_ocupante,
    andarId: sala.andarId || 0
  });
  
  const [andares, setAndares] = useState<Andar[]>([]);
  const [errors, setErrors] = useState<SalaEditFormErrors>({});
  const [loadingAndares, setLoadingAndares] = useState(true);
  const [isDisponivel, setIsDisponivel] = useState<boolean>(!sala.nome_ocupante || sala.nome_ocupante.trim() === '');
  const [mensagemDisponivel, setMensagemDisponivel] = useState<string>('Sala Disponivel');

  // Carregar andares disponíveis
  useEffect(() => {
    const loadAndares = async () => {
      try {
        const response = await apiService.getAndares();
        setAndares(response);
      } catch (error) {
        console.error('Erro ao carregar andares:', error);
        // Não carregar andares se houver erro
      } finally {
        setLoadingAndares(false);
      }
    };

    loadAndares();
    // Carregar extras locais (contato/mensagem) se houver
    try {
      const key = `sala-extra:${sala.numero_sala}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved) as { mensagem?: string };
        if (data.mensagem) setMensagemDisponivel(data.mensagem);
      }
    } catch {}
  }, [sala.numero_sala]);

  const validateForm = (): boolean => {
    const newErrors: SalaEditFormErrors = {};

    if (!formData.numero_sala.trim()) {
      newErrors.numero_sala = 'Número da sala é obrigatório';
    } else if (formData.numero_sala.trim().length < 1) {
      newErrors.numero_sala = 'Número da sala deve ter pelo menos 1 caractere';
    } else if (formData.numero_sala.trim().length > 4) {
      newErrors.numero_sala = 'Número da sala deve ter no máximo 4 caracteres';
    } else if (formData.numero_sala.trim() !== sala.numero_sala && existingSalas.includes(formData.numero_sala.trim())) {
      newErrors.numero_sala = 'Já existe uma sala com este número';
    }

    if (formData.nome_ocupante && formData.nome_ocupante.trim().length < 3) {
      newErrors.nome_ocupante = 'Nome do ocupante deve ter pelo menos 3 caracteres';
    } else if (formData.nome_ocupante && formData.nome_ocupante.trim().length > 30) {
      newErrors.nome_ocupante = 'Nome do ocupante deve ter no máximo 30 caracteres';
    }

    if (!formData.andarId || formData.andarId === 0) {
      newErrors.andarId = 'Selecione um andar';
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
      // Persistir informações extras quando marcar como disponível
      if (isDisponivel && formData.numero_sala) {
        try {
          const key = `sala-extra:${formData.numero_sala}`;
          localStorage.setItem(key, JSON.stringify({ mensagem: mensagemDisponivel }));
        } catch {}
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    }
  };

  const handleInputChange = (field: keyof SalaEditFormData, value: string | number | null) => {
    let processedValue: string | number | null = value;
    
    // Para o campo nome_ocupante, converter string vazia para null
    if (field === 'nome_ocupante') {
      processedValue = value === '' || value === null ? null : value as string;
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loadingAndares) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-300">Carregando andares...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Status da Sala */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Status da Sala</label>
          <div className="inline-flex rounded-lg overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsDisponivel(true);
                setFormData(prev => ({ ...prev, nome_ocupante: null }));
              }}
              className={`px-3 py-1.5 text-sm ${isDisponivel ? 'bg-emerald-500/15 text-emerald-200 border-r border-white/10' : 'bg-white/5 text-white/70 border-r border-white/10'} hover:bg-white/10 transition-colors`}
            >
              Disponível
            </button>
            <button
              type="button"
              onClick={() => setIsDisponivel(false)}
              className={`px-3 py-1.5 text-sm ${!isDisponivel ? 'bg-red-500/15 text-red-200' : 'bg-white/5 text-white/70'} hover:bg-white/10 transition-colors`}
            >
              Ocupada
            </button>
          </div>
        </div>
        {/* Número da Sala */}
        <div>
          <label htmlFor="numero_sala" className="block text-sm font-medium text-gray-200 mb-2">
            Número da Sala *
          </label>
          <input
            type="text"
            id="numero_sala"
            value={formData.numero_sala}
            onChange={(e) => handleInputChange('numero_sala', e.target.value)}
            placeholder="Ex: 1501, 1702-A, 2001-B"
            maxLength={4}
            className={`w-full px-3 py-2 bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
              errors.numero_sala ? 'border-red-500' : 'border-white/20'
            }`}
            disabled={isLoading}
          />
          {errors.numero_sala && (
            <p className="mt-1 text-sm text-red-400">{errors.numero_sala}</p>
          )}
        </div>

        {/* Nome do Ocupante OU Informações de Disponibilidade */}
        {isDisponivel ? (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Mensagem de disponibilidade</label>
            <input
              type="text"
              value={mensagemDisponivel}
              onChange={(e) => setMensagemDisponivel(e.target.value)}
              placeholder="Ex: Sala livre. Entre em contato."
              maxLength={30}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              disabled={isLoading}
            />
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`${mensagemDisponivel.length > 27 ? 'bg-red-400' : mensagemDisponivel.length > 22 ? 'bg-amber-400' : 'bg-emerald-400'} h-full`}
                  style={{ width: `${(mensagemDisponivel.length / 30) * 100}%` }}
                />
              </div>
              <span className={`${mensagemDisponivel.length > 27 ? 'text-red-300' : mensagemDisponivel.length > 22 ? 'text-amber-300' : 'text-white/70'} text-[11px]`}>{mensagemDisponivel.length}/30</span>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="nome_ocupante" className="block text-sm font-medium text-gray-200 mb-2">
              Nome do Ocupante
            </label>
            <div className="relative">
              <input
                type="text"
                id="nome_ocupante"
                value={formData.nome_ocupante || ''}
                onChange={(e) => handleInputChange('nome_ocupante', e.target.value || null)}
                placeholder="Ex: Dr. João Silva"
                maxLength={30}
                className={`w-full px-3 py-2 bg-white/10 border rounded-lg shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
                  errors.nome_ocupante ? 'border-red-500' : 'border-white/20'
                }`}
                disabled={isLoading}
              />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`${(formData.nome_ocupante?.length || 0) > 27 ? 'bg-red-400' : (formData.nome_ocupante?.length || 0) > 22 ? 'bg-amber-400' : 'bg-emerald-400'} h-full`}
                  style={{ width: `${((formData.nome_ocupante?.length || 0) / 30) * 100}%` }}
                />
              </div>
              <span className={`${(formData.nome_ocupante?.length || 0) > 27 ? 'text-red-300' : (formData.nome_ocupante?.length || 0) > 22 ? 'text-amber-300' : 'text-white/70'} text-[11px]`}>{(formData.nome_ocupante?.length || 0)}/30</span>
            </div>
            {errors.nome_ocupante && (
              <p className="mt-1 text-sm text-red-400">{errors.nome_ocupante}</p>
            )}
          </div>
        )}

        {/* Andar */}
        <div>
          <label htmlFor="andarId" className="block text-sm font-medium text-gray-200 mb-2">
            Andar *
          </label>
          <select
            id="andarId"
            value={formData.andarId}
            onChange={(e) => handleInputChange('andarId', parseInt(e.target.value))}
            className={`w-full px-3 py-2 bg-white/10 border rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
              errors.andarId ? 'border-red-500' : 'border-white/20'
            }`}
            disabled={isLoading}
          >
            <option value={0} className="bg-gray-800 text-white">Selecione um andar</option>
            {andares.map((andar) => (
              <option key={andar.id} value={andar.id} className="bg-gray-800 text-white">
                {andar.numero_andar}º Andar {andar.nome_identificador && `- ${andar.nome_identificador}`}
              </option>
            ))}
          </select>
          {errors.andarId && (
            <p className="mt-1 text-sm text-red-400">{errors.andarId}</p>
          )}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
