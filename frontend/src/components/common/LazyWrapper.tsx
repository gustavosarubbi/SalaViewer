'use client';

import React, { ReactNode } from 'react';
import { useLazyComponent } from '@/hooks/useLazyComponent';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyWrapper({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32" />,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyWrapperProps) {
  const { elementRef, isLoaded } = useLazyComponent(
    () => Promise.resolve({ default: () => <>{children}</> }),
    { threshold, rootMargin }
  );

  return (
    <div ref={elementRef} className={className}>
      {isLoaded ? children : fallback}
    </div>
  );
}

// Componente específico para lazy loading de listas
interface LazyListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyList<T>({ 
  items, 
  renderItem, 
  fallback = <div className="animate-pulse space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gray-200 rounded h-16" />
    ))}
  </div>,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyListProps<T>) {
  const { elementRef, isLoaded } = useLazyComponent(
    () => Promise.resolve({ 
      default: () => (
        <div className={`space-y-2 ${className}`}>
          {items.map((item, index) => (
            <div key={index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )
    }),
    { threshold, rootMargin }
  );

  return (
    <div ref={elementRef}>
      {isLoaded ? (
        <div className={`space-y-2 ${className}`}>
          {items.map((item, index) => (
            <div key={index}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      ) : fallback}
    </div>
  );
}

