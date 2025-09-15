'use client';

import { Particles } from './Particles';

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Partículas flutuantes */}
      <Particles />

      {/* Gradientes de fundo - círculos removidos */}
    </div>
  );
};
