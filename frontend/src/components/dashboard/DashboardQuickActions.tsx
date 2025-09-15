'use client';

import { Building, BarChart3, DoorOpen } from 'lucide-react';

export default function DashboardQuickActions() {
  const actions = [
    {
      name: 'Gerenciar Salas',
      description: 'Adicionar, editar ou remover salas',
      href: '/dashboard/salas',
      icon: DoorOpen,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
    },
    {
      name: 'Gerenciar Andares',
      description: 'Configurar andares do prédio',
      href: '/dashboard/andares',
      icon: Building,
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'linear-gradient(135deg, #ffcf00 0%, #f59e0b 100%)'
    },
    {
      name: 'Ver Relatórios',
      description: 'Análises e estatísticas',
      href: '/dashboard/relatorios',
      icon: BarChart3,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
    }
  ];

  return (
    <div 
      className="rounded-2xl shadow-2xl animate-slide-in"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="group relative overflow-hidden rounded-xl text-white px-6 py-4 font-semibold transition-all duration-300 hover:-translate-y-1"
              style={{
                background: action.bgColor,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="flex items-center">
                <action.icon className="h-6 w-6 mr-3" />
                <div>
                  <div className="font-semibold">{action.name}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
