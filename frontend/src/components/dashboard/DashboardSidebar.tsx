'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Home, BarChart3, Building, DoorOpen, Eye, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Salas', href: '/dashboard/salas', icon: DoorOpen },
  { name: 'Andares', href: '/dashboard/andares', icon: Building },
  { name: 'Relatórios', href: '/dashboard/relatorios', icon: BarChart3 },
];

const displayNavigation = [
  { name: 'Lista Digital', href: '/display', icon: Eye, description: 'Visualização pública' },
];

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    // Limpar dados de sessão (se houver)
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirecionar para a página de login
    window.location.href = '/';
  };

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
                    <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                      <span className="sr-only">Fechar sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 glass-strong" style={{
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center space-x-3">
                      <Image
                        className="h-12 w-auto"
                        src="/Logo E-Salas.png"
                        alt="E-Salas"
                        width={48}
                        height={48}
                      />
                      <span className="text-xl font-bold text-white">E-Salas</span>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                                  pathname === item.href
                                    ? 'text-white'
                                    : 'text-white/70 hover:text-white'
                                }`}
                                style={pathname === item.href ? {
                                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                                } : {
                                  background: 'transparent'
                                }}
                                onClick={onClose}
                              >
                                <item.icon
                                  className={`h-6 w-6 shrink-0 transition-colors duration-200 ${
                                    pathname === item.href
                                      ? 'text-white'
                                      : 'text-gray-400 group-hover:text-blue-700'
                                  }`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      
                      {/* Seção de Display Público */}
                      <li>
                        <div className="text-xs font-semibold leading-6 text-white/50 uppercase tracking-wider mb-2">
                          Display Público
                        </div>
                        <ul role="list" className="-mx-2 space-y-1">
                          {displayNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 text-white/70 hover:text-white"
                                style={{
                                  background: 'transparent'
                                }}
                                onClick={onClose}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0 transition-colors duration-200 text-gray-400 group-hover:text-green-400"
                                  aria-hidden="true"
                                />
                                <div className="flex flex-col">
                                  <span>{item.name}</span>
                                  <span className="text-xs text-white/40">{item.description}</span>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                  
                  {/* Botão de Logout - Posicionado no final */}
                  <div className="mt-auto pb-4">
                    <button
                      onClick={handleLogout}
                      className="group flex items-center justify-center gap-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-white hover:text-white w-full relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                      }}
                    >
                      <LogOut
                        className="h-4 w-4 shrink-0 transition-all duration-300 text-white group-hover:rotate-12"
                        aria-hidden="true"
                      />
                      <span className="transition-all duration-300 group-hover:scale-105">Sair</span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 glass-strong" style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <Image
                className="h-12 w-auto"
                src="/Logo E-Salas.png"
                alt="E-Salas"
                width={48}
                height={48}
              />
              <span className="text-xl font-bold text-white">E-Salas</span>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                          pathname === item.href
                            ? 'text-white'
                            : 'text-white/70 hover:text-white'
                        }`}
                        style={pathname === item.href ? {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                        } : {
                          background: 'transparent'
                        }}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 transition-colors duration-200 ${
                            pathname === item.href
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-blue-700'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Seção de Display Público */}
              <li>
                <div className="text-xs font-semibold leading-6 text-white/50 uppercase tracking-wider mb-2">
                  Display Público
                </div>
                <ul role="list" className="-mx-2 space-y-1">
                  {displayNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all duration-200 text-white/70 hover:text-white"
                        style={{
                          background: 'transparent'
                        }}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0 transition-colors duration-200 text-gray-400 group-hover:text-green-400"
                          aria-hidden="true"
                        />
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-white/40">{item.description}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          
          {/* Botão de Logout - Posicionado no final */}
          <div className="mt-auto pb-4">
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center gap-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300 text-white hover:text-white w-full relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              }}
            >
              <LogOut
                className="h-4 w-4 shrink-0 transition-all duration-300 text-white group-hover:rotate-12"
                aria-hidden="true"
              />
              <span className="transition-all duration-300 group-hover:scale-105">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
