"use client";

import React from 'react';
import { Monitor, Play } from 'lucide-react';

type MonitorSelectCardProps = {
  screenNumber: number;
  onSelect: (screenNumber: number) => void;
};

export function MonitorSelectCard({ screenNumber, onSelect }: MonitorSelectCardProps) {
  return (
    <button
      onClick={() => onSelect(screenNumber)}
      aria-label={`Selecionar Monitor ${screenNumber}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-0.5 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 w-32 flex-shrink-0"
    >
      {/* Borda com brilho sutil */}
      <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.15),transparent_45%),radial-gradient(circle_at_80%_120%,rgba(59,130,246,0.15),transparent_40%)]" />

      {/* Corpo do card - layout horizontal ultracompacto */}
      <div className="relative rounded-[14px] bg-slate-950/70 backdrop-blur-xl p-2.5 min-h-[150px]">
        {/* Canto diagonal decorativo */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rotate-45 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />

        {/* Layout vertical compacto - reorganizado para o tamanho */}
        <div className="flex flex-col items-center text-center h-full">
          {/* Ícone centralizado */}
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-300 transition-colors duration-300 group-hover:from-cyan-500/30 group-hover:to-blue-500/20 mb-4">
            <Monitor className="h-8 w-8" />
          </div>

          {/* Número do monitor - posicionado um pouco mais abaixo */}
          <div className="flex items-center justify-center mb-4">
            <div className="text-lg font-bold text-white">Monitor {screenNumber}</div>
          </div>

          {/* Ação sempre visível - posicionada na parte inferior */}
          <div className="mt-auto">
            <div className="flex items-center justify-center gap-2 text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 hover:bg-cyan-500/20 transition-colors duration-300">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Iniciar</span>
            </div>
          </div>
        </div>

        {/* Barra inferior animada */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 group-hover:opacity-100" />
      </div>
    </button>
  );
}

export default MonitorSelectCard;
