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
      className="p-6 rounded-2xl shadow-2xl animate-slide-in"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Andares</h1>
          <p className="text-white/80 text-sm">
            Gerencie todos os andares do prédio
          </p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBulkDelete}
            className="group inline-flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backdropFilter: 'blur(200px)',
              WebkitBackdropFilter: 'blur(200px)',
              background: 'rgba(220, 38, 38, 0.25)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.35)';
              e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.6)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(220, 38, 38, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(220, 38, 38, 0.15)';
            }}
            title="Excluir múltiplos andares"
          >
            <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Exclusão em Massa
          </button>
          <button
            type="button"
            onClick={onBulkCreate}
            className="group inline-flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backdropFilter: 'blur(200px)',
              WebkitBackdropFilter: 'blur(200px)',
              background: 'rgba(255, 140, 0, 0.25)',
              border: '1px solid rgba(255, 140, 0, 0.4)',
              boxShadow: '0 8px 32px rgba(255, 140, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 140, 0, 0.35)';
              e.currentTarget.style.borderColor = 'rgba(255, 140, 0, 0.6)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 140, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 140, 0, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 140, 0, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 140, 0, 0.15)';
            }}
            title="Criar múltiplos andares e salas"
          >
            <Layers className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Criação em Massa
          </button>
          <button
            type="button"
            onClick={onNovoAndar}
            className="group inline-flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backdropFilter: 'blur(200px)',
              WebkitBackdropFilter: 'blur(200px)',
              background: 'rgba(0, 123, 255, 0.25)',
              border: '1px solid rgba(0, 123, 255, 0.4)',
              boxShadow: '0 8px 32px rgba(0, 123, 255, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 123, 255, 0.35)';
              e.currentTarget.style.borderColor = 'rgba(0, 123, 255, 0.6)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 123, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 123, 255, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(0, 123, 255, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 123, 255, 0.15)';
            }}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Novo Andar
          </button>
        </div>
      </div>
    </div>
  );
}
