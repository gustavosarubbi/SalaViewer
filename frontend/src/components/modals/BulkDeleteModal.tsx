'use client';

import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import ModalPortal from '@/components/common/ModalPortal';

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => Promise<void>;
  salas: Array<{ id: number; numero_sala: string; nome_ocupante: string | null }>;
  isLoading?: boolean;
  searchTerm?: string;
  selectedAndar?: string;
  availableAndares?: number[];
  onSearchChange?: (value: string) => void;
  onAndarChange?: (value: string) => void;
  onClearFilters?: () => void;
}

export default function BulkDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  salas, 
  isLoading = false,
  searchTerm = '',
  selectedAndar = '',
  availableAndares = [],
  onSearchChange,
  onAndarChange,
  onClearFilters
}: BulkDeleteModalProps) {
  const [selectedSalas, setSelectedSalas] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectedSalas.length === salas.length) {
      setSelectedSalas([]);
    } else {
      setSelectedSalas(salas.map(sala => sala.id));
    }
  };

  const handleSelectSala = (salaId: number) => {
    setSelectedSalas(prev => 
      prev.includes(salaId) 
        ? prev.filter(id => id !== salaId)
        : [...prev, salaId]
    );
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSalas.length === 0) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onConfirm(selectedSalas);
      setSelectedSalas([]);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Erro ao excluir salas:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    setSelectedSalas([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white/20 border border-white/30 shadow-2xl transition-all backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/20">
          <div>
            <h3 className="text-base font-semibold text-white">Exclusão em Massa</h3>
            <p className="text-xs text-white/70">
              Selecione as salas para excluir
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
        <div className="p-3">
          {!showConfirmation ? (
            <>
              {/* Filters Section - Compact */}
              {(searchTerm || selectedAndar) && (
                <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-medium">
                      {salas.length} sala{salas.length !== 1 ? 's' : ''} filtrada{salas.length !== 1 ? 's' : ''}
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
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* Search Input */}
                {onSearchChange && (
                  <input
                    type="text"
                    className="block w-full rounded py-1.5 px-2 text-white placeholder:text-white/50 bg-white/5 border border-white/10 focus:bg-white/8 focus:border-blue-500 focus:outline-none text-xs"
                    placeholder="Buscar salas..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                )}

                {/* Andar Filter */}
                {onAndarChange && availableAndares.length > 0 && (
                  <select
                    className="block w-full rounded py-1.5 px-2 text-white bg-white/10 border border-white/20 focus:bg-white/15 focus:border-blue-500 focus:outline-none text-xs"
                    value={selectedAndar}
                    onChange={(e) => onAndarChange(e.target.value)}
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" className="bg-gray-800 text-white">Todos os andares</option>
                    {availableAndares.map((andar) => (
                      <option key={andar} value={andar.toString()} className="bg-gray-800 text-white">
                        {andar}º Andar
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Select All - Compact */}
              {salas.length > 0 && (
                <div className="mb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSalas.length === salas.length && salas.length > 0}
                      onChange={handleSelectAll}
                      className="w-3 h-3 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-1"
                    />
                    <span className="text-xs text-white">
                      Selecionar todas ({salas.length})
                    </span>
                  </label>
                </div>
              )}

              {/* Salas List - Compact */}
              <div className="max-h-64 overflow-y-auto space-y-1 mb-3">
                {salas.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-white/50">
                      <Trash2 className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs">Nenhuma sala encontrada</p>
                    </div>
                  </div>
                ) : (
                  salas.map((sala) => (
                    <label
                      key={sala.id}
                      className="flex items-center space-x-2 p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSalas.includes(sala.id)}
                        onChange={() => handleSelectSala(sala.id)}
                        className="w-3 h-3 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          Sala {sala.numero_sala}
                        </div>
                        <div className="text-xs text-white/70 truncate">
                          {sala.nome_ocupante ? sala.nome_ocupante : 'Disponível'}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>

              {/* Summary - Compact */}
              {selectedSalas.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Trash2 className="h-3 w-3 text-red-400" />
                    <span className="text-xs text-red-400 font-medium">
                      {selectedSalas.length} selecionada{selectedSalas.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons - Compact */}
              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/10 border border-white/20 rounded hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={selectedSalas.length === 0 || isLoading}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-1 focus:ring-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Excluindo...
                    </div>
                  ) : (
                    `Excluir ${selectedSalas.length}`
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
                  Excluir <span className="font-semibold text-red-400">{selectedSalas.length}</span> sala{selectedSalas.length > 1 ? 's' : ''}?
                </p>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded p-2 mb-4">
                  <p className="text-xs text-red-300">
                    ⚠️ Esta ação não pode ser desfeita
                  </p>
                </div>

                {/* Selected Salas Preview - Compact */}
                <div className="max-h-20 overflow-y-auto space-y-1 mb-4">
                  {selectedSalas.slice(0, 5).map((salaId) => {
                    const sala = salas.find(s => s.id === salaId);
                    return sala ? (
                      <div key={salaId} className="text-xs text-white/80 bg-white/5 rounded px-2 py-1">
                        Sala {sala.numero_sala}
                      </div>
                    ) : null;
                  })}
                  {selectedSalas.length > 5 && (
                    <div className="text-xs text-white/60">
                      +{selectedSalas.length - 5} mais...
                    </div>
                  )}
                </div>

                {/* Confirmation Buttons - Compact */}
                <div className="flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/10 border border-white/20 rounded hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 border border-transparent rounded hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-1 focus:ring-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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