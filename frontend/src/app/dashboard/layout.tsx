'use client';

import { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import SidebarToggle from '@/components/common/SidebarToggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative" style={{
      background: '#0a0a0a'
    }}>
      {/* Background animado igual ao login - fixo atrás */}
      <div className="fixed inset-0 z-0">
      </div>
      
      {/* Sidebar Toggle Button - Apenas desktop (mostrar só quando colapsado) */}
      {sidebarCollapsed && (
        <div className="hidden lg:block">
          <SidebarToggle 
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
      )}

      {/* Sidebar */}
      {/* Overlay com blur quando sidebar aberto (desktop) */}
      {!sidebarCollapsed && (
        <div 
          className="hidden lg:block fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" 
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <div className="relative z-40">
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main content - manter largura total, sidebar sobreposta */}
      <div className="relative z-20">
        {/* Page content */}
        <main className="pt-0 pb-8 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="animate-slide-in relative z-20">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
