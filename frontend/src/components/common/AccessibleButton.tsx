'use client';

import React, { forwardRef, useRef, useEffect } from 'react';
import { accessibilityManager } from '@/utils/accessibility';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaPressed?: boolean;
  ariaCurrent?: boolean;
  ariaHaspopup?: boolean;
  ariaLive?: 'polite' | 'assertive' | 'off';
  role?: string;
  tabIndex?: number;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaControls,
    ariaPressed,
    ariaCurrent,
    ariaHaspopup,
    ariaLive,
    role,
    tabIndex,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const actualRef = (ref || buttonRef) as React.RefObject<HTMLButtonElement>;

    // Efeito para gerenciar foco
    useEffect(() => {
      const button = actualRef.current;
      if (!button) return;

      const handleFocus = (event: FocusEvent) => {
        accessibilityManager.announce(ariaLabel || button.textContent || 'Botão');
        onFocus?.(event as unknown as React.FocusEvent<HTMLButtonElement>);
      };

      const handleBlur = (event: FocusEvent) => {
        onBlur?.(event as unknown as React.FocusEvent<HTMLButtonElement>);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        // Suporte a navegação por teclado
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          button.click();
        }
        onKeyDown?.(event as unknown as React.KeyboardEvent<HTMLButtonElement>);
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        onKeyUp?.(event as unknown as React.KeyboardEvent<HTMLButtonElement>);
      };

      button.addEventListener('focus', handleFocus);
      button.addEventListener('blur', handleBlur);
      button.addEventListener('keydown', handleKeyDown);
      button.addEventListener('keyup', handleKeyUp);

      return () => {
        button.removeEventListener('focus', handleFocus);
        button.removeEventListener('blur', handleBlur);
        button.removeEventListener('keydown', handleKeyDown);
        button.removeEventListener('keyup', handleKeyUp);
      };
    }, [ariaLabel, onFocus, onBlur, onKeyDown, onKeyUp, actualRef]);

    // Classes base
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-md',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-blue-500',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
      'relative',
      'overflow-hidden'
    ];

    // Classes de variante
    const variantClasses = {
      primary: [
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'active:bg-blue-800',
        'focus:ring-blue-500'
      ],
      secondary: [
        'bg-gray-200',
        'text-gray-900',
        'hover:bg-gray-300',
        'active:bg-gray-400',
        'focus:ring-gray-500'
      ],
      danger: [
        'bg-red-600',
        'text-white',
        'hover:bg-red-700',
        'active:bg-red-800',
        'focus:ring-red-500'
      ],
      ghost: [
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-100',
        'active:bg-gray-200',
        'focus:ring-gray-500'
      ],
      link: [
        'bg-transparent',
        'text-blue-600',
        'hover:text-blue-700',
        'hover:underline',
        'active:text-blue-800',
        'focus:ring-blue-500'
      ]
    };

    // Classes de tamanho
    const sizeClasses = {
      sm: ['px-3', 'py-1.5', 'text-sm', 'min-h-[32px]'],
      md: ['px-4', 'py-2', 'text-sm', 'min-h-[40px]'],
      lg: ['px-6', 'py-3', 'text-base', 'min-h-[48px]']
    };

    // Classes de largura
    const widthClasses = fullWidth ? ['w-full'] : [];

    // Classes de loading
    const loadingClasses = loading ? ['cursor-wait'] : [];

    // Classes de ícone
    const iconClasses = icon ? [
      iconPosition === 'left' ? 'mr-2' : 'ml-2'
    ] : [];

    // Combinar todas as classes
    const allClasses = [
      ...baseClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      ...widthClasses,
      ...loadingClasses,
      ...iconClasses,
      className
    ].join(' ');

    // Atributos ARIA
    const ariaAttributes: React.AriaAttributes = {
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      'aria-pressed': ariaPressed,
      'aria-current': ariaCurrent,
      'aria-haspopup': ariaHaspopup,
      'aria-live': ariaLive,
      'aria-disabled': disabled || loading
    };

    // Remover atributos undefined
    Object.keys(ariaAttributes).forEach(key => {
      if (ariaAttributes[key as keyof React.AriaAttributes] === undefined) {
        delete ariaAttributes[key as keyof React.AriaAttributes];
      }
    });

    return (
      <button
        ref={actualRef}
        className={allClasses}
        disabled={disabled || loading}
        role={role}
        tabIndex={tabIndex}
        {...ariaAttributes}
        {...props}
      >
        {/* Indicador de loading */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          </div>
        )}

        {/* Conteúdo do botão */}
        <div className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {/* Ícone à esquerda */}
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}

          {/* Texto do botão */}
          <span className="flex-1 text-center">
            {children}
          </span>

          {/* Ícone à direita */}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>

        {/* Texto para leitores de tela */}
        {loading && (
          <span className="sr-only">Carregando...</span>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
