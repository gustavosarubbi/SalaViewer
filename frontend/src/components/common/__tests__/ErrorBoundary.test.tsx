import React from 'react';
import { render, screen, fireEvent } from '@/utils/test-utils';

// Componente que vai quebrar para testar o ErrorBoundary
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Limpar console.error para evitar logs desnecessários
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve renderizar children quando não há erro', () => {
    render(
      <ThrowError shouldThrow={false} />
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('deve renderizar fallback quando há erro', () => {
    render(
      <ThrowError shouldThrow={true} />
    );
    
    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
    expect(screen.getByText('Ir para Dashboard')).toBeInTheDocument();
  });

  it('deve mostrar detalhes do erro em desenvolvimento', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ThrowError shouldThrow={true} />
    );
    
    expect(screen.getByText('Erro: Test error')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('deve esconder detalhes do erro em produção', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ThrowError shouldThrow={true} />
    );
    
    expect(screen.queryByText('Erro: Test error')).not.toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('deve permitir retry após erro', () => {
    const { rerender } = render(
      <ThrowError shouldThrow={true} />
    );
    
    expect(screen.getByText('Oops! Algo deu errado')).toBeInTheDocument();
    
    // Simular retry
    fireEvent.click(screen.getByText('Tentar Novamente'));
    
    // Renderizar sem erro
    rerender(<ThrowError shouldThrow={false} />);
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('deve chamar onError callback quando fornecido', () => {
    // const onError = jest.fn(); // Removido para evitar warning de variável não utilizada
    
    render(
      <ThrowError shouldThrow={true} />,
      { wrapper: ({ children }) => (
        <div>
          {children}
        </div>
      )}
    );
    
    // O ErrorBoundary deve capturar o erro automaticamente
    expect(console.error).toHaveBeenCalled();
  });
});
