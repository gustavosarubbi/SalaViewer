'use client';

import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container com microinterações */}
      <div className="group relative">
        {/* Borda gradiente mais rica (moldura) */}
        <div className="relative p-[1.5px] rounded-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.1),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.06))]">
          {/* Card vidro */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-white/10 ring-1 ring-white/10 overflow-hidden transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] group-hover:border-white/20 group-hover:translate-y-[-1px]">
            {/* Linha superior de brilho */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Brilho diagonal sutil */}
            <div className="pointer-events-none absolute -top-20 -right-24 h-56 w-56 rotate-12 bg-gradient-to-tr from-blue-400/10 via-white/10 to-transparent blur-3xl" />

            {/* Cantos decorativos */}
            <div className="pointer-events-none absolute -left-0.5 top-6 h-8 w-0.5 bg-gradient-to-b from-white/40 to-transparent rounded-full opacity-70" />
            <div className="pointer-events-none absolute -right-0.5 bottom-6 h-8 w-0.5 bg-gradient-to-t from-white/40 to-transparent rounded-full opacity-70" />

            {children}

            {/* Reflexo suave ao passar o mouse */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-x-0 -top-1/2 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


