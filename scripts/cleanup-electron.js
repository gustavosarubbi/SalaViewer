#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para executar comandos
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(''); // Ignorar erros silenciosamente
      } else {
        resolve(stdout || '');
      }
    });
  });
}

// Função para obter PID do processo pai
function getParentPid(pid) {
  return new Promise((resolve) => {
    exec(`wmic process where processid=${pid} get parentprocessid /value`, (error, stdout) => {
      if (error) {
        resolve(null);
      } else {
        const match = stdout.match(/ParentProcessId=(\d+)/);
        resolve(match ? match[1] : null);
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

// Função para detectar processos do backend SalaViewer
async function getBackendProcesses() {
  try {
    const backendProcesses = [];
    const backendPort = getBackendPort();
    
    // 1. Detectar processos Node.js do backend SalaViewer
    const nodeOutput = await runCommand('tasklist /fi "imagename eq node.exe" /fo csv');
    if (nodeOutput && nodeOutput.includes('node.exe')) {
      const lines = nodeOutput.split('\n');
      for (const line of lines) {
        if (line.includes('node.exe')) {
          const match = line.match(/"node.exe","(\d+)"/);
          if (match) {
            const pid = match[1];
            const commandLine = await getProcessCommandLine(pid);
            
            // Verificar se é do backend SalaViewer
            if (commandLine.includes('SalaViewer') && 
                (commandLine.includes('backend') || commandLine.includes('start:dev'))) {
              
              // Detectar porta se possível
              const portMatch = commandLine.match(/:(\d+)/);
              const port = portMatch ? portMatch[1] : 'N/A';
              
              backendProcesses.push({ 
                type: 'backend', 
                pid, 
                port,
                command: commandLine.trim()
              });
            }
          }
        }
      }
    }
    
    // 2. Detectar processos por porta dinâmica do backend
    const netstatOutput = await runCommand('netstat -ano | findstr LISTENING');
    if (netstatOutput && netstatOutput.trim()) {
      const lines = netstatOutput.split('\n');
      for (const line of lines) {
        const match = line.match(/:(\d+)\s+.*?(\d+)\s*$/);
        if (match) {
          const port = parseInt(match[1]);
          const pid = match[2];
          
          // Verificar se é porta do backend SalaViewer
          if (port === backendPort) {
            const commandLine = await getProcessCommandLine(pid);
            
            // Verificar se o processo já não foi detectado
            const alreadyDetected = backendProcesses.some(p => p.pid === pid);
            
            if (!alreadyDetected && 
                (commandLine.includes('SalaViewer') || 
                 commandLine.includes('backend') ||
                 commandLine.includes('start:dev'))) {
              
              backendProcesses.push({ 
                type: 'port', 
                pid, 
                port: port.toString(),
                command: commandLine.trim()
              });
            }
          }
        }
      }
    }
    
    return backendProcesses;
  } catch (error) {
    return [];
  }
}

// Função principal de limpeza
async function cleanup() {
  try {
    console.log('🔍 Detectando processos do backend SalaViewer...');
    
    const backendProcesses = await getBackendProcesses();
    
    if (backendProcesses.length === 0) {
      console.log('✅ Nenhum processo do backend SalaViewer encontrado');
      return;
    }
    
    console.log(`📍 Encontrados ${backendProcesses.length} processos do backend:`);
    backendProcesses.forEach(proc => {
      console.log(`   • ${proc.type.toUpperCase()} - PID: ${proc.pid} - Porta: ${proc.port}`);
    });
    
    console.log('\n🛑 Finalizando processos do backend...');
    
    for (const proc of backendProcesses) {
      try {
        await runCommand(`taskkill /f /pid ${proc.pid} 2>nul`);
        console.log(`✅ Processo ${proc.type} (PID: ${proc.pid}) finalizado`);
      } catch (error) {
        console.log(`⚠️ Erro ao finalizar processo ${proc.pid}: ${error.message}`);
      }
    }
    
    console.log('\n✅ Limpeza concluída!');
    console.log('ℹ️  Frontend finaliza automaticamente ao fechar a janela do Electron');
    
  } catch (error) {
    console.error(`❌ Erro durante a limpeza: ${error.message}`);
  }
}

// Executar limpeza
cleanup();