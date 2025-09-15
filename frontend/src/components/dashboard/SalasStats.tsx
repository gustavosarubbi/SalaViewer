'use client';

import { UserMinus, DoorOpen, Building2 } from 'lucide-react';

interface SalasStatsProps {
  totalSalas: number;
  salasOcupadas: number;
  salasDisponiveis: number;
}

export default function SalasStats({ totalSalas, salasOcupadas, salasDisponiveis }: SalasStatsProps) {
  const stats = [
    {
      name: 'Total de Salas',
      value: totalSalas,
      icon: Building2,
      iconBgColor: 'bg-cyan-500',
      borderColor: 'border-cyan-400/30',
      iconColor: 'text-white',
      description: 'Todas as salas do sistema',
      accentColor: 'bg-cyan-500'
    },
    {
      name: 'Salas Ocupadas',
      value: salasOcupadas,
      icon: UserMinus,
      iconBgColor: 'bg-red-custom',
      borderColor: 'border-red-400/30',
      iconColor: 'text-white',
      description: 'Salas em uso no momento',
      accentColor: 'bg-red-custom'
    },
    {
      name: 'Salas Disponíveis',
      value: salasDisponiveis,
      icon: DoorOpen,
      iconBgColor: 'bg-green-custom',
      borderColor: 'border-green-400/30',
      iconColor: 'text-white',
      description: 'Salas livres para uso',
      accentColor: 'bg-green-custom'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div
          key={stat.name}
          className={`group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl ${stat.borderColor} border`}
          style={{
            backdropFilter: 'blur(500px)',
            WebkitBackdropFilter: 'blur(500px)',
            background: 'rgba(255, 255, 255, 0.35)',
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="relative p-4">
            <div className="flex items-start justify-between">
              {/* Content */}
              <div className="space-y-1 flex-1">
                <h3 className="text-xs font-medium text-white/70 leading-tight">
                  {stat.name}
                </h3>
                <p className="text-xs text-white/50 leading-tight">
                  {stat.description}
                </p>
                <div className="pt-1">
                  <p className="text-xl font-bold text-white group-hover:text-white/90 transition-colors duration-300">
                    {stat.value}
                  </p>
                </div>
              </div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.iconBgColor} shadow-md group-hover:scale-110 transition-transform duration-300 ml-3`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} aria-hidden="true" />
              </div>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.accentColor} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      ))}
    </div>
  );
}
