'use client';

import { Plus, Layers, Trash2 } from 'lucide-react';

interface AndaresHeaderProps {
  onNovoAndar: () => void;
  onBulkCreate: () => void;
  onBulkDelete: () => void;
}

export default function AndaresHeader({ onNovoAndar, onBulkCreate, onBulkDelete }: AndaresHeaderProps) {
  return (
    <div 
      className="p-6 rounded-2xl shadow-2xl animate-slide-in card-header no-glassmorphism"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Andares</h1>
          <p className="text-white/80 text-sm">
            Gerencie todos os andares do prédio
          </p>
        </div>
        
        {/* Botões de ação no header - Padrão Display Setup */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBulkDelete}
            className="group inline-flex items-center rounded-lg px-3 py-2 bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all"
            title="Excluir múltiplos andares"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Exclusão em Massa
          </button>
          <button
            type="button"
            onClick={onBulkCreate}
            className="group inline-flex items-center rounded-lg px-3 py-2 bg-orange-500/15 border border-orange-500/30 text-orange-200 hover:text-orange-100 hover:bg-orange-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition-all"
            title="Criar múltiplos andares e salas"
          >
            <Layers className="h-4 w-4 mr-2" />
            Criação em Massa
          </button>
          <button
            type="button"
            onClick={onNovoAndar}
            className="group inline-flex items-center rounded-lg px-3 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Andar
          </button>
        </div>
      </div>
    </div>
  );
}
