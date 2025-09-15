const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs seguras para o frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Status do backend
  getBackendStatus: () => ipcRenderer.invoke('get-backend-status'),
  
  // Reiniciar backend
  restartBackend: () => ipcRenderer.invoke('restart-backend'),
  
  // Informações da aplicação
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Utilitários
  platform: process.platform,
  isElectron: true,
  
  // Logs para debug
  log: (message) => {
    console.log('[Frontend]', message);
  },
  
  // Verificar se está em modo desenvolvimento
  isDev: process.env.NODE_ENV === 'development'
});

// Expor informações básicas do sistema
contextBridge.exposeInMainWorld('systemInfo', {
  platform: process.platform,
  arch: process.arch,
  version: process.versions.electron,
  node: process.versions.node,
  chrome: process.versions.chrome
});

// Log de inicialização
console.log('🔒 Preload script carregado com segurança');
console.log('📱 Plataforma:', process.platform);
console.log('⚡ Electron version:', process.versions.electron);
