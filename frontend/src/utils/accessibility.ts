// Sistema de acessibilidade avançado

// Níveis de acessibilidade
export enum AccessibilityLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA'
}

// Tipos de deficiência
export enum DisabilityType {
  VISUAL = 'VISUAL',
  MOTOR = 'MOTOR',
  COGNITIVE = 'COGNITIVE',
  AUDITORY = 'AUDITORY',
  SPEECH = 'SPEECH'
}

// Interface para configurações de acessibilidade
interface AccessibilityConfig {
  level: AccessibilityLevel;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableLargeText: boolean;
  enableKeyboardNavigation: boolean;
  enableVoiceControl: boolean;
  enableReducedMotion: boolean;
  enableFocusIndicators: boolean;
  enableSkipLinks: boolean;
  enableAltText: boolean;
  enableAriaLabels: boolean;
  enableSemanticHTML: boolean;
  enableColorBlindSupport: boolean;
  enableDyslexiaSupport: boolean;
  enableMotorSupport: boolean;
}

// Configuração padrão
const defaultConfig: AccessibilityConfig = {
  level: AccessibilityLevel.AA,
  enableScreenReader: true,
  enableHighContrast: true,
  enableLargeText: true,
  enableKeyboardNavigation: true,
  enableVoiceControl: true,
  enableReducedMotion: true,
  enableFocusIndicators: true,
  enableSkipLinks: true,
  enableAltText: true,
  enableAriaLabels: true,
  enableSemanticHTML: true,
  enableColorBlindSupport: true,
  enableDyslexiaSupport: true,
  enableMotorSupport: true
};

