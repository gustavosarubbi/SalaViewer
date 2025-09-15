// Sistema de tratamento de erros minucioso e robusto
// import { audit } from './audit';

// Tipos de erros
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  SYSTEM = 'SYSTEM',
  UNKNOWN = 'UNKNOWN'
}

// Níveis de severidade
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Interface para erros estruturados
export interface StructuredError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  context?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  stack?: string;
  recoverable: boolean;
  retryable: boolean;
  userMessage: string;
  technicalMessage: string;
  suggestions: string[];
  metadata: Record<string, unknown>;
}

// Interface para configuração de tratamento de erros
interface ErrorHandlerConfig {
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  enableFallback: boolean;
  enableAudit: boolean;
  enableUserNotification: boolean;
  enableTechnicalLogging: boolean;
}

// Configuração padrão
const defaultConfig: ErrorHandlerConfig = {
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  enableFallback: true,
  enableAudit: true,
  enableUserNotification: true,
  enableTechnicalLogging: true
};

class ErrorHandler {
  private config: ErrorHandlerConfig;
  private retryQueue: Map<string, { count: number; lastRetry: number }> = new Map();
  private errorHistory: StructuredError[] = [];
  private maxHistorySize = 100;

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // Analisar erro e determinar tipo e severidade
  private analyzeError(error: Error): {
    type: ErrorType;
    severity: ErrorSeverity;
    recoverable: boolean;
    retryable: boolean;
  } {
    const message = error.message.toLowerCase();
    // const stack = error.stack?.toLowerCase() || ''; // Removido para evitar warning

    // Análise de tipo
    let type = ErrorType.UNKNOWN;
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      type = ErrorType.NETWORK;
    } else if (message.includes('unauthorized') || message.includes('401')) {
      type = ErrorType.AUTHENTICATION;
    } else if (message.includes('forbidden') || message.includes('403')) {
      type = ErrorType.AUTHORIZATION;
    } else if (message.includes('validation') || message.includes('invalid')) {
      type = ErrorType.VALIDATION;
    } else if (message.includes('business') || message.includes('logic')) {
      type = ErrorType.BUSINESS_LOGIC;
    } else if (message.includes('system') || message.includes('internal')) {
      type = ErrorType.SYSTEM;
    }

    // Análise de severidade
    let severity = ErrorSeverity.MEDIUM;
    if (type === ErrorType.AUTHENTICATION || type === ErrorType.AUTHORIZATION) {
      severity = ErrorSeverity.HIGH;
    } else if (type === ErrorType.SYSTEM) {
      severity = ErrorSeverity.CRITICAL;
    } else if (type === ErrorType.VALIDATION) {
      severity = ErrorSeverity.LOW;
    }

    // Análise de recuperabilidade
    const recoverable = type === ErrorType.NETWORK || type === ErrorType.VALIDATION;
    const retryable = type === ErrorType.NETWORK || type === ErrorType.SYSTEM;

