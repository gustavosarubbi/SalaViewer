'use client';

import { useState, useEffect } from 'react';

interface ParticleProps {
  count: number;
  size: 'small' | 'medium';
  color: string;
  animationDelay: number;
}

const Particle = ({ size, color, animationDelay }: Omit<ParticleProps, 'count'>) => {
  const sizeClass = size === 'small' ? 'particle-small' : 'particle-medium';
  
  return (
    <div
      className={sizeClass}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * animationDelay}s`,
        backgroundColor: color
      }}
    />
  );
};

export const Particles = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="absolute inset-0" />;
  }

  return (
    <div className="absolute inset-0">
      {/* Partículas pequenas */}
      {[...Array(30)].map((_, i) => (
        <Particle
          key={`particle-small-${i}`}
          size="small"
          color="rgba(255, 255, 255, 0.2)"
          animationDelay={3}
        />
      ))}
      
      {/* Partículas médias */}
      {[...Array(15)].map((_, i) => (
        <Particle
          key={`particle-medium-${i}`}
          size="medium"
          color="rgba(59, 130, 246, 0.3)"
          animationDelay={4}
        />
      ))}
    </div>
  );
};
