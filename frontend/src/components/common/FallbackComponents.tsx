'use client';

import React from 'react';
import { Loader2, AlertCircle, Wifi, WifiOff, RefreshCw, Home } from 'lucide-react';

// Componente de Loading Avançado
export const AdvancedLoading = ({ 
  message = 'Carregando...', 
  progress = 0,
  showProgress = false,
  size = 'default'
}: {
  message?: string;
  progress?: number;
  showProgress?: boolean;
  size?: 'small' | 'default' | 'large';
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-sm text-gray-600">{message}</p>
      
      {showProgress && (
        <div className="w-48 mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Componente de Erro com Retry
export const ErrorFallback = ({ 
  error, 
  onRetry, 
  onGoHome,
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Tente novamente.',
  showDetails = false
}: {
  error?: Error;
  onRetry?: () => void;
  onGoHome?: () => void;
  title?: string;
  message?: string;
  showDetails?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      
      {showDetails && error && (
        <div className="mb-4 p-3 bg-red-50 rounded border border-red-200 text-left max-w-md">
          <p className="text-xs font-mono text-red-800">
            <strong>Erro:</strong> {error.message}
          </p>
        </div>
      )}
      
      <div className="flex space-x-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </button>
        )}
        
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Ir para Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

// Componente de Estado Vazio
export const EmptyState = ({ 
  icon: Icon = AlertCircle,
  title = 'Nenhum item encontrado',
  message = 'Não há dados para exibir no momento.',
  action,
  actionLabel = 'Criar Novo'
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-6 max-w-md">{message}</p>
      
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Componente de Estado de Conexão
export const ConnectionStatus = ({ 
  isOnline, 
  isConnecting = false,
  lastSync
}: {
  isOnline: boolean;
  isConnecting?: boolean;
  lastSync?: Date;
}) => {
  if (isConnecting) {
    return (
      <div className="flex items-center space-x-2 text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Conectando...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center space-x-2 text-red-600">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">Sem conexão</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <Wifi className="h-4 w-4" />
      <span className="text-sm">
        Online{lastSync && ` • Última sincronização: ${lastSync.toLocaleTimeString()}`}
      </span>
    </div>
  );
};

// Componente de Skeleton Loading
export const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

// Componente de Timeout
export const TimeoutFallback = ({ 
  onRetry,
  timeout = 30
}: {
  onRetry?: () => void;
  timeout?: number;
}) => {
  const [seconds, setSeconds] = React.useState(timeout);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
        <AlertCircle className="h-6 w-6 text-yellow-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Tempo limite excedido
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        A operação está demorando mais que o esperado.
      </p>
      
      <div className="mb-6">
        <div className="text-2xl font-bold text-blue-600">{seconds}</div>
        <div className="text-sm text-gray-500">segundos restantes</div>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

// Componente de Manutenção
export const MaintenanceFallback = ({ 
  message = 'Sistema em manutenção',
  estimatedTime = '30 minutos'
}: {
  message?: string;
  estimatedTime?: string;
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {message}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Estamos realizando melhorias no sistema. 
            O serviço deve voltar em aproximadamente <strong>{estimatedTime}</strong>.
          </p>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Obrigado pela sua paciência. Em caso de dúvidas, 
              entre em contato com o suporte técnico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para gerenciar estados de fallback
export const useFallbackState = () => {
  const [state, setState] = React.useState<{
    isLoading: boolean;
    error: Error | null;
    isEmpty: boolean;
    isOffline: boolean;
    isTimeout: boolean;
  }>({
    isLoading: false,
    error: null,
    isEmpty: false,
    isOffline: false,
    isTimeout: false
  });

  const setLoading = (loading: boolean) => 
    setState(prev => ({ ...prev, isLoading: loading }));

  const setError = (error: Error | null) => 
    setState(prev => ({ ...prev, error, isLoading: false }));

  const setEmpty = (empty: boolean) => 
    setState(prev => ({ ...prev, isEmpty: empty, isLoading: false }));

  const setOffline = (offline: boolean) => 
    setState(prev => ({ ...prev, isOffline: offline }));

  const setTimeout = (timeout: boolean) => 
    setState(prev => ({ ...prev, isTimeout: timeout, isLoading: false }));

  const reset = () => 
    setState({
      isLoading: false,
      error: null,
      isEmpty: false,
      isOffline: false,
      isTimeout: false
    });

  return {
    ...state,
    setLoading,
    setError,
    setEmpty,
    setOffline,
    setTimeout,
    reset
  };
};
