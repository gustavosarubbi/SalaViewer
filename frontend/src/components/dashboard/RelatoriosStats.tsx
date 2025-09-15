'use client';

import { Building, BarChart3, DoorOpen, Building2 } from 'lucide-react';

interface RelatoriosStatsProps {
  totalSalas: number;
  totalAndares: number;
  salasOcupadas: number;
  salasDisponiveis: number;
}

export default function RelatoriosStats({ 
  totalSalas, 
  totalAndares, 
  salasOcupadas, 
  salasDisponiveis 
}: RelatoriosStatsProps) {
  const taxaOcupacao = totalSalas > 0 ? Math.round((salasOcupadas / totalSalas) * 100) : 0;

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
      name: 'Total de Andares',
      value: totalAndares,
      icon: Building,
      iconBgColor: 'bg-amber-custom',
      borderColor: 'border-amber-400/30',
      iconColor: 'text-white',
      description: 'Andares cadastrados',
      accentColor: 'bg-amber-custom'
    },
    {
      name: 'Taxa de Ocupação',
      value: `${taxaOcupacao}%`,
      icon: BarChart3,
      iconBgColor: 'bg-orange-500',
      borderColor: 'border-orange-400/30',
      iconColor: 'text-white',
      description: 'Percentual de ocupação',
      accentColor: 'bg-orange-500'
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
