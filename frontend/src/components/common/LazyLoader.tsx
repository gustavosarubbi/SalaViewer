'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { performanceMonitor } from '@/utils/performance';
import { cache } from '@/utils/cache';

// Interface para configuração de lazy loading
interface LazyLoaderConfig {
  threshold: number;                    // Threshold de visibilidade (0-1)
  rootMargin: string;                   // Margem do root
  triggerOnce: boolean;                 // Disparar apenas uma vez
  placeholder: React.ReactNode;         // Placeholder durante carregamento
  fallback: React.ReactNode;            // Fallback em caso de erro
  preload: boolean;                     // Pré-carregar quando próximo
  preloadDistance: number;              // Distância para pré-carregamento
  cache: boolean;                       // Usar cache
  cacheKey?: string;                    // Chave do cache
  cacheTTL?: number;                    // TTL do cache
  retryCount: number;                   // Número de tentativas
  retryDelay: number;                   // Delay entre tentativas
  enablePerformance: boolean;           // Habilitar monitoramento de performance
}

// Configuração padrão
const defaultConfig: LazyLoaderConfig = {
  threshold: 0.1,
  rootMargin: '50px',
  triggerOnce: true,
  placeholder: <div className="animate-pulse bg-gray-200 rounded h-32" />,
  fallback: <div className="text-red-500">Erro ao carregar</div>,
  preload: true,
  preloadDistance: 100,
  cache: true,
  retryCount: 3,
  retryDelay: 1000,
  enablePerformance: true
};

// Interface para props do LazyLoader
interface LazyLoaderProps {
  children: React.ReactNode;
  config?: Partial<LazyLoaderConfig>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onVisible?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Hook para lazy loading
export function useLazyLoad(config: Partial<LazyLoaderConfig> = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });

  // Configurar observer
  const setupObserver = useCallback(() => {
    if (!elementRef.current || observerRef.current) return;

    const { threshold, rootMargin, triggerOnce } = configRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            if (triggerOnce && observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);
  }, []);

  // Carregar conteúdo
  const loadContent = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    const startTime = performance.now();

    try {
      // Verificar cache
      if (configRef.current.cache && configRef.current.cacheKey) {
        const cached = await cache.get(configRef.current.cacheKey);
        if (cached) {
          setIsLoaded(true);
          setIsLoading(false);
          return;
        }
      }

      // Simular carregamento (em produção, carregar componente real)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Salvar no cache
      if (configRef.current.cache && configRef.current.cacheKey) {
        await cache.set(
          configRef.current.cacheKey,
          { loaded: true },
          configRef.current.cacheTTL
        );
      }

      setIsLoaded(true);
      setIsLoading(false);

      // Monitorar performance
      if (configRef.current.enablePerformance) {
        const loadTime = performance.now() - startTime;
        performanceMonitor.recordCustomMetric('lazy-load-time', loadTime, {
          cacheKey: configRef.current.cacheKey,
          retryCount
        });
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsLoading(false);

      // Tentar novamente
      if (retryCount < configRef.current.retryCount) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadContent();
        }, configRef.current.retryDelay);
      }
    }
  }, [isLoaded, isLoading, retryCount]);

  // Efeito para carregar quando visível
  useEffect(() => {
    if (isVisible && !isLoaded && !isLoading) {
      loadContent();
    }
  }, [isVisible, isLoaded, isLoading, loadContent]);

  // Efeito para configurar observer
  useEffect(() => {
    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupObserver]);

  return {
    elementRef,
    isVisible,
    isLoaded,
    isLoading,
    error,
    retryCount,
    loadContent
  };
}

// Componente LazyLoader
export const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  config = {},
  onLoad,
  onError,
  onVisible,
  className = '',
  style = {}
}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const {
    elementRef,
    isVisible,
    isLoaded,
    isLoading,
    error,
    retryCount
  } = useLazyLoad(finalConfig);

  // Efeito para callbacks
  useEffect(() => {
    if (isVisible && onVisible) {
      onVisible();
    }
  }, [isVisible, onVisible]);

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Renderizar conteúdo
  const renderContent = () => {
    if (error && retryCount >= finalConfig.retryCount) {
      return finalConfig.fallback;
    }

    if (isLoaded) {
      return children;
    }

    if (isLoading) {
      return finalConfig.placeholder;
    }

    return finalConfig.placeholder;
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={style}
    >
      {renderContent()}
    </div>
  );
};

