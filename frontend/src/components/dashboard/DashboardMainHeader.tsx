'use client';

import { RefreshCw } from 'lucide-react';

interface DashboardMainHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DashboardMainHeader({ onRefresh, isRefreshing = false }: DashboardMainHeaderProps) {
  return (
    <div 
      className="p-6 rounded-2xl shadow-2xl animate-slide-in card-header no-glassmorphism"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/80 text-sm">
            Visão geral do sistema de gerenciamento de salas
          </p>
        </div>
        
        <div className="flex space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="group inline-flex items-center btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}
