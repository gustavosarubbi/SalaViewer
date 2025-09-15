'use client';

import { RefreshCw } from 'lucide-react';

interface DashboardMainHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DashboardMainHeader({ onRefresh, isRefreshing = false }: DashboardMainHeaderProps) {
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
              className="group inline-flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backdropFilter: 'blur(200px)',
                WebkitBackdropFilter: 'blur(200px)',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.1)';
                }
              }}
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
