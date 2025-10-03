import { withErrorHandling } from '@/utils/error-handler';
import { generatePossibleApiUrls } from '@/utils/network-detector';
import { getApiBaseUrl, getPossibleHosts, getPossiblePorts, logEnvironmentInfo } from '@/utils/environment';

// Sistema de detecção dinâmica de API
class DynamicApiManager {
  private apiUrl: string = '';
  private isInitialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.detectApiUrl();
    await this.initPromise;
    this.isInitialized = true;
  }

  private async detectApiUrl(): Promise<void> {
    try {
      // Log do ambiente detectado
      logEnvironmentInfo();
      
      // 1. Tentar variáveis de ambiente primeiro (mais confiável)
      if (process.env.NEXT_PUBLIC_API_URL) {
        this.apiUrl = process.env.NEXT_PUBLIC_API_URL;
        console.log('🌐 API URL das variáveis de ambiente:', this.apiUrl);
        return;
      }

      // 2. Tentar obter do arquivo port-info.json (gerado pelo backend)
      const portInfo = await this.getBackendPortInfo();
      if (portInfo) {
        this.apiUrl = portInfo.apiUrl;
        console.log('🌐 API URL detectada do backend:', this.apiUrl);
        
        // Verificar se a URL do port-info.json está funcionando
        const isWorking = await this.testApiUrl(this.apiUrl);
        if (isWorking) {
          console.log('✅ URL do port-info.json está funcionando');
          return;
        } else {
          console.warn('⚠️ URL do port-info.json não está funcionando, tentando detecção automática...');
        }
      }

      // 3. Tentar detectar automaticamente testando portas comuns
      const detectedUrl = await this.autoDetectApiUrl();
      if (detectedUrl) {
        this.apiUrl = detectedUrl;
        console.log('🌐 API URL detectada automaticamente:', this.apiUrl);
        return;
      }

      // 4. Fallback para configuração padrão dinâmica
      this.apiUrl = this.getDefaultApiUrl();
      console.warn('⚠️ Usando URL padrão da API:', this.apiUrl);
    } catch (error) {
      console.warn('⚠️ Erro ao detectar URL da API, usando fallback:', error);
    }
  }

  private async getBackendPortInfo(): Promise<{ apiUrl: string } | null> {
    try {
      // Tentar buscar o arquivo port-info.json do backend
      const possibleHosts = this.getPossibleHosts();
      const ports = this.getCommonPorts();
      
      for (const host of possibleHosts) {
        for (const port of ports) {
          try {
            const url = `http://${host}:${port}/port-info.json`;
            const response = await fetch(url, { 
              method: 'GET',
              signal: AbortSignal.timeout(1000)
            });
            
            if (response.ok) {
              const portInfo = await response.json();
              console.log('📄 Port-info encontrado em:', url);
              return portInfo;
            }
          } catch {
            // Continuar tentando outras URLs
            continue;
          }
        }
      }
    } catch {
      // Arquivo não existe ou erro de rede
    }
    return null;
  }

  private async testApiUrl(apiUrl: string): Promise<boolean> {
    try {
      const testUrl = `${apiUrl}/andares`;
      console.log(`🧪 Testando URL: ${testUrl}`);
      
      const response = await fetch(testUrl, { 
        method: 'GET',
        signal: AbortSignal.timeout(2000) // Timeout de 2 segundos
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  private async autoDetectApiUrl(): Promise<string | null> {
    // Usar o detector de rede para obter URLs possíveis
    const possibleUrls = generatePossibleApiUrls();
    
    console.log('🔍 Testando URLs da API:', possibleUrls.slice(0, 5), '...');
    
    for (const baseUrl of possibleUrls) {
      try {
        const testUrl = `${baseUrl}/andares`;
        console.log(`🧪 Testando: ${testUrl}`);
        
        const response = await fetch(testUrl, { 
          method: 'GET',
          signal: AbortSignal.timeout(2000) // Timeout de 2 segundos
        });
        
        if (response.ok) {
          console.log(`✅ API encontrada: ${baseUrl}`);
          return baseUrl;
        }
      } catch {
        // URL não disponível, continuar tentando
        console.log(`❌ Falha: ${baseUrl}`);
        continue;
      }
    }
    
    console.log('⚠️ Nenhuma API encontrada automaticamente');
    return null;
  }

  private getPossibleHosts(): string[] {
    return getPossibleHosts();
  }

  private getCommonPorts(): number[] {
    return getPossiblePorts();
  }

  private getDefaultApiUrl(): string {
    const apiUrl = getApiBaseUrl();
    console.log('🔗 URL da API configurada:', apiUrl);
    return apiUrl;
  }

  getApiUrl(): string {
    return this.apiUrl || this.getDefaultApiUrl();
  }

  async refreshApiUrl(): Promise<void> {
    this.isInitialized = false;
    this.initPromise = null;
    await this.initialize();
  }
}

// Instância global do gerenciador de API
const apiManager = new DynamicApiManager();

// Inicializar automaticamente
apiManager.initialize().catch(console.warn);

// URL da API será obtida dinamicamente
let API_BASE_URL = ''; // Será definida dinamicamente

// Atualizar URL quando o gerenciador estiver pronto
apiManager.initialize().then(() => {
  API_BASE_URL = apiManager.getApiUrl();
  console.log('🌐 API URL final configurada:', API_BASE_URL);
});

export interface Sala {
  id: number;
  numero_sala: string;
  nome_ocupante: string | null;
  andarId: number;
  andar: {
    id: number;
    numero_andar: number;
    nome_identificador?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SalaUpdateData {
  numero_sala?: string;
  nome_ocupante?: string | null;
  andarId?: number;
}

export interface Andar {
  id: number;
  numero_andar: number;
  nome_identificador?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AndarUpdateData {
  numero_andar?: number;
  nome_identificador?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Garantir que a API está inicializada
    await apiManager.initialize();
    const currentApiUrl = apiManager.getApiUrl();
    const url = `${currentApiUrl}${endpoint}`;
    
    // Sanitizar endpoint para prevenir ataques
    const sanitizedEndpoint = endpoint.replace(/[<>]/g, '');
    if (sanitizedEndpoint !== endpoint) {
      throw new Error('Endpoint inválido detectado');
    }
    
    // Obter token JWT do localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Prevenir CSRF
        ...(token && { 'Authorization': `Bearer ${token}` }), // Adicionar token JWT
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🌐 Fazendo requisição para:', url, 'com opções:', config);
      const response = await fetch(url, config);
      
      console.log('📡 Resposta recebida:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        
        // Tratamento específico de erros com mais detalhes
        if (response.status === 401) {
          // Limpar token inválido e redirecionar para login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirecionar para login se não estiver na página de login
            if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
              window.location.href = '/';
            }
          }
          throw new Error('Sessão expirada. Faça login novamente.');
        } else if (response.status === 403) {
          throw new Error('Acesso negado. Você não tem permissão para esta ação.');
        } else if (response.status === 404) {
          throw new Error('Recurso não encontrado.');
        } else if (response.status === 409) {
          throw new Error('Conflito: O recurso já existe ou está em uso.');
        } else if (response.status === 422) {
          throw new Error('Dados inválidos. Verifique os campos preenchidos.');
        } else if (response.status === 429) {
          throw new Error('Muitas tentativas. Aguarde um momento e tente novamente.');
        } else if (response.status === 500) {
          throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        } else if (response.status >= 500) {
          throw new Error('Servidor indisponível. Tente novamente mais tarde.');
        } else {
          throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
        }
      }
      
      // Verificar se a resposta tem conteúdo antes de tentar fazer parse JSON
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      
      if (hasJsonContent) {
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        return data;
      } else {
        // Para operações como DELETE que podem retornar resposta vazia
        console.log('✅ Operação realizada com sucesso (sem dados de retorno)');
        return {} as T;
      }
    } catch (error) {
      console.error('❌ API request failed:', error);
      
      // Tratamento específico de erros de rede
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Erro de conexão. Verifique sua internet e se o servidor está rodando.');
      }
      
      // Timeout handling
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido. Tente novamente.');
      }
      
      // Re-throw outros erros
      throw error;
    }
  }

  // Salas
  async getSalas(): Promise<Sala[]> {
    return withErrorHandling(
      async () => {
        const response = await this.request<{ data: Sala[] }>('/salas');
        return response.data;
      },
      { operation: 'getSalas', resource: 'salas' }
    );
  }


  async getSala(id: number): Promise<Sala> {
    const response = await this.request<{ data: Sala }>(`/salas/${id}`);
    return response.data;
  }

  async createSala(data: { numero_sala: string; nome_ocupante?: string | null; andarId: number }): Promise<Sala> {
    // Converter andarId para andar para compatibilidade com o backend
    const backendData = {
      numero_sala: data.numero_sala,
      nome_ocupante: data.nome_ocupante,
      andar: data.andarId
    };
    
    const response = await this.request<{ data: Sala }>('/salas', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return response.data;
  }

  async updateSala(id: number, data: SalaUpdateData): Promise<Sala> {
    console.log('🔄 updateSala chamado com ID:', id, 'Data:', data);
    
    // Converter andarId para andar para compatibilidade com o backend
    const backendData: Record<string, unknown> = { ...data };
    if (data.andarId !== undefined) {
      backendData.andar = data.andarId;
      delete backendData.andarId;
    }
    
    const response = await this.request<{ data: Sala }>(`/salas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(backendData),
    });
    return response.data;
  }

  async deleteSala(id: number): Promise<void> {
    console.log('🗑️ deleteSala chamado com ID:', id);
    
    await this.request<void>(`/salas/${id}`, {
      method: 'DELETE',
    });
  }

  // Função para processar operações em massa em lotes
  async processBatch<T>(
    items: T[],
    processor: (item: T, index: number) => Promise<void>,
    batchSize: number = 50,
    delayMs: number = 100
  ): Promise<{ success: T[], errors: { item: T, error: Error }[] }> {
    const success: T[] = [];
    const errors: { item: T, error: Error }[] = [];
    
    console.log(`🔄 Processando ${items.length} itens em lotes de ${batchSize}...`);
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`📦 Processando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} (${batch.length} itens)`);
      
      // Processar lote em paralelo
      const batchPromises = batch.map(async (item, batchIndex) => {
        const globalIndex = i + batchIndex;
        try {
          await processor(item, globalIndex);
          success.push(item);
        } catch (error) {
          errors.push({ item, error: error instanceof Error ? error : new Error(String(error)) });
        }
      });
      
      await Promise.all(batchPromises);
      
      // Pequena pausa entre lotes para não sobrecarregar o servidor
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    console.log(`✅ Processamento concluído: ${success.length} sucessos, ${errors.length} erros`);
    return { success, errors };
  }

  // Função para limpar cache e forçar recarregamento
  async clearCacheAndReload(): Promise<{ andares: Andar[], salas: Sala[] }> {
    console.log('🧹 Limpando cache e recarregando dados...');
    
    // Pequena pausa para garantir que o servidor processou todas as operações
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const [andares, salas] = await Promise.all([
      this.getAndares(),
      this.getSalas()
    ]);
    
    console.log(`✅ Cache limpo: ${andares.length} andares e ${salas.length} salas`);
    
    return { andares, salas };
  }

  // Função para recarregar URL da API
  async refreshApiConnection(): Promise<void> {
    console.log('🔄 Recarregando conexão com a API...');
    await apiManager.refreshApiUrl();
    const newUrl = apiManager.getApiUrl();
    console.log('🌐 Nova URL da API:', newUrl);
  }

  // Função para obter URL atual da API
  getCurrentApiUrl(): string {
    return apiManager.getApiUrl();
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/local', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Andares
  async getAndares(): Promise<Andar[]> {
    const response = await this.request<{ data: Andar[] }>('/andares');
    return response.data;
  }

  async getAndar(id: number): Promise<Andar> {
    const response = await this.request<{ data: Andar }>(`/andares/${id}`);
    return response.data;
  }

  async createAndar(data: Partial<Andar>): Promise<Andar> {
    const response = await this.request<{ data: Andar }>('/andares', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateAndar(id: number, data: AndarUpdateData): Promise<Andar> {
    console.log('🔄 updateAndar chamado com ID:', id, 'Data:', data);
    
    const response = await this.request<{ data: Andar }>(`/andares/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteAndar(id: number): Promise<void> {
    console.log('🗑️ deleteAndar chamado com ID:', id);
    
    await this.request<void>(`/andares/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
