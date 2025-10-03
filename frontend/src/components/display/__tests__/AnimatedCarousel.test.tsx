import { render, screen, waitFor } from '@testing-library/react';
import { AnimatedCarousel } from '../AnimatedCarousel';

const mockSalasPorAndar = [
  {
    andar: {
      id: 1,
      numero_andar: 1,
      nome_identificador: 'Térreo'
    },
    salas: [
      {
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
      }
    ]
  },
  {
    andar: {
      id: 2,
      numero_andar: 2,
      nome_identificador: '1º Andar'
    },
    salas: [
      {
        id: 2,
        numero_sala: '201',
        nome_ocupante: null,
        andarId: 2,
        andar: {
          id: 2,
          numero_andar: 2,
          nome_identificador: '1º Andar'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    ]
  }
];

describe('AnimatedCarousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders first andar initially', () => {
    render(
      <AnimatedCarousel
        salasPorAndar={mockSalasPorAndar}
        screenCount={1}
      />
    );
    
    expect(screen.getByText('Térreo')).toBeInTheDocument();
  });

  it('rotates through andares automatically', async () => {
    render(
      <AnimatedCarousel
        salasPorAndar={mockSalasPorAndar}
        screenCount={1}
        autoRotateInterval={1000}
      />
    );
    
    // Initially shows first andar
    expect(screen.getByText('Térreo')).toBeInTheDocument();
    
    // Fast-forward time to trigger rotation
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.getByText('1º Andar')).toBeInTheDocument();
    });
  });

  it('does not rotate when only one andar', () => {
    const singleAndar = [mockSalasPorAndar[0]];
    
    render(
      <AnimatedCarousel
        salasPorAndar={singleAndar}
        screenCount={1}
        autoRotateInterval={1000}
      />
    );
    
    expect(screen.getByText('Térreo')).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Should still show the same andar
    expect(screen.getByText('Térreo')).toBeInTheDocument();
  });

  it('handles empty salasPorAndar', () => {
    render(
      <AnimatedCarousel
        salasPorAndar={[]}
        screenCount={1}
      />
    );
    
    // Should not crash and render nothing
    expect(screen.queryByText('Térreo')).not.toBeInTheDocument();
  });

  it('sorts andares by numero_andar', () => {
    const unsortedAndares = [
      mockSalasPorAndar[1], // 2º andar
      mockSalasPorAndar[0]  // 1º andar
    ];
    
    render(
      <AnimatedCarousel
        salasPorAndar={unsortedAndares}
        screenCount={1}
      />
    );
    
    // Should show 1º andar first (sorted)
    expect(screen.getByText('Térreo')).toBeInTheDocument();
  });

  it('handles different screen counts', () => {
    render(
      <AnimatedCarousel
        salasPorAndar={mockSalasPorAndar}
        screenCount={2}
        currentScreen={1}
      />
    );
    
    // Should still render (distribution logic is tested separately)
    expect(screen.getByText('Térreo')).toBeInTheDocument();
  });
});

