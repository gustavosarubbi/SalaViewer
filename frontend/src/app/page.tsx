'use client';

import { 
  ToasterContainer,
  LoginHeader,
  LoginForm,
  LoginFooter
} from '@/components';
import BackgroundLogin from '@/components/BackgroundLogin';
import { useToaster } from '@/hooks/useToaster';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    document.body.classList.remove('display-login-bg');
    document.body.classList.remove('display-solid-bg');
    return () => {};
  }, []);

  const { toasters, removeToaster } = useToaster();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-black">
      <BackgroundLogin />

      <div className="w-full max-w-md relative z-10">
        <div className="relative rounded-2xl">
          {/* Card sem gradiente, com brilho sutil */}
          <div className="relative rounded-2xl bg-black/95 border border-white/10 ring-1 ring-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.55),_0_0_16px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.55),_0_0_22px_rgba(255,255,255,0.05)] transition-shadow overflow-hidden">
            {/* Barra superior branca com brilho */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/60" />
            <div className="pointer-events-none absolute -top-0.5 left-0 right-0 h-2 bg-white/10 blur-sm" />

            <div className="px-6 sm:px-8 pt-6 pb-4">
              <LoginHeader />
            </div>
            <div className="px-6 sm:px-8 py-6">
              <LoginForm />
            </div>
            <div className="px-6 sm:px-8 py-4">
              <LoginFooter />
            </div>
          </div>
        </div>
      </div>

      <ToasterContainer
        toasters={toasters}
        onRemove={removeToaster}
      />
    </div>
  );
}