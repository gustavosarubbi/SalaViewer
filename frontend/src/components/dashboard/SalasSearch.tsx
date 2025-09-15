'use client';

import { Search } from 'lucide-react';

interface SalasSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SalasSearch({ searchTerm, onSearchChange }: SalasSearchProps) {
  return (
    <div className="max-w-md">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        <input
          type="text"
          className="block w-full rounded-xl py-3 pl-10 pr-3 text-white placeholder:text-white/50 focus:placeholder:text-white/70 transition-all duration-300 bg-white/5 border border-white/10 focus:bg-white/8 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:text-sm sm:leading-6"
          placeholder="Buscar salas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