    return { type, severity, recoverable, retryable };
  }

  // Gerar mensagens para usuário e técnico
  private generateMessages(
    error: Error,
    type: ErrorType
  ): {
    userMessage: string;
    technicalMessage: string;
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let userMessage = 'Ocorreu um erro inesperado.';
    let technicalMessage = error.message;

    switch (type) {
      case ErrorType.NETWORK:
        userMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
        technicalMessage = `Network error: ${error.message}`;
        suggestions.push('Verifique sua conexão com a internet');
        suggestions.push('Tente novamente em alguns segundos');
        suggestions.push('Verifique se o servidor está funcionando');
        break;

      case ErrorType.AUTHENTICATION:
        userMessage = 'Sessão expirada. Faça login novamente.';
        technicalMessage = `Authentication error: ${error.message}`;
        suggestions.push('Faça login novamente');
        suggestions.push('Verifique suas credenciais');
        break;

      case ErrorType.AUTHORIZATION:
        userMessage = 'Você não tem permissão para esta ação.';
        technicalMessage = `Authorization error: ${error.message}`;
        suggestions.push('Verifique suas permissões');
        suggestions.push('Entre em contato com o administrador');
        break;

      case ErrorType.VALIDATION:
        userMessage = 'Dados inválidos. Verifique os campos preenchidos.';
        technicalMessage = `Validation error: ${error.message}`;
        suggestions.push('Verifique os campos obrigatórios');
        suggestions.push('Corrija os dados e tente novamente');
        break;

      case ErrorType.BUSINESS_LOGIC:
        userMessage = 'Operação não permitida.';
        technicalMessage = `Business logic error: ${error.message}`;
        suggestions.push('Verifique as regras de negócio');
        suggestions.push('Entre em contato com o suporte');
        break;

      case ErrorType.SYSTEM:
        userMessage = 'Erro interno do sistema. Nossa equipe foi notificada.';
        technicalMessage = `System error: ${error.message}`;
        suggestions.push('Tente novamente mais tarde');
        suggestions.push('Entre em contato com o suporte técnico');
        break;

      default:
        userMessage = 'Erro inesperado. Tente novamente.';
        technicalMessage = `Unknown error: ${error.message}`;
        suggestions.push('Tente novamente');
        suggestions.push('Entre em contato com o suporte');
    }

    return { userMessage, technicalMessage, suggestions };
  }

  // Criar erro estruturado
  private createStructuredError(
    error: Error,
    context?: Record<string, unknown>,
    userId?: string
  ): StructuredError {
    const analysis = this.analyzeError(error);
    const messages = this.generateMessages(error, analysis.type);
    
    const structuredError: StructuredError = {
      id: this.generateErrorId(),
      type: analysis.type,
      severity: analysis.severity,
      message: error.message,
      originalError: error,
      context: context || {},
      timestamp: Date.now(),
      userId,
      sessionId: this.getSessionId(),
      stack: error.stack,
      recoverable: analysis.recoverable,
      retryable: analysis.retryable,
      userMessage: messages.userMessage,
      technicalMessage: messages.technicalMessage,
      suggestions: messages.suggestions,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    };

    return structuredError;
  }

  // Gerar ID único para erro
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obter ID da sessão
  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'unknown';
  }

  // Adicionar erro ao histórico
  private addToHistory(error: StructuredError) {
    this.errorHistory.push(error);
    
    // Manter apenas os últimos N erros
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  // Verificar se deve tentar novamente
  private shouldRetry(errorId: string): boolean {
    if (!this.config.enableRetry) return false;
    
    const retryInfo = this.retryQueue.get(errorId);
    if (!retryInfo) return true;
    
    const now = Date.now();
    const timeSinceLastRetry = now - retryInfo.lastRetry;
    
    return retryInfo.count < this.config.maxRetries && 
           timeSinceLastRetry >= this.config.retryDelay;
  }

  // Registrar tentativa de retry
  private recordRetry(errorId: string) {
    const retryInfo = this.retryQueue.get(errorId) || { count: 0, lastRetry: 0 };
    retryInfo.count++;
    retryInfo.lastRetry = Date.now();
    this.retryQueue.set(errorId, retryInfo);
  }

  // Limpar retry info
  private clearRetryInfo(errorId: string) {
    this.retryQueue.delete(errorId);
  }

  // Tratar erro principal
  async handleError(
    error: Error,
    context?: Record<string, unknown>,
    userId?: string,
    retryFunction?: () => Promise<unknown>
  ): Promise<StructuredError> {
    const structuredError = this.createStructuredError(error, context, userId);
    
    // Adicionar ao histórico
    this.addToHistory(structuredError);
    
    // Log técnico
    if (this.config.enableTechnicalLogging) {
      console.error(`[ERROR HANDLER] ${structuredError.type}:`, {
        id: structuredError.id,
        message: structuredError.technicalMessage,
        context: structuredError.context,
        stack: structuredError.stack
      });
    }
    
    // Auditoria
    if (this.config.enableAudit) {
      // audit.error(error, JSON.stringify(context), userId);
      console.log('[AUDIT] Error logged:', error.message);
    }
    
    // Tentar retry se aplicável
    if (structuredError.retryable && retryFunction && this.shouldRetry(structuredError.id)) {
      try {
        this.recordRetry(structuredError.id);
        await retryFunction();
        this.clearRetryInfo(structuredError.id);
        return structuredError;
      } catch (retryError) {
        // Se retry falhar, continuar com tratamento normal
        console.warn('Retry failed:', retryError);
      }
    }
    
    // Notificar usuário
    if (this.config.enableUserNotification) {
      this.notifyUser(structuredError);
    }
    
    return structuredError;
  }

  // Notificar usuário sobre erro
  private notifyUser(error: StructuredError) {
    // Aqui você pode integrar com seu sistema de notificações
    // Por exemplo, mostrar toast, modal, etc.
    
    if (error.severity === ErrorSeverity.CRITICAL) {
      // Para erros críticos, mostrar modal
      this.showErrorModal(error);
    } else {
      // Para outros erros, mostrar toast
      this.showErrorToast(error);
    }
  }

  // Mostrar modal de erro
  private showErrorModal(error: StructuredError) {
    // Implementar modal de erro
    console.error('CRITICAL ERROR MODAL:', error.userMessage);
  }

  // Mostrar toast de erro
  private showErrorToast(error: StructuredError) {
    // Implementar toast de erro
    console.warn('ERROR TOAST:', error.userMessage);
  }

  // Wrapper para funções assíncronas
  async withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: Record<string, unknown>,
    userId?: string,
    retryFunction?: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const structuredError = await this.handleError(
        error as Error,
        context,
        userId,
        retryFunction
      );
      
      // Re-throw se não for recuperável
      if (!structuredError.recoverable) {
        throw structuredError;
      }
      
      // Para erros recuperáveis, retornar valor padrão ou null
      return null as T;
    }
  }

  // Wrapper para funções síncronas
  withErrorHandlingSync<T>(
    fn: () => T,
    context?: Record<string, unknown>,
    userId?: string
  ): T | null {
    try {
      return fn();
    } catch (error) {
      this.handleError(error as Error, context, userId);
      return null;
    }
  }

  // Obter histórico de erros
  getErrorHistory(): StructuredError[] {
    return [...this.errorHistory];
  }

  // Obter erros por tipo
  getErrorsByType(type: ErrorType): StructuredError[] {
    return this.errorHistory.filter(error => error.type === type);
  }

  // Obter erros por severidade
  getErrorsBySeverity(severity: ErrorSeverity): StructuredError[] {
    return this.errorHistory.filter(error => error.severity === severity);
  }

  // Limpar histórico
  clearHistory() {
    this.errorHistory = [];
    this.retryQueue.clear();
  }

  // Obter estatísticas de erros
  getErrorStats() {
    const stats = {
      total: this.errorHistory.length,
      byType: {} as Record<ErrorType, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
      recent: this.errorHistory.slice(-10)
    };

    this.errorHistory.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }
}

// Instância global do error handler
export const errorHandler = new ErrorHandler({
  enableRetry: true,
  maxRetries: 3,
  retryDelay: 1000,
  enableFallback: true,
  enableAudit: true,
  enableUserNotification: true,
  enableTechnicalLogging: process.env.NODE_ENV === 'development'
});

// Funções de conveniência
export const handleError = errorHandler.handleError.bind(errorHandler);
export const withErrorHandling = errorHandler.withErrorHandling.bind(errorHandler);
export const withErrorHandlingSync = errorHandler.withErrorHandlingSync.bind(errorHandler);

// Hook para React
export function useErrorHandler() {
  return {
    handleError: (error: Error, context?: Record<string, unknown>, userId?: string) => 
      errorHandler.handleError(error, context, userId),
    
    withErrorHandling: <T>(
      fn: () => Promise<T>,
      context?: Record<string, unknown>,
      userId?: string
    ) => errorHandler.withErrorHandling(fn, context, userId),
    
    getErrorHistory: () => errorHandler.getErrorHistory(),
    getErrorStats: () => errorHandler.getErrorStats(),
    clearHistory: () => errorHandler.clearHistory()
  };
}
