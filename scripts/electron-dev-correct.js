#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando SalaViewer Electron em modo desenvolvimento...\n');

// Função para aguardar um tempo
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startDevelopment() {
  let backendProcess, frontendProcess, electronProcess;

  try {
    // 1. INICIAR BACKEND PRIMEIRO
    console.log('📦 Iniciando Backend...');
    backendProcess = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(process.cwd(), 'backend'),
      stdio: 'pipe',
      shell: true
    });

    // Aguardar backend estar completamente pronto
    await new Promise((resolve, reject) => {
      let backendReady = false;
      
      backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Backend] ${output}`);
        if (output.includes('SALAVIEWER BACKEND INICIADO COM SUCESSO') && !backendReady) {
          backendReady = true;
          console.log('✅ Backend iniciado com sucesso!');
          resolve();
        }
      });

      backendProcess.stderr.on('data', (data) => {
        console.error(`[Backend Error] ${data.toString()}`);
      });

      backendProcess.on('error', (error) => {
        console.error('❌ Erro ao iniciar backend:', error.message);
        reject(error);
      });

      // Timeout de 30 segundos
      setTimeout(() => {
        if (!backendReady) {
          reject(new Error('Timeout: Backend não iniciou em 30 segundos'));
        }
      }, 30000);
    });

    // Aguardar estabilização do backend
    await wait(2000);

    // 2. INICIAR FRONTEND DEPOIS DO BACKEND
    console.log('📦 Iniciando Frontend...');
    frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(process.cwd(), 'frontend'),
      stdio: 'pipe',
      shell: true
    });

    // Aguardar frontend estar completamente pronto
    await new Promise((resolve, reject) => {
      let frontendReady = false;
      
      frontendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Frontend] ${output}`);
        if ((output.includes('Ready') || output.includes('started server') || output.includes('Local:')) && !frontendReady) {
          frontendReady = true;
          console.log('✅ Frontend iniciado com sucesso!');
          resolve();
        }
      });

      frontendProcess.stderr.on('data', (data) => {
        console.error(`[Frontend Error] ${data.toString()}`);
      });

      frontendProcess.on('error', (error) => {
        console.error('❌ Erro ao iniciar frontend:', error.message);
        reject(error);
      });

      // Timeout de 30 segundos
      setTimeout(() => {
        if (!frontendReady) {
          reject(new Error('Timeout: Frontend não iniciou em 30 segundos'));
        }
      }, 30000);
    });

    // Aguardar estabilização do frontend
    await wait(2000);

    // 3. INICIAR ELECTRON POR ÚLTIMO
    console.log('⚡ Iniciando Electron...');
    electronProcess = spawn('npm', ['run', 'electron'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    });

    electronProcess.on('close', (code) => {
      console.log(`📦 Electron finalizado com código ${code}`);
      cleanup();
    });

    // Tratamento de sinais para finalizar tudo
    process.on('SIGINT', () => {
      console.log('\n🛑 Finalizando todos os processos...');
      cleanup();
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 SIGTERM recebido, finalizando...');
      cleanup();
    });

    process.on('exit', () => {
      console.log('📦 Processo principal finalizado');
    });

  } catch (error) {
    console.error('❌ Erro durante o desenvolvimento:', error.message);
    cleanup();
    process.exit(1);
  }

  function cleanup() {
    console.log('🧹 Limpando processos...');
    
    // Finalizar electron
    if (electronProcess && !electronProcess.killed) {
      console.log('🛑 Parando electron...');
      electronProcess.kill('SIGINT');
    }
    
    // Finalizar frontend
    if (frontendProcess && !frontendProcess.killed) {
      console.log('🛑 Parando frontend...');
      frontendProcess.kill('SIGINT');
    }
    
    // Finalizar backend
    if (backendProcess && !backendProcess.killed) {
      console.log('🛑 Parando backend...');
      backendProcess.kill('SIGINT');
    }
    
    setTimeout(() => {
      console.log('✅ Todos os processos finalizados!');
      process.exit(0);
    }, 2000);
  }
}

startDevelopment();
