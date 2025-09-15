'use client';

import { 
  LoginHeader, 
  LoginForm, 
  LoginFooter, 
  AnimatedBackground,
  ToasterContainer
} from '@/components';
import { useToaster } from '@/hooks/useToaster';

export default function HomePage() {
  const { toasters, removeToaster } = useToaster();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animado */}
      <AnimatedBackground />
      
      {/* Conteúdo principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Card de Login Centralizado */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
            {/* Efeito de brilho no topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            {/* Seção do Header - "Faça Login" */}
            <div className="px-8 pt-6 pb-4">
              <LoginHeader />
            </div>
            
            {/* Separador visual */}
            <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Seção do Formulário */}
            <div className="px-8 py-6">
              <LoginForm />
            </div>
            
            {/* Separador visual */}
            <div className="mx-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {/* Seção do Footer */}
            <div className="px-8 py-4">
              <LoginFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Toaster */}
      <ToasterContainer
        toasters={toasters}
        onRemove={removeToaster}
      />
    </div>
  );
}