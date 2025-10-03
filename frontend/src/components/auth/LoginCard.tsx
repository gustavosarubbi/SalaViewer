'use client';

import React from 'react';
import { LoginHeader } from '@/components';
import LoginForm from '@/components/LoginForm';
import LoginFooter from '@/components/LoginFooter';

// Novo card de login criado do zero: estrutura própria, sem depender do AuthCard existente
export default function LoginCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Moldura e base do card */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Borda sutil com gradiente escuro */}
        <div className="absolute inset-0 rounded-3xl p-[1.5px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(255,255,255,0.06),rgba(255,255,255,0.08))]" />

        {/* Conteúdo do card (preto) */}
        <div className="relative rounded-3xl bg-black/90 backdrop-blur-xl border border-white/10 ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          {/* Cabeçalho novo (substitui a antiga barra superior) */}
          <div className="px-6 sm:px-8 pt-7 pb-4 relative">
            {/* Faixa decorativa suave dentro do cabeçalho */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)] rounded-t-3xl" />
            {/* Sutileza de linhas finas na borda superior */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="pointer-events-none absolute top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <LoginHeader />
          </div>

          {/* Separador */}
          <div className="mx-6 sm:mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Formulário */}
          <div className="px-6 sm:px-8 py-6">
            <LoginForm />
          </div>

          {/* Separador */}
          <div className="mx-6 sm:mx-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4">
            <LoginFooter />
          </div>
        </div>

        {/* Sem efeitos de glow no background */}
      </div>
    </div>
  );
}


