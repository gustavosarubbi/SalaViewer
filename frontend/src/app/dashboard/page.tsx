'use client';

import { useState, useEffect } from 'react';
import { 
  DashboardStats,
  ToasterContainer,
  RelatoriosOcupacao,
  RelatoriosAtividades
} from '@/components';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { apiService, Sala, Andar } from '@/services/api';
import { useToaster } from '@/hooks/useToaster';
import { RefreshCw } from 'lucide-react';

interface DashboardStatsData {
  totalSalas: number;
  totalAndares: number;
  salasOcupadas: number;
  salasDisponiveis: number;
}

interface OcupacaoPorAndarItem {
  andar: number;
  salas: number;
  ocupadas: number;
}

interface UltimaAtividadeItem {
  tipo: string;
  descricao: string;
  data: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalSalas: 0,
    totalAndares: 0,
    salasOcupadas: 0,
    salasDisponiveis: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ocupacaoPorAndar, setOcupacaoPorAndar] = useState<OcupacaoPorAndarItem[]>([]);
  const [ultimasAtividades, setUltimasAtividades] = useState<UltimaAtividadeItem[]>([]);
  
  
  const { toasters, showSuccess, showError, removeToaster } = useToaster();

  

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('🔄 Carregando dados do dashboard da API...');
        setLoading(true);
        
        const [salasResponse, andaresResponse] = await Promise.all([
          apiService.getSalas(),
          apiService.getAndares()
        ]);

        console.log('📊 Dados recebidos:', { salasResponse, andaresResponse });

        const salas = salasResponse || [];
        const andares = andaresResponse || [];

        // Calcular estatísticas
        const totalSalas = salas.length;
        const totalAndares = andares.length;
        const salasOcupadas = salas.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length;
        const salasDisponiveis = totalSalas - salasOcupadas;
        
        const newStats = {
          totalSalas,
          totalAndares,
          salasOcupadas,
          salasDisponiveis
        };

        console.log('📈 Estatísticas calculadas:', newStats);
        setStats(newStats);
        
        // Ocupação por andar
        const novaOcupacaoPorAndar: OcupacaoPorAndarItem[] = andares.map((andar: Andar) => {
          const salasDoAndar = salas.filter((s: Sala) => s.andar && s.andar.id === andar.id);
          const salasOcupadasDoAndar = salasDoAndar.filter((s: Sala) => s.nome_ocupante && s.nome_ocupante.trim() !== '').length;
          return {
            andar: andar.numero_andar,
            salas: salasDoAndar.length,
            ocupadas: salasOcupadasDoAndar,
          };
        });
        setOcupacaoPorAndar(novaOcupacaoPorAndar);
        
        // Últimas atividades (10 mais recentes por updatedAt)
        const novasAtividades: UltimaAtividadeItem[] = salas
          .slice()
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 10)
          .map((s) => ({
            tipo: 'atualizacao',
            descricao: s.nome_ocupante && s.nome_ocupante.trim() !== ''
              ? `Sala ${s.numero_sala} ocupada por ${s.nome_ocupante}`
              : `Sala ${s.numero_sala} disponível`,
            data: s.updatedAt,
          }));
        setUltimasAtividades(novasAtividades);
        
        showSuccess('Dados carregados com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao carregar dados do dashboard:', error);
        showError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [showSuccess, showError]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('🔄 Atualizando dados do dashboard...');
      
      const [salasResponse, andaresResponse] = await Promise.all([
        apiService.getSalas(),
        apiService.getAndares()
      ]);

      const salas = salasResponse || [];
      const andares = andaresResponse || [];

      const totalSalas = salas.length;
      const totalAndares = andares.length;
      const salasOcupadas = salas.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length;
      const salasDisponiveis = totalSalas - salasOcupadas;
      
      setStats({
        totalSalas,
        totalAndares,
        salasOcupadas,
        salasDisponiveis
      });
      
      const novaOcupacaoPorAndar: OcupacaoPorAndarItem[] = andares.map((andar: Andar) => {
        const salasDoAndar = salas.filter((s: Sala) => s.andar && s.andar.id === andar.id);
        const salasOcupadasDoAndar = salasDoAndar.filter((s: Sala) => s.nome_ocupante && s.nome_ocupante.trim() !== '').length;
        return {
          andar: andar.numero_andar,
          salas: salasDoAndar.length,
          ocupadas: salasOcupadasDoAndar,
        };
      });
      setOcupacaoPorAndar(novaOcupacaoPorAndar);
      
      const novasAtividades: UltimaAtividadeItem[] = salas
        .slice()
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10)
        .map((s) => ({
          tipo: 'atualizacao',
          descricao: s.nome_ocupante && s.nome_ocupante.trim() !== ''
            ? `Sala ${s.numero_sala} ocupada por ${s.nome_ocupante}`
            : `Sala ${s.numero_sala} disponível`,
          data: s.updatedAt,
        }));
      setUltimasAtividades(novasAtividades);
      
      showSuccess('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar dados:', error);
      showError('Erro ao atualizar dados');
    } finally {
      setRefreshing(false);
    }
  };



  if (loading) {
    return (
      <PageLayout title="Dashboard" description="Carregando dados do sistema...">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </PageLayout>
    );
  }

  const actions = (
    <>
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className="inline-flex items-center rounded-lg px-3 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`h-4 w-4 mr-2 text-blue-300 transition-transform duration-300 ${refreshing ? 'animate-spin' : 'hover:scale-110'}`} />
        {refreshing ? 'Atualizando...' : 'Atualizar Dados'}
      </button>
    </>
  );

  return (
    <PageLayout
      title="Dashboard"
      description="Visão geral do sistema de gerenciamento de salas"
      actions={actions}
    >
      {/* Estatísticas */}
      <Section title="Estatísticas do Sistema" description="Resumo geral dos dados">
        <DashboardStats 
          totalSalas={stats.totalSalas}
          totalAndares={stats.totalAndares}
          salasOcupadas={stats.salasOcupadas}
          salasDisponiveis={stats.salasDisponiveis}
        />
      </Section>

      {/* Relatórios - Ocupação por Andar */}
      <Section title="Ocupação por Andar" description="Distribuição de ocupação por andar">
        <RelatoriosOcupacao ocupacaoPorAndar={ocupacaoPorAndar} />
      </Section>

      {/* Relatórios - Últimas Atividades */}
      <Section title="Atividades Recentes" description="Últimas alterações registradas">
        <RelatoriosAtividades atividades={ultimasAtividades} />
      </Section>

      <ToasterContainer 
        toasters={toasters} 
        onRemove={removeToaster} 
      />
    </PageLayout>
  );
}