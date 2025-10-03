'use client';

import React from 'react';

interface AnimatedStarsProps {
  small?: number;
  medium?: number;
  large?: number;
  className?: string;
}

function multipleBoxShadow(n: number): string {
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  }
  return value;
}

export default function AnimatedStars({ small = 500, medium = 150, large = 60, className }: AnimatedStarsProps) {
  const smallShadows = React.useMemo(() => multipleBoxShadow(small), [small]);
  const mediumShadows = React.useMemo(() => multipleBoxShadow(medium), [medium]);
  const largeShadows = React.useMemo(() => multipleBoxShadow(large), [large]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`} aria-hidden>
      <div style={{ width: '1px', height: '1px', background: 'transparent', boxShadow: smallShadows, animation: 'animStar 50s linear infinite', position: 'absolute', top: 0, left: 0 }} />
      <div style={{ position: 'absolute', top: '2000px', width: '1px', height: '1px', background: 'transparent', boxShadow: smallShadows, animation: 'animStar 50s linear infinite' }} />
      <div style={{ width: '2px', height: '2px', background: 'transparent', boxShadow: mediumShadows, animation: 'animStar 100s linear infinite', position: 'absolute', top: 0, left: 0 }} />
      <div style={{ position: 'absolute', top: '2000px', width: '2px', height: '2px', background: 'transparent', boxShadow: mediumShadows, animation: 'animStar 100s linear infinite' }} />
      <div style={{ width: '3px', height: '3px', background: 'transparent', boxShadow: largeShadows, animation: 'animStar 150s linear infinite', position: 'absolute', top: 0, left: 0 }} />
      <div style={{ position: 'absolute', top: '2000px', width: '3px', height: '3px', background: 'transparent', boxShadow: largeShadows, animation: 'animStar 150s linear infinite' }} />

      <style jsx global>{`
        @keyframes animStar { from { transform: translateY(0px);} to { transform: translateY(-2000px);} }
      `}</style>
    </div>
  );
}


