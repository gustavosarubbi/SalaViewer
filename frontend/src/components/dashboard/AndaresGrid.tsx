'use client';

import AndarCard from './AndarCard';
import { Andar, Sala } from '@/services/api';

interface AndaresGridProps {
  andares: Andar[];
  salas: Sala[];
  onEdit: (andar: Andar) => void;
  onDelete: (andar: Andar) => void;
}

export default function AndaresGrid({ andares, salas, onEdit, onDelete }: AndaresGridProps) {
  if (andares.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-white/70">
          <p className="text-lg font-medium">Nenhum andar encontrado</p>
          <p className="text-sm">Tente ajustar os termos de busca</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {andares.map((andar) => (
        <AndarCard
          key={andar.id}
          andar={andar}
          salas={salas.filter(sala => sala.andar && sala.andar.id === andar.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
