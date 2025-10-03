'use client';

import { Pencil, Trash2, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { Andar, Sala } from '@/services/api';

interface AndarCardProps {
  andar: Andar;
  salas: Sala[];
  onEdit: (andar: Andar) => void;
  onDelete: (andar: Andar) => void;
}

export default function AndarCard({ andar, salas, onEdit, onDelete }: AndarCardProps) {
  const total = salas.length;
  const ocupadas = salas.filter(s => s.nome_ocupante && s.nome_ocupante.trim() !== '').length;
  const livres = total - ocupadas;
  const ocupacaoPercent = total > 0 ? Math.round((ocupadas / total) * 100) : 0;
  const disponibilidadePercent = total > 0 ? Math.round((livres / total) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-200 group">
      {/* Cabeçalho */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-white">{andar.numero_andar}º Andar</h3>
                {andar.nome_identificador && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 border border-white/20 text-white/80">
                    {andar.nome_identificador}
                  </span>
                )}
              </div>
              <div className="text-xs text-white/60">Criado em {new Date(andar.createdAt).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(andar)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
              title="Editar andar"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(andar)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all"
              title="Excluir andar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Linha divisória */}
      <div className="px-5 sm:px-6">
        <div className="h-px w-full bg-white/10" />
      </div>

      {/* Métricas (refeitas do zero) */}
      <div className="p-3 sm:p-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {/* Total */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 p-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[9px] uppercase tracking-wide text-amber-200/80">Total</div>
              <div className="h-6 w-6 rounded-md bg-amber-500/20 flex items-center justify-center">
                <Layers className="h-3.5 w-3.5 text-amber-200" />
              </div>
            </div>
            <div className="mt-0.5 text-lg font-extrabold text-amber-200 leading-none">{total}</div>
            <div className="mt-0.5 h-0.5 w-full rounded-full bg-amber-500/20 overflow-hidden">
              <div className="h-full w-full bg-amber-400" />
            </div>
          </div>

          {/* Ocupadas */}
          <div className="rounded-lg bg-red-500/10 border border-red-500/25 p-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[9px] uppercase tracking-wide text-red-200/80">Ocupadas</div>
              <div className="h-6 w-6 rounded-md bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-3.5 w-3.5 text-red-200" />
              </div>
            </div>
            <div className="mt-0.5 flex items-end justify-between">
              <div className="text-lg font-extrabold text-red-200 leading-none">{ocupadas}</div>
              <div className="text-[9px] text-red-200/70">{ocupacaoPercent}%</div>
            </div>
            <div className="mt-0.5 h-0.5 w-full rounded-full bg-red-500/20 overflow-hidden">
              <div className="h-full bg-red-400" style={{ width: `${ocupacaoPercent}%` }} />
            </div>
          </div>

          {/* Disponíveis */}
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[9px] uppercase tracking-wide text-emerald-200/80">Disponíveis</div>
              <div className="h-6 w-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
              </div>
            </div>
            <div className="mt-0.5 flex items-end justify-between">
              <div className="text-lg font-extrabold text-emerald-200 leading-none">{livres}</div>
              <div className="text-[9px] text-emerald-200/70">{disponibilidadePercent}%</div>
            </div>
            <div className="mt-0.5 h-0.5 w-full rounded-full bg-emerald-500/20 overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: `${disponibilidadePercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
