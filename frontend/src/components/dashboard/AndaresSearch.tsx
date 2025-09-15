'use client';

import { Search, ArrowUpDown, Filter } from 'lucide-react';

interface AndaresSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}

export default function AndaresSearch({ searchTerm, onSearchChange, sortOrder, onSortChange }: AndaresSearchProps) {
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
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-white/70 mr-2" />
          <h3 className="text-lg font-semibold text-white">Filtros e Busca</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Campo de busca */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Buscar andares
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                <Search className="h-5 w-5 text-white/70" />
              </div>
              <input
                type="text"
                className="block w-full rounded-xl py-3 pl-10 pr-3 text-white placeholder:text-white/50 focus:placeholder:text-white/70 transition-all duration-300 bg-white/5 border border-white/10 focus:bg-white/8 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm sm:leading-6"
                placeholder="Buscar andares..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Filtro de ordenação */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <ArrowUpDown className="inline h-4 w-4 mr-1" />
              Ordenar por
            </label>
            <select
              className="block w-full rounded-xl py-3 px-3 text-white bg-white/10 border border-white/20 focus:bg-white/15 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
              style={{
                colorScheme: 'dark'
              }}
            >
              <option value="asc" className="bg-gray-800 text-white">Número crescente</option>
              <option value="desc" className="bg-gray-800 text-white">Número decrescente</option>
            </select>
          </div>
        </div>

        {/* Botão limpar filtros */}
        {(searchTerm || sortOrder !== 'asc') && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onSortChange('asc');
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white/90 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-200"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
