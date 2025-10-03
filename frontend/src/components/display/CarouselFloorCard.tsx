import { useAndarColorsWithFallback, useColorVariations } from './hooks/useDisplayColors';

interface CarouselFloorCardProps {
  andar: {
    id: number;
    numero_andar: number;
    nome_identificador?: string;
  };
}

export function CarouselFloorCard({ andar }: CarouselFloorCardProps) {
  // Usa o novo sistema de cores com fallback para compatibilidade
  const andarColors = useAndarColorsWithFallback();
  const accentColor = andarColors.accentColor;
  const accentVariations = useColorVariations(accentColor);
  
  return (
    <div className="w-full flex items-center justify-center py-4">
      {/* Linhas de conexão tecnológicas - estilo quadrado */}
      <div className="flex flex-1 items-center justify-end mr-10">
        <div className="flex items-center gap-4">
          {/* Nó de conexão quadrado */}
          <div 
            className="relative w-5 h-5"
            style={{
              background: `linear-gradient(45deg, ${accentColor}, ${accentColor}80)`,
              boxShadow: `0 0 25px ${accentColor}80, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
              animation: 'square-pulse 2s ease-in-out infinite'
            }}
          />
          {/* Linha de conexão com padrão de dados */}
          <div className="flex-1 relative h-[4px] overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(90deg, ${accentColor}90 0px, ${accentColor}90 6px, transparent 6px, transparent 12px)`,
                animation: 'data-flow 1.8s linear infinite'
              }}
            />
            <div 
              className="absolute inset-0 opacity-70"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
                boxShadow: `0 0 12px ${accentColor}60`
              }}
            />
          </div>
        </div>
      </div>

      {/* Card principal - design quadrado high-tech */}
      <div 
        className="relative group"
        style={{
          filter: `drop-shadow(0 0 20px ${accentColor}40) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.3))`
        }}
      >
        {/* Efeito de aura externa quadrada */}
        <div 
          className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-600"
          style={{
            background: `linear-gradient(45deg, ${accentColor}15, transparent, ${accentColor}15)`,
            transform: 'scale(1.15) rotate(45deg)',
            filter: 'blur(20px)',
            animation: 'aura-rotate 6s linear infinite'
          }}
        />
        
        {/* Container principal quadrado */}
        <div
          className="relative w-56 h-14"
          style={{
            background: `linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.7) 50%, rgba(59, 130, 246, 0.5) 100%)`,
            backdropFilter: 'blur(130px) saturate(220%)',
            WebkitBackdropFilter: 'blur(130px) saturate(220%)',
            border: `3px solid ${accentColor}80`,
            boxShadow: `
              inset 0 3px 0 rgba(255, 255, 255, 0.15),
              inset 0 -3px 0 rgba(0, 0, 0, 0.15),
              0 0 25px ${accentColor}40,
              0 0 50px ${accentColor}25
            `
          }}
        >
          {/* Padrão de grid high-tech */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(${accentColor}30 1px, transparent 1px),
                linear-gradient(90deg, ${accentColor}30 1px, transparent 1px),
                radial-gradient(circle at 25% 25%, ${accentColor}20 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, ${accentColor}20 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px, 20px 20px, 40px 40px, 40px 40px',
              animation: 'grid-scan 4s ease-in-out infinite'
            }}
          />

          {/* Efeito de energia quadrada pulsante */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{
              background: `linear-gradient(45deg, ${accentColor}20 0%, transparent 50%, ${accentColor}20 100%)`,
              animation: 'energy-square 3s ease-in-out infinite'
            }}
          />

          {/* Bordas de energia nos cantos quadrados */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Cantos quadrados com energia */}
            <div 
              className="absolute top-0 left-0 w-8 h-8"
              style={{ 
                background: `linear-gradient(135deg, ${accentColor}60, transparent)`,
                boxShadow: `0 0 15px ${accentColor}50`,
                filter: 'blur(1px)'
              }} 
            />
            <div 
              className="absolute top-0 right-0 w-8 h-8"
              style={{ 
                background: `linear-gradient(225deg, ${accentColor}60, transparent)`,
                boxShadow: `0 0 15px ${accentColor}50`,
                filter: 'blur(1px)'
              }} 
            />
            <div 
              className="absolute bottom-0 left-0 w-8 h-8"
              style={{ 
                background: `linear-gradient(45deg, ${accentColor}60, transparent)`,
                boxShadow: `0 0 15px ${accentColor}50`,
                filter: 'blur(1px)'
              }} 
            />
            <div 
              className="absolute bottom-0 right-0 w-8 h-8"
              style={{ 
                background: `linear-gradient(315deg, ${accentColor}60, transparent)`,
                boxShadow: `0 0 15px ${accentColor}50`,
                filter: 'blur(1px)'
              }} 
            />
          </div>

          {/* Linhas de energia cruzadas */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Linha horizontal */}
            <div 
              className="absolute top-1/2 left-0 right-0 h-[2px] transform -translate-y-1/2"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}50, ${accentColor}70, ${accentColor}50, transparent)`,
                boxShadow: `0 0 10px ${accentColor}50`,
                animation: 'line-flow-h 2.5s ease-in-out infinite'
              }}
            />
            {/* Linha vertical */}
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-[2px] transform -translate-x-1/2"
              style={{
                background: `linear-gradient(180deg, transparent, ${accentColor}50, ${accentColor}70, ${accentColor}50, transparent)`,
                boxShadow: `0 0 10px ${accentColor}50`,
                animation: 'line-flow-v 2.5s ease-in-out infinite',
                animationDelay: '1.25s'
              }}
            />
          </div>

          {/* Conteúdo principal */}
          <div className="relative z-10 flex items-center justify-center h-full px-6">
            {/* Divisor vertical esquerdo - Ultra fino e high-tech */}
            <div className="flex flex-col items-center mr-6">
              <div 
                className="relative w-[0.5px] h-12"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${accentColor}15 15%, ${accentColor}70 45%, ${accentColor}80 50%, ${accentColor}70 55%, ${accentColor}15 85%, transparent 100%)`,
                  boxShadow: `
                    0 0 4px ${accentColor}60, 
                    0 0 8px ${accentColor}40,
                    0 0 12px ${accentColor}20,
                    inset 0 0 1px rgba(255, 255, 255, 0.6)
                  `,
                }}
              >
                {/* Efeito de scan vertical refinado */}
                <div 
                  className="absolute inset-0 w-full"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${accentColor}40 20%, ${accentColor}80 50%, ${accentColor}40 80%, transparent 100%)`,
                    filter: 'blur(0.5px)'
                  }}
                />
                {/* Partículas de energia */}
                <div 
                  className="absolute top-0 left-1/2 w-[2px] h-[2px] transform -translate-x-1/2"
                  style={{
                    background: accentColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 6px ${accentColor}`
                  }}
                />
                <div 
                  className="absolute bottom-0 left-1/2 w-[2px] h-[2px] transform -translate-x-1/2"
                  style={{
                    background: accentColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 6px ${accentColor}`
                  }}
                />
              </div>
            </div>

            {/* Título do andar */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <                h2 
                  className="text-3xl md:text-4xl font-black tracking-wider uppercase font-mono"
                  style={{ 
                    color: 'white',
                    textShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}, 0 2px 6px rgba(0,0,0,0.5)`
                  }}
                >
                  {andar.nome_identificador || `Andar`}
                </h2>
                
                {/* Divisor tecnológico ultra fino central */}
                <div 
                  className="relative w-[0.15px] h-10 mx-1"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${accentColor}20 15%, ${accentColor}90 45%, ${accentColor} 50%, ${accentColor}90 55%, ${accentColor}20 85%, transparent 100%)`,
                    boxShadow: `
                      0 0 3px ${accentColor}90, 
                      0 0 6px ${accentColor}60,
                      0 0 10px ${accentColor}30,
                      inset 0 0 0.5px rgba(255, 255, 255, 0.95)
                    `,
                    filter: 'brightness(1.3) contrast(1.1)'
                  }}
                >
                  {/* Efeito de scan vertical tecnológico */}
                  <div 
                    className="absolute inset-0 w-full"
                    style={{
                      background: `linear-gradient(180deg, transparent 0%, ${accentColor}25 30%, ${accentColor}95 50%, ${accentColor}25 70%, transparent 100%)`,
                      filter: 'blur(0.2px)',
                      opacity: 0.8
                    }}
                  />
                  {/* Nó central de energia tecnológico */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-[1px] h-[1px] transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: accentColor,
                      borderRadius: '50%',
                      boxShadow: `
                        0 0 2px ${accentColor}, 
                        0 0 4px ${accentColor}85,
                        0 0 6px ${accentColor}40
                      `
                    }}
                  />
                </div>
                
                <div 
                  className="text-3xl md:text-4xl font-black tracking-wider font-mono"
                  style={{ 
                    color: 'white',
                    textShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}, 0 2px 6px rgba(0,0,0,0.5)`
                  }}
                >
                  {andar.numero_andar}
                </div>
              </div>
            </div>

            {/* Divisor vertical direito - Ultra fino e high-tech */}
            <div className="flex flex-col items-center ml-6">
              <div 
                className="relative w-[0.5px] h-11"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${accentColor}15 15%, ${accentColor}70 45%, ${accentColor}80 50%, ${accentColor}70 55%, ${accentColor}15 85%, transparent 100%)`,
                  boxShadow: `
                    0 0 4px ${accentColor}60, 
                    0 0 8px ${accentColor}40,
                    0 0 12px ${accentColor}20,
                    inset 0 0 1px rgba(255, 255, 255, 0.6)
                  `
                }}
              >
                {/* Efeito de scan vertical refinado */}
                <div 
                  className="absolute inset-0 w-full"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${accentColor}40 20%, ${accentColor}80 50%, ${accentColor}40 80%, transparent 100%)`,
                    filter: 'blur(0.5px)'
                  }}
                />
                {/* Partículas de energia */}
                <div 
                  className="absolute top-0 left-1/2 w-[2px] h-[2px] transform -translate-x-1/2"
                  style={{
                    background: accentColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 6px ${accentColor}`
                  }}
                />
                <div 
                  className="absolute bottom-0 left-1/2 w-[2px] h-[2px] transform -translate-x-1/2"
                  style={{
                    background: accentColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 6px ${accentColor}`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linhas de conexão tecnológicas - estilo quadrado */}
      <div className="flex flex-1 items-center justify-start ml-10">
        <div className="flex items-center gap-4">
          {/* Linha de conexão com padrão de dados */}
          <div className="flex-1 relative h-[4px] overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(90deg, transparent 0px, transparent 6px, ${accentColor}90 6px, ${accentColor}90 12px)`,
                animation: 'data-flow 1.8s linear infinite reverse'
              }}
            />
            <div 
              className="absolute inset-0 opacity-70"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
                boxShadow: `0 0 12px ${accentColor}60`
              }}
            />
          </div>
          {/* Nó de conexão quadrado */}
          <div 
            className="relative w-5 h-5"
            style={{
              background: `linear-gradient(45deg, ${accentColor}, ${accentColor}80)`,
              boxShadow: `0 0 25px ${accentColor}80, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
              animation: 'square-pulse 2s ease-in-out infinite',
              animationDelay: '1.5s'
            }}
          />
        </div>
      </div>

      {/* Animações CSS high-tech */}
      <style jsx>{`
        @keyframes square-pulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.2) rotate(45deg);
            opacity: 1;
          }
        }
        
        @keyframes data-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes aura-rotate {
          0% { transform: scale(1.15) rotate(45deg); }
          100% { transform: scale(1.15) rotate(405deg); }
        }
        
        @keyframes grid-scan {
          0%, 100% { 
            opacity: 0.1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.3;
            transform: scale(1.02);
          }
        }
        
        @keyframes energy-square {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        @keyframes line-flow-h {
          0%, 100% { 
            opacity: 0.6;
            transform: translateY(-50%) scaleX(1);
          }
          50% { 
            opacity: 1;
            transform: translateY(-50%) scaleX(1.1);
          }
        }
        
        @keyframes line-flow-v {
          0%, 100% { 
            opacity: 0.6;
            transform: translateX(-50%) scaleY(1);
          }
          50% { 
            opacity: 1;
            transform: translateX(-50%) scaleY(1.1);
          }
        }
        
               @keyframes square-indicator {
                 0%, 100% { 
                   opacity: 0.7;
                   transform: scale(1) rotate(0deg);
                 }
                 50% { 
                   opacity: 1;
                   transform: scale(1.3) rotate(45deg);
                 }
               }
               
               @keyframes divider-pulse {
                 0%, 100% { 
                   opacity: 0.6;
                   transform: scaleY(1);
                 }
                 50% { 
                   opacity: 1;
                   transform: scaleY(1.1);
                 }
               }
               
               @keyframes divider-scan {
                 0% { 
                   transform: translateY(-100%);
                   opacity: 0;
                 }
                 50% { 
                   opacity: 1;
                 }
                 100% { 
                   transform: translateY(100%);
                   opacity: 0;
                 }
               }
               
               @keyframes divider-pulse-refined {
                 0%, 100% { 
                   opacity: 0.7;
                   transform: scaleY(1) scaleX(1);
                   filter: brightness(1);
                 }
                 50% { 
                   opacity: 1;
                   transform: scaleY(1.15) scaleX(1.5);
                   filter: brightness(1.3);
                 }
               }
               
               @keyframes divider-scan-refined {
                 0% { 
                   transform: translateY(-120%);
                   opacity: 0;
                   filter: blur(1px);
                 }
                 25% { 
                   opacity: 0.6;
                   filter: blur(0.5px);
                 }
                 50% { 
                   opacity: 1;
                   filter: blur(0.3px);
                 }
                 75% { 
                   opacity: 0.6;
                   filter: blur(0.5px);
                 }
                 100% { 
                   transform: translateY(120%);
                   opacity: 0;
                   filter: blur(1px);
                 }
               }
               
               @keyframes divider-pulse-central {
                 0%, 100% { 
                   opacity: 0.8;
                   transform: scaleY(1) scaleX(1);
                   filter: brightness(1.2);
                 }
                 50% { 
                   opacity: 1;
                   transform: scaleY(1.2) scaleX(2);
                   filter: brightness(1.5);
                 }
               }
               
               @keyframes divider-scan-central {
                 0% { 
                   transform: translateY(-100%);
                   opacity: 0;
                   filter: blur(0.5px);
                 }
                 30% { 
                   opacity: 0.8;
                   filter: blur(0.2px);
                 }
                 50% { 
                   opacity: 1;
                   filter: blur(0.1px);
                 }
                 70% { 
                   opacity: 0.8;
                   filter: blur(0.2px);
                 }
                 100% { 
                   transform: translateY(100%);
                   opacity: 0;
                   filter: blur(0.5px);
                 }
               }
               
               @keyframes particle-flow-down {
                 0% { 
                   transform: translateY(-200%) translateX(-50%);
                   opacity: 0;
                   scale: 0.5;
                 }
                 20% { 
                   opacity: 1;
                   scale: 1;
                 }
                 80% { 
                   opacity: 1;
                   scale: 1;
                 }
                 100% { 
                   transform: translateY(200%) translateX(-50%);
                   opacity: 0;
                   scale: 0.5;
                 }
               }
               
               @keyframes particle-flow-up {
                 0% { 
                   transform: translateY(200%) translateX(-50%);
                   opacity: 0;
                   scale: 0.5;
                 }
                 20% { 
                   opacity: 1;
                   scale: 1;
                 }
                 80% { 
                   opacity: 1;
                   scale: 1;
                 }
                 100% { 
                   transform: translateY(-200%) translateX(-50%);
                   opacity: 0;
                   scale: 0.5;
                 }
               }
               
               @keyframes energy-node-static {
                 0%, 100% { 
                   opacity: 0.9;
                   transform: translate(-50%, -50%) scale(1);
                   filter: brightness(1.3);
                 }
                 50% { 
                   opacity: 1;
                   transform: translate(-50%, -50%) scale(1.1);
                   filter: brightness(1.4);
                 }
               }
      `}</style>
    </div>
  );
}