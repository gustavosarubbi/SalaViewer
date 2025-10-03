'use client';

import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
}

export default function Section({ 
  children, 
  title, 
  description, 
  className = '',
  icon 
}: SectionProps) {
  return (
    <div className={`bg-white/5 rounded-2xl p-8 border border-white/10 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <div className="flex items-center gap-3 mb-2">
              {icon && <div className="text-white/70">{icon}</div>}
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
          )}
          {description && (
            <p className="text-white/70 text-sm">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}


