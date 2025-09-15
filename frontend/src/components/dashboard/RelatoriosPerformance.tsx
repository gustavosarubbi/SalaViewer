'use client';

interface OcupacaoPorAndar {
  andar: number;
  salas: number;
  ocupadas: number;
}

interface Atividade {
  tipo: string;
  descricao: string;
  data: string;
}

interface RelatoriosPerformanceProps {
  taxaOcupacao: number;
  ocupacaoPorAndar: OcupacaoPorAndar[];
  atividades: Atividade[];
}

export default function RelatoriosPerformance({ 
  taxaOcupacao, 
  ocupacaoPorAndar, 
  atividades 
}: RelatoriosPerformanceProps) {
  const andarComMaiorOcupacao = ocupacaoPorAndar && ocupacaoPorAndar.length > 0
    ? ocupacaoPorAndar.reduce((max, andar) => 
        (andar.ocupadas / andar.salas) > (max.ocupadas / max.salas) ? andar : max
      )
    : { andar: 0, salas: 0, ocupadas: 0 };

  return (
    <div className="card-blur-intense overflow-hidden shadow-2xl rounded-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          Resumo de Performance
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-white/70">Taxa de Ocupação Média</span>
            <span className="text-sm font-semibold text-white">{taxaOcupacao}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/70">Andar com Maior Ocupação</span>
            <span className="text-sm font-semibold text-white">
              {andarComMaiorOcupacao.andar > 0 ? `${andarComMaiorOcupacao.andar}º` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/70">Total de Atividades</span>
            <span className="text-sm font-semibold text-white">
              {atividades ? atividades.length : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
