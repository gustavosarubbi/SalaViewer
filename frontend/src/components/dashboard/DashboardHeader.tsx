'use client';

import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-x-4 px-4 sm:gap-x-6 sm:px-6 lg:px-8 glass-strong" style={{
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-white/20 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 justify-end items-center">
        {/* Espaço vazio - indicador de status removido */}
      </div>
    </div>
  );
}
