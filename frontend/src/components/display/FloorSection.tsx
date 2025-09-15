import { FloorHeader } from './FloorHeader';
import { RoomCards } from './RoomCards';
import { Sala, Andar } from '@/services/api';

interface FloorSectionProps {
  andar: Andar;
  salas: Sala[];
}

export function FloorSection({ andar, salas }: FloorSectionProps) {
  return (
    <div className="mb-8">
      <FloorHeader andar={andar} />
      <RoomCards salas={salas} />
    </div>
  );
}
