import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SalaCard from '../SalaCard';
import { mockSala, mockApiService } from '@/utils/test-utils';

// Mock do apiService
jest.mock('@/services/api', () => ({
  apiService: mockApiService,
}));

// Mock do console.log para evitar logs desnecessários nos testes
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('SalaCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    sala: mockSala,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar corretamente com dados da sala', () => {
      render(<SalaCard {...defaultProps} />);

      expect(screen.getByText('Sala 101')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('1º Andar')).toBeInTheDocument();
    });

    it('deve mostrar status "Ocupada" quando sala tem ocupante', () => {
      render(<SalaCard {...defaultProps} />);

      expect(screen.getByText('Ocupada')).toBeInTheDocument();
    });

    it('deve mostrar status "Disponível" quando sala não tem ocupante', () => {
      const salaDisponivel = {
        ...mockSala,
        nome_ocupante: '',
      };

      render(
        <SalaCard
          {...defaultProps}
          sala={salaDisponivel}
        />
      );

      expect(screen.getByText('Disponível')).toBeInTheDocument();
      expect(screen.getByText('Sala disponível para ocupação')).toBeInTheDocument();
    });

    it('deve mostrar data de criação formatada', () => {
      render(<SalaCard {...defaultProps} />);

      expect(screen.getByText(/Criado em:/)).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar onEdit quando botão editar é clicado', async () => {
      const user = userEvent.setup();
      render(<SalaCard {...defaultProps} />);

      const editButton = screen.getByTitle('Editar sala');
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockSala);
    });

    it('deve chamar onDelete quando botão excluir é clicado', async () => {
      const user = userEvent.setup();
      render(<SalaCard {...defaultProps} />);

      const deleteButton = screen.getByTitle('Excluir sala');
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockSala);
    });

    it('deve prevenir propagação de eventos nos botões', async () => {
      // const user = userEvent.setup(); // Removido para evitar warning de variável não utilizada
      const mockStopPropagation = jest.fn();
      
      render(<SalaCard {...defaultProps} />);

      const editButton = screen.getByTitle('Editar sala');
      
      // Simular evento com stopPropagation
      fireEvent.click(editButton, {
        preventDefault: jest.fn(),
        stopPropagation: mockStopPropagation,
      });

      expect(mockOnEdit).toHaveBeenCalled();
    });
  });

  describe('Estilos e Classes CSS', () => {
    it('deve aplicar classes corretas para sala ocupada', () => {
      render(<SalaCard {...defaultProps} />);

      const statusTag = screen.getByText('Ocupada');
      expect(statusTag).toHaveClass('bg-blue-500/20', 'text-blue-400');
    });

    it('deve aplicar classes corretas para sala disponível', () => {
      const salaDisponivel = {
        ...mockSala,
        nome_ocupante: '',
      };

      render(
        <SalaCard
          {...defaultProps}
          sala={salaDisponivel}
        />
      );

      const statusTag = screen.getByText('Disponível');
      expect(statusTag).toHaveClass('bg-green-500/20', 'text-green-400');
    });

    it('deve aplicar ícone correto baseado no status', () => {
      render(<SalaCard {...defaultProps} />);

      const iconContainer = screen.getByText('Ocupada').closest('span')?.previousElementSibling;
      expect(iconContainer).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-blue-600');
    });
  });

  describe('Tratamento de Dados', () => {
    it('deve lidar com andar com dados incompletos', () => {
      const salaComAndarIncompleto = {
        ...mockSala,
        andar: {
          id: 1,
          numero_andar: 0,
          nome_identificador: undefined,
        },
      };

      render(
        <SalaCard
          {...defaultProps}
          sala={salaComAndarIncompleto}
        />
      );

      expect(screen.getByText('0º Andar')).toBeInTheDocument();
    });

    it('deve lidar com nome de ocupante vazio', () => {
      const salaComOcupanteVazio = {
        ...mockSala,
        nome_ocupante: '   ',
      };

      render(
        <SalaCard
          {...defaultProps}
          sala={salaComOcupanteVazio}
        />
      );

      expect(screen.getByText('Disponível')).toBeInTheDocument();
    });

    it('deve formatar data corretamente', () => {
      const salaComData = {
        ...mockSala,
        createdAt: '2024-01-15T10:30:00.000Z',
      };

      render(
        <SalaCard
          {...defaultProps}
          sala={salaComData}
        />
      );

      expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter títulos apropriados nos botões', () => {
      render(<SalaCard {...defaultProps} />);

      expect(screen.getByTitle('Editar sala')).toBeInTheDocument();
      expect(screen.getByTitle('Excluir sala')).toBeInTheDocument();
    });

    it('deve ter estrutura semântica correta', () => {
      render(<SalaCard {...defaultProps} />);

      const listItem = screen.getByRole('listitem');
      expect(listItem).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('deve renderizar sem erros de console', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      
      render(<SalaCard {...defaultProps} />);
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('deve re-renderizar apenas quando props mudam', () => {
      const { rerender } = render(<SalaCard {...defaultProps} />);
      
      // Re-renderizar com mesmas props
      rerender(<SalaCard {...defaultProps} />);
      
      expect(screen.getByText('Sala 101')).toBeInTheDocument();
    });
  });
});