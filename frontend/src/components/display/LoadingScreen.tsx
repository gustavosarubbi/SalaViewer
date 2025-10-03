import { LoadingScreenProps } from './types';
import BackgroundLogin from '@/components/BackgroundLogin';

export function LoadingScreen({}: LoadingScreenProps) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center px-4 py-8 overflow-hidden bg-black">
      <BackgroundLogin />
      
      <div className="w-full relative z-10 flex items-center justify-center">
        <div className="text-center">
          {/* Loader customizado com animação de barras */}
          <div className="loader mx-auto mb-6"></div>
          
          <p className="text-white text-xl font-medium font-mono tracking-wide">
            Carregando salas...
          </p>
        </div>
      </div>

      {/* Estilos CSS para o loader */}
      <style jsx>{`
        .loader {
          width: 45px;
          aspect-ratio: 1;
          --c: no-repeat linear-gradient(#3b82f6 0 0);
          background: 
            var(--c) 0%   50%,
            var(--c) 50%  50%,
            var(--c) 100% 50%;
          background-size: 20% 100%;
          animation: l1 1s infinite linear;
        }
        
        @keyframes l1 {
          0%  {background-size: 20% 100%,20% 100%,20% 100%}
          33% {background-size: 20% 10% ,20% 100%,20% 100%}
          50% {background-size: 20% 100%,20% 10% ,20% 100%}
          66% {background-size: 20% 100%,20% 100%,20% 10% }
          100%{background-size: 20% 100%,20% 100%,20% 100%}
        }
      `}</style>
    </div>
  );
}
