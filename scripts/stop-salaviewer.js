#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para executar comandos
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve('');
      } else {
        resolve(stdout || '');
      }
    });
  });
}

// Função para obter linha de comando do processo
function getProcessCommandLine(pid) {
  return new Promise((resolve) => {
    exec(`wmic process where processid=${pid} get commandline /value`, (error, stdout) => {
      if (error) {
        resolve('');
      } else {
        const match = stdout.match(/CommandLine=(.+)/);
        resolve(match ? match[1] : '');
      }
    });
  });
}

// Função para ler porta dinâmica do backend SalaViewer
function getBackendPort() {
  try {
    const portInfoPath = path.join(__dirname, '../backend/port-info.json');
    if (fs.existsSync(portInfoPath)) {
      const portInfo = JSON.parse(fs.readFileSync(portInfoPath, 'utf8'));
      return portInfo.port;
    }
  } catch (error) {
    // Ignorar erro
  }
  
  // Fallback para porta padrão
  return 1337;
}

// Função para finalizar processo específico
async function killProcess(pid, type) {
  try {
    await runCommand(`taskkill /f /pid ${pid} 2>nul`);
    console.log(`✅ ${type} finalizado (PID: ${pid})`);
    return true;
  } catch (error) {
    console.log(`⚠️ Erro ao finalizar ${type} (PID: ${pid})`);
    return false;
  }
}

// Função principal para parar backend SalaViewer
async function stopSalaviewer() {
  try {
    console.log('🛑 Parando backend SalaViewer...\n');
    
    // Obter porta dinâmica do backend
    const backendPort = getBackendPort();
    console.log(`📍 Porta do backend detectada: ${backendPort}\n`);
    
    let processesFound = 0;
    let processesKilled = 0;
    
    // 1. Detectar e finalizar processos Node.js do backend SalaViewer
    console.log('🔍 Procurando processos Node.js do backend SalaViewer...');
    const nodeOutput = await runCommand('tasklist /fi "imagename eq node.exe" /fo csv');
    
    if (nodeOutput && nodeOutput.includes('node.exe')) {
      const lines = nodeOutput.split('\n');
      for (const line of lines) {
        if (line.includes('node.exe')) {
          const match = line.match(/"node.exe","(\d+)"/);
          if (match) {
            const pid = match[1];
            const commandLine = await getProcessCommandLine(pid);
            
            if (commandLine.includes('SalaViewer') && 
                (commandLine.includes('backend') || commandLine.includes('start:dev'))) {
              processesFound++;
              console.log(`📍 Processo backend encontrado (PID: ${pid})`);
              const killed = await killProcess(pid, 'Backend');
              if (killed) processesKilled++;
            }
          }
        }
      }
    }
    
    // 2. Detectar e finalizar processos por porta dinâmica do backend
    console.log('\n🔍 Procurando processos por porta dinâmica do backend...');
    const netstatOutput = await runCommand('netstat -ano | findstr LISTENING');
    
    if (netstatOutput && netstatOutput.trim()) {
      const lines = netstatOutput.split('\n');
      const processedPids = new Set();
      
      for (const line of lines) {
        const match = line.match(/:(\d+)\s+.*?(\d+)\s*$/);
        if (match) {
          const port = parseInt(match[1]);
          const pid = match[2];
          
          // Verificar se é porta do backend SalaViewer e não foi processado
          if (port === backendPort && !processedPids.has(pid)) {
            processedPids.add(pid);
            const commandLine = await getProcessCommandLine(pid);
            
            if (commandLine.includes('SalaViewer') || 
                commandLine.includes('backend') ||
                commandLine.includes('start:dev')) {
              processesFound++;
              console.log(`📍 Processo na porta ${port} encontrado (PID: ${pid})`);
              const killed = await killProcess(pid, `Porta ${port}`);
              if (killed) processesKilled++;
            }
          }
        }
      }
    }
    
    // Resultado final
    console.log('\n📊 Resultado:');
    console.log(`   • Processos encontrados: ${processesFound}`);
    console.log(`   • Processos finalizados: ${processesKilled}`);
    
    if (processesKilled > 0) {
      console.log('✅ Backend SalaViewer parado com sucesso!');
    } else {
      console.log('✅ Nenhum processo do backend SalaViewer estava rodando');
    }
    
    console.log('ℹ️  Frontend finaliza automaticamente ao fechar a janela do Electron');
    
  } catch (error) {
    console.error(`❌ Erro ao parar SalaViewer: ${error.message}`);
  }
}

// Executar parada
stopSalaviewer();