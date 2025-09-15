import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock do Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do fetch
global.fetch = jest.fn();

// Wrapper customizado para testes
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock de dados para testes
export const mockSala = {
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

export const mockAndar = {
  id: 1,
  numero_andar: 1,
  nome_identificador: 'Térreo',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

// Funções utilitárias para testes
export const createMockApiResponse = (data: unknown) => data;

export const createMockError = (message: string, status = 400) => {
  const error = new Error(message);
  (error as Error & { status: number }).status = status;
  return error;
};

// Mock do apiService
export const mockApiService = {
  getSalas: jest.fn(),
  createSala: jest.fn(),
  updateSala: jest.fn(),
  deleteSala: jest.fn(),
  getAndares: jest.fn(),
  createAndar: jest.fn(),
  updateAndar: jest.fn(),
  deleteAndar: jest.fn(),
  processBatch: jest.fn(),
  clearCacheAndReload: jest.fn(),
};

// Helper para simular erros
export const simulateError = (error: Error) => {
  throw error;
};

// Helper para simular loading
export const simulateLoading = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Helper para limpar mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
};

export * from '@testing-library/react';
export { customRender as render };
