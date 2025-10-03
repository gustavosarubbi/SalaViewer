'use client';

import { useState, useEffect } from 'react';
import { 
  AndaresSearch,
  AndaresStats,
  AndaresGrid,
  AndarModal,
  AndarEditModal,
  BulkCreateModal,
  BulkDeleteAndaresModal,
  ConfirmModal,
  ToasterContainer
} from '@/components';
import PageLayout from '@/components/layout/PageLayout';
import Section from '@/components/layout/Section';
import { apiService, Andar, Sala } from '@/services/api';
import { useToaster } from '@/hooks/useToaster';

export default function AndaresPage() {
  const [andares, setAndares] = useState<Andar[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [andarToEdit, setAndarToEdit] = useState<Andar | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [andarToDelete, setAndarToDelete] = useState<Andar | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkCreateModalOpen, setIsBulkCreateModalOpen] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  
  // Sistema de toaster
  const { toasters, showSuccess, showError, removeToaster } = useToaster();

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Carregando TODOS os andares e salas...');
        
        const [allAndares, allSalas] = await Promise.all([
          apiService.getAndares(),
          apiService.getSalas()
        ]);
        
        console.log(`✅ Carregados ${allAndares.length} andares e ${allSalas.length} salas`);
        
        setAndares(allAndares);
        setSalas(allSalas);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showError('Erro ao carregar dados', 'Verifique se o backend está rodando e tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showError]);

  const filteredAndares = andares
    .filter(andar =>
      andar.numero_andar.toString().includes(searchTerm) ||
      (andar.nome_identificador && andar.nome_identificador.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.numero_andar - b.numero_andar;
      } else {
        return b.numero_andar - a.numero_andar;
      }
    });

  const handleNovoAndar = () => {
    console.log('Botão Novo Andar clicado!');
    setIsModalOpen(true);
  };

  const handleCreateAndar = async (data: { numero_andar: number }) => {
    try {
      console.log('Criando novo andar:', data);
      
      const response = await apiService.createAndar({
        numero_andar: data.numero_andar
      });
      console.log('Novo andar criado:', response);
      
      // Recarregar os dados
      const [andaresResponse, salasResponse] = await Promise.all([
        apiService.getAndares(),
        apiService.getSalas()
      ]);
      setAndares(andaresResponse);
      setSalas(salasResponse);
      
      showSuccess(`Andar ${data.numero_andar}º criado com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar andar:', error);
      showError('Erro ao criar andar', 'Verifique o console para mais detalhes.');
      throw error; // Re-throw para o modal tratar
    }
  };

  const handleEdit = (andar: Andar) => {
    console.log('Botão Editar clicado para andar:', andar.numero_andar);
    setAndarToEdit(andar);
    setIsEditModalOpen(true);
  };

  const handleUpdateAndar = async (data: { numero_andar: number }) => {
    if (!andarToEdit) return;
    
    try {
      console.log('Atualizando andar:', data);
      
      // 1. Atualizar o andar
      const response = await apiService.updateAndar(andarToEdit.id, {
        numero_andar: data.numero_andar
      });
      console.log('Andar atualizado:', response);
      
      // 2. Buscar salas associadas ao andar antigo
      const salasDoAndar = salas.filter(sala => sala.andar && sala.andar.id === andarToEdit.id);
      console.log(`Encontradas ${salasDoAndar.length} salas associadas ao andar ${andarToEdit.numero_andar}º`);
      
      // 3. Atualizar as salas para referenciar o novo andar
      if (salasDoAndar.length > 0) {
        console.log('Atualizando salas para o novo andar...');
        
        // Buscar o novo andar atualizado
        const andaresResponse = await apiService.getAndares();
        const novoAndar = andaresResponse.find((a: Andar) => a.numero_andar === data.numero_andar);
        
        if (novoAndar) {
          // Atualizar cada sala
          const updatePromises = salasDoAndar.map(sala => 
            apiService.updateSala(sala.id, { andarId: novoAndar.id })
          );
          
          await Promise.all(updatePromises);
          console.log(`✅ ${salasDoAndar.length} salas atualizadas para o andar ${data.numero_andar}º`);
        }
      }
      
      // 4. Recarregar os dados
      const [andaresResponse, salasResponse] = await Promise.all([
        apiService.getAndares(),
        apiService.getSalas()
      ]);
      setAndares(andaresResponse);
      setSalas(salasResponse);
      
      showSuccess(`Andar ${data.numero_andar}º atualizado com sucesso! ${salasDoAndar.length > 0 ? `(${salasDoAndar.length} salas atualizadas)` : ''}`);
    } catch (error) {
      console.error('Erro ao editar andar:', error);
      showError('Erro ao editar andar', 'Verifique o console para mais detalhes.');
      throw error; // Re-throw para o modal tratar
    }
  };

  const handleDelete = (andar: Andar) => {
    console.log('Botão Excluir clicado para andar:', andar.numero_andar);
    setAndarToDelete(andar);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!andarToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiService.deleteAndar(andarToDelete.id);
      console.log('Andar excluído da API:', andarToDelete.numero_andar);
      
      // Recarregar os dados
      const [andaresResponse, salasResponse] = await Promise.all([
        apiService.getAndares(),
        apiService.getSalas()
      ]);
      setAndares(andaresResponse);
      setSalas(salasResponse);
      
      showSuccess(`Andar ${andarToDelete.numero_andar}º excluído com sucesso!`);
      
      // Fechar modal
      setIsDeleteModalOpen(false);
      setAndarToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir andar:', error);
      showError('Erro ao excluir andar', 'Verifique o console para mais detalhes.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAndarToDelete(null);
  };


  const handleBulkCreate = () => {
    setIsBulkCreateModalOpen(true);
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkCreateSubmit = async (data: { quantidadeAndares: number; salasPorAndar: number; andarInicial: number }) => {
    setIsBulkCreating(true);
    
    try {
      console.log('Iniciando criação em massa:', data);
      
      // Verificar andares existentes
      const andaresExistentes = andares.map(a => a.numero_andar);
      const andaresParaCriar = [];
      const andaresJaExistem = [];
      
      for (let i = 0; i < data.quantidadeAndares; i++) {
        const numeroAndar = data.andarInicial + i;
        if (andaresExistentes.includes(numeroAndar)) {
          andaresJaExistem.push(numeroAndar);
        } else {
          andaresParaCriar.push(numeroAndar);
        }
      }
      
      // Criar apenas andares que não existem
      const novosAndares: Andar[] = [];
      for (const numeroAndar of andaresParaCriar) {
        console.log(`Criando andar ${numeroAndar}...`);
        
        const andarData = {
          numero_andar: numeroAndar
        };
        
        const andarResponse = await apiService.createAndar(andarData);
        novosAndares.push(andarResponse);
      }
      
                // Recarregar os dados para ter os IDs corretos
                const [todosAndares, todasSalas] = await Promise.all([
                  apiService.getAndares(),
                  apiService.getSalas()
                ]);
      
      // Verificar salas existentes
      const salasExistentes = todasSalas.map(s => s.numero_sala);
      const salasCriadas = [];
      const salasJaExistem = [];
      
      // Preparar todas as salas para criação em lotes
      const salasParaCriar = [];
      
      for (let i = 0; i < data.quantidadeAndares; i++) {
        const numeroAndar = data.andarInicial + i;
        
        // Encontrar o ID do andar (novo ou existente) na lista atualizada
        const andarAtual = todosAndares.find((a: Andar) => a.numero_andar === numeroAndar);
        if (!andarAtual) {
          console.error(`Andar ${numeroAndar} não encontrado após criação!`);
          continue;
        }
        
        const andarId = andarAtual.id;
        console.log(`Preparando salas para andar ${numeroAndar} (ID: ${andarId})...`);
        
        // Preparar salas para este andar
        for (let j = 1; j <= data.salasPorAndar; j++) {
          const numeroSala = `${numeroAndar}${j.toString().padStart(2, '0')}`;
          
          if (salasExistentes.includes(numeroSala)) {
            salasJaExistem.push(numeroSala);
            console.log(`Sala ${numeroSala} já existe, pulando...`);
          } else {
            salasParaCriar.push({
              numeroSala,
              andarId,
              andarNumero: numeroAndar
            });
          }
        }
      }
      
      console.log(`📋 Preparadas ${salasParaCriar.length} salas para criação em lotes`);
      
      // Configurar progresso
      setBulkProgress({ current: 0, total: salasParaCriar.length });
      
      // Processar criação em lotes de 100 com pausa de 50ms entre lotes
      // Otimizado para 3.000+ salas
      const result = await apiService.processBatch(
        salasParaCriar,
        async (item, index) => {
          const salaData = {
            numero_sala: item.numeroSala,
            nome_ocupante: '', // Sala vazia por padrão
            andarId: item.andarId
          };
          
          console.log(`Criando sala ${item.numeroSala} no andar ${item.andarNumero} (ID: ${item.andarId})...`);
          await apiService.createSala(salaData);
          salasCriadas.push(item.numeroSala);
          console.log(`✅ Sala ${item.numeroSala} criada com sucesso!`);
          
          // Atualizar progresso
          setBulkProgress(prev => ({ ...prev, current: index + 1 }));
        },
        100, // Lotes de 100 (otimizado para grandes volumes)
        50 // 50ms de pausa entre lotes (balanceado para performance)
      );
      
      // Adicionar salas criadas com sucesso
      salasCriadas.push(...result.success.map(item => item.numeroSala));
      
      // Adicionar erros
      result.errors.forEach(error => {
        console.error(`❌ Erro ao criar sala ${error.item.numeroSala}:`, error.error);
      });
      
      console.log('Criação em massa concluída!');
      
      // Limpar cache e recarregar TODOS os dados da API para garantir consistência
      const { andares: freshAndares, salas: freshSalas } = await apiService.clearCacheAndReload();
      
      // Atualizar o estado com os dados mais recentes da API
      setAndares(freshAndares);
      setSalas(freshSalas);
      
      // Montar mensagem de resultado
      let mensagem = '';
      
      if (novosAndares.length > 0) {
        mensagem += `✅ Andares criados: ${novosAndares.length} (${andaresParaCriar.join(', ')})`;
      }
      
      if (andaresJaExistem.length > 0) {
        mensagem += `\n⚠️ Andares que já existiam: ${andaresJaExistem.length} (${andaresJaExistem.join(', ')})`;
      }
      
      if (salasCriadas.length > 0) {
        mensagem += `\n✅ Salas criadas: ${salasCriadas.length}`;
      }
      
      if (salasJaExistem.length > 0) {
        mensagem += `\n⚠️ Salas que já existiam: ${salasJaExistem.length} (${salasJaExistem.slice(0, 5).join(', ')}${salasJaExistem.length > 5 ? '...' : ''})`;
      }
      
      showSuccess('Criação em massa concluída!', mensagem);
      
      // Fechar modal
      setIsBulkCreateModalOpen(false);
      
    } catch (error) {
      console.error('Erro na criação em massa:', error);
      showError('Erro na criação em massa', 'Verifique o console para mais detalhes.');
    } finally {
      setIsBulkCreating(false);
    }
  };

  const handleBulkDeleteSubmit = async (selectedIds: number[]) => {
    setIsBulkDeleting(true);
    
    try {
      console.log('Iniciando exclusão em massa de andares:', selectedIds);
      
      // Preparar itens para processamento em lotes
      const itemsToDelete = selectedIds.map(id => ({ id }));
      
      // Processar exclusões em lotes de 25 com pausa de 150ms entre lotes
      // Otimizado para volumes maiores (andares deletam salas em cascata)
      const result = await apiService.processBatch(
        itemsToDelete,
        async (item) => {
          console.log(`Excluindo andar com ID ${item.id}...`);
          await apiService.deleteAndar(item.id);
          console.log(`✅ Andar ${item.id} excluído com sucesso!`);
        },
        25, // Lotes de 25 (otimizado para volumes maiores)
        150 // 150ms de pausa entre lotes (balanceado para performance)
      );
      
      // Separar sucessos e erros
      const andaresExcluidos = result.success.map(item => item.id);
      const andaresComErro = result.errors.map(item => item.item.id);
      
      console.log('Exclusão em massa concluída!');
      
      // Limpar cache e recarregar os dados
      const { andares: freshAndares, salas: freshSalas } = await apiService.clearCacheAndReload();
      setAndares(freshAndares);
      setSalas(freshSalas);
      
      // Montar mensagem de resultado
      let mensagem = '';
      
      if (andaresExcluidos.length > 0) {
        mensagem += `✅ Andares excluídos: ${andaresExcluidos.length}`;
      }
      
      if (andaresComErro.length > 0) {
        mensagem += `\n⚠️ Andares com erro: ${andaresComErro.length} (IDs: ${andaresComErro.join(', ')})`;
      }
      
      if (andaresExcluidos.length === selectedIds.length) {
        showSuccess('Exclusão em massa concluída!', mensagem);
      } else if (andaresExcluidos.length > 0) {
        showSuccess('Exclusão parcial concluída!', mensagem);
      } else {
        showError('Erro na exclusão', 'Nenhum andar foi excluído. Verifique o console para detalhes.');
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

  const totalSalas = salas.length;

  const actions = (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={handleBulkDelete}
        className="group inline-flex items-center rounded-lg px-3 py-2 bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all"
        title="Excluir múltiplos andares"
      >
        Exclusão em Massa
      </button>
      <button
        type="button"
        onClick={handleBulkCreate}
        className="group inline-flex items-center rounded-lg px-3 py-2 bg-orange-500/15 border border-orange-500/30 text-orange-200 hover:text-orange-100 hover:bg-orange-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition-all"
        title="Criar múltiplos andares e salas"
      >
        Criação em Massa
      </button>
      <button
        type="button"
        onClick={handleNovoAndar}
        className="group inline-flex items-center rounded-lg px-3 py-2 bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
      >
        Novo Andar
      </button>
    </div>
  );

  return (
    <>
      <PageLayout title="Andares" description="Gerencie todos os andares do prédio" actions={actions}>
        <Section title="Resumo" description="Indicadores gerais dos andares e salas">
          <AndaresStats 
            totalAndares={andares.length}
            totalSalas={totalSalas}
          />
        </Section>

        <Section title="Pesquisa e Ordenação" description="Encontre e ordene andares">
          <AndaresSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </Section>

        <Section title="Andares" description="Lista completa de andares">
          <AndaresGrid 
            andares={filteredAndares}
            salas={salas}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Section>
      </PageLayout>

      {/* Modal para criar novo andar */}
      <AndarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAndar}
        existingAndares={andares.map(andar => andar.numero_andar)}
      />

      {/* Modal para editar andar */}
      <AndarEditModal
        isOpen={isEditModalOpen}
        andar={andarToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setAndarToEdit(null);
        }}
        onSubmit={handleUpdateAndar}
        existingAndares={andares.map(andar => andar.numero_andar)}
      />

      {/* Modal de confirmação para excluir andar */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Andar"
        message={`Tem certeza que deseja excluir o ${andarToDelete?.numero_andar}º andar? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Modal de criação em massa */}
        <BulkCreateModal
          isOpen={isBulkCreateModalOpen}
          onClose={() => setIsBulkCreateModalOpen(false)}
          onSubmit={handleBulkCreateSubmit}
          isLoading={isBulkCreating}
          progress={bulkProgress}
        />

      {/* Modal de exclusão em massa */}
      <BulkDeleteAndaresModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDeleteSubmit}
        andares={filteredAndares}
        isLoading={isBulkDeleting}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClearFilters={() => setSearchTerm('')}
      />

      {/* Sistema de Toaster */}
      <ToasterContainer
        toasters={toasters}
        onRemove={removeToaster}
      />
    </>
  );
}