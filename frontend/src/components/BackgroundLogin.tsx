import React, { useEffect, useRef, useState } from 'react';

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

const PARTICLE_COUNT = 30; // reduzido
const COLORS = [
  'rgba(0, 255, 255, 0.85)',
  'rgba(0, 180, 255, 0.7)',
  'rgba(0, 120, 255, 0.6)',
  'rgba(0, 255, 200, 0.7)',
];
const GLOWS = [
  '0 0 12px 4px #00fff7',
  '0 0 18px 6px #00bfff',
  '0 0 24px 8px #00eaff',
  '0 0 16px 6px #00b4ff',
];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

const GRID_SIZE = 49;
const GRID_COLOR = 'rgba(255,255,255,0.08)';
const BG_COLOR = '#000000';
const RADIAL_COLOR = 'rgba(255,255,255,0.06)';
const LINE_COLOR = '#00eaff';
const LINE_MAX_DIST = 110; // alcance maior para mais conexões

const BackgroundLogin: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const requestRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Função para gerar dy conforme tier (todas um pouco mais lentas)
  const getDyForTier = (tier: 'fast' | 'normal' | 'slow') => {
    if (tier === 'fast') return randomBetween(-2.4, -1.4);
    if (tier === 'slow') return randomBetween(-0.6, -0.3);
    return randomBetween(-1.6, -0.8);
  };

  // Inicializa partículas (raio 1–2.5) com proporções 40/40/20
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });
    const arr: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const tierRand = Math.random();
      const speedTier: Particle['speedTier'] = tierRand < 0.4 ? 'fast' : tierRand < 0.8 ? 'normal' : 'slow';
      arr.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        r: randomBetween(2, 4), // raio maior
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: randomBetween(0.35, 0.85),
        dx: randomBetween(-0.08, 0.08), // deriva horizontal levemente maior
        dy: getDyForTier(speedTier), // velocidade conforme tier (um pouco mais lenta)
        glow: GLOWS[Math.floor(Math.random() * GLOWS.length)],
        phase: Math.random() * Math.PI * 2,
        speedTier,
      });
    }
    setParticles(arr);
  }, []);

  // Animação (movimento por frame)
  useEffect(() => {
    const animate = () => {
      setParticles(prev =>
        prev.map((p, i) => {
          let { x, y, dx, dy, r, color, opacity, glow, phase, speedTier } = p;

          // deriva horizontal suave e subida constante
          x += dx + Math.sin(Date.now() * 0.00025 + i) * 0.05;
          y += dy; // dy negativo -> sobe

          // wrap horizontal
          if (x < -10) x = dimensions.width + 10;
          if (x > dimensions.width + 10) x = -10;

          // reaparece por baixo ao sair pelo topo e reatribui velocidade vertical conforme proporção 40/40/20
          if (y < -10) {
            y = dimensions.height + 10;
            x = (x + randomBetween(-40, 40) + dimensions.width) % dimensions.width;
            const newTierRand = Math.random();
            speedTier = newTierRand < 0.4 ? 'fast' : newTierRand < 0.8 ? 'normal' : 'slow';
            dy = getDyForTier(speedTier);
          }

          return { x, y, dx, dy, r, color, opacity, glow, phase, speedTier };
        })
      );
      requestRef.current = requestAnimationFrame(animate);
    };
    if (dimensions.width && dimensions.height) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [dimensions]);

  // Responsivo
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!dimensions.width || !dimensions.height) return null;

  // Grid sutil
  const gridLines = [];
  for (let x = 0; x < dimensions.width; x += GRID_SIZE) {
    gridLines.push(
      <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={dimensions.height} stroke={GRID_COLOR} strokeWidth={0.6} />
    );
  }
  for (let y = 0; y < dimensions.height; y += GRID_SIZE) {
    gridLines.push(
      <line key={`h-${y}`} x1={0} y1={y} x2={dimensions.width} y2={y} stroke={GRID_COLOR} strokeWidth={0.6} />
    );
  }

  // Linhas conectando partículas próximas (tech sutil)
  const lines: JSX.Element[] = [];
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dyv = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dyv * dyv);
      if (dist < LINE_MAX_DIST) {
        const base = 0.07;
        const scale = 0.18;
        const proximity = 1 - dist / LINE_MAX_DIST;
        const opacity = base + scale * proximity;
        lines.push(
          <line
            key={`line-${i}-${j}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={LINE_COLOR}
            strokeWidth={1.2} // conexões mais grossas
            opacity={opacity}
            style={{ filter: 'drop-shadow(0 0 5px rgba(0,234,255,0.3))' }}
          />
        );
      }
    }
  }

  const radialId = 'radial-bg';

  return (
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
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill={BG_COLOR} />
      <defs>
        <radialGradient id={radialId} cx="60%" cy="40%" r="70%">
          <stop offset="0%" stopColor={RADIAL_COLOR} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill={`url(#${radialId})`} />
      {gridLines}
      {lines}
      {particles.map((p, i) => {
        const t = Date.now() * 0.001;
        const pulse = 0.85 + 0.15 * Math.sin(t * 1.2 + (p.phase || 0));
        const r = p.r * pulse;
        const outerOpacity = p.opacity * 0.20 * pulse;
        const blurPx = r * 1.1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={r * 1.7} fill={p.color} opacity={outerOpacity} filter={`blur(${blurPx}px)`} />
            <circle cx={p.x} cy={p.y} r={r} fill={p.color} opacity={p.opacity} style={{ filter: `drop-shadow(${p.glow})` }} />
          </g>
        );
      })}
    </svg>
  );
};

export default BackgroundLogin;
