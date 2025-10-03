'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Home, Building, DoorOpen, Eye, LogOut, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import DisplayModeToggle from './DisplayModeToggle';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

// Nova estrutura organizacional - Padrão Display Setup
const mainNavigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home, 
    description: 'Visão geral do sistema',
    category: 'principal'
  },
];

const managementNavigation = [
  { 
    name: 'Salas', 
    href: '/dashboard/salas', 
    icon: DoorOpen, 
    description: 'Gerenciar salas',
    category: 'gestao'
  },
  { 
    name: 'Andares', 
    href: '/dashboard/andares', 
    icon: Building, 
    description: 'Gerenciar andares',
    category: 'gestao'
  },
];

// Seção de análises removida: itens movidos para "Principal"

const displayNavigation = [
  { 
    name: 'Display Público', 
    href: '/display', 
    icon: Eye, 
    description: 'Visualização pública', 
    isDynamic: true,
    category: 'display'
  },
  { 
    name: 'Configurar Display', 
    href: '/display/setup', 
    icon: Settings, 
    description: 'Configurar aparência',
    category: 'display'
  },
];

export default function DashboardSidebar({ isOpen, onClose, isCollapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['principal']));



  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const NavigationSection = ({ 
    title, 
    items, 
    sectionKey, 
    icon: SectionIcon,
    color = 'blue'
  }: {
    title: string;
    items: Array<{
      name: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
      category: string;
      isDynamic?: boolean;
    }>;
    sectionKey: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }) => {
    const isExpanded = expandedSections.has(sectionKey);
    const activeColor = {
      blue: 'bg-blue-600',
      green: 'bg-green-600', 
      purple: 'bg-purple-600',
      orange: 'bg-orange-600'
    }[color];

    // Se o sidebar estiver colapsado, mostrar apenas os itens sem seções
    if (isCollapsed) {
      return (
        <div className="mb-6">
          <ul role="list" className="space-y-1">
            {items.map((item) => (
              <li key={`${sectionKey}-${item.name}`}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-center rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? `${activeColor} text-white shadow-lg`
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  title={item.name}
                  target={item.href === '/display' ? '_blank' : undefined}
                  rel={item.href === '/display' ? 'noopener noreferrer' : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full p-2 text-left hover:bg-white/5 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <SectionIcon className="h-4 w-4 text-white/60" />
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              {title}
            </h2>
          </div>
          <ChevronRight 
            className={`h-4 w-4 text-white/40 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`} 
          />
        </button>
        
        {isExpanded && (
          <ul role="list" className="mt-2 space-y-1">
            {items.map((item) => (
              <li key={`${sectionKey}-${item.name}`}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? `${activeColor} text-white shadow-lg`
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={onClose}
                  target={item.href === '/display' ? '_blank' : undefined}
                  rel={item.href === '/display' ? 'noopener noreferrer' : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-white/60">{item.description}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // (Revertido) Cabeçalho unificado removido — voltando ao cabeçalho original

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onClose}
                    >
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                {/* Sidebar Content */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 bg-black/90 backdrop-blur-none border-r border-white/10">
                  {/* Header */}
                  <div className="flex h-16 shrink-0 items-center mb-6">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="h-12 w-auto"
                        src="/Logo E-Salas.png"
                        alt="E-Salas"
                        width={48}
                        height={48}
                      />
                      <div>
                        <h1 className="text-lg font-semibold text-white">E-Salas</h1>
                        <p className="text-xs text-white/60">Sistema de Gestão</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-1 flex-col">
                    <NavigationSection
                      title="Principal"
                      items={mainNavigation}
                      sectionKey="mobile-principal"
                      icon={Home}
                      color="blue"
                    />

                    <NavigationSection
                      title="Gestão"
                      items={managementNavigation}
                      sectionKey="mobile-gestao"
                      icon={Building}
                      color="green"
                    />

                    {/* Seção de Análises removida */}

                    <NavigationSection
                      title="Display"
                      items={displayNavigation}
                      sectionKey="mobile-display"
                      icon={Eye}
                      color="orange"
                    />
                  </nav>
                  
                  {/* Logout */}
                  <div className="flex flex-shrink-0 border-t border-white/10 p-4">
                    <button
                      onClick={handleLogout}
                      className="group flex w-full gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                      Sair
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-[60] lg:flex lg:flex-col transition-all duration-300 ${
        isCollapsed ? 'lg:w-0 lg:opacity-0 lg:pointer-events-none' : 'lg:w-72'
      }`}>
        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto px-6 bg-black/90 backdrop-blur-none border-r border-white/10">
          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="absolute top-3 right-3 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Fechar sidebar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center mb-6">
            <div className="flex items-center space-x-3">
              <Image
                className="h-12 w-auto"
                src="/Logo E-Salas.png"
                alt="E-Salas"
                width={48}
                height={48}
              />
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-white">E-Salas</h1>
                  <p className="text-xs text-white/60">Sistema de Gestão</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <NavigationSection
              title="Principal"
              items={mainNavigation}
              sectionKey="desktop-principal"
              icon={Home}
              color="blue"
            />

            <NavigationSection
              title="Gestão"
              items={managementNavigation}
              sectionKey="desktop-gestao"
              icon={Building}
              color="green"
            />

            {/* Seção de Análises removida */}

            <NavigationSection
              title="Display"
              items={displayNavigation}
              sectionKey="desktop-display"
              icon={Eye}
              color="orange"
            />
          </nav>
          
          {/* Display Mode Toggle */}
          {!isCollapsed && <DisplayModeToggle />}
          
          {/* Logout */}
          <div className="flex flex-shrink-0 border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className={`group flex w-full gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Sair' : undefined}
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!isCollapsed && 'Sair'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}