class AccessibilityManager {
  private config: AccessibilityConfig;
  private currentFocus: HTMLElement | null = null;
  private focusHistory: HTMLElement[] = [];
  private screenReaderAnnouncements: string[] = [];
  private keyboardShortcuts: Map<string, () => void> = new Map();
  private ariaLiveRegion: HTMLElement | null = null;

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initializeAccessibility();
  }

  // Inicializar sistema de acessibilidade
  private initializeAccessibility() {
    // Criar região ARIA live para anúncios
    this.createAriaLiveRegion();
    
    // Configurar atalhos de teclado
    this.setupKeyboardShortcuts();
    
    // Configurar observadores de foco
    this.setupFocusObservers();
    
    // Configurar suporte a leitores de tela
    this.setupScreenReaderSupport();
    
    // Configurar suporte a alto contraste
    this.setupHighContrastSupport();
    
    // Configurar suporte a texto grande
    this.setupLargeTextSupport();
    
    // Configurar suporte a movimento reduzido
    this.setupReducedMotionSupport();
    
    // Configurar suporte a daltonismo
    this.setupColorBlindSupport();
    
    // Configurar suporte a dislexia
    this.setupDyslexiaSupport();
    
    // Configurar suporte motor
    this.setupMotorSupport();
  }

  // Criar região ARIA live
  private createAriaLiveRegion() {
    if (typeof window === 'undefined') return;
    
    this.ariaLiveRegion = document.createElement('div');
    this.ariaLiveRegion.setAttribute('aria-live', 'polite');
    this.ariaLiveRegion.setAttribute('aria-atomic', 'true');
    this.ariaLiveRegion.className = 'sr-only';
    this.ariaLiveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(this.ariaLiveRegion);
  }

  // Configurar atalhos de teclado
  private setupKeyboardShortcuts() {
    if (typeof window === 'undefined') return;
    
    // Atalho para pular para conteúdo principal
    this.keyboardShortcuts.set('Alt+1', () => {
      const main = document.querySelector('main, [role="main"]');
      if (main) {
        this.focusElement(main as HTMLElement);
        this.announce('Pulou para o conteúdo principal');
      }
    });
    
    // Atalho para pular para navegação
    this.keyboardShortcuts.set('Alt+2', () => {
      const nav = document.querySelector('nav, [role="navigation"]');
      if (nav) {
        this.focusElement(nav as HTMLElement);
        this.announce('Pulou para a navegação');
      }
    });
    
    // Atalho para pular para busca
    this.keyboardShortcuts.set('Alt+3', () => {
      const search = document.querySelector('input[type="search"], [role="search"]');
      if (search) {
        this.focusElement(search as HTMLElement);
        this.announce('Pulou para a busca');
      }
    });
    
    // Atalho para alternar alto contraste
    this.keyboardShortcuts.set('Alt+C', () => {
      this.toggleHighContrast();
    });
    
    // Atalho para alternar texto grande
    this.keyboardShortcuts.set('Alt+T', () => {
      this.toggleLargeText();
    });
    
    // Atalho para alternar movimento reduzido
    this.keyboardShortcuts.set('Alt+M', () => {
      this.toggleReducedMotion();
    });
    
    // Atalho para mostrar atalhos de teclado
    this.keyboardShortcuts.set('Alt+H', () => {
      this.showKeyboardShortcuts();
    });
    
    // Atalho para voltar ao elemento anterior
    this.keyboardShortcuts.set('Alt+Left', () => {
      this.focusPrevious();
    });
    
    // Atalho para ir ao próximo elemento
    this.keyboardShortcuts.set('Alt+Right', () => {
      this.focusNext();
    });
    
    // Atalho para focar no primeiro elemento
    this.keyboardShortcuts.set('Alt+Home', () => {
      this.focusFirst();
    });
    
    // Atalho para focar no último elemento
    this.keyboardShortcuts.set('Alt+End', () => {
      this.focusLast();
    });
    
    // Adicionar listeners de teclado
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
  }

  // Manipular atalhos de teclado
  private handleKeyboardShortcuts(event: KeyboardEvent) {
    const key = `${event.altKey ? 'Alt+' : ''}${event.ctrlKey ? 'Ctrl+' : ''}${event.shiftKey ? 'Shift+' : ''}${event.key}`;
    const shortcut = this.keyboardShortcuts.get(key);
    
    if (shortcut) {
      event.preventDefault();
      shortcut();
    }
  }

  // Configurar observadores de foco
  private setupFocusObservers() {
    if (typeof window === 'undefined') return;
    
    document.addEventListener('focusin', (event) => {
      this.currentFocus = event.target as HTMLElement;
      this.focusHistory.push(this.currentFocus);
      
      // Manter apenas os últimos 10 elementos focados
      if (this.focusHistory.length > 10) {
        this.focusHistory.shift();
      }
      
      // Anunciar elemento focado
      this.announceFocusedElement();
    });
    
    document.addEventListener('focusout', () => {
      // Limpar foco atual
      this.currentFocus = null;
    });
  }

  // Configurar suporte a leitores de tela
  private setupScreenReaderSupport() {
    if (typeof window === 'undefined') return;
    
    // Adicionar classes para leitores de tela
    document.documentElement.classList.add('screen-reader-supported');
    
    // Configurar anúncios automáticos
    this.setupAutoAnnouncements();
  }

  // Configurar anúncios automáticos
  private setupAutoAnnouncements() {
    if (typeof window === 'undefined') return;
    
    // Observar mudanças no DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              if (element.hasAttribute('aria-live')) {
                this.announce(element.textContent || '');
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Configurar suporte a alto contraste
  private setupHighContrastSupport() {
    if (typeof window === 'undefined') return;
    
    // Detectar preferência do sistema
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersHighContrast) {
      this.enableHighContrast();
    }
    
    // Observar mudanças na preferência
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      if (e.matches) {
        this.enableHighContrast();
      } else {
        this.disableHighContrast();
      }
    });
  }

  // Configurar suporte a texto grande
  private setupLargeTextSupport() {
    if (typeof window === 'undefined') return;
    
    // Detectar preferência do sistema
    const prefersLargeText = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    
    if (prefersLargeText) {
      this.enableLargeText();
    }
  }

  // Configurar suporte a movimento reduzido
  private setupReducedMotionSupport() {
    if (typeof window === 'undefined') return;
    
    // Detectar preferência do sistema
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      this.enableReducedMotion();
    }
    
    // Observar mudanças na preferência
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        this.enableReducedMotion();
      } else {
        this.disableReducedMotion();
      }
    });
  }

  // Configurar suporte a daltonismo
  private setupColorBlindSupport() {
    if (typeof window === 'undefined') return;
    
    // Adicionar classes para diferentes tipos de daltonismo
    document.documentElement.classList.add('colorblind-support');
    
    // Configurar indicadores visuais alternativos
    this.setupColorBlindIndicators();
  }

  // Configurar indicadores para daltonismo
  private setupColorBlindIndicators() {
    if (typeof window === 'undefined') return;
    
    // Adicionar ícones ou padrões para elementos que dependem de cor
    const colorElements = document.querySelectorAll('[class*="text-red"], [class*="text-green"], [class*="text-blue"]');
    colorElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      if (!htmlElement.querySelector('.colorblind-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'colorblind-indicator sr-only';
        indicator.textContent = this.getColorDescription(htmlElement.className);
        htmlElement.appendChild(indicator);
      }
    });
  }

  // Obter descrição de cor
  private getColorDescription(className: string): string {
    if (className.includes('text-red')) return ' (vermelho)';
    if (className.includes('text-green')) return ' (verde)';
    if (className.includes('text-blue')) return ' (azul)';
    if (className.includes('text-yellow')) return ' (amarelo)';
    if (className.includes('text-orange')) return ' (laranja)';
    if (className.includes('text-purple')) return ' (roxo)';
    return '';
  }

  // Configurar suporte a dislexia
  private setupDyslexiaSupport() {
    if (typeof window === 'undefined') return;
    
    // Adicionar classes para suporte a dislexia
    document.documentElement.classList.add('dyslexia-support');
    
    // Configurar fontes mais legíveis
    this.setupDyslexiaFonts();
  }

  // Configurar fontes para dislexia
  private setupDyslexiaFonts() {
    if (typeof window === 'undefined') return;
    
    // Adicionar estilos CSS para fontes mais legíveis
    const style = document.createElement('style');
    style.textContent = `
      .dyslexia-support {
        font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif;
        line-height: 1.6;
        letter-spacing: 0.05em;
      }
      
      .dyslexia-support h1,
      .dyslexia-support h2,
      .dyslexia-support h3,
      .dyslexia-support h4,
      .dyslexia-support h5,
      .dyslexia-support h6 {
        font-weight: bold;
        line-height: 1.4;
      }
    `;
    document.head.appendChild(style);
  }

  // Configurar suporte motor
  private setupMotorSupport() {
    if (typeof window === 'undefined') return;
    
    // Adicionar classes para suporte motor
    document.documentElement.classList.add('motor-support');
    
    // Configurar áreas de toque maiores
    this.setupLargerTouchTargets();
    
    // Configurar suporte a switch control
    this.setupSwitchControl();
  }

  // Configurar alvos de toque maiores
  private setupLargerTouchTargets() {
    if (typeof window === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = `
      .motor-support button,
      .motor-support input,
      .motor-support select,
      .motor-support textarea,
      .motor-support a {
        min-height: 44px;
        min-width: 44px;
        padding: 12px;
      }
      
      .motor-support .focus-visible {
        outline: 3px solid #0066cc;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  // Configurar suporte a switch control
  private setupSwitchControl() {
    if (typeof window === 'undefined') return;
    
    // Adicionar suporte a navegação por switch
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
        // Permitir navegação por switch
        return;
      }
    });
  }

  // Focar elemento
  focusElement(element: HTMLElement) {
    if (element && typeof element.focus === 'function') {
      element.focus();
      this.currentFocus = element;
    }
  }

  // Anunciar elemento focado
  private announceFocusedElement() {
    if (!this.currentFocus) return;
    
    const role = this.currentFocus.getAttribute('role');
    const label = this.currentFocus.getAttribute('aria-label') || 
                  this.currentFocus.getAttribute('title') || 
                  this.currentFocus.textContent?.trim();
    
    if (label) {
      let announcement = label;
      
      if (role) {
        announcement = `${label}, ${role}`;
      }
      
      this.announce(announcement);
    }
  }

  // Anunciar texto
  announce(text: string) {
    if (!this.ariaLiveRegion) return;
    
    this.ariaLiveRegion.textContent = text;
    
    // Limpar após 1 segundo
    setTimeout(() => {
      if (this.ariaLiveRegion) {
        this.ariaLiveRegion.textContent = '';
      }
    }, 1000);
  }

  // Focar elemento anterior
  focusPrevious() {
    if (this.focusHistory.length > 1) {
      const previous = this.focusHistory[this.focusHistory.length - 2];
      this.focusElement(previous);
    }
  }

  // Focar próximo elemento
  focusNext() {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(this.currentFocus!);
    
    if (currentIndex < focusableElements.length - 1) {
      this.focusElement(focusableElements[currentIndex + 1]);
    }
  }

  // Focar primeiro elemento
  focusFirst() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      this.focusElement(focusableElements[0]);
    }
  }

  // Focar último elemento
  focusLast() {
    const focusableElements = this.getFocusableElements();
    if (focusableElements.length > 0) {
      this.focusElement(focusableElements[focusableElements.length - 1]);
    }
  }

  // Obter elementos focáveis
  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[role="tab"]',
      '[role="option"]'
    ];
    
    const elements: HTMLElement[] = [];
    focusableSelectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(element => {
        if (element instanceof HTMLElement) {
          elements.push(element);
        }
      });
    });
    
    return elements;
  }

  // Alternar alto contraste
  toggleHighContrast() {
    if (document.documentElement.classList.contains('high-contrast')) {
      this.disableHighContrast();
    } else {
      this.enableHighContrast();
    }
  }

  // Habilitar alto contraste
  enableHighContrast() {
    document.documentElement.classList.add('high-contrast');
    this.announce('Alto contraste ativado');
  }

  // Desabilitar alto contraste
  disableHighContrast() {
    document.documentElement.classList.remove('high-contrast');
    this.announce('Alto contraste desativado');
  }

  // Alternar texto grande
  toggleLargeText() {
    if (document.documentElement.classList.contains('large-text')) {
      this.disableLargeText();
    } else {
      this.enableLargeText();
    }
  }

  // Habilitar texto grande
  enableLargeText() {
    document.documentElement.classList.add('large-text');
    this.announce('Texto grande ativado');
  }

  // Desabilitar texto grande
  disableLargeText() {
    document.documentElement.classList.remove('large-text');
    this.announce('Texto grande desativado');
  }

  // Alternar movimento reduzido
  toggleReducedMotion() {
    if (document.documentElement.classList.contains('reduced-motion')) {
      this.disableReducedMotion();
    } else {
      this.enableReducedMotion();
    }
  }

  // Habilitar movimento reduzido
  enableReducedMotion() {
    document.documentElement.classList.add('reduced-motion');
    this.announce('Movimento reduzido ativado');
  }

  // Desabilitar movimento reduzido
  disableReducedMotion() {
    document.documentElement.classList.remove('reduced-motion');
    this.announce('Movimento reduzido desativado');
  }

  // Mostrar atalhos de teclado
  showKeyboardShortcuts() {
    const shortcuts = Array.from(this.keyboardShortcuts.keys());
    const message = `Atalhos disponíveis: ${shortcuts.join(', ')}`;
    this.announce(message);
  }

  // Obter configuração atual
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  // Atualizar configuração
  updateConfig(newConfig: Partial<AccessibilityConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.initializeAccessibility();
  }

  // Obter estatísticas de acessibilidade
  getAccessibilityStats() {
    const focusableElements = this.getFocusableElements();
    const elementsWithAriaLabels = document.querySelectorAll('[aria-label]').length;
    const elementsWithRoles = document.querySelectorAll('[role]').length;
    const imagesWithAlt = document.querySelectorAll('img[alt]').length;
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])').length;
    
    return {
      focusableElements: focusableElements.length,
      elementsWithAriaLabels,
      elementsWithRoles,
      imagesWithAlt,
      imagesWithoutAlt,
      accessibilityScore: this.calculateAccessibilityScore()
    };
  }

  // Calcular pontuação de acessibilidade
  private calculateAccessibilityScore(): number {
    const stats = this.getAccessibilityStats();
    let score = 0;
    
    // Pontuação base
    score += 20;
    
    // Pontuação por elementos com ARIA
    score += Math.min(stats.elementsWithAriaLabels * 2, 20);
    score += Math.min(stats.elementsWithRoles * 1, 10);
    
    // Pontuação por imagens com alt
    const imageScore = stats.imagesWithAlt / (stats.imagesWithAlt + stats.imagesWithoutAlt) * 20;
    score += imageScore;
    
    // Pontuação por elementos focáveis
    score += Math.min(stats.focusableElements * 0.5, 20);
    
    return Math.min(Math.round(score), 100);
  }
}

// Instância global do gerenciador de acessibilidade
export const accessibilityManager = new AccessibilityManager();

// Funções de conveniência
export const focusElement = (element: HTMLElement) => 
  accessibilityManager.focusElement(element);

export const announce = (text: string) => 
  accessibilityManager.announce(text);

export const toggleHighContrast = () => 
  accessibilityManager.toggleHighContrast();

export const toggleLargeText = () => 
  accessibilityManager.toggleLargeText();

export const toggleReducedMotion = () => 
  accessibilityManager.toggleReducedMotion();

export const getAccessibilityStats = () => 
  accessibilityManager.getAccessibilityStats();
