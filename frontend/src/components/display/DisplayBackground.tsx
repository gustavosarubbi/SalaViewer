import React, { useEffect, useRef, useState } from 'react';
import { useParticleColors, useBackgroundColors } from './ColorConfig';

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
  dx: number;
  dy: number;
  glow: string;
  phase?: number;
  speedTier?: 'fast' | 'normal' | 'slow';
}

const PARTICLE_COUNT = 25; // Reduzido para displays
const LINE_MAX_DIST = 120; // Alcance para conexões
const GRID_SIZE = 50;

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

// Função para gerar dy conforme tier (movida para fora do componente)
const getDyForTier = (tier: 'fast' | 'normal' | 'slow') => {
  if (tier === 'fast') return randomBetween(-2.0, -1.2);
  if (tier === 'slow') return randomBetween(-0.5, -0.2);
  return randomBetween(-1.4, -0.6);
};

interface DisplayBackgroundProps {
  children?: React.ReactNode;
}

export const DisplayBackground: React.FC<DisplayBackgroundProps> = ({ children }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particleColors = useParticleColors();
  const backgroundColors = useBackgroundColors();
  
  // Memoizar as cores para evitar re-renders desnecessários
  const COLORS = React.useMemo(() => {
    const colors = [
      particleColors.primaria,
      particleColors.secundaria,
      particleColors.terciaria,
      particleColors.quaternaria,
    ].filter(color => color && color !== 'undefined');
    
    // Fallback se não houver cores válidas
    if (colors.length === 0) {
      return ['rgba(0, 255, 255, 0.85)', 'rgba(0, 180, 255, 0.7)', 'rgba(0, 120, 255, 0.6)', 'rgba(0, 255, 200, 0.7)'];
    }
    
    return colors;
  }, [particleColors]);
  
  const GLOWS = React.useMemo(() => {
    const glowColor = particleColors.brilho || '#00fff7';
    return [
      `0 0 12px 4px ${glowColor}`,
      `0 0 18px 6px ${glowColor}`,
      `0 0 24px 8px ${glowColor}`,
      `0 0 16px 6px ${glowColor}`,
    ];
  }, [particleColors.brilho]);

  // Inicializa partículas
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });
    
    // Só inicializa partículas se as cores estiverem disponíveis
    if (COLORS.length > 0 && GLOWS.length > 0 && width > 0 && height > 0) {
      const arr: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const tierRand = Math.random();
        const speedTier: Particle['speedTier'] = tierRand < 0.4 ? 'fast' : tierRand < 0.8 ? 'normal' : 'slow';
        arr.push({
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          r: randomBetween(1.5, 3.5),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          opacity: randomBetween(0.3, 0.8),
          dx: randomBetween(-0.06, 0.06),
          dy: getDyForTier(speedTier),
          glow: GLOWS[Math.floor(Math.random() * GLOWS.length)],
          phase: Math.random() * Math.PI * 2,
          speedTier,
        });
      }
      setParticles(arr);
    }
  }, [COLORS, GLOWS]); // Depende das cores para inicializar

  // Atualiza cores das partículas quando as cores mudarem
  useEffect(() => {
    setParticles(prev => prev.map(particle => ({
      ...particle,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      glow: GLOWS[Math.floor(Math.random() * GLOWS.length)],
    })));
  }, [COLORS, GLOWS]);

  // Animação
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || particles.length === 0) return;
    
    const animate = () => {
      setParticles(prev =>
        prev.map((p, i) => {
          let { x, y, dx, dy, r, color, opacity, glow, phase, speedTier } = p;

          // Movimento suave
          x += dx + Math.sin(Date.now() * 0.0002 + i) * 0.04;
          y += dy;

          // Wrap horizontal
          if (x < -10) x = dimensions.width + 10;
          if (x > dimensions.width + 10) x = -10;

          // Reaparece por baixo
          if (y < -10) {
            y = dimensions.height + 10;
            x = (x + randomBetween(-30, 30) + dimensions.width) % dimensions.width;
            const newTierRand = Math.random();
            speedTier = newTierRand < 0.4 ? 'fast' : newTierRand < 0.8 ? 'normal' : 'slow';
            dy = getDyForTier(speedTier);
          }

          return { x, y, dx, dy, r, color, opacity, glow, phase, speedTier };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [dimensions.width, dimensions.height, particles.length]); // Inclui particles.length para aguardar inicialização

  // Responsivo
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!dimensions.width || !dimensions.height) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center px-4 py-8 overflow-hidden bg-black">
        <div className="w-full relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // Grid sutil
  const gridLines = [];
  for (let x = 0; x < dimensions.width; x += GRID_SIZE) {
    gridLines.push(
      <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={dimensions.height} stroke={backgroundColors.grid || 'rgba(255, 255, 255, 0.08)'} strokeWidth={0.5} />
    );
  }
  for (let y = 0; y < dimensions.height; y += GRID_SIZE) {
    gridLines.push(
      <line key={`h-${y}`} x1={0} y1={y} x2={dimensions.width} y2={y} stroke={backgroundColors.grid || 'rgba(255, 255, 255, 0.08)'} strokeWidth={0.5} />
    );
  }

  // Linhas conectando partículas
  const lines: JSX.Element[] = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dyv = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dyv * dyv);
      if (dist < LINE_MAX_DIST) {
        const base = 0.05;
        const scale = 0.15;
        const proximity = 1 - dist / LINE_MAX_DIST;
        const opacity = base + scale * proximity;
        lines.push(
          <line
            key={`line-${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={particleColors.conexoes || '#00eaff'}
            strokeWidth={1.0}
            opacity={opacity}
            style={{ filter: `drop-shadow(0 0 4px ${particleColors.conexoes || '#00eaff'}25)` }}
          />
        );
      }
    }
  }

  const radialId = 'display-radial-bg';

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 py-8 overflow-hidden" 
         style={{ backgroundColor: backgroundColors.primario || '#000000' }}>
      {/* Background SVG */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'visible',
          display: 'block',
        }}
      >
        <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill={backgroundColors.primario || '#000000'} />
        <defs>
          <radialGradient id={radialId} cx="60%" cy="40%" r="70%">
            <stop offset="0%" stopColor={backgroundColors.radial || 'rgba(255, 255, 255, 0.06)'} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill={`url(#${radialId})`} />
        {gridLines}
        {lines}
        {particles.map((p, i) => {
          const t = Date.now() * 0.001;
          const pulse = 0.8 + 0.2 * Math.sin(t * 1.0 + (p.phase || 0));
          const r = p.r * pulse;
          const outerOpacity = p.opacity * 0.15 * pulse;
          const blurPx = r * 0.8;
          return (
            <g key={i}>
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={r * 1.5} 
                fill={p.color} 
                opacity={outerOpacity} 
                filter={`blur(${blurPx}px)`} 
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={r} 
                fill={p.color} 
                opacity={p.opacity} 
                style={{ filter: `drop-shadow(${p.glow})` }} 
              />
            </g>
          );
        })}
      </svg>

      {/* Conteúdo */}
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  );
};
