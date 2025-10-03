'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface OcupacaoPorAndar {
  andar: number;
  salas: number;
  ocupadas: number;
}

interface RelatoriosOcupacaoProps {
  ocupacaoPorAndar: OcupacaoPorAndar[];
}

type SortOrder = 'andar' | 'ocupacao' | 'salas';

export default function RelatoriosOcupacao({ ocupacaoPorAndar }: RelatoriosOcupacaoProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('andar');
  const [isAscending, setIsAscending] = useState(true);

  const handleSort = (order: SortOrder) => {
    if (sortOrder === order) {
      setIsAscending(!isAscending);
    } else {
      setSortOrder(order);
      setIsAscending(true);
    }
  };

  const sortedData = [...ocupacaoPorAndar].sort((a, b) => {
    let comparison = 0;
    
    switch (sortOrder) {
      case 'andar':
        comparison = a.andar - b.andar;
        break;
      case 'ocupacao':
        const percentualA = a.salas > 0 ? (a.ocupadas / a.salas) * 100 : 0;
        const percentualB = b.salas > 0 ? (b.ocupadas / b.salas) * 100 : 0;
        comparison = percentualA - percentualB;
        break;
      case 'salas':
        comparison = a.salas - b.salas;
        break;
    }
    
    return isAscending ? comparison : -comparison;
  });


  return (
    <div className="space-y-6">
      {/* Controles (sem título interno; o título vem do Section) */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Ordenar por:</span>
          <div className="flex space-x-1">
            {(['andar', 'ocupacao', 'salas'] as SortOrder[]).map((order) => (
              <button
                key={order}
                onClick={() => handleSort(order)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                  sortOrder === order
                    ? 'bg-blue-600/30 text-blue-300 border border-white/10'
                    : 'bg-white/10 text-white/70 border border-white/10 hover:bg-white/20'
                }`}
              >
                {order === 'andar' ? 'Andar' : order === 'ocupacao' ? 'Ocupação' : 'Salas'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAscending(!isAscending)}
            className="p-1 text-white/70 hover:text-white transition-colors"
            title={`${isAscending ? 'Decrescente' : 'Crescente'}`}
          >
            <ArrowUpDown className={`h-4 w-4 transition-transform ${!isAscending ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2.5">
        {sortedData.map((item) => {
          const percentualOcupacao = item.salas > 0 ? Math.round((item.ocupadas / item.salas) * 100) : 0;
          const colorStrip = 'bg-amber-400/70';
          const barTrack = 'bg-amber-500/20';
          const barFill = 'bg-amber-400';
          const textColor = 'text-amber-200';
          return (
            <div
              key={item.andar}
              className={`relative overflow-hidden rounded-lg bg-amber-500/10 border border-amber-500/25 p-2.5`}
            >
              {/* Faixa lateral */}
              <div className={`absolute inset-y-0 left-0 w-1.5 ${colorStrip}`} />

              <div className="flex items-center gap-3">
                {/* Badge do andar */}
                <div className="shrink-0">
                  <div className="px-2 py-1 rounded-md bg-amber-500/15 border border-amber-500/25 text-[10px] font-semibold text-amber-200">
                    {item.andar}º Andar
                  </div>
                </div>

                {/* Barra de ocupação */}
                <div className="flex-1">
                  <div className={`h-2 w-full rounded-full ${barTrack} overflow-hidden`}>
                    <div
                      className={`${barFill} h-full`}
                      style={{ width: `${percentualOcupacao}%` }}
                    />
                  </div>
                </div>

                {/* Valores */}
                <div className="shrink-0 text-right">
                  <div className="text-[10px] text-amber-200/80">{item.ocupadas}/{item.salas}</div>
                  <div className={`text-sm font-bold ${textColor}`}>{percentualOcupacao}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
