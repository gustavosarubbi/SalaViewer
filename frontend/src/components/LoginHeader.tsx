'use client';

import Image from 'next/image';

export default function LoginHeader() {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">
        <Image
          src="/Logo E-Salas.png"
          alt="E-Salas Logo"
          width={50}
          height={50}
          className="rounded-md"
        />
      </div>
      <h1 className="text-2xl font-bold text-white mb-1">Entrar</h1>
      <p className="text-sm text-white/70 mb-5">Acesse sua conta para continuar.</p>
      {/* Divisor com linhas sólidas aprimoradas */}
      <div
        className="mx-auto mb-1"
        style={{
          width: '260px',
          height: '2px',
          backgroundColor: 'rgba(255,255,255,0.35)',
          borderRadius: '9999px',
          boxShadow: '0 0 8px rgba(255,255,255,0.15)'
        }}
      />
      <div
        className="mx-auto"
        style={{
          width: '180px',
          height: '1px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '9999px'
        }}
      />
    </div>
  );
}
