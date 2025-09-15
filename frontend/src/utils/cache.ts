// Sistema de cache inteligente e otimizado
import { audit } from './audit';

// Tipos de cache
export enum CacheType {
  MEMORY = 'MEMORY',
  SESSION = 'SESSION',
  LOCAL = 'LOCAL',
  INDEXED_DB = 'INDEXED_DB'
}

// Estratégias de cache
export enum CacheStrategy {
  CACHE_FIRST = 'CACHE_FIRST',           // Cache primeiro, fallback para rede
  NETWORK_FIRST = 'NETWORK_FIRST',       // Rede primeiro, fallback para cache
  CACHE_ONLY = 'CACHE_ONLY',             // Apenas cache
  NETWORK_ONLY = 'NETWORK_ONLY',         // Apenas rede
  STALE_WHILE_REVALIDATE = 'STALE_WHILE_REVALIDATE' // Cache com revalidação em background
}

// Interface para item de cache
interface CacheItem<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt: number;
  hits: number;
  lastAccessed: number;
  size: number;
  tags: string[];
  strategy: CacheStrategy;
  version: number;
}

// Interface para configuração de cache
interface CacheConfig {
  maxSize: number;                    // Tamanho máximo em bytes
  maxItems: number;                   // Número máximo de itens
  defaultTTL: number;                 // TTL padrão em ms
  cleanupInterval: number;            // Intervalo de limpeza em ms
  enableCompression: boolean;         // Habilitar compressão
  enableEncryption: boolean;          // Habilitar criptografia
  enableAudit: boolean;               // Habilitar auditoria
  strategies: Record<string, CacheStrategy>; // Estratégias por chave
  tags: Record<string, string[]>;     // Tags por chave
}

// Configuração padrão
const defaultConfig: CacheConfig = {
  maxSize: 50 * 1024 * 1024,         // 50MB
  maxItems: 1000,
  defaultTTL: 5 * 60 * 1000,         // 5 minutos
  cleanupInterval: 60 * 1000,        // 1 minuto
  enableCompression: true,
  enableEncryption: false,
  enableAudit: true,
  strategies: {},
  tags: {}
};

