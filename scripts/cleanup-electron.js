#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🧹 Limpando processos órfãos do SalaViewer...\n');

// Função para executar comandos
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`⚠️ ${command}: ${error.message}`);
        resolve('');
      } else {
        resolve(stdout || '');
      }
    });
  });
}

// Função para verificar se há processo Electron rodando
async function isElectronRunning() {
  try {
    const electronOutput = await runCommand('tasklist /fi "imagename eq electron.exe"');
    return electronOutput && electronOutput.includes('electron.exe');
  } catch (error) {
    return false;
  }
}

// Função para detectar processos do SalaViewer dinamicamente
async function getSalaviewerProcesses() {
  try {
    // Detectar todos os processos Node.js
    const tasklistOutput = await runCommand('tasklist /fi "imagename eq node.exe" /fo csv');
    const nodePids = [];
    
    if (tasklistOutput && tasklistOutput.trim()) {
      const lines = tasklistOutput.split('\n');
      for (const line of lines) {
        if (line.includes('node.exe')) {
          const match = line.match(/"node.exe","(\d+)"/);
          if (match) {
            nodePids.push(match[1]);
          }
        }
      }
    }
    
    // Detectar portas em uso por processos Node.js
    const netstatOutput = await runCommand('netstat -ano | findstr LISTENING');
    const salaviewerProcesses = [];
    
    if (netstatOutput && netstatOutput.trim()) {
      const lines = netstatOutput.split('\n');
      for (const line of lines) {
        const match = line.match(/:(\d+)\s+.*?(\d+)\s*$/);
        if (match) {
          const port = parseInt(match[1]);
          const pid = match[2];
          
          // Verificar se o PID pertence a um processo Node.js
          if (nodePids.includes(pid)) {
            // Detectar se é do SalaViewer por padrão de portas
            // SalaViewer usa portas: 3000 (frontend), 1337+ (backend)
            if (port === 3000 || port >= 1337) {
              salaviewerProcesses.push({ port, pid });
            }
          }
        }
      }
    }
    
    return salaviewerProcesses;
  } catch (error) {
    return [];
  }
}

async function cleanup() {
  try {
    console.log('🔍 Procurando processos do SalaViewer...');
    
    if (process.platform === 'win32') {
      // 1. Finalizar processos Electron
      console.log('🛑 Finalizando processos Electron...');
      await runCommand('taskkill /f /im electron.exe');
      
      // 2. Verificar se há Electron rodando
      const electronRunning = await isElectronRunning();
      console.log(`📍 Electron rodando: ${electronRunning ? 'Sim' : 'Não'}`);
      
      // 3. Detectar processos do SalaViewer
      console.log('🔍 Detectando processos do SalaViewer...');
      const salaviewerProcesses = await getSalaviewerProcesses();
      
      console.log(`📍 Processos do SalaViewer detectados: ${salaviewerProcesses.map(p => `${p.port}(PID:${p.pid})`).join(', ')}`);
      
      // 4. Finalizar processos do SalaViewer
      if (salaviewerProcesses.length > 0) {
        console.log(`🛑 Finalizando ${salaviewerProcesses.length} processos do SalaViewer...`);
        for (const { port, pid } of salaviewerProcesses) {
          console.log(`🛑 Finalizando processo do SalaViewer na porta ${port} (PID: ${pid})`);
          await runCommand(`taskkill /f /pid ${pid} 2>nul`);
        }
      } else {
        console.log('📍 Nenhum processo do SalaViewer detectado');
      }
      
    } else {
      // Linux/Mac - detecção dinâmica
      console.log('🛑 Finalizando processos Electron...');
      await runCommand('pkill -f electron');
      
      console.log('🛑 Finalizando processos do SalaViewer...');
      await runCommand('pkill -f "SalaViewer"');
      await runCommand('pkill -f "salaviewer"');
    }
    
    console.log('\n✅ Limpeza concluída!');
    console.log('📋 Próximos passos:');
    console.log('   • Execute: npm run electron:dev');
    console.log('   • Para parar: Ctrl+C (agora deve funcionar corretamente)');
    
  } catch (error) {
    console.error(`❌ Erro durante a limpeza: ${error.message}`);
  }
}

cleanup();