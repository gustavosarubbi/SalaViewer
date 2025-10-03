import { Sala } from '@/services/api';

interface RoomCardProps {
  sala: Sala;
}

export function RoomCard({ sala }: RoomCardProps) {
  const isOcupada = sala.nome_ocupante && sala.nome_ocupante.trim() !== '';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-8 bg-white ${
        isOcupada
          ? 'shadow-xl'
          : 'border-green-500 shadow-xl'
      }`}
      style={
        isOcupada
          ? {
              borderColor: '#081534',
              boxShadow:
                '0 0 0 4px rgba(8, 21, 52, 0.2), 0 0 0 8px rgba(8, 21, 52, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          : {
              boxShadow:
                '0 0 0 4px rgba(34, 197, 94, 0.2), 0 0 0 8px rgba(34, 197, 94, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
      }
    >
      {/* Status Bar - State Indicator */}
      <div className="relative w-full overflow-hidden" style={{ height: '5px' }}>
        <div
          className={`h-full w-full ${
            isOcupada ? '' : 'bg-gradient-to-r from-green-500 to-green-600'
          }`}
          style={
            isOcupada
              ? { background: 'linear-gradient(to right, #081534, #0a1a3a)' }
              : {}
          }
        ></div>
        {/* Bordas e brilho da faixa */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Fundo branco sólido (garantido) - exceto na status bar */}
      <div className="absolute inset-0 bg-white" style={{ top: '5px' }}></div>

      {/* Borda interna para definição */}
      <div className="absolute inset-0 rounded-2xl border-2 border-gray-200 pointer-events-none"></div>

      {/* Borda externa para máximo destaque */}
      <div className="absolute -inset-2 rounded-3xl border-4 border-black/10 pointer-events-none"></div>

      {/* Conteúdo */}
      <div className="p-0 flex h-16 relative">
        {/* Nome ou Sala disponível */}
        <div className="flex-1 flex items-center p-3">
          {isOcupada ? (
            <div className="flex items-center space-x-3">
              <svg
                className="text-gray-700"
                style={{ width: '42px', height: '42px' }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 6l8 6-8 6V6z" />
              </svg>
              <p className="text-2xl font-black text-gray-800 tracking-wide">
                {sala.nome_ocupante}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-black text-green-800 tracking-wide">
                Sala Disponível
              </p>
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className="flex items-center justify-center mx-2">
          <div className="w-1 h-12 rounded-full" style={{ backgroundColor: '#1d293f' }}></div>
        </div>

        {/* Número da sala */}
        <div
          className="min-w-20 px-4 py-2 rounded-r-2xl flex items-center justify-center mx-auto"
          style={{ backgroundColor: '#1d293f' }}
        >
          <h3 className="text-4xl font-black text-white tracking-tight whitespace-nowrap">
            {sala.numero_sala}
          </h3>
        </div>
      </div>
    </div>
  );
}

