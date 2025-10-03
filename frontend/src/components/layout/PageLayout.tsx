'use client';

import { ReactNode } from 'react';
import Breadcrumbs from '@/components/common/Breadcrumbs';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
}

export default function PageLayout({ 
  children, 
  title, 
  description, 
  actions,
  showBreadcrumbs = true 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs />
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              {description && (
                <p className="text-white/80 text-sm">{description}</p>
              )}
            </div>
            
            {/* Actions */}
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}


