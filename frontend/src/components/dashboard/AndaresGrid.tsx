'use client';

import AndarCard from './AndarCard';
import { Andar, Sala } from '@/services/api';
import { LazyList } from '@/components/common/LazyWrapper';

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
    <LazyList
      items={andares}
      renderItem={(andar) => (
        <AndarCard
          andar={andar}
          salas={salas.filter(sala => sala.andar && sala.andar.id === andar.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      threshold={0.1}
      rootMargin="100px"
    />
  );
}
