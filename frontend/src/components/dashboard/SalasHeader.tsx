'use client';

import { Plus, Trash2 } from 'lucide-react';

interface SalasHeaderProps {
  onNovaSala: () => void;
  onBulkDelete: () => void;
}

export default function SalasHeader({ onNovaSala, onBulkDelete }: SalasHeaderProps) {
  return (
    <div 
      className="p-6 rounded-2xl shadow-2xl animate-slide-in"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Salas</h1>
          <p className="text-white/80 text-sm">
            Gerencie todas as salas do prédio
          </p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Botão Exclusão em Massa clicado no SalasHeader');
              onBulkDelete();
            }}
            className="group inline-flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backdropFilter: 'blur(200px)',
              WebkitBackdropFilter: 'blur(200px)',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(239, 68, 68, 0.1)';
            }}
          >
            <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Exclusão em Massa
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Botão Nova Sala clicado no SalasHeader');
              onNovaSala();
            }}
            className="group inline-flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              backdropFilter: 'blur(200px)',
              WebkitBackdropFilter: 'blur(200px)',
              background: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(6, 182, 212, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(6, 182, 212, 0.1)';
            }}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Nova Sala
          </button>
        </div>
      </div>
    </div>
  );
}
