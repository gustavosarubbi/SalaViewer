'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { Andar, Sala } from '@/services/api';

interface AndarCardProps {
  andar: Andar;
  salas: Sala[];
  onEdit: (andar: Andar) => void;
  onDelete: (andar: Andar) => void;
}

export default function AndarCard({ andar, salas, onEdit, onDelete }: AndarCardProps) {
  return (
    <div 
      className="overflow-hidden shadow-2xl rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        backdropFilter: 'blur(800px)',
        WebkitBackdropFilter: 'blur(800px)',
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {andar.numero_andar}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">
                {andar.numero_andar}º Andar
              </h3>
              {andar.nome_identificador && (
                <p className="text-sm text-white/70">
                  {andar.nome_identificador}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(andar)}
              className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
              title="Editar andar"
            >
              <Pencil className="h-4 w-4" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
            </button>
            <button
              onClick={() => onDelete(andar)}
              className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-105"
              title="Excluir andar"
            >
              <Trash2 className="h-4 w-4" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/10 group-hover:to-red-600/10 transition-all duration-300"></div>
            </button>
          </div>
        </div>
        
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-white/90">Salas:</span>
          </div>
          
          <div className="relative bg-gradient-to-r from-white/6 to-white/10 rounded-lg p-3 border border-white/20 backdrop-blur-sm shadow-lg">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/60 via-purple-500/60 to-blue-500/60 rounded-t-lg"></div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              {/* Total */}
              <div className="text-center group relative flex flex-col items-center justify-center">
                <div className="relative inline-flex items-center justify-center w-8 h-8 mb-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600/25 to-gray-700/25 rounded-md opacity-30 group-hover:opacity-50 transition-all duration-200 group-hover:scale-105"></div>
                  <div className="relative w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-md flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                    <span className="text-white font-bold text-xs">{salas.length}</span>
                  </div>
                </div>
                <div className="text-xs font-medium text-white/80 uppercase tracking-wide">Total</div>
                {/* Divisória direita */}
                <div className="absolute top-0 right-0 bottom-0 w-px bg-white/20"></div>
              </div>

              {/* Ocupadas */}
              <div className="text-center group relative flex flex-col items-center justify-center">
                <div className="relative inline-flex items-center justify-center w-8 h-8 mb-1">
                  {/* Elemento visual sutil - fundo com opacidade */}
                  <div className="absolute inset-0 rounded-md opacity-20 group-hover:opacity-30 transition-all duration-200" style={{backgroundColor: '#e61919'}}></div>
                  {/* Elemento visual sutil - borda */}
                  <div className="absolute inset-0 rounded-md border border-opacity-30 group-hover:border-opacity-50 transition-all duration-200" style={{borderColor: '#e61919'}}></div>
                  {/* Quadrado principal */}
                  <div className="relative w-6 h-6 rounded-md flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200" style={{backgroundColor: '#e61919'}}>
                    <span className="text-white font-bold text-xs">{salas.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length}</span>
                  </div>
                </div>
                <div className="text-xs font-medium uppercase tracking-wide" style={{color: '#e61919'}}>Ocupadas</div>
                {/* Divisória direita */}
                <div className="absolute top-0 right-0 bottom-0 w-px bg-white/20"></div>
              </div>

              {/* Disponíveis */}
              <div className="text-center group flex flex-col items-center justify-center">
                <div className="relative inline-flex items-center justify-center w-8 h-8 mb-1">
                  {/* Elemento visual sutil - fundo com opacidade */}
                  <div className="absolute inset-0 bg-green-500/20 rounded-md group-hover:bg-green-500/30 transition-all duration-200"></div>
                  {/* Elemento visual sutil - borda */}
                  <div className="absolute inset-0 rounded-md border border-green-500/30 group-hover:border-green-500/50 transition-all duration-200"></div>
                  {/* Quadrado principal */}
                  <div className="relative w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-md flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                    <span className="text-white font-bold text-xs">{salas.filter(sala => !sala.nome_ocupante || sala.nome_ocupante.trim() === '').length}</span>
                  </div>
                </div>
                <div className="text-xs font-medium text-green-400 uppercase tracking-wide">Disponíveis</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/50">
            Criado em: {new Date(andar.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}
