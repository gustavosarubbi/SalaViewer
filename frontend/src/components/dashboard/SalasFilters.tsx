'use client';

import { Filter, ArrowUpDown, Building } from 'lucide-react';

interface SalasFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAndar: string;
  onAndarChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  availableAndares: number[];
}

export default function SalasFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedAndar, 
  onAndarChange, 
  sortOrder, 
  onSortChange,
  availableAndares 
}: SalasFiltersProps) {
  return (
    <div 
      className="p-6 rounded-2xl shadow-2xl"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <Filter className="h-5 w-5 text-white/70" />
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Buscar salas
          </label>
          <input
            type="text"
            className="block w-full rounded-xl py-2 px-3 text-white placeholder:text-white/50 bg-white/5 border border-white/10 focus:bg-white/8 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            placeholder="Digite o número da sala..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filtro por andar */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Building className="inline h-4 w-4 mr-1" />
            Filtrar por andar
          </label>
          <select
            className="block w-full rounded-xl py-2 px-3 text-white bg-white/10 border border-white/20 focus:bg-white/15 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
            value={selectedAndar}
            onChange={(e) => onAndarChange(e.target.value)}
            style={{
              colorScheme: 'dark'
            }}
          >
            <option value="" className="bg-gray-800 text-white">Todos os andares</option>
            {availableAndares.map((andar) => (
              <option key={andar} value={andar.toString()} className="bg-gray-800 text-white">
                {andar}º Andar
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <ArrowUpDown className="inline h-4 w-4 mr-1" />
            Ordenar por
          </label>
          <select
            className="block w-full rounded-xl py-2 px-3 text-white bg-white/10 border border-white/20 focus:bg-white/15 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
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
      {(searchTerm || selectedAndar || sortOrder !== 'asc') && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              onSearchChange('');
              onAndarChange('');
              onSortChange('asc');
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white/90 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
}
