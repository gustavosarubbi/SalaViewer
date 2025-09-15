'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Shield, Zap } from 'lucide-react';
import { audit } from '@/utils/audit';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
  showDetails?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
  errorId: string;
  errorTimestamp: number;
  userAgent: string;
  url: string;
}

export class ErrorBoundaryAdvanced extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;
  private errorHistory: Array<{
    error: Error;
    errorInfo: ErrorInfo;
    timestamp: number;
    retryCount: number;
  }> = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
      errorId: '',
      errorTimestamp: 0,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      errorTimestamp: Date.now()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundaryAdvanced caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Adicionar ao histórico de erros
    this.errorHistory.push({
      error,
      errorInfo,
      timestamp: Date.now(),
      retryCount: this.state.retryCount
    });

    // Manter apenas os últimos 10 erros
    if (this.errorHistory.length > 10) {
      this.errorHistory.shift();
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auditoria de erro
    audit.error(error, `ErrorBoundary: ${this.props.level || 'component'}`, undefined);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      const errorData = {
        id: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: this.state.errorTimestamp,
        userAgent: this.state.userAgent,
        url: this.state.url,
        retryCount: this.state.retryCount,
        level: this.props.level || 'component',
        errorHistory: this.errorHistory.slice(-5) // Últimos 5 erros
      };

      // Em produção, enviar para serviço de monitoramento
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  };

  handleRetry = async () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({ isRetrying: true });

    // Aguardar delay antes de tentar novamente
    await new Promise(resolve => {
      this.retryTimeout = setTimeout(resolve, retryDelay * (this.state.retryCount + 1));
    });

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      isRetrying: false
    }));
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  handleReportBug = () => {
    const errorData = {
      id: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: this.state.errorTimestamp,
      userAgent: this.state.userAgent,
      url: this.state.url,
      retryCount: this.state.retryCount
    };

    // Abrir email ou sistema de bug report
    const subject = `Bug Report - Error ID: ${this.state.errorId}`;
    const body = `Error Details:\n\n${JSON.stringify(errorData, null, 2)}`;
    
    window.open(`mailto:support@salaviewer.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  getErrorIcon = () => {
    const { level = 'component' } = this.props;
    
    switch (level) {
      case 'critical':
        return <Shield className="h-8 w-8 text-red-600" />;
      case 'page':
        return <Bug className="h-8 w-8 text-orange-600" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    }
  };

  getErrorTitle = () => {
    const { level = 'component' } = this.props;
    
    switch (level) {
      case 'critical':
        return 'Erro Crítico do Sistema';
      case 'page':
        return 'Erro na Página';
      default:
        return 'Erro no Componente';
    }
  };

  getErrorDescription = () => {
    const { level = 'component' } = this.props;
    
    switch (level) {
      case 'critical':
        return 'Ocorreu um erro crítico que afeta o funcionamento do sistema. Nossa equipe foi notificada automaticamente.';
      case 'page':
        return 'Ocorreu um erro ao carregar esta página. Você pode tentar recarregar ou voltar ao dashboard.';
      default:
        return 'Ocorreu um erro neste componente. Você pode tentar recarregar ou continuar usando outras partes do sistema.';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { showDetails = false, enableRetry = true } = this.props;
      const canRetry = enableRetry && this.state.retryCount < (this.props.maxRetries || 3);

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-2xl w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                {this.getErrorIcon()}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {this.getErrorTitle()}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {this.getErrorDescription()}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>ID do Erro:</span>
                  <span className="font-mono">{this.state.errorId}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Horário:</span>
                  <span>{new Date(this.state.errorTimestamp).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Tentativas:</span>
                  <span>{this.state.retryCount}/{(this.props.maxRetries || 3)}</span>
                </div>
              </div>

              {showDetails && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 rounded border border-red-200 text-left">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">Detalhes Técnicos:</h3>
                  <p className="text-xs font-mono text-red-700 mb-2">
                    <strong>Erro:</strong> {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs text-red-600 overflow-auto max-h-32 bg-red-100 p-2 rounded">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <button
                    onClick={this.handleRetry}
                    disabled={this.state.isRetrying}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {this.state.isRetrying ? (
                      <>
                        <Zap className="h-5 w-5 mr-2 animate-spin" />
                        Tentando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Tentar Novamente
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Ir para Dashboard
                </button>

                <button
                  onClick={this.handleReportBug}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Bug className="h-5 w-5 mr-2" />
                  Reportar Bug
                </button>
              </div>

              {this.state.retryCount > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  Tentativa {this.state.retryCount} de {(this.props.maxRetries || 3)}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }
}

// Hook para usar Error Boundary em componentes funcionais
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implementar serviço de monitoramento
      console.error('Production error:', error);
    }
  };
}

// Wrapper para diferentes níveis de Error Boundary
export const PageErrorBoundary = (props: Omit<Props, 'level'>) => (
  <ErrorBoundaryAdvanced {...props} level="page" showDetails={true} enableRetry={true} />
);

export const ComponentErrorBoundary = (props: Omit<Props, 'level'>) => (
  <ErrorBoundaryAdvanced {...props} level="component" showDetails={false} enableRetry={true} />
);

export const CriticalErrorBoundary = (props: Omit<Props, 'level'>) => (
  <ErrorBoundaryAdvanced {...props} level="critical" showDetails={true} enableRetry={false} />
);
