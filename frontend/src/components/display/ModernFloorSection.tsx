import { ModernRoomCard } from './ModernRoomCard';
import { ModernFloorCard } from './ModernFloorCard';
import { FloorSectionProps } from './types';

export function ModernFloorSection({ andar, salas }: FloorSectionProps) {
  // Dividir salas em duas colunas se houver mais de 8 salas (reduzido de 10)
  const shouldSplit = salas.length > 8;
  const midPoint = Math.ceil(salas.length / 2);
  const leftSalas = salas.slice(0, midPoint);
  const rightSalas = salas.slice(midPoint);

  return (
    <div className="space-y-2">
      <ModernFloorCard andar={andar} salas={salas} />

      {shouldSplit ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-2 relative">
          {/* Coluna Esquerda */}
          <div className="space-y-2 relative">
            {leftSalas.map((sala) => (
              <ModernRoomCard key={sala.id} sala={sala} />
            ))}
          </div>
          
          {/* Divisor High-Tech Branco Simples */}
          <div 
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[4px] transform -translate-x-1/2 z-10"
            style={{
              background: `linear-gradient(180deg, 
                transparent 0%, 
                rgba(255, 255, 255, 0.3) 10%, 
                rgba(255, 255, 255, 0.7) 25%, 
                rgba(255, 255, 255, 0.9) 40%, 
                white 50%, 
                rgba(255, 255, 255, 0.9) 60%, 
                rgba(255, 255, 255, 0.7) 75%, 
                rgba(255, 255, 255, 0.3) 90%, 
                transparent 100%)`,
              boxShadow: `
                0 0 20px rgba(255, 255, 255, 0.8), 
                0 0 40px rgba(255, 255, 255, 0.6),
                0 0 60px rgba(255, 255, 255, 0.4),
                inset 0 0 4px rgba(255, 255, 255, 0.9)
              `,
              filter: 'brightness(1.2) contrast(1.1)'
            }}
          >
            {/* Aura externa brilhante */}
            <div 
              className="absolute inset-0 w-[8px] h-full transform -translate-x-1/2 left-1/2"
              style={{
                background: `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.2) 20%, 
                  rgba(255, 255, 255, 0.4) 50%, 
                  rgba(255, 255, 255, 0.2) 80%, 
                  transparent 100%)`,
                filter: 'blur(3px)',
                opacity: 0.8
              }}
            />
            
            {/* Linha central de energia branca */}
            <div 
              className="absolute inset-0 w-[2px] h-full transform -translate-x-1/2 left-1/2"
              style={{
                background: `linear-gradient(180deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.6) 20%, 
                  white 40%, 
                  rgba(255, 255, 255, 1) 50%, 
                  white 60%, 
                  rgba(255, 255, 255, 0.6) 80%, 
                  transparent 100%)`,
                boxShadow: `0 0 12px white, 0 0 24px rgba(255, 255, 255, 0.8)`
              }}
            />
            
            {/* Linhas de conexão horizontais */}
            <div 
              className="absolute top-1/2 left-0 w-[30px] h-[2px] transform -translate-y-1/2 -translate-x-full"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, white 100%)`,
                boxShadow: `0 0 8px rgba(255, 255, 255, 0.8)`
              }}
            />
            <div 
              className="absolute top-1/2 right-0 w-[30px] h-[2px] transform -translate-y-1/2 translate-x-full"
              style={{
                background: `linear-gradient(90deg, white 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)`,
                boxShadow: `0 0 8px rgba(255, 255, 255, 0.8)`
              }}
            />
          </div>
          
          {/* Coluna Direita */}
          <div className="space-y-2 relative">
            {rightSalas.map((sala) => (
              <ModernRoomCard key={sala.id} sala={sala} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {salas.map((sala) => (
            <ModernRoomCard key={sala.id} sala={sala} />
          ))}
        </div>
      )}
    </div>
  );
}
