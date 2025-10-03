'use client';

import React from 'react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export default function AuthButton({ isLoading, children, className = '', ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      className={`w-full inline-flex justify-center items-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.99] ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Entrando...
        </div>
      ) : (
        children
      )}
    </button>
  );
}


