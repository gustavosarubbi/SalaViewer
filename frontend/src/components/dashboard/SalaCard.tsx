'use client';

import { Pencil, Trash2, DoorOpen } from 'lucide-react';
import { Sala } from '@/services/api';

interface SalaCardProps {
  sala: Sala;
  onEdit: (sala: Sala) => void;
  onDelete: (sala: Sala) => void;
}

export default function SalaCard({ sala, onEdit, onDelete }: SalaCardProps) {
  // Verificar se a sala está disponível
  const isDisponivel = !sala.nome_ocupante || sala.nome_ocupante.trim() === '';
  
  return (
    <li>
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                isDisponivel 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}>
                <DoorOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <p className="text-lg font-semibold text-white">
                  Sala {sala.numero_sala}
                </p>
                <span className="ml-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white border border-white/20">
                  {sala.andar?.numero_andar || 'N/A'}º Andar
                </span>
                {/* Tag de Status */}
                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  isDisponivel
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {isDisponivel ? 'Disponível' : 'Ocupada'}
                </span>
              </div>
              <p className="text-sm text-white/70 mt-1">
                {isDisponivel ? 'Sala disponível para ocupação' : sala.nome_ocupante}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botão Editar clicado no SalaCard');
                onEdit(sala);
              }}
              className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
              title="Editar sala"
            >
              <Pencil className="h-4 w-4" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botão Excluir clicado no SalaCard');
                onDelete(sala);
              }}
              className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-105"
              title="Excluir sala"
            >
              <Trash2 className="h-4 w-4" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
            </button>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center text-sm text-white/50">
            <span>Criado em: {new Date(sala.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </li>
  );
}
