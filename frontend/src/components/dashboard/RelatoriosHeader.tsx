'use client';


// Interface removida - componente não recebe props

export default function RelatoriosHeader() {
  return (
    <div 
      className="p-6 rounded-2xl shadow-2xl animate-slide-in"
      style={{
        backdropFilter: 'blur(500px)',
        WebkitBackdropFilter: 'blur(500px)',
        background: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Relatórios</h1>
          <p className="text-white/80 text-sm">
            Análise e estatísticas do sistema
          </p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
