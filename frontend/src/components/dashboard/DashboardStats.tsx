'use client';

import { XCircle, Layers, CheckCircle2, DoorOpen } from 'lucide-react';

interface DashboardStatsProps {
  totalSalas: number;
  totalAndares: number;
  salasOcupadas: number;
  salasDisponiveis: number;
}

export default function DashboardStats({ 
  totalSalas, 
  totalAndares, 
  salasOcupadas, 
  salasDisponiveis 
}: DashboardStatsProps) {
  const statCards = [
    {
      name: 'Total de Salas',
      value: totalSalas,
      icon: DoorOpen,
      cardBg: 'bg-cyan-500/10',
      cardBorder: 'border-cyan-500/25',
      strip: 'bg-cyan-400/70',
      badgeBg: 'bg-cyan-500/20',
      iconColor: 'text-cyan-200',
      titleColor: 'text-cyan-200/80',
      valueColor: 'text-cyan-200',
      barTrack: 'bg-cyan-500/20',
      barFill: 'bg-cyan-400'
    },
    {
      name: 'Total de Andares',
      value: totalAndares,
      icon: Layers,
      cardBg: 'bg-amber-500/10',
      cardBorder: 'border-amber-500/25',
      strip: 'bg-amber-400/70',
      badgeBg: 'bg-amber-500/20',
      iconColor: 'text-amber-200',
      titleColor: 'text-amber-200/80',
      valueColor: 'text-amber-200',
      barTrack: 'bg-amber-500/20',
      barFill: 'bg-amber-400'
    },
    {
      name: 'Salas Ocupadas',
      value: salasOcupadas,
      icon: XCircle,
      cardBg: 'bg-red-500/10',
      cardBorder: 'border-red-500/25',
      strip: 'bg-red-400/70',
      badgeBg: 'bg-red-500/20',
      iconColor: 'text-red-200',
      titleColor: 'text-red-200/80',
      valueColor: 'text-red-200',
      barTrack: 'bg-red-500/20',
      barFill: 'bg-red-400'
    },
    {
      name: 'Salas Disponíveis',
      value: salasDisponiveis,
      icon: CheckCircle2,
      cardBg: 'bg-emerald-500/10',
      cardBorder: 'border-emerald-500/25',
      strip: 'bg-emerald-400/70',
      badgeBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-200',
      titleColor: 'text-emerald-200/80',
      valueColor: 'text-emerald-200',
      barTrack: 'bg-emerald-500/20',
      barFill: 'bg-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className={`relative overflow-hidden rounded-lg ${stat.cardBg} border ${stat.cardBorder} p-2.5`}
        >
          <div className={`absolute inset-y-0 left-0 w-1.5 ${stat.strip}`} />
          <div className="flex items-center justify-between">
            <div className="text-[9px] uppercase tracking-wide ${stat.titleColor}">{stat.name}</div>
            <div className={`h-6 w-6 rounded-md ${stat.badgeBg} flex items-center justify-center`}>
              <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
            </div>
          </div>
          <div className={`mt-0.5 text-lg font-extrabold ${stat.valueColor} leading-none`}>{stat.value}</div>
          <div className={`mt-1 h-0.5 w-full rounded-full ${stat.barTrack} overflow-hidden`}>
            <div className={`h-full w-full ${stat.barFill}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
