import { RoomCardProps } from './types';
import { useSalaColorsWithFallback, useColorVariations } from './hooks/useDisplayColors';

export function CarouselRoomCard({ sala }: RoomCardProps) {
  const isOcupada = Boolean(sala.nome_ocupante && sala.nome_ocupante.trim() !== '');
  
  // Usa o novo sistema de cores com fallback para compatibilidade
  const salaColors = useSalaColorsWithFallback(isOcupada);
  const textColor = salaColors.textColor;
  const colorVariations = useColorVariations(textColor);

  return (
    <div
      className="no-glass relative text-white overflow-visible transition-all duration-300 hover:scale-[1.02]"
      style={{
        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
        filter: `drop-shadow(0 0 20px ${isOcupada ? 'rgba(37, 99, 235, 0.7)' : 'rgba(16, 185, 129, 0.7)'}) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))`
      }}
    >
      {/* Container com bordas neon */}
      <div
        className="relative h-12"
        style={{
          background: isOcupada 
            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.42) 0%, rgba(59, 130, 246, 0.48) 50%, rgba(37, 99, 235, 0.42) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.42) 0%, rgba(52, 211, 153, 0.48) 50%, rgba(16, 185, 129, 0.42) 100%)',
          backdropFilter: 'blur(123px) saturate(200%)',
          WebkitBackdropFilter: 'blur(123px) saturate(200%)',
          border: `1px solid ${isOcupada ? 'rgba(59, 130, 246, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`,
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
            0 0 20px ${isOcupada ? 'rgba(37, 99, 235, 0.3)' : 'rgba(16, 185, 129, 0.3)'}
          `
        }}
      >
        {/* Brilho interno suave */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-x-0 top-0 h-1/2 opacity-30"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)'
            }}
          />
          {/* Brilho perimetral */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(45deg, transparent 0%, ${isOcupada ? 'rgba(59, 130, 246, 0.1)' : 'rgba(52, 211, 153, 0.1)'} 25%, transparent 50%, ${isOcupada ? 'rgba(59, 130, 246, 0.1)' : 'rgba(52, 211, 153, 0.1)'} 75%, transparent 100%)`,
              filter: 'blur(2px)'
            }}
          />
        </div>

        {/* Bordas neon suaves e elegantes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cantos modernos com glow suave */}
          <div 
            className="absolute top-0 left-0 w-4 h-4"
            style={{ 
              borderTop: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              borderLeft: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              boxShadow: `0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.5)' : 'rgba(52, 211, 153, 0.5)'}`,
              filter: 'blur(0.5px)'
            }} 
          />
          <div 
            className="absolute top-0 right-0 w-4 h-4"
            style={{ 
              borderTop: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              borderRight: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              boxShadow: `0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.5)' : 'rgba(52, 211, 153, 0.5)'}`,
              filter: 'blur(0.5px)'
            }} 
          />
          <div 
            className="absolute bottom-0 left-0 w-4 h-4"
            style={{ 
              borderBottom: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              borderLeft: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              boxShadow: `0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.5)' : 'rgba(52, 211, 153, 0.5)'}`,
              filter: 'blur(0.5px)'
            }} 
          />
          <div 
            className="absolute bottom-0 right-0 w-4 h-4"
            style={{ 
              borderBottom: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              borderRight: `2px solid ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}`,
              boxShadow: `0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.5)' : 'rgba(52, 211, 153, 0.5)'}`,
              filter: 'blur(0.5px)'
            }} 
          />
      </div>

        {/* Scan lines effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)',
            animation: 'scan-lines 8s linear infinite'
          }}
        />

        {/* Glitch effect overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${isOcupada ? 'rgba(37, 99, 235, 0.2)' : 'rgba(16, 185, 129, 0.2)'} 50%, transparent 100%)`,
            animation: 'glitch-sweep 3s ease-in-out infinite'
          }}
        />

        {/* Animações CSS high-tech */}
        <style jsx>{`
          @keyframes scan-horizontal {
            0%, 100% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
          }
          
          @keyframes scan-vertical {
            0%, 100% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
          }
          
          @keyframes scan-lines {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
          }
          
          @keyframes glitch-sweep {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
          
          @keyframes data-stream {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 0.3; }
            100% { transform: translateY(100%); opacity: 0; }
          }
        `}</style>

        <div className="flex items-stretch h-12 relative z-10">
          {/* Barra lateral high-tech com data stream */}
          <div
            className="w-10 self-stretch relative overflow-hidden"
            style={{ 
              background: isOcupada
                ? 'linear-gradient(180deg, rgba(59, 130, 246, 1) 0%, rgba(37, 99, 235, 1) 50%, rgba(59, 130, 246, 1) 100%)'
                : 'linear-gradient(180deg, rgba(52, 211, 153, 1) 0%, rgba(16, 185, 129, 1) 50%, rgba(52, 211, 153, 1) 100%)',
              boxShadow: `
                inset 0 0 30px ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'},
                0 0 20px ${isOcupada ? 'rgba(59, 130, 246, 0.6)' : 'rgba(52, 211, 153, 0.6)'},
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >
            {/* Data stream animado mais intenso */}
            <div 
              className="absolute inset-0 w-full h-6"
              style={{
                background: `linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2), transparent)`,
                animation: 'data-stream 1.2s linear infinite',
                boxShadow: `0 0 20px rgba(255, 255, 255, 0.7), 0 0 40px rgba(255, 255, 255, 0.3)`
              }}
            />
            
            {/* Linhas horizontais tech mais acentuadas */}
            <div 
              className="absolute top-1/4 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}, rgba(255, 255, 255, 0.6), ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}, transparent)`,
                boxShadow: `0 0 8px rgba(255, 255, 255, 0.5), 0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`
              }}
            />
            <div 
              className="absolute top-2/4 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${isOcupada ? 'rgba(59, 130, 246, 0.9)' : 'rgba(52, 211, 153, 0.9)'}, rgba(255, 255, 255, 0.8), ${isOcupada ? 'rgba(59, 130, 246, 0.9)' : 'rgba(52, 211, 153, 0.9)'}, transparent)`,
                boxShadow: `0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px ${isOcupada ? 'rgba(59, 130, 246, 0.5)' : 'rgba(52, 211, 153, 0.5)'}`
              }}
            />
            <div 
              className="absolute top-3/4 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}, rgba(255, 255, 255, 0.6), ${isOcupada ? 'rgba(59, 130, 246, 0.8)' : 'rgba(52, 211, 153, 0.8)'}, transparent)`,
                boxShadow: `0 0 8px rgba(255, 255, 255, 0.5), 0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`
              }}
            />
            
            {/* Brilho interno mais intenso */}
            <div 
              className="absolute inset-0 opacity-60"
              style={{
                background: `radial-gradient(ellipse at center, ${isOcupada ? 'rgba(59, 130, 246, 0.4)' : 'rgba(52, 211, 153, 0.4)'} 0%, rgba(255, 255, 255, 0.2) 30%, transparent 70%)`,
                filter: 'blur(1px)'
              }}
            />
            
            {/* Efeito de scan vertical */}
            <div 
              className="absolute inset-0 w-[1px]"
              style={{
                background: `linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.8), transparent)`,
                animation: 'scan-vertical 2s ease-in-out infinite',
                left: '50%',
                transform: 'translateX(-50%)',
                boxShadow: `0 0 10px rgba(255, 255, 255, 0.6)`
              }}
            />
          </div>

          {/* Área de conteúdo principal */}
          <div className="flex-1 px-4 py-2.5 flex items-center self-stretch relative"
            style={{
              background: isOcupada 
                ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)'
                : 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.08) 100%)'
            }}
          >
            {/* Grid tech background */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}
            />
            
            <div className="flex-1 min-w-0 relative">
              <h3 
                className={`truncate font-bold text-2xl md:text-3xl uppercase tracking-wide`}
                style={{ 
                  color: 'white',
                  textShadow: `0 0 20px ${textColor}, 0 0 35px ${textColor}, 0 2px 8px rgba(0,0,0,0.5)`,
                  fontFamily: 'monospace'
                }}
              >
              {isOcupada ? sala.nome_ocupante : 'Sala Disponível'}
            </h3>
          </div>
        </div>

          {/* Badge do número com design hexagonal tech */}
          <div
            className="w-20 self-stretch flex items-center justify-center text-white relative overflow-hidden px-2"
            style={{ 
              background: isOcupada
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 1) 100%)'
                : 'linear-gradient(135deg, rgba(52, 211, 153, 0.95) 0%, rgba(16, 185, 129, 1) 100%)',
              boxShadow: `inset 0 0 25px ${isOcupada ? 'rgba(59, 130, 246, 0.7)' : 'rgba(52, 211, 153, 0.7)'}`
            }}
          >
            {/* Brilho interno elegante */}
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(ellipse at center, ${isOcupada ? 'rgba(59, 130, 246, 0.2)' : 'rgba(52, 211, 153, 0.2)'} 0%, transparent 60%)`,
                filter: 'blur(1px)'
              }}
            />
            
            {/* Barra separadora neon suave */}
            <div 
              className="absolute left-0 top-2 bottom-2 w-[2px]"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.7), transparent)',
                boxShadow: `0 0 8px rgba(255, 255, 255, 0.6), 0 0 15px ${isOcupada ? 'rgba(59, 130, 246, 0.4)' : 'rgba(52, 211, 153, 0.4)'}`,
                filter: 'blur(0.5px)'
              }}
            />

            {/* Número */}
            <span 
              className="relative text-2xl md:text-3xl font-black tracking-wide font-mono z-10 whitespace-nowrap"
              style={{
                textShadow: `0 0 20px rgba(255, 255, 255, 0.9), 0 0 35px rgba(255, 255, 255, 0.6), 0 2px 6px rgba(0,0,0,0.5)`,
                color: 'white'
              }}
            >
              {sala.numero_sala}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}