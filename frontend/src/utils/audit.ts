// Sistema de Auditoria para SalaViewer
// Registra eventos importantes para segurança e monitoramento

export interface AuditEvent {
  type: 'error' | 'securityViolation' | 'dataCreate' | 'dataUpdate' | 'dataDelete' | 'userAction';
  message: string;
  data?: Record<string, unknown>;
  userId?: string;
  timestamp: number;
  context?: string;
}

class AuditLogger {
  private events: AuditEvent[] = [];
  private maxEvents = 1000; // Limite de eventos em memória

  // Registrar erro
  error(error: Error, context?: string, userId?: string): void {
    this.log({
      type: 'error',
      message: error.message,
      data: {
        name: error.name,
        stack: error.stack,
        context
      },
      userId,
      timestamp: Date.now()
    });
  }

  // Registrar violação de segurança
  securityViolation(message: string, data?: Record<string, unknown>): void {
    this.log({
      type: 'securityViolation',
      message,
      data,
      timestamp: Date.now()
    });
  }

  // Registrar criação de dados
  dataCreate(resource: string, data: Record<string, unknown>, userId?: string): void {
    this.log({
      type: 'dataCreate',
      message: `Created ${resource}`,
      data: {
        resource,
        ...data
      },
      userId,
      timestamp: Date.now()
    });
  }

  // Registrar atualização de dados
  dataUpdate(resource: string, data: Record<string, unknown>, userId?: string): void {
    this.log({
      type: 'dataUpdate',
      message: `Updated ${resource}`,
      data: {
        resource,
        ...data
      },
      userId,
      timestamp: Date.now()
    });
  }

  // Registrar exclusão de dados
  dataDelete(resource: string, data: Record<string, unknown>, userId?: string): void {
    this.log({
      type: 'dataDelete',
      message: `Deleted ${resource}`,
      data: {
        resource,
        ...data
      },
      userId,
      timestamp: Date.now()
    });
  }

  // Registrar ação do usuário
  userAction(action: string, data?: Record<string, unknown>, userId?: string): void {
    this.log({
      type: 'userAction',
      message: action,
      data,
      userId,
      timestamp: Date.now()
    });
  }

  // Log interno
  private log(event: AuditEvent): void {
    // Adicionar evento
    this.events.push(event);

    // Manter apenas os últimos eventos
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${event.type.toUpperCase()}:`, {
        message: event.message,
        userId: event.userId,
        timestamp: new Date(event.timestamp).toISOString(),
        data: event.data
      });
    }

    // Em produção, aqui você pode enviar para um serviço de auditoria
    // como Sentry, LogRocket, ou um serviço customizado
    if (process.env.NODE_ENV === 'production') {
      this.sendToAuditService();
    }
  }

  // Enviar para serviço de auditoria (implementar conforme necessário)
  private sendToAuditService(): void {
    // Implementar envio para serviço de auditoria
    // Exemplo: fetch('/api/audit', { method: 'POST', body: JSON.stringify(event) })
  }

  // Obter eventos (para debug)
  getEvents(): AuditEvent[] {
    return [...this.events];
  }

  // Limpar eventos
  clear(): void {
    this.events = [];
  }

  // Obter eventos por tipo
  getEventsByType(type: AuditEvent['type']): AuditEvent[] {
    return this.events.filter(event => event.type === type);
  }

  // Obter eventos por usuário
  getEventsByUser(userId: string): AuditEvent[] {
    return this.events.filter(event => event.userId === userId);
  }
}

// Instância singleton
export const audit = new AuditLogger();
