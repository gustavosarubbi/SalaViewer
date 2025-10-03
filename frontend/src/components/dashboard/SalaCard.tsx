'use client';

import { Pencil, Trash2, DoorOpen } from 'lucide-react';
import { Sala } from '@/services/api';
import { trackEvent } from '@/utils/monitoring';

interface SalaCardProps {
  sala: Sala;
  onEdit: (sala: Sala) => void;
  onDelete: (sala: Sala) => void;
}

export default function SalaCard({ sala, onEdit, onDelete }: SalaCardProps) {
  // Verificar se a sala está disponível
  const isDisponivel = !sala.nome_ocupante || sala.nome_ocupante.trim() === '';
  
  return (
    <div role="listitem">
      <div className={`relative overflow-hidden px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-white/10 transition-all duration-200 hover:border-white/20 ${
        isDisponivel ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-red-500/5 hover:bg-red-500/10'
      }`}>
        <div className={`absolute inset-y-0 left-0 w-1.5 ${isDisponivel ? 'bg-emerald-400/70' : 'bg-red-400/70'}`} />

        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center ${
                isDisponivel ? 'bg-emerald-500/10 border border-emerald-500/25' : 'bg-red-500/10 border border-red-500/25'
              }`}>
                <DoorOpen className={`h-5 w-5 sm:h-6 sm:w-6 ${isDisponivel ? 'text-emerald-200' : 'text-red-200'}`} />
              </div>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <div className="flex items-center min-w-0">
                <p className="text-base sm:text-lg font-semibold text-white truncate">Sala {sala.numero_sala}</p>
                <span className="ml-2 sm:ml-3 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium bg-amber-500/10 border border-amber-500/25 text-amber-200 flex-shrink-0">
                  {sala.andar?.numero_andar || 'N/A'}º Andar
                </span>
                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-medium border ${
                  isDisponivel
                    ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/25'
                    : 'bg-red-500/10 text-red-200 border-red-500/25'
                }`}>
                  {isDisponivel ? 'Disponível' : 'Ocupada'}
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                {isDisponivel ? 'Sala disponível para ocupação' : sala.nome_ocupante}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                trackEvent('sala_edit_click', { salaId: sala.id, salaNumero: sala.numero_sala });
                onEdit(sala);
              }}
              className="group relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
              title="Editar sala"
            >
              <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                trackEvent('sala_delete_click', { salaId: sala.id, salaNumero: sala.numero_sala });
                onDelete(sala);
              }}
              className="group relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all"
              title="Excluir sala"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <div className={`h-0.5 w-full rounded-full overflow-hidden ${isDisponivel ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}> 
            <div className={`h-full w-full ${isDisponivel ? 'bg-emerald-400/60' : 'bg-red-400/60'}`} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/50 mt-1">
            <span>Criado em {new Date(sala.createdAt).toLocaleDateString('pt-BR')}</span>
            {!isDisponivel && <span className="text-white/60">{sala.nome_ocupante}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
