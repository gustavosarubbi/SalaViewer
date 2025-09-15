'use client';

import { Menu, User } from 'lucide-react';
import ApiStatusIndicator from '@/components/common/ApiStatusIndicator';

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

      <div className="flex flex-1 justify-between items-center">
        {/* API Status Indicator */}
        <div className="flex items-center">
          <ApiStatusIndicator />
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            type="button"
            className="-m-1.5 flex items-center p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 group"
          >
            <span className="sr-only">Abrir menu do usuário</span>
            <User className="h-8 w-8 text-white/70 group-hover:text-white transition-colors duration-200" aria-hidden="true" />
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-4 text-sm font-semibold leading-6 text-white group-hover:text-white transition-colors duration-200" aria-hidden="true">
                Administrador
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
