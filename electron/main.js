const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Otimizações de performance
app.commandLine.appendSwitch('--disable-gpu-sandbox');
app.commandLine.appendSwitch('--disable-software-rasterizer');
app.commandLine.appendSwitch('--disable-background-timer-throttling');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('--disable-features', 'TranslateUI');
app.commandLine.appendSwitch('--disable-ipc-flooding-protection');

let mainWindow;
let backendProcess;
let isBackendRunning = false;

// Configurações da janela
const windowConfig = {
  width: 1400,
  height: 900,
  minWidth: 1200,
  minHeight: 700,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, 'preload.js'),
    // Otimizações de performance
    webSecurity: true,
    allowRunningInsecureContent: false,
    experimentalFeatures: false,
    // Desabilitar recursos desnecessários
    plugins: false,
    webgl: true,
    hardwareAcceleration: true
  },
  icon: path.join(__dirname, '../build/icon.png'),
  show: false, // Não mostrar até estar pronto
  titleBarStyle: 'default',
  // Otimizações de performance da janela
  frame: true,
  transparent: false,
  alwaysOnTop: false,
  skipTaskbar: false,
  resizable: true,
  maximizable: true,
  minimizable: true,
  closable: true
};

function createWindow() {
  // Criar a janela principal
  mainWindow = new BrowserWindow(windowConfig);

  // Configurar menu da aplicação
  createMenu();

  // Eventos da janela
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('🎉 SalaViewer Electron iniciado com sucesso!');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Em modo desenvolvimento, o backend já está rodando via script
  if (isDev) {
    console.log('🔧 Modo desenvolvimento: Backend já iniciado via script');
    // Carregar frontend diretamente
    loadFrontend();
  } else {
    // Em produção, iniciar backend
    startBackend();
    // Carregar frontend após um delay para garantir que o backend esteja rodando
    setTimeout(() => {
      loadFrontend();
    }, 3000);
  }

  // Otimizações de performance
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Frontend carregado com sucesso!');
  });

  // Desabilitar DevTools em produção para melhor performance
  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }
}

function createMenu() {
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        {
          label: 'Forçar Recarregar',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        {
          label: 'Alternar Tela Cheia',
          accelerator: 'F11',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomFactor();
              mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
            }
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            if (mainWindow) {
              const currentZoom = mainWindow.webContents.getZoomFactor();
              mainWindow.webContents.setZoomFactor(Math.max(0.5, currentZoom - 0.1));
            }
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.setZoomFactor(1.0);
            }
          }
        }
      ]
    },
    {
      label: 'Desenvolvimento',
      submenu: [
        {
          label: 'Abrir DevTools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        },
        {
          label: 'Reiniciar Backend',
          click: () => {
            restartBackend();
          }
        },
        {
          label: 'Status do Backend',
          click: () => {
            showBackendStatus();
          }
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre SalaViewer',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre SalaViewer',
              message: 'SalaViewer Desktop v1.0.0',
              detail: 'Aplicativo desktop para gerenciamento de salas e andares.\n\nDesenvolvido com Electron, Next.js e NestJS.'
            });
          }
        },
        {
          label: 'Abrir Logs',
          click: () => {
            const logPath = path.join(__dirname, '../logs');
            if (fs.existsSync(logPath)) {
              shell.openPath(logPath);
            } else {
              dialog.showErrorBox('Erro', 'Diretório de logs não encontrado');
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startBackend() {
  console.log('🚀 Iniciando backend...');
  
  const backendPath = path.join(__dirname, '../backend');
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npm.cmd' : 'npm';
  
  backendProcess = spawn(command, ['run', 'start:dev'], {
    cwd: backendPath,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[Backend] ${output}`);
    
    // Detectar quando o backend está pronto
    if (output.includes('SALAVIEWER BACKEND INICIADO COM SUCESSO')) {
      isBackendRunning = true;
      console.log('✅ Backend iniciado com sucesso!');
    }
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error] ${data.toString()}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    isBackendRunning = false;
  });

  backendProcess.on('error', (error) => {
    console.error('Erro ao iniciar backend:', error);
    isBackendRunning = false;
  });
}

function restartBackend() {
  console.log('🔄 Reiniciando backend...');
  
  if (backendProcess) {
    backendProcess.kill();
  }
  
  setTimeout(() => {
    startBackend();
  }, 1000);
}

function showBackendStatus() {
  const status = isBackendRunning ? 'Rodando' : 'Parado';
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Status do Backend',
    message: `Backend está: ${status}`,
    detail: isBackendRunning 
      ? 'O backend está funcionando corretamente.'
      : 'O backend não está rodando. Tente reiniciá-lo.'
  });
}

function loadFrontend() {
  if (!mainWindow) return;

  // Tentar carregar o frontend
  const frontendUrl = 'http://localhost:3000';
  
  console.log('🌐 Carregando frontend...');
  
  mainWindow.loadURL(frontendUrl).catch((error) => {
    console.error('Erro ao carregar frontend:', error);
    
    // Mostrar página de erro
    mainWindow.loadURL(`data:text/html,
      <html>
        <head>
          <title>SalaViewer - Erro</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5;
            }
            .error-container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #e74c3c; }
            .retry-btn {
              background: #3498db;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
            }
            .retry-btn:hover {
              background: #2980b9;
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>❌ Erro ao Carregar Frontend</h1>
            <p>Não foi possível conectar ao frontend em ${frontendUrl}</p>
            <p>Verifique se o frontend está rodando corretamente.</p>
            <button class="retry-btn" onclick="location.reload()">Tentar Novamente</button>
          </div>
        </body>
      </html>
    `);
  });
}

// Eventos do IPC para comunicação com o frontend
ipcMain.handle('get-backend-status', () => {
  return isBackendRunning;
});

ipcMain.handle('restart-backend', () => {
  restartBackend();
  return true;
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Eventos da aplicação
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('🛑 Fechando aplicação...');
  
  if (backendProcess) {
    console.log('🛑 Parando backend...');
    backendProcess.kill();
  }
});

// Prevenir múltiplas instâncias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
