// Sistema modular de estilos para modais
// Baseado na estética do projeto SalaViewer

export const modalStyles = {
  // Backdrop/Overlay
  backdrop: {
    base: "fixed inset-0 z-50 overflow-y-auto",
    overlay: "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
    overlayDark: "fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
  },

  // Container do modal
  container: {
    base: "flex min-h-full items-center justify-center p-4",
    content: "relative w-full max-w-md transform overflow-hidden rounded-2xl bg-black/90 border border-white/10 shadow-2xl transition-all duration-300",
    contentDark: "relative w-full max-w-md transform overflow-hidden rounded-2xl bg-black/90 border border-white/10 shadow-2xl transition-all duration-300"
  },

  // Header do modal
  header: {
    base: "flex items-center justify-between border-b border-white/10 px-6 py-4",
    dark: "flex items-center justify-between border-b border-gray-700/50 px-6 py-4",
    title: "text-lg font-semibold text-white",
    titleDark: "text-lg font-semibold text-gray-100",
    closeButton: "text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-200",
    closeButtonDark: "text-gray-500 hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
  },

  // Conteúdo do modal
  content: {
    base: "px-6 py-4",
    text: "text-sm text-gray-300 mb-6",
    textDark: "text-sm text-gray-400 mb-6"
  },

  // Botões
  buttons: {
    container: "flex justify-end space-x-3 pt-4 border-t border-white/10",
    containerDark: "flex justify-end space-x-3 pt-4 border-t border-gray-700/50",
    cancel: {
      base: "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-white/30 transition-all",
      dark: "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
    },
    confirm: {
      base: "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all",
      danger: "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-red-500/15 border border-red-500/30 text-red-200 hover:text-red-100 hover:bg-red-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all",
      warning: "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-amber-500/15 border border-amber-500/30 text-amber-200 hover:text-amber-100 hover:bg-amber-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all",
      create: "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium bg-blue-500/15 border border-blue-500/30 text-blue-200 hover:text-blue-100 hover:bg-blue-500/25 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
    }
  },

  // Ícones
  icons: {
    container: {
      base: "flex-shrink-0 w-10 h-10 rounded-full bg-blue-100/20 flex items-center justify-center",
      danger: "flex-shrink-0 w-10 h-10 rounded-full bg-red-100/20 flex items-center justify-center",
      warning: "flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100/20 flex items-center justify-center",
      info: "flex-shrink-0 w-10 h-10 rounded-full bg-blue-100/20 flex items-center justify-center"
    },
    color: {
      base: "text-blue-500",
      danger: "text-red-500",
      warning: "text-yellow-500",
      info: "text-blue-500"
    }
  },

  // Animações
  animations: {
    enter: "transition ease-out duration-300",
    enterFrom: "opacity-0 scale-95 translate-y-4",
    enterTo: "opacity-100 scale-100 translate-y-0",
    leave: "transition ease-in duration-200",
    leaveFrom: "opacity-100 scale-100 translate-y-0",
    leaveTo: "opacity-0 scale-95 translate-y-4"
  },

  // Loading states
  loading: {
    spinner: "animate-spin rounded-full h-4 w-4 border-b-2 border-white",
    text: "flex items-center"
  }
};

// Variantes de tema
export const modalVariants = {
  light: {
    backdrop: modalStyles.backdrop.overlay,
    container: modalStyles.container.content,
    header: modalStyles.header.base,
    title: modalStyles.header.title,
    closeButton: modalStyles.header.closeButton,
    content: modalStyles.content.base,
    text: modalStyles.content.text,
    buttons: {
      container: modalStyles.buttons.container,
      cancel: modalStyles.buttons.cancel.base,
      confirm: modalStyles.buttons.confirm.base
    }
  },
  dark: {
    backdrop: modalStyles.backdrop.overlayDark,
    container: modalStyles.container.contentDark,
    header: modalStyles.header.dark,
    title: modalStyles.header.titleDark,
    closeButton: modalStyles.header.closeButtonDark,
    content: modalStyles.content.base,
    text: modalStyles.content.textDark,
    buttons: {
      container: modalStyles.buttons.containerDark,
      cancel: modalStyles.buttons.cancel.dark,
      confirm: modalStyles.buttons.confirm.base
    }
  }
};

// Hook para detectar tema (pode ser expandido)
export const useModalTheme = () => {
  // Por enquanto retorna dark como padrão baseado no projeto
  return 'dark';
};

// Utilitários para classes condicionais
export const getModalClasses = (variant: 'light' | 'dark' = 'dark') => {
  return modalVariants[variant];
};

// Classes para diferentes tipos de confirmação
export const getConfirmClasses = (type: 'danger' | 'warning' | 'info' | 'create' | 'default' = 'default') => {
  const baseClasses = modalStyles.buttons.confirm.base;
  
  switch (type) {
    case 'danger':
      return modalStyles.buttons.confirm.danger;
    case 'warning':
      return modalStyles.buttons.confirm.warning;
    case 'create':
      return modalStyles.buttons.confirm.create;
    case 'info':
      return modalStyles.buttons.confirm.base;
    default:
      return baseClasses;
  }
};

// Classes para ícones
export const getIconClasses = (type: 'danger' | 'warning' | 'info' | 'default' = 'default') => {
  const iconType = type === 'default' ? 'base' : type;
  return {
    container: modalStyles.icons.container[iconType] || modalStyles.icons.container.base,
    color: modalStyles.icons.color[iconType] || modalStyles.icons.color.base
  };
};
