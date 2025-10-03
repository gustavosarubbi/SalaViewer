import { useState, useEffect, useRef } from 'react';

interface LazyComponentConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyComponent<T = unknown>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  config: LazyComponentConfig = {}
) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = config;

  useEffect(() => {
    if (isLoaded || isLoading || Component) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsLoading(true);
          
          importFn()
            .then((module) => {
              setComponent(() => module.default);
              setIsLoaded(true);
              setError(null);
            })
            .catch((err) => {
              setError(err);
              console.error('Failed to load component:', err);
            })
            .finally(() => {
              setIsLoading(false);
            });

          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [importFn, threshold, rootMargin, triggerOnce, isLoaded, isLoading, Component]);

  return {
    elementRef,
    Component,
    isLoaded,
    isLoading,
    error
  };
}

// Hook para lazy loading de dados
export function useLazyData<T>(
  fetchFn: () => Promise<T>,
  config: LazyComponentConfig = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = config;

  useEffect(() => {
    if (isLoaded || isLoading || data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsLoading(true);
          
          fetchFn()
            .then((result) => {
              setData(result);
              setIsLoaded(true);
              setError(null);
            })
            .catch((err) => {
              setError(err);
              console.error('Failed to fetch data:', err);
            })
            .finally(() => {
              setIsLoading(false);
            });

          if (triggerOnce) {
            observer.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchFn, threshold, rootMargin, triggerOnce, isLoaded, isLoading, data]);

  return {
    elementRef,
    data,
    isLoaded,
    isLoading,
    error
  };
}