// Hook para lazy loading de imagens
export function useLazyImage(src: string, config: Partial<LazyLoaderConfig> = {}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const elementRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });

  // Carregar imagem
  const loadImage = useCallback(async () => {
    if (isLoaded || !src) return;

    try {
      // Verificar cache
      if (configRef.current.cache) {
        const cached = await cache.get<string>(`image_${src}`);
        if (cached) {
          setImageSrc(cached);
          setIsLoaded(true);
          return;
        }
      }

      // Carregar imagem
      const img = new window.Image();
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        
        // Salvar no cache
        if (configRef.current.cache) {
          cache.set(`image_${src}`, src, configRef.current.cacheTTL);
        }
      };
      img.onerror = () => {
        setError(new Error('Failed to load image'));
      };
      img.src = src;
    } catch (err) {
      setError(err as Error);
    }
  }, [src, isLoaded]);

  // Configurar observer
  useEffect(() => {
    if (!elementRef.current || observerRef.current) return;

    const { threshold, rootMargin, triggerOnce } = configRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            
            if (triggerOnce && observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadImage]);

  return {
    elementRef,
    imageSrc,
    isLoaded,
    error
  };
}

// Componente LazyImage
interface LazyImageProps {
  src: string;
  alt: string;
  config?: Partial<LazyLoaderConfig>;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  config = {},
  className = '',
  style = {},
  onLoad,
  onError
}) => {
  const { elementRef, imageSrc, isLoaded, error } = useLazyImage(src, config);

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <Image
      ref={elementRef}
      src={imageSrc || '/placeholder.png'}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
    />
  );
};

// Hook para lazy loading de componentes
export function useLazyComponent(
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>,
  config: Partial<LazyLoaderConfig> = {}
) {
  const [Component, setComponent] = useState<React.ComponentType<unknown> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });

  // Carregar componente
  const loadComponent = useCallback(async () => {
    if (isLoaded || Component) return;

    try {
      // Verificar cache
      if (configRef.current.cache && configRef.current.cacheKey) {
        const cached = await cache.get<React.ComponentType<unknown>>(`component_${configRef.current.cacheKey}`);
        if (cached) {
          setComponent(cached);
          setIsLoaded(true);
          return;
        }
      }

      // Carregar componente
      const loadedModule = await importFn();
      setComponent(() => loadedModule.default);
      setIsLoaded(true);

      // Salvar no cache
      if (configRef.current.cache && configRef.current.cacheKey) {
        cache.set(`component_${configRef.current.cacheKey}`, loadedModule.default, configRef.current.cacheTTL);
      }
    } catch (err) {
      setError(err as Error);
    }
  }, [isLoaded, Component, importFn]);

  // Configurar observer
  useEffect(() => {
    if (!elementRef.current || observerRef.current) return;

    const { threshold, rootMargin, triggerOnce } = configRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadComponent();
            
            if (triggerOnce && observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadComponent]);

  return {
    elementRef,
    Component,
    isLoaded,
    error
  };
}

// Componente LazyComponent
interface LazyComponentProps {
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>;
  config?: Partial<LazyLoaderConfig>;
  props?: Record<string, unknown>;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  importFn,
  config = {},
  props = {},
  fallback = <div>Carregando...</div>,
  onLoad,
  onError
}) => {
  const { elementRef, Component, isLoaded, error } = useLazyComponent(importFn, config);

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div ref={elementRef}>
      {Component ? (
        <Component {...props} />
      ) : (
        fallback
      )}
    </div>
  );
};

// Hook para pré-carregamento
export function usePreload(
  preloadFn: () => Promise<unknown>,
  config: Partial<LazyLoaderConfig> = {}
) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const configRef = useRef({ ...defaultConfig, ...config });

  // Pré-carregar
  const preload = useCallback(async () => {
    if (isPreloaded || isPreloading) return;

    setIsPreloading(true);
    setError(null);

    try {
      await preloadFn();
      setIsPreloaded(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsPreloading(false);
    }
  }, [isPreloaded, isPreloading, preloadFn]);

  // Configurar observer
  useEffect(() => {
    if (!elementRef.current || observerRef.current) return;

    const { preloadDistance } = configRef.current;
    const rootMargin = `0px 0px ${preloadDistance}px 0px`;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preload();
          }
        });
      },
      {
        threshold: 0,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [preload]);

  return {
    elementRef,
    isPreloaded,
    isPreloading,
    error
  };
}

// Componente Preloader
interface PreloaderProps {
  preloadFn: () => Promise<unknown>;
  config?: Partial<LazyLoaderConfig>;
  children: React.ReactNode;
  onPreload?: () => void;
  onError?: (error: Error) => void;
}

export const Preloader: React.FC<PreloaderProps> = ({
  preloadFn,
  config = {},
  children,
  onPreload,
  onError
}) => {
  const { elementRef, isPreloaded, isPreloading, error } = usePreload(preloadFn, config);

  useEffect(() => {
    if (isPreloaded && onPreload) {
      onPreload();
    }
  }, [isPreloaded, onPreload]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <div ref={elementRef}>
      {children}
      {isPreloading && <div className="text-sm text-gray-500">Pré-carregando...</div>}
    </div>
  );
};
