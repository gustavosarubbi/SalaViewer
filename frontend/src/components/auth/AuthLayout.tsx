'use client';

import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#09090b]">

      {/* Split screen */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Painel esquerdo */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 border-r border-white/10">
          <div className="flex items-center gap-3">
            <Image src="/Logo E-Salas.png" alt="E-Salas" width={40} height={40} className="rounded-md" />
            <div>
              <h1 className="text-white font-semibold text-lg">E-Salas</h1>
              <p className="text-white/60 text-xs">Sistema de Gestão</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Bem-vindo de volta</h2>
            <p className="text-white/70 max-w-md">Gerencie salas e andares com eficiência. Visual moderno, rápido e responsivo.</p>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span> Gestão de salas e andares</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span> Atualizações em tempo real</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span> Relatórios e insights</li>
            </ul>
          </div>

          <div className="text-white/50 text-xs">© {new Date().getFullYear()} E-Salas</div>
        </div>

        {/* Painel direito (formulário) */}
        <div className="flex items-center justify-center px-6 sm:px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}


