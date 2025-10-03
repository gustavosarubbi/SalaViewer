'use client';

import { Search, Filter } from 'lucide-react';

interface AndaresSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}

export default function AndaresSearch({ searchTerm, onSearchChange, sortOrder, onSortChange }: AndaresSearchProps) {
  return (
    <div className="rounded-2xl card-standard no-glassmorphism">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
          <Filter className="h-5 w-5 text-white/60" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Campo de busca */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Buscar andares</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                <Search className="h-4 w-4 text-white/70" />
              </div>
              <input
                type="text"
                className="block w-full input-standard"
                placeholder="Buscar andares..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Filtro de ordenação */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Ordenar por</label>
            <select
              className="block w-full input-standard"
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
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onSortChange('asc');
              }}
              className="inline-flex items-center btn-secondary"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
