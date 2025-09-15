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
          className="rounded-full shadow-lg"
        />
      </div>
      
      <h1 className="text-2xl font-bold text-white mb-1">
        E-Salas
      </h1>
      
      <p className="text-sm text-white/70 mb-4">
        Faça login para continuar
      </p>
      
      {/* Linha divisória mais visível */}
      <div className="w-full h-0.5 bg-white/80 mx-auto mb-2"></div>
    </div>
  );
}
