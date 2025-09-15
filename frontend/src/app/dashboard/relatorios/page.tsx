'use client';

import { useState, useEffect } from 'react';
import { 
  RelatoriosHeader,
  RelatoriosStats,
  RelatoriosOcupacao,
  RelatoriosAtividades,
  ToasterContainer
} from '@/components';
import { apiService } from '@/services/api';
import { useToaster } from '@/hooks/useToaster';

interface RelatorioData {
  totalSalas: number;
  totalAndares: number;
  salasOcupadas: number;
  salasDisponiveis: number;
  ocupacaoPorAndar: { andar: number; salas: number; ocupadas: number }[];
  ultimasAtividades: { tipo: string; descricao: string; data: string }[];
}

export default function RelatoriosPage() {
  const [data, setData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Sistema de toaster
  const { toasters, showError, removeToaster } = useToaster();

  useEffect(() => {
    const loadRelatorioData = async () => {
      try {
        console.log('Carregando dados do relatório da API...');
        
        // Buscar dados reais da API usando as funções otimizadas
        const [andares, salas] = await Promise.all([
          apiService.getAndares(),
          apiService.getSalas()
        ]);
        
        // Calcular estatísticas reais
        const totalSalas = salas.length;
        const totalAndares = andares.length;
        const salasOcupadas = salas.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length;
        const salasDisponiveis = totalSalas - salasOcupadas;
        
        // Calcular ocupação por andar
        const ocupacaoPorAndar = andares.map(andar => {
          const salasDoAndar = salas.filter(sala => sala.andar && sala.andar.id === andar.id);
          const salasOcupadasDoAndar = salasDoAndar.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length;
          
          return {
            andar: andar.numero_andar,
            salas: salasDoAndar.length,
            ocupadas: salasOcupadasDoAndar
          };
        });
        
        // Gerar atividades baseadas nos dados reais (últimas 10 salas criadas/atualizadas)
        const ultimasAtividades = salas.length > 0 
          ? salas
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 10)
              .map(sala => ({
                tipo: 'atualizacao' as const,
                descricao: sala.nome_ocupante && sala.nome_ocupante.trim() !== '' 
                  ? `Sala ${sala.numero_sala} ocupada por ${sala.nome_ocupante}`
                  : `Sala ${sala.numero_sala} disponível`,
                data: sala.updatedAt
              }))
          : [];
        
        const relatorioData: RelatorioData = {
          totalSalas,
          totalAndares,
          salasOcupadas,
          salasDisponiveis,
          ocupacaoPorAndar,
          ultimasAtividades
        };
        
        console.log('Dados do relatório calculados:', relatorioData);
        setData(relatorioData);
      } catch (error) {
        console.error('Erro ao carregar dados do relatório:', error);
        showError('Erro ao carregar relatório', 'Verifique se o backend está rodando e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadRelatorioData();
  }, [showError]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Erro ao carregar dados do relatório</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RelatoriosHeader />

      <RelatoriosStats 
        totalSalas={data.totalSalas}
        totalAndares={data.totalAndares}
        salasOcupadas={data.salasOcupadas}
        salasDisponiveis={data.salasDisponiveis}
      />

      <RelatoriosOcupacao ocupacaoPorAndar={data.ocupacaoPorAndar} />

      <RelatoriosAtividades atividades={data.ultimasAtividades} />

      {/* Sistema de Toaster */}
      <ToasterContainer
        toasters={toasters}
        onRemove={removeToaster}
      />
    </div>
  );
}