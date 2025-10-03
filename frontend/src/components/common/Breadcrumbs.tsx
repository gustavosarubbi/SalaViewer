'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Dashboard', href: '/dashboard' }
    ];

    // Root path
    if (segments.length === 0) {
      return [{ name: 'Dashboard', href: '/dashboard', current: true }];
    }

    // Exact "/dashboard" path should not duplicate the Dashboard item
    if (segments.length === 1 && segments[0] === 'dashboard') {
      return [{ name: 'Dashboard', href: '/dashboard', current: true }];
    }

    let currentPath = '';
    segments.forEach((segment, index) => {
      // Skip duplicating the initial "dashboard" segment since it's already added
      if (segment === 'dashboard') {
        return;
      }
      currentPath += `/${segment}`;
      
      let name = segment;
      if (segment === 'salas') {
        name = 'Salas';
      } else if (segment === 'andares') {
        name = 'Andares';
      } else if (segment === 'relatorios') {
        name = 'Relatórios';
      } else if (segment === 'display') {
        name = 'Display';
      } else if (segment === 'setup') {
        name = 'Configuração';
      }

      breadcrumbs.push({
        name,
        href: currentPath,
        current: index === segments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-white/40 mx-1" />
            )}
            {item.current ? (
              <span className="text-white font-medium">{item.name}</span>
            ) : (
              <Link
                href={item.href}
                className="text-white/70 hover:text-white transition-colors duration-200"
              >
                {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

