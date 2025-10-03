'use client';

import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import ModalPortal from '@/components/common/ModalPortal';

interface BulkDeleteAndaresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => Promise<void>;
  andares: Array<{ id: number; numero_andar: number; nome_identificador?: string }>;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onClearFilters?: () => void;
}

export default function BulkDeleteAndaresModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  andares, 
  isLoading = false,
  searchTerm = '',
  onSearchChange,
  onClearFilters
}: BulkDeleteAndaresModalProps) {
  const [selectedAndares, setSelectedAndares] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectedAndares.length === andares.length) {
      setSelectedAndares([]);
    } else {
      setSelectedAndares(andares.map(andar => andar.id));
    }
  };

  const handleSelectAndar = (andarId: number) => {
    setSelectedAndares(prev => 
      prev.includes(andarId) 
        ? prev.filter(id => id !== andarId)
        : [...prev, andarId]
    );
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedAndares.length === 0) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onConfirm(selectedAndares);
      setSelectedAndares([]);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Erro ao excluir andares:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setSelectedAndares([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-black/90 border border-white/10 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Exclusão em Massa</h3>
            <p className="text-xs text-white/70">
              Selecione os andares para excluir
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!showConfirmation ? (
            <>
              {/* Filters Section - Compact */}
              {searchTerm && (
                <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-medium">
                      {andares.length} andar{andares.length !== 1 ? 'es' : ''} filtrado{andares.length !== 1 ? 's' : ''}
                    </span>
                    {onClearFilters && (
                      <button
                        onClick={onClearFilters}
                        className="text-blue-300 hover:text-blue-200 underline"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Filter Controls - Compact */}
              {onSearchChange && (
                <div className="mb-3">
                  <input
                    type="text"
                    className="block w-full rounded py-1.5 px-2 text-white placeholder:text-white/50 bg-white/5 border border-white/10 focus:bg-white/8 focus:border-blue-500 focus:outline-none text-xs"
                    placeholder="Buscar andares..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>
              )}

              {/* Select All - Compact */}
              {andares.length > 0 && (
                <div className="mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAndares.length === andares.length && andares.length > 0}
                      onChange={handleSelectAll}
                      className="w-3 h-3 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-1"
                    />
                    <span className="text-xs text-white">
                      Selecionar todos ({andares.length})
                    </span>
                  </label>
                </div>
              )}

              {/* Andares List - Compact */}
              <div className="max-h-64 overflow-y-auto space-y-1 mb-3">
                {andares.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-white/50">
                      <Trash2 className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs">Nenhum andar encontrado</p>
                    </div>
                  </div>
                ) : (
                  andares.map((andar) => (
                    <label
                      key={andar.id}
                      className="flex items-center space-x-2 p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAndares.includes(andar.id)}
                        onChange={() => handleSelectAndar(andar.id)}
                        className="w-3 h-3 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {andar.numero_andar}º Andar
                        </div>
                        {andar.nome_identificador && (
                          <div className="text-xs text-white/70 truncate">
                            {andar.nome_identificador}
                          </div>
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>

              {/* Summary - Compact */}
              {selectedAndares.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Trash2 className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">
                      {selectedAndares.length} selecionado{selectedAndares.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons - Compact */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-white/30 transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={selectedAndares.length === 0 || isLoading}
                  className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Excluindo...
                    </div>
                  ) : (
                    `Excluir ${selectedAndares.length}`
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Confirmation Screen - Compact */}
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-3">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
                
                <h3 className="text-base font-semibold text-white mb-2">
                  Confirmar Exclusão
                </h3>
                
                <p className="text-xs text-white/70 mb-3">
                  Excluir <span className="font-semibold text-red-400">{selectedAndares.length}</span> andar{selectedAndares.length > 1 ? 'es' : ''}?
                </p>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-4">
                  <p className="text-xs text-red-300">
                    ⚠️ Esta ação não pode ser desfeita
                  </p>
                </div>

                {/* Selected Andares Preview - Compact */}
                <div className="max-h-20 overflow-y-auto space-y-1 mb-4">
                  {selectedAndares.slice(0, 5).map((andarId) => {
                    const andar = andares.find(a => a.id === andarId);
                    return andar ? (
                      <div key={andarId} className="text-xs text-white/80 bg-white/5 rounded px-2 py-1">
                        {andar.numero_andar}º Andar
                      </div>
                    ) : null;
                  })}
                  {selectedAndares.length > 5 && (
                    <div className="text-xs text-white/60">
                      +{selectedAndares.length - 5} mais...
                    </div>
                  )}
                </div>

                {/* Confirmation Buttons - Compact */}
                <div className="flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isLoading}
                    className="inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        Excluindo...
                      </div>
                    ) : (
                      'Sim, Excluir'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
