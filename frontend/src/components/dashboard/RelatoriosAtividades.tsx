'use client';

import { Home, BarChart3 } from 'lucide-react';

interface Atividade {
  tipo: string;
  descricao: string;
  data: string;
}

interface RelatoriosAtividadesProps {
  atividades: Atividade[];
}

export default function RelatoriosAtividades({ atividades }: RelatoriosAtividadesProps) {
  return (
    <div 
      className="shadow-2xl rounded-2xl"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="px-6 py-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Atividades Recentes
        </h3>
        <div className="flow-root">
          {atividades && atividades.length > 0 ? (
            <ul className="-mb-8">
              {atividades.map((atividade, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== atividades.length - 1 && (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-white/20"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-transparent ${
                        atividade.tipo === 'criacao' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                      }`}>
                        {atividade.tipo === 'criacao' ? (
                          <Home className="h-4 w-4 text-white" />
                        ) : (
                          <BarChart3 className="h-4 w-4 text-white" />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-white/70">
                          {atividade.descricao}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-white/50">
                        <time>
                          {new Date(atividade.data).toLocaleDateString('pt-BR')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="text-white/50 mb-2">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Nenhuma atividade recente</p>
                <p className="text-xs text-white/40 mt-1">
                  As atividades aparecerão aqui conforme as salas forem atualizadas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
