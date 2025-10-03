'use client';

import SalaCard from './SalaCard';
import { Sala } from '@/services/api';
import { LazyList } from '@/components/common/LazyWrapper';

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
    <LazyList
      items={salas}
      renderItem={(sala) => (
        <SalaCard
          sala={sala}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      className="divide-y divide-white/10"
      threshold={0.1}
      rootMargin="100px"
    />
  );
}
