'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

export default function SidebarToggle({ isCollapsed, onToggle, className = '' }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed top-4 z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20 ${className} ${
        isCollapsed ? 'left-4' : 'left-72'
      }`}
      title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
    >
      {isCollapsed ? (
        <ChevronRight className="h-5 w-5" />
      ) : (
        <ChevronLeft className="h-5 w-5" />
      )}
    </button>
  );
}
