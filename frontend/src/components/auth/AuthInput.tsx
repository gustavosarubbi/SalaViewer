'use client';

import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  error?: string;
}

export default function AuthInput({ label, leftIcon, rightAction, error, className = '', ...props }: AuthInputProps) {
  return (
    <div>
      <label className="flex items-center text-xs font-semibold uppercase tracking-wide text-white/70 mb-2">
        {label}
      </label>
      <div className="relative group">
        {leftIcon && (
          <div className={`pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center z-10 ${error ? 'text-red-400' : 'text-white/80 group-focus-within:text-white'}`}>
            <span className="h-5 w-5">{leftIcon}</span>
          </div>
        )}
        <input
          {...props}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          className={`block w-full ${leftIcon ? 'pl-10' : 'pl-3'} ${rightAction ? 'pr-14' : 'pr-3'} h-12 rounded-xl bg-white/5 text-white placeholder-white/50 outline-none transition-all duration-200 border ${
            error ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/10 focus:border-white/30 focus:ring-2 focus:ring-white/20'
          } ${className}`}
        />
        {rightAction && (
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button type="button" tabIndex={-1} className="h-full w-10 flex items-center justify-center text-white/80 hover:text-white transition-colors">
              {rightAction}
            </button>
          </div>
        )}
      </div>
      {error && <p id={`${(props.id as string) || 'input'}-error`} className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}


