import { render, screen } from '@testing-library/react';
import { ModernRoomCard } from '../ModernRoomCard';

const mockSala = {
  id: 1,
  numero_sala: '101',
  nome_ocupante: 'João Silva',
  andarId: 1,
  andar: {
    id: 1,
    numero_andar: 1,
    nome_identificador: 'Térreo'
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

const mockSalaLivre = {
  ...mockSala,
  nome_ocupante: null
};

describe('ModernRoomCard', () => {
  it('renders occupied room correctly', () => {
    render(<ModernRoomCard sala={mockSala} />);
    
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
  });

  it('renders free room correctly', () => {
    render(<ModernRoomCard sala={mockSalaLivre} />);
    
    expect(screen.getByText('Sala Livre')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
  });

  it('shows correct status indicator for occupied room', () => {
    render(<ModernRoomCard sala={mockSala} />);
    
    const statusIndicator = screen.getByText('João Silva').parentElement?.parentElement?.querySelector('.bg-red-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('shows correct status indicator for free room', () => {
    render(<ModernRoomCard sala={mockSalaLivre} />);
    
    const statusIndicator = screen.getByText('Sala Livre').parentElement?.parentElement?.querySelector('.bg-green-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('displays room number correctly', () => {
    render(<ModernRoomCard sala={mockSala} />);
    
    expect(screen.getByText('101')).toBeInTheDocument();
  });

  it('handles empty occupant name as free room', () => {
    const salaWithEmptyName = {
      ...mockSala,
      nome_ocupante: ''
    };
    
    render(<ModernRoomCard sala={salaWithEmptyName} />);
    
    expect(screen.getByText('Sala Livre')).toBeInTheDocument();
  });

  it('handles whitespace-only occupant name as free room', () => {
    const salaWithWhitespaceName = {
      ...mockSala,
      nome_ocupante: '   '
    };
    
    render(<ModernRoomCard sala={salaWithWhitespaceName} />);
    
    expect(screen.getByText('Sala Livre')).toBeInTheDocument();
  });
});

