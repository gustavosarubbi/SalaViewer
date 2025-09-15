'use client';

import { Home, BarChart3 } from 'lucide-react';

interface Activity {
  tipo: string;
  descricao: string;
  data: string;
}

interface DashboardRecentActivityProps {
  activities: Activity[];
}

export default function DashboardRecentActivity({ activities }: DashboardRecentActivityProps) {
  return (
    <div className="card-blur-intense rounded-2xl shadow-2xl animate-slide-in">
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Atividade Recente
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-white/20"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-transparent ${
                        activity.tipo === 'criacao' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}>
                        {activity.tipo === 'criacao' ? (
                          <Home className="h-4 w-4 text-white" />
                        ) : (
                          <BarChart3 className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-white/70">
                          {activity.descricao}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-white/50">
                        <time>
                          {new Date(activity.data).toLocaleDateString('pt-BR')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
