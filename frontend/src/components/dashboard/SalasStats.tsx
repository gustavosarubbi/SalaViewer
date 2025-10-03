'use client';

import { XCircle, CheckCircle2, Layers } from 'lucide-react';

interface SalasStatsProps {
  totalSalas: number;
  salasOcupadas: number;
  salasDisponiveis: number;
}

export default function SalasStats({ totalSalas, salasOcupadas, salasDisponiveis }: SalasStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {/* Total de Salas - ciano */}
      <div className="relative overflow-hidden rounded-lg bg-cyan-500/10 border border-cyan-500/25 p-2.5">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-cyan-400/70" />
        <div className="flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-wide text-cyan-200/80">Total de Salas</div>
          <div className="h-6 w-6 rounded-md bg-cyan-500/20 flex items-center justify-center">
            <Layers className="h-3.5 w-3.5 text-cyan-200" />
          </div>
        </div>
        <div className="mt-0.5 text-lg font-extrabold text-cyan-200 leading-none">{totalSalas}</div>
        <div className="mt-1 h-0.5 w-full rounded-full bg-cyan-500/20 overflow-hidden">
          <div className="h-full w-full bg-cyan-400" />
        </div>
      </div>

      {/* Ocupadas - vermelho */}
      <div className="relative overflow-hidden rounded-lg bg-red-500/10 border border-red-500/25 p-2.5">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-red-400/70" />
        <div className="flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-wide text-red-200/80">Salas Ocupadas</div>
          <div className="h-6 w-6 rounded-md bg-red-500/20 flex items-center justify-center">
            <XCircle className="h-3.5 w-3.5 text-red-200" />
          </div>
        </div>
        <div className="mt-0.5 text-lg font-extrabold text-red-200 leading-none">{salasOcupadas}</div>
        <div className="mt-1 h-0.5 w-full rounded-full bg-red-500/20 overflow-hidden">
          <div className="h-full w-full bg-red-400" />
        </div>
      </div>

      {/* Disponíveis - verde */}
      <div className="relative overflow-hidden rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-emerald-400/70" />
        <div className="flex items-center justify-between">
          <div className="text-[9px] uppercase tracking-wide text-emerald-200/80">Salas Disponíveis</div>
          <div className="h-6 w-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
          </div>
        </div>
        <div className="mt-0.5 text-lg font-extrabold text-emerald-200 leading-none">{salasDisponiveis}</div>
        <div className="mt-1 h-0.5 w-full rounded-full bg-emerald-500/20 overflow-hidden">
          <div className="h-full w-full bg-emerald-400" />
        </div>
      </div>
    </div>
  );
}
