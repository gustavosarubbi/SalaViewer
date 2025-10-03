'use client';


// Interface removida - componente não recebe props

export default function RelatoriosHeader() {
  return (
    <div 
      className="p-6 rounded-2xl shadow-2xl animate-slide-in card-header no-glassmorphism"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-white/80 text-sm">
            Análise e estatísticas do sistema
          </p>
        </div>
        
        {/* Botões de ação no header - Padrão Display Setup */}
        <div className="flex items-center space-x-3">
          {/* Espaço para futuros botões de ação */}
        </div>
      </div>
    </div>
  );
}
