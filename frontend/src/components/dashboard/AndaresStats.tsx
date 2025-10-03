'use client';

import { Layers, DoorOpen } from 'lucide-react';

interface AndaresStatsProps {
  totalAndares: number;
  totalSalas: number;
}

export default function AndaresStats({ totalAndares, totalSalas }: AndaresStatsProps) {

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {/* Total de Andares - tema âmbar, compacto */}
      <div className="relative overflow-hidden rounded-lg bg-amber-500/10 border border-amber-500/25 p-2.5">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400/70" />
        <div className="flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-wide text-amber-200/80">Total de Andares</div>
          <div className="h-6 w-6 rounded-md bg-amber-500/20 flex items-center justify-center">
            <Layers className="h-3.5 w-3.5 text-amber-200" />
          </div>
        </div>
        <div className="mt-0.5 text-lg font-extrabold text-amber-200 leading-none">{totalAndares}</div>
        <div className="mt-1 h-0.5 w-full rounded-full bg-amber-500/20 overflow-hidden">
          <div className="h-full w-full bg-amber-400" />
        </div>
      </div>

      {/* Total de Salas - tema ciano, compacto */}
      <div className="relative overflow-hidden rounded-lg bg-cyan-500/10 border border-cyan-500/25 p-2.5">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-cyan-400/70" />
        <div className="flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-wide text-cyan-200/80">Total de Salas</div>
          <div className="h-6 w-6 rounded-md bg-cyan-500/20 flex items-center justify-center">
            <DoorOpen className="h-3.5 w-3.5 text-cyan-200" />
          </div>
        </div>
        <div className="mt-0.5 text-lg font-extrabold text-cyan-200 leading-none">{totalSalas}</div>
        <div className="mt-1 h-0.5 w-full rounded-full bg-cyan-500/20 overflow-hidden">
          <div className="h-full w-full bg-cyan-400" />
        </div>
      </div>
    </div>
  );
}
