'use client';

import { BarChart3, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface Atividade {
  tipo: string;
  descricao: string;
  data: string;
}

interface RelatoriosAtividadesProps {
  atividades: Atividade[];
}

export default function RelatoriosAtividades({ atividades }: RelatoriosAtividadesProps) {
  return (
    <div className="space-y-3">
      {atividades && atividades.length > 0 ? (
        <ul className="space-y-2.5">
          {atividades.map((atividade, index) => {
            const isDisponivel = atividade.descricao?.toLowerCase().includes('disponível');
            const isOcupada = atividade.descricao?.toLowerCase().includes('ocupada');
            const strip = isOcupada ? 'bg-red-400/70' : isDisponivel ? 'bg-emerald-400/70' : 'bg-amber-400/70';
            const badgeBg = isOcupada ? 'bg-red-500/20' : isDisponivel ? 'bg-emerald-500/20' : 'bg-amber-500/20';
            const iconColor = isOcupada ? 'text-red-200' : isDisponivel ? 'text-emerald-200' : 'text-amber-200';
            const textColor = isOcupada ? 'text-red-200' : isDisponivel ? 'text-emerald-200' : 'text-amber-200';
            const cardBg = isOcupada ? 'bg-red-500/10' : isDisponivel ? 'bg-emerald-500/10' : 'bg-amber-500/10';
            const cardBorder = isOcupada ? 'border-red-500/25' : isDisponivel ? 'border-emerald-500/25' : 'border-amber-500/25';
            const Icon = isOcupada ? XCircle : isDisponivel ? CheckCircle2 : BarChart3;
            return (
              <li key={index} className={`relative overflow-hidden rounded-lg ${cardBg} border ${cardBorder} p-2.5`}>
                <div className={`absolute inset-y-0 left-0 w-1.5 ${strip}`} />
                <div className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-md ${badgeBg} flex items-center justify-center mt-0.5`}>
                    <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 leading-snug truncate">
                      {atividade.descricao}
                    </p>
                    <div className={`mt-1 h-0.5 w-full rounded-full bg-white/10 overflow-hidden`}>
                      <div className={`h-full w-full ${textColor.replace('text-','bg-')}`} />
                    </div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-white/60">
                    <div className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/50" />
                      <time>{new Date(atividade.data).toLocaleDateString('pt-BR')}</time>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-8 rounded-lg bg-white/5 border border-white/10">
          <div className="text-white/60 mb-2">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-amber-300" />
            <p className="text-sm">Nenhuma atividade recente</p>
            <p className="text-xs text-white/40 mt-1">
              As atividades aparecerão aqui conforme as salas forem atualizadas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
