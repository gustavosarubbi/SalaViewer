'use client';

import SalaCard from './SalaCard';
import { Sala } from '@/services/api';

interface SalasListProps {
  salas: Sala[];
  onEdit: (sala: Sala) => void;
  onDelete: (sala: Sala) => void;
}

export default function SalasList({ salas, onEdit, onDelete }: SalasListProps) {
  if (salas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/70">
          <p className="text-lg font-medium">Nenhuma sala encontrada</p>
          <p className="text-sm">Tente ajustar os termos de busca</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="shadow-2xl overflow-hidden rounded-2xl"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <ul className="divide-y divide-white/10">
        {salas.map((sala) => (
          <SalaCard
            key={sala.id}
            sala={sala}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
