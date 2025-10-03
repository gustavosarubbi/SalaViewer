'use client';

import { useState, useEffect } from 'react';
import { 
  SalasFilters,
  SalasStats,
  SalasList,
  SalaModal,
  SalaEditModal,
  BulkDeleteModal,
  ConfirmModal,
  ToasterContainer
} from '@/components';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { apiService, Sala, SalaUpdateData } from '@/services/api';
import { useToaster } from '@/hooks/useToaster';

// Interface Sala já importada do serviço de API

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAndar, setSelectedAndar] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [salaToEdit, setSalaToEdit] = useState<Sala | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [salaToDelete, setSalaToDelete] = useState<Sala | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Sistema de toaster
  const { toasters, showSuccess, showError, removeToaster } = useToaster();

  useEffect(() => {
    const loadSalas = async () => {
      try {
        console.log('🔄 Carregando TODAS as salas da API...');
        const allSalas = await apiService.getSalas();
        console.log(`✅ Carregadas ${allSalas.length} salas totais`);
        setSalas(allSalas);
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        showError('Erro ao carregar salas', 'Verifique se o backend está rodando e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadSalas();
  }, [showError]);

  // Obter andares únicos para o filtro
  const availableAndares = [...new Set(salas
    .filter(sala => sala.andar && sala.andar.numero_andar)
    .map(sala => sala.andar.numero_andar)
  )].sort((a, b) => a - b);

  // Calcular estatísticas
  const salasOcupadas = salas.filter(sala => sala.nome_ocupante && sala.nome_ocupante.trim() !== '').length;
  const salasDisponiveis = salas.filter(sala => !sala.nome_ocupante || sala.nome_ocupante.trim() === '').length;
  

  // Filtrar e ordenar salas
  const filteredSalas = salas
    .filter(sala => {
      const matchesSearch = sala.numero_sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (sala.nome_ocupante && sala.nome_ocupante.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (sala.andar && sala.andar.numero_andar && sala.andar.numero_andar.toString().includes(searchTerm)) ||
                           (!sala.nome_ocupante && 'disponível'.includes(searchTerm.toLowerCase()));
      
      const matchesAndar = !selectedAndar || (sala.andar && sala.andar.numero_andar && sala.andar.numero_andar.toString() === selectedAndar);
      
      return matchesSearch && matchesAndar;
    })
    .sort((a, b) => {
      // Extrair números da string da sala (ex: "101" de "Sala 101")
      const numA = parseInt(a.numero_sala.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.numero_sala.replace(/\D/g, '')) || 0;
      
      // Ordenação numérica correta
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });

  const handleNovaSala = () => {
    setIsModalOpen(true);
  };

  const handleCreateSala = async (data: { numero_sala: string; nome_ocupante: string | null; andarId: number }) => {
    try {
      console.log('Criando nova sala:', data);
      
      const response = await apiService.createSala(data);
      console.log('Nova sala criada:', response);
      
      // Recarregar a lista de salas
      const allSalas = await apiService.getSalas();
      setSalas(allSalas);
      
      showSuccess(`Sala ${data.numero_sala} criada com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      showError('Erro ao criar sala', 'Verifique o console para mais detalhes.');
      throw error; // Re-throw para o modal tratar
    }
  };

  const handleEdit = (sala: Sala) => {
    console.log('Botão Editar clicado para sala:', sala.numero_sala);
    setSalaToEdit(sala);
    setIsEditModalOpen(true);
  };

  const handleUpdateSala = async (data: { numero_sala: string; nome_ocupante: string | null; andarId: number }) => {
    if (!salaToEdit) return;
    
    try {
      console.log('Atualizando sala:', data);
      
      const dadosAtualizados: SalaUpdateData = {
        numero_sala: data.numero_sala,
        nome_ocupante: data.nome_ocupante,
        andarId: data.andarId
      };
      
      const response = await apiService.updateSala(salaToEdit.id, dadosAtualizados);
      console.log('Sala atualizada:', response);
      
      // Recarregar a lista de salas
      const allSalas = await apiService.getSalas();
      setSalas(allSalas);
      
      showSuccess(`Sala ${data.numero_sala} atualizada com sucesso!`);
    } catch (error) {
      console.error('Erro ao editar sala:', error);
      showError('Erro ao editar sala', 'Verifique o console para mais detalhes.');
      throw error; // Re-throw para o modal tratar
    }
  };

  const handleDelete = (sala: Sala) => {
    console.log('Botão Excluir clicado para sala:', sala.numero_sala);
    setSalaToDelete(sala);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!salaToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiService.deleteSala(salaToDelete.id);
      console.log('Sala excluída da API:', salaToDelete.numero_sala);
      
      // Recarregar a lista de salas
      const updatedSalas = await apiService.getSalas();
      setSalas(updatedSalas);
      
      showSuccess(`Sala ${salaToDelete.numero_sala} excluída com sucesso!`);
      
      // Fechar modal
      setIsDeleteModalOpen(false);
      setSalaToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      showError('Erro ao excluir sala', 'Verifique o console para mais detalhes.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSalaToDelete(null);
  };

  const handleBulkDelete = () => {
    console.log('Abrindo modal de exclusão em massa');
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteConfirm = async (selectedIds: number[]) => {
    setIsBulkDeleting(true);
    
    try {
      console.log('Iniciando exclusão em massa de salas:', selectedIds);
      
      // Preparar itens para processamento em lotes
      const itemsToDelete = selectedIds.map(id => ({ id }));
      
      if (itemsToDelete.length === 0) {
        throw new Error('Nenhuma sala válida encontrada para exclusão');
      }
      
      // Processar exclusões em lotes de 50 com pausa de 100ms entre lotes
      // Otimizado para 3.000+ salas
      const result = await apiService.processBatch(
        itemsToDelete,
        async (item) => {
          console.log(`Excluindo sala com ID ${item.id}...`);
          await apiService.deleteSala(item.id);
          console.log(`✅ Sala ${item.id} excluída com sucesso!`);
        },
        50, // Lotes de 50 (otimizado para grandes volumes)
        100 // 100ms de pausa entre lotes (balanceado para performance)
      );
      
      console.log('Exclusão em massa concluída!');
      
      // Limpar cache e recarregar a lista de salas
      const { salas: freshSalas } = await apiService.clearCacheAndReload();
      setSalas(freshSalas);
      
      // Montar mensagem de resultado
      let mensagem = '';
      
      if (result.success.length > 0) {
        mensagem += `✅ Salas excluídas: ${result.success.length}`;
      }
      
      if (result.errors.length > 0) {
        const errorIds = result.errors.map(e => e.item.id);
        mensagem += `\n⚠️ Salas com erro: ${result.errors.length} (IDs: ${errorIds.join(', ')})`;
      }
      
      if (result.success.length === selectedIds.length) {
        showSuccess('Exclusão em massa concluída!', mensagem);
      } else if (result.success.length > 0) {
        showSuccess('Exclusão parcial concluída!', mensagem);
      } else {
        showError('Erro na exclusão', 'Nenhuma sala foi excluída. Verifique o console para detalhes.');
      }
      
      // Fechar modal
      setIsBulkDeleteModalOpen(false);
      
    } catch (error) {
      console.error('Erro geral na exclusão em massa:', error);
      showError('Erro na exclusão em massa', 'Verifique o console para mais detalhes.');
    } finally {
      setIsBulkDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const actions = (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={handleBulkDelete}
        className="group inline-flex items-center rounded-lg px-3 py-2 bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all"
      >
        Exclusão em Massa
      </button>
      <button
        type="button"
        onClick={handleNovaSala}
        className="group inline-flex items-center rounded-lg px-3 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
      >
        Nova Sala
      </button>
    </div>
  );

  return (
    <>
      <PageLayout title="Salas" description="Gerencie todas as salas do prédio" actions={actions}>
        <Section title="Resumo" description="Indicadores gerais de salas">
          <SalasStats 
            totalSalas={salas.length}
            salasOcupadas={salasOcupadas}
            salasDisponiveis={salasDisponiveis}
          />
        </Section>

        <Section title="Filtros" description="Pesquise, filtre e ordene as salas">
          <SalasFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedAndar={selectedAndar}
            onAndarChange={setSelectedAndar}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            availableAndares={availableAndares}
          />
        </Section>

        <Section title="Lista de Salas" description="Resultados">
          <SalasList 
            salas={filteredSalas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Section>
      </PageLayout>

      {/* Modal para criar nova sala */}
      <SalaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSala}
        existingSalas={salas.map(sala => sala.numero_sala)}
      />

      {/* Modal para editar sala */}
      <SalaEditModal
        isOpen={isEditModalOpen}
        sala={salaToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setSalaToEdit(null);
        }}
        onSubmit={handleUpdateSala}
        existingSalas={salas.map(sala => sala.numero_sala)}
      />

      {/* Modal de confirmação para excluir sala */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Sala"
        message={`Tem certeza que deseja excluir a sala "${salaToDelete?.numero_sala}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Modal de exclusão em massa */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        salas={filteredSalas.map(sala => ({
          id: sala.id,
          numero_sala: sala.numero_sala,
          nome_ocupante: sala.nome_ocupante
        }))}
        isLoading={isBulkDeleting}
        searchTerm={searchTerm}
        selectedAndar={selectedAndar}
        availableAndares={availableAndares}
        onSearchChange={setSearchTerm}
        onAndarChange={setSelectedAndar}
        onClearFilters={() => {
          setSearchTerm('');
          setSelectedAndar('');
        }}
      />

      {/* Sistema de Toaster */}
      <ToasterContainer
        toasters={toasters}
        onRemove={removeToaster}
      />
    </>
  );
}