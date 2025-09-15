import { RoomCard } from './RoomCard';
import { Sala } from '@/services/api';

interface RoomCardsProps {
  salas: Sala[];
}

export function RoomCards({ salas }: RoomCardsProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {salas.map((sala) => (
        <RoomCard key={sala.id} sala={sala} />
      ))}
    </div>
  );
}