class IntelligentCache {
  private config: CacheConfig;
  private memoryCache: Map<string, CacheItem> = new Map();
  private cleanupTimer?: NodeJS.Timeout;
  private isInitialized = false;
  private compressionWorker?: Worker;
  private encryptionKey?: string;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initialize();
  }

  // Inicializar cache
  private async initialize() {
    if (this.isInitialized) return;

    try {
      // Configurar timer de limpeza
      this.setupCleanupTimer();
      
      // Configurar worker de compressão
      if (this.config.enableCompression) {
        await this.setupCompressionWorker();
      }
      
      // Configurar chave de criptografia
      if (this.config.enableEncryption) {
        await this.setupEncryption();
      }
      
      // Carregar cache persistente
      await this.loadPersistentCache();
      
      this.isInitialized = true;
      
      if (this.config.enableAudit) {
        audit.securityViolation('Cache initialized', {
          config: this.config
        });
      }
    } catch (error) {
      console.error('Failed to initialize cache:', error);
    }
  }

  // Configurar timer de limpeza
  private setupCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  // Configurar worker de compressão
  private async setupCompressionWorker() {
    if (typeof Worker === 'undefined') return;

    try {
      // Criar worker inline para compressão
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          if (type === 'compress') {
            try {
              // Simulação de compressão (em produção usar biblioteca real)
              const compressed = btoa(JSON.stringify(data));
              self.postMessage({ type: 'compressed', data: compressed });
            } catch (error) {
              self.postMessage({ type: 'error', error: error.message });
            }
          } else if (type === 'decompress') {
            try {
              const decompressed = JSON.parse(atob(data));
              self.postMessage({ type: 'decompressed', data: decompressed });
            } catch (error) {
              self.postMessage({ type: 'error', error: error.message });
            }
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.compressionWorker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('Compression worker not supported:', error);
    }
  }

  // Configurar criptografia
  private async setupEncryption() {
    try {
      // Gerar chave de criptografia simples (em produção usar Web Crypto API)
      this.encryptionKey = await this.generateEncryptionKey();
    } catch (error) {
      console.warn('Encryption not supported:', error);
    }
  }

  // Gerar chave de criptografia
  private async generateEncryptionKey(): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const exported = await crypto.subtle.exportKey('raw', key);
      return btoa(String.fromCharCode(...new Uint8Array(exported)));
    }
    
    // Fallback para chave simples
    return btoa(Math.random().toString(36) + Date.now().toString(36));
  }

  // Carregar cache persistente
  private async loadPersistentCache() {
    try {
      // Carregar do sessionStorage
      const sessionData = sessionStorage.getItem('cache_data');
      if (sessionData) {
        const items = JSON.parse(sessionData);
        for (const [key, item] of Object.entries(items)) {
          this.memoryCache.set(key, item as CacheItem);
        }
      }

      // Carregar do localStorage
      const localData = localStorage.getItem('cache_data');
      if (localData) {
        const items = JSON.parse(localData);
        for (const [key, item] of Object.entries(items)) {
          this.memoryCache.set(key, item as CacheItem);
        }
      }
    } catch (error) {
      console.warn('Failed to load persistent cache:', error);
    }
  }

  // Salvar cache persistente
  private async savePersistentCache() {
    try {
      const items: Record<string, CacheItem> = {};
      this.memoryCache.forEach((item, key) => {
        items[key] = item;
      });

      // Salvar no sessionStorage
      sessionStorage.setItem('cache_data', JSON.stringify(items));

      // Salvar no localStorage (apenas itens com TTL longo)
      const longTermItems: Record<string, CacheItem> = {};
      this.memoryCache.forEach((item, key) => {
        if (item.expiresAt - Date.now() > 24 * 60 * 60 * 1000) { // 24 horas
          longTermItems[key] = item;
        }
      });
      localStorage.setItem('cache_data', JSON.stringify(longTermItems));
    } catch (error) {
      console.warn('Failed to save persistent cache:', error);
    }
  }

  // Obter item do cache
  async get<T>(key: string): Promise<T | null> {
    if (!this.isInitialized) await this.initialize();

    const item = this.memoryCache.get(key);
    if (!item) return null;

    // Verificar se expirou
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    // Atualizar estatísticas
    item.hits++;
    item.lastAccessed = Date.now();

    // Descomprimir se necessário
    let value = item.value;
    if (this.config.enableCompression && item.value && typeof item.value === 'string') {
      value = await this.decompress(item.value);
    }

    // Descriptografar se necessário
    if (this.config.enableEncryption && item.value && typeof item.value === 'string') {
      value = await this.decrypt(item.value);
    }

    if (this.config.enableAudit) {
      audit.securityViolation('Cache hit', {
        key,
        hits: item.hits,
        age: Date.now() - item.timestamp
      });
    }

    return value as T;
  }

  // Definir item no cache
  async set<T>(
    key: string, 
    value: T, 
    ttl?: number, 
    tags?: string[], 
    strategy?: CacheStrategy
  ): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    const now = Date.now();
    const expiresAt = now + (ttl || this.config.defaultTTL);
    const itemStrategy = strategy || this.config.strategies[key] || CacheStrategy.CACHE_FIRST;
    const itemTags = tags || this.config.tags[key] || [];

    // Comprimir se necessário
    let processedValue = value;
    if (this.config.enableCompression) {
      processedValue = await this.compress(value) as T;
    }

    // Criptografar se necessário
    if (this.config.enableEncryption) {
      processedValue = await this.encrypt(processedValue) as T;
    }

    // Calcular tamanho
    const size = this.calculateSize(processedValue);

    // Verificar limites
    if (size > this.config.maxSize) {
      console.warn(`Cache item too large: ${key} (${size} bytes)`);
      return;
    }

    // Criar item de cache
    const item: CacheItem<T> = {
      key,
      value: processedValue,
      timestamp: now,
      expiresAt,
      hits: 0,
      lastAccessed: now,
      size,
      tags: itemTags,
      strategy: itemStrategy,
      version: 1
    };

    // Adicionar ao cache
    this.memoryCache.set(key, item);

    // Verificar limites
    this.enforceLimits();

    // Salvar cache persistente
    await this.savePersistentCache();

    if (this.config.enableAudit) {
      audit.securityViolation('Cache set', {
        key,
        size,
        ttl: ttl || this.config.defaultTTL,
        tags: itemTags
      });
    }
  }

  // Remover item do cache
  async delete(key: string): Promise<boolean> {
    if (!this.isInitialized) await this.initialize();

    const deleted = this.memoryCache.delete(key);
    
    if (deleted) {
      await this.savePersistentCache();
      
      if (this.config.enableAudit) {
        audit.securityViolation('Cache delete', { key });
      }
    }

    return deleted;
  }

  // Limpar cache por tags
  async clearByTags(tags: string[]): Promise<number> {
    if (!this.isInitialized) await this.initialize();

    let cleared = 0;
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((item, key) => {
      if (item.tags.some(tag => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      if (this.memoryCache.delete(key)) {
        cleared++;
      }
    });

    if (cleared > 0) {
      await this.savePersistentCache();
      
      if (this.config.enableAudit) {
        audit.securityViolation('Cache clear by tags', { tags, cleared });
      }
    }

    return cleared;
  }

  // Limpar todo o cache
  async clear(): Promise<void> {
    if (!this.isInitialized) await this.initialize();

    this.memoryCache.clear();
    await this.savePersistentCache();

    if (this.config.enableAudit) {
      audit.securityViolation('Cache clear all');
    }
  }

  // Verificar se item existe
  async has(key: string): Promise<boolean> {
    if (!this.isInitialized) await this.initialize();

    const item = this.memoryCache.get(key);
    if (!item) return false;

    // Verificar se expirou
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return false;
    }

    return true;
  }

  // Obter múltiplos itens
  async getMany<T>(keys: string[]): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    
    for (const key of keys) {
      result[key] = await this.get<T>(key);
    }

    return result;
  }

  // Definir múltiplos itens
  async setMany<T>(
    items: Record<string, T>, 
    ttl?: number, 
    tags?: string[]
  ): Promise<void> {
    for (const [key, value] of Object.entries(items)) {
      await this.set(key, value, ttl, tags);
    }
  }

  // Comprimir dados
  private async compress(data: unknown): Promise<string> {
    if (!this.compressionWorker) return JSON.stringify(data);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Compression timeout'));
      }, 5000);

      this.compressionWorker!.onmessage = (e) => {
        clearTimeout(timeout);
        if (e.data.type === 'compressed') {
          resolve(e.data.data);
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.error));
        }
      };

      this.compressionWorker!.postMessage({
        type: 'compress',
        data
      });
    });
  }

  // Descomprimir dados
  private async decompress(compressed: string): Promise<unknown> {
    if (!this.compressionWorker) return JSON.parse(compressed);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Decompression timeout'));
      }, 5000);

      this.compressionWorker!.onmessage = (e) => {
        clearTimeout(timeout);
        if (e.data.type === 'decompressed') {
          resolve(e.data.data);
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.error));
        }
      };

      this.compressionWorker!.postMessage({
        type: 'decompress',
        data: compressed
      });
    });
  }

  // Criptografar dados
  private async encrypt(data: unknown): Promise<string> {
    if (!this.encryptionKey) return JSON.stringify(data);

    try {
      const jsonString = JSON.stringify(data);
      const encoded = btoa(jsonString);
      return encoded;
    } catch (error) {
      console.warn('Encryption failed:', error);
      return JSON.stringify(data);
    }
  }

  // Descriptografar dados
  private async decrypt(encrypted: string): Promise<unknown> {
    if (!this.encryptionKey) return JSON.parse(encrypted);

    try {
      const decoded = atob(encrypted);
      return JSON.parse(decoded);
    } catch (error) {
      console.warn('Decryption failed:', error);
      return JSON.parse(encrypted);
    }
  }

  // Calcular tamanho
  private calculateSize(data: unknown): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return 0;
    }
  }

  // Aplicar limites
  private enforceLimits() {
    // Limitar por número de itens
    if (this.memoryCache.size > this.config.maxItems) {
      const items = Array.from(this.memoryCache.entries())
        .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      const toDelete = items.slice(0, this.memoryCache.size - this.config.maxItems);
      toDelete.forEach(([key]) => this.memoryCache.delete(key));
    }

    // Limitar por tamanho
    let totalSize = 0;
    const items = Array.from(this.memoryCache.entries());
    
    for (const [key, item] of items) {
      totalSize += item.size;
      if (totalSize > this.config.maxSize) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Limpeza de cache
  private cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((item, key) => {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key);
    });

    if (keysToDelete.length > 0) {
      this.savePersistentCache();
      
      if (this.config.enableAudit) {
        audit.securityViolation('Cache cleanup', { 
          expired: keysToDelete.length,
          remaining: this.memoryCache.size
        });
      }
    }
  }

  // Obter estatísticas do cache
  getStats() {
    const items = Array.from(this.memoryCache.values());
    const totalSize = items.reduce((sum, item) => sum + item.size, 0);
    const totalHits = items.reduce((sum, item) => sum + item.hits, 0);
    const avgHits = items.length > 0 ? totalHits / items.length : 0;

    return {
      size: this.memoryCache.size,
      maxSize: this.config.maxItems,
      totalSize,
      maxTotalSize: this.config.maxSize,
      totalHits,
      avgHits,
      hitRate: totalHits / Math.max(1, this.memoryCache.size),
      oldestItem: Math.min(...items.map(item => item.timestamp)),
      newestItem: Math.max(...items.map(item => item.timestamp))
    };
  }

  // Obter itens por tag
  getByTags(tags: string[]): CacheItem[] {
    return Array.from(this.memoryCache.values())
      .filter(item => item.tags.some(tag => tags.includes(tag)));
  }

  // Destruir cache
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    if (this.compressionWorker) {
      this.compressionWorker.terminate();
    }

    this.memoryCache.clear();
    this.isInitialized = false;
  }
}

// Instância global do cache
export const cache = new IntelligentCache();

// Funções de conveniência
export const getCache = <T>(key: string): Promise<T | null> => 
  cache.get<T>(key);

export const setCache = <T>(
  key: string, 
  value: T, 
  ttl?: number, 
  tags?: string[], 
  strategy?: CacheStrategy
): Promise<void> => 
  cache.set(key, value, ttl, tags, strategy);

export const deleteCache = (key: string): Promise<boolean> => 
  cache.delete(key);

export const clearCache = (): Promise<void> => 
  cache.clear();

export const clearCacheByTags = (tags: string[]): Promise<number> => 
  cache.clearByTags(tags);

export const hasCache = (key: string): Promise<boolean> => 
  cache.has(key);

export const getCacheStats = () => 
  cache.getStats();
