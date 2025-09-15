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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Ocupação por Andar
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/70">Ordenar por:</span>
            <div className="flex space-x-1">
              {(['andar', 'ocupacao', 'salas'] as SortOrder[]).map((order) => (
                <button
                  key={order}
                  onClick={() => handleSort(order)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                    sortOrder === order
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
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
        <div className="space-y-4">
          {sortedData.map((item) => {
            const percentualOcupacao = item.salas > 0 ? Math.round((item.ocupadas / item.salas) * 100) : 0;
            return (
              <div key={item.andar} className="flex items-center">
                <div className="w-16 text-sm font-semibold text-white">
                  {item.andar}º
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-lg"
                      style={{ width: `${percentualOcupacao}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-sm text-white/70 text-right">
                  {item.ocupadas}/{item.salas}
                </div>
                <div className="w-12 text-sm text-white font-semibold text-right">
                  {percentualOcupacao}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
