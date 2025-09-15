'use client';

import { useState, useEffect } from 'react';
import { 
  DashboardMainHeader,
  DashboardStats,
  DashboardQuickActions,
  ToasterContainer
} from '@/components';
import { apiService } from '@/services/api';
import { useToaster } from '@/hooks/useToaster';

interface DashboardStatsData {
  totalSalas: number;
  totalAndares: number;
  salasOcupadas: number;
  salasDisponiveis: number;
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
  
  const { toasters, showSuccess, showError, removeToaster } = useToaster();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('🔄 Carregando dados do dashboard da API...');
        
        // Buscar dados reais da API
        const [andares, salas] = await Promise.all([
          apiService.getAndares(),
          apiService.getSalas()
        ]);
        
        console.log(`✅ Dashboard: ${andares.length} andares e ${salas.length} salas`);
        
        // Calcular estatísticas reais
        const totalSalas = salas.length;
        const totalAndares = andares.length;
        const salasOcupadas = salas.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length;
        const salasDisponiveis = totalSalas - salasOcupadas;
        
        console.log('Dados do dashboard calculados:', {
          totalSalas,
          totalAndares,
          salasOcupadas,
          salasDisponiveis
        });
        
        // Debug: verificar se a sala 115 está sendo carregada
        const sala115 = salas.find(sala => sala.numero_sala === '115');
        if (sala115) {
          console.log('🔍 Dashboard - Sala 115 encontrada:', sala115);
        } else {
          console.log('⚠️ Dashboard - Sala 115 NÃO encontrada na lista de salas');
        }
        
        // Debug: verificar se há salas com números > 100
        const salasMaiores100 = salas.filter(sala => {
          const num = parseInt(sala.numero_sala.replace(/\D/g, '')) || 0;
          return num > 100;
        });
        console.log('🔍 Dashboard - Salas com número > 100:', salasMaiores100.map(s => s.numero_sala));
        
        // Debug: verificar total de salas
        console.log('📊 Dashboard - Total de salas carregadas:', salas.length);
        console.log('📊 Dashboard - Últimas 10 salas:', salas.slice(-10).map(s => s.numero_sala));
        
        setStats({
          totalSalas,
          totalAndares,
          salasOcupadas,
          salasDisponiveis
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showError('Erro ao carregar dashboard', 'Verifique se o backend está rodando e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [showError]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('🔄 Forçando atualização do dashboard...');
      const { andares, salas } = await apiService.clearCacheAndReload();
      
      // Calcular estatísticas reais
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
      
      showSuccess('Dashboard atualizado!', `Dados recarregados: ${totalSalas} salas e ${totalAndares} andares`);
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
      showError('Erro ao atualizar', 'Não foi possível recarregar os dados');
    } finally {
      setRefreshing(false);
    }
  };


  // Mostrar loading enquanto carrega dados
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <DashboardMainHeader onRefresh={handleRefresh} isRefreshing={refreshing} />
      
      <DashboardStats 
        totalSalas={stats.totalSalas}
        totalAndares={stats.totalAndares}
        salasOcupadas={stats.salasOcupadas}
        salasDisponiveis={stats.salasDisponiveis}
      />
      
      <DashboardQuickActions />

      {/* Sistema de Toaster */}
      <ToasterContainer
        toasters={toasters}
        onRemove={removeToaster}
      />
    </div>
  );
}