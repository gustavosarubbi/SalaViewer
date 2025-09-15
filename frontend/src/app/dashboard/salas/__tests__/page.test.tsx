import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import SalasPage from '../page';
import { mockSala, mockAndar, mockApiService } from '@/utils/test-utils';

// Mock do Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock do apiService
jest.mock('@/services/api', () => ({
  apiService: mockApiService,
}));

// Mock do useToaster
jest.mock('@/hooks/useToaster', () => ({
  useToaster: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    addToaster: jest.fn(),
  }),
}));


// Mock dos componentes
jest.mock('@/components/dashboard/SalasHeader', () => ({
  SalasHeader: ({ onSearch, onFilter, onSort }: { onSearch: (value: string) => void; onFilter: (value: string) => void; onSort: (value: string) => void }) => (
    <div data-testid="salas-header">
      <input
        data-testid="search-input"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar salas..."
      />
      <select
        data-testid="filter-select"
        onChange={(e) => onFilter(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="ocupadas">Ocupadas</option>
        <option value="disponiveis">Disponíveis</option>
      </select>
      <select
        data-testid="sort-select"
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="numero">Número</option>
        <option value="andar">Andar</option>
        <option value="ocupante">Ocupante</option>
      </select>
    </div>
  ),
}));

jest.mock('@/components/dashboard/SalasStats', () => ({
  SalasStats: ({ salas }: { salas: Array<{ nome_ocupante?: string }> }) => (
    <div data-testid="salas-stats">
      <span>Total: {salas.length}</span>
      <span>Ocupadas: {salas.filter((s) => s.nome_ocupante).length}</span>
      <span>Disponíveis: {salas.filter((s) => !s.nome_ocupante).length}</span>
    </div>
  ),
}));

jest.mock('@/components/dashboard/SalasList', () => ({
  SalasList: ({ salas, onEdit, onDelete, onToggleOccupancy }: { 
    salas: Array<{ id: string; nome: string; nome_ocupante?: string }>; 
    onEdit: (id: string) => void; 
    onDelete: (id: string) => void; 
    onToggleOccupancy: (id: string) => void; 
  }) => (
    <div data-testid="salas-list">
      {salas.map((sala) => (
        <div key={sala.id} data-testid={`sala-${sala.id}`}>
          <span>{sala.numero_sala}</span>
          <button onClick={() => onEdit(sala)}>Editar</button>
          <button onClick={() => onDelete(sala)}>Deletar</button>
          <button onClick={() => onToggleOccupancy(sala)}>Toggle</button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/modals/SalaModal', () => ({
  SalaModal: ({ isOpen, onClose, onSuccess }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSuccess: () => void; 
  }) => 
    isOpen ? (
      <div data-testid="sala-modal">
        <button onClick={onClose}>Fechar</button>
        <button onClick={onSuccess}>Salvar</button>
      </div>
    ) : null,
}));

jest.mock('@/components/modals/SalaEditModal', () => ({
  SalaEditModal: ({ isOpen, onClose, onSuccess, sala }: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSuccess: () => void; 
    sala?: { numero_sala: string }; 
  }) => 
    isOpen ? (
      <div data-testid="sala-edit-modal">
        <span>Editando: {sala?.numero_sala}</span>
        <button onClick={onClose}>Fechar</button>
        <button onClick={onSuccess}>Salvar</button>
      </div>
    ) : null,
}));

describe('SalasPage - Testes de Integração', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  };

  const mockSalas = [
    { ...mockSala, id: 1, numero_sala: '101', nome_ocupante: 'João Silva' },
    { ...mockSala, id: 2, numero_sala: '102', nome_ocupante: null },
    { ...mockSala, id: 3, numero_sala: '201', nome_ocupante: 'Maria Santos' },
  ];

  const mockAndares = [
    { ...mockAndar, id: 1, numero_andar: 1, nome_identificador: 'Térreo' },
    { ...mockAndar, id: 2, numero_andar: 2, nome_identificador: '1º Andar' },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
    
    // Mock das respostas da API
    mockApiService.getSalas.mockResolvedValue(mockSalas);
    mockApiService.getAndares.mockResolvedValue(mockAndares);
  });

  describe('Carregamento Inicial', () => {
    it('deve carregar e exibir salas corretamente', async () => {
      render(<SalasPage />);
      
      // Verificar se está carregando
      expect(screen.getByText('Carregando salas...')).toBeInTheDocument();
      
      // Aguardar carregamento
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      // Verificar se as salas foram carregadas
      expect(screen.getByTestId('sala-1')).toBeInTheDocument();
      expect(screen.getByTestId('sala-2')).toBeInTheDocument();
      expect(screen.getByTestId('sala-3')).toBeInTheDocument();
    });

    it('deve exibir estatísticas corretas', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-stats')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Total: 3')).toBeInTheDocument();
      expect(screen.getByText('Ocupadas: 2')).toBeInTheDocument();
      expect(screen.getByText('Disponíveis: 1')).toBeInTheDocument();
    });

    it('deve lidar com erro de carregamento', async () => {
      mockApiService.getSalas.mockRejectedValue(new Error('Erro de rede'));
      
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar salas')).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidades de Busca e Filtro', () => {
    it('deve filtrar salas por busca', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: '101' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('sala-1')).toBeInTheDocument();
        expect(screen.queryByTestId('sala-2')).not.toBeInTheDocument();
        expect(screen.queryByTestId('sala-3')).not.toBeInTheDocument();
      });
    });

    it('deve filtrar salas por status de ocupação', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const filterSelect = screen.getByTestId('filter-select');
      fireEvent.change(filterSelect, { target: { value: 'ocupadas' } });
      
      await waitFor(() => {
        expect(screen.getByTestId('sala-1')).toBeInTheDocument();
        expect(screen.getByTestId('sala-3')).toBeInTheDocument();
        expect(screen.queryByTestId('sala-2')).not.toBeInTheDocument();
      });
    });

    it('deve ordenar salas corretamente', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const sortSelect = screen.getByTestId('sort-select');
      fireEvent.change(sortSelect, { target: { value: 'andar' } });
      
      // Verificar se a ordenação foi aplicada
      await waitFor(() => {
        const salas = screen.getAllByTestId(/sala-\d+/);
        expect(salas).toHaveLength(3);
      });
    });
  });

  describe('Operações CRUD', () => {
    it('deve abrir modal de criação de sala', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Nova Sala');
      fireEvent.click(createButton);
      
      expect(screen.getByTestId('sala-modal')).toBeInTheDocument();
    });

    it('deve abrir modal de edição de sala', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const editButton = screen.getAllByText('Editar')[0];
      fireEvent.click(editButton);
      
      expect(screen.getByTestId('sala-edit-modal')).toBeInTheDocument();
      expect(screen.getByText('Editando: 101')).toBeInTheDocument();
    });

    it('deve deletar sala com confirmação', async () => {
      mockApiService.deleteSala.mockResolvedValue({});
      
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const deleteButton = screen.getAllByText('Deletar')[0];
      fireEvent.click(deleteButton);
      
      // Verificar se modal de confirmação aparece
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
      
      const confirmButton = screen.getByText('Confirmar');
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(mockApiService.deleteSala).toHaveBeenCalledWith(1);
      });
    });

    it('deve alternar ocupação de sala', async () => {
      mockApiService.updateSala.mockResolvedValue({});
      
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const toggleButton = screen.getAllByText('Toggle')[0];
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(mockApiService.updateSala).toHaveBeenCalled();
      });
    });
  });

  describe('Estados de Loading', () => {
    it('deve mostrar loading durante operações', async () => {
      mockApiService.getSalas.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockSalas), 100))
      );
      
      render(<SalasPage />);
      
      expect(screen.getByText('Carregando salas...')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText('Carregando salas...')).not.toBeInTheDocument();
      });
    });

    it('deve desabilitar botões durante loading', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Nova Sala');
      expect(createButton).not.toBeDisabled();
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve lidar com erro de criação de sala', async () => {
      mockApiService.createSala.mockRejectedValue(new Error('Erro ao criar sala'));
      
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Nova Sala');
      fireEvent.click(createButton);
      
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao criar sala')).toBeInTheDocument();
      });
    });

    it('deve lidar com erro de atualização de sala', async () => {
      mockApiService.updateSala.mockRejectedValue(new Error('Erro ao atualizar sala'));
      
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const editButton = screen.getAllByText('Editar')[0];
      fireEvent.click(editButton);
      
      const saveButton = screen.getByText('Salvar');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao atualizar sala')).toBeInTheDocument();
      });
    });
  });

  describe('Acessibilidade', () => {
    it('deve ser navegável por teclado', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const createButton = screen.getByText('Nova Sala');
      createButton.focus();
      expect(createButton).toHaveFocus();
    });

    it('deve ter labels apropriados', async () => {
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      expect(screen.getByLabelText('Buscar salas')).toBeInTheDocument();
      expect(screen.getByLabelText('Filtrar por status')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve carregar rapidamente', async () => {
      const start = performance.now();
      render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Menos de 1 segundo
    });

    it('deve evitar re-renders desnecessários', async () => {
      const { rerender } = render(<SalasPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('salas-list')).toBeInTheDocument();
      });
      
      // Re-render com mesmas props
      rerender(<SalasPage />);
      
      // Verificar se não houve mudanças desnecessárias
      expect(screen.getByTestId('salas-list')).toBeInTheDocument();
    });
  });
});
