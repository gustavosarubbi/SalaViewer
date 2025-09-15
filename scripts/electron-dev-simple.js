#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando SalaViewer Electron em modo desenvolvimento...\n');

// Função para aguardar um tempo
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startDevelopment() {
  try {
    console.log('📦 Iniciando Backend...');
    const backendProcess = spawn('npm', ['run', 'start:dev'], {
      cwd: path.join(process.cwd(), 'backend'),
      stdio: 'pipe',
      shell: true
    });

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('SALAVIEWER BACKEND INICIADO COM SUCESSO')) {
        console.log('✅ Backend iniciado com sucesso!');
        startFrontend();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString()}`);
    });

    // Aguardar um pouco para o backend iniciar
    await wait(3000);

    console.log('📦 Iniciando Frontend...');
    const frontendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(process.cwd(), 'frontend'),
      stdio: 'pipe',
      shell: true
    });

    frontendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Ready') || output.includes('started server')) {
        console.log('✅ Frontend iniciado com sucesso!');
        startElectron();
      }
    });

    frontendProcess.stderr.on('data', (data) => {
      console.error(`[Frontend Error] ${data.toString()}`);
    });

    // Aguardar um pouco para o frontend iniciar
    await wait(5000);

    console.log('⚡ Iniciando Electron...');
    const electronProcess = spawn('npm', ['run', 'electron'], {
      stdio: 'inherit',
      shell: true
    });

    electronProcess.on('close', (code) => {
      console.log(`📦 Electron finalizado com código ${code}`);
      
      // Finalizar outros processos
      if (backendProcess && !backendProcess.killed) {
        backendProcess.kill();
      }
      if (frontendProcess && !frontendProcess.killed) {
        frontendProcess.kill();
      }
    });

    // Tratamento de sinais para finalizar tudo
    process.on('SIGINT', () => {
      console.log('\n🛑 Finalizando todos os processos...');
      
      // Finalizar electron primeiro
      if (electronProcess && !electronProcess.killed) {
        console.log('🛑 Parando electron...');
        electronProcess.kill('SIGINT');
      }
      
      // Finalizar frontend
      if (frontendProcess && !frontendProcess.killed) {
        console.log('🛑 Parando frontend...');
        frontendProcess.kill('SIGINT');
      }
      
      // Finalizar backend com força
      if (backendProcess && !backendProcess.killed) {
        console.log('🛑 Parando backend...');
        backendProcess.kill('SIGTERM');
        
        // Se não finalizar em 2 segundos, forçar
        setTimeout(() => {
          if (backendProcess && !backendProcess.killed) {
            console.log('🛑 Forçando finalização do backend...');
            backendProcess.kill('SIGKILL');
          }
        }, 2000);
      }
      
      // Aguardar um pouco para os processos finalizarem
      setTimeout(() => {
        console.log('✅ Todos os processos finalizados!');
        process.exit(0);
      }, 3000);
    });

    // Tratamento de outros sinais
    process.on('SIGTERM', () => {
      console.log('\n🛑 SIGTERM recebido, finalizando...');
      process.emit('SIGINT');
    });

    process.on('exit', () => {
      console.log('📦 Processo principal finalizado');
    });

  } catch (error) {
    console.error('❌ Erro durante o desenvolvimento:', error.message);
    process.exit(1);
  }
}

function startFrontend() {
  console.log('📦 Iniciando Frontend...');
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(process.cwd(), 'frontend'),
    stdio: 'pipe',
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Ready') || output.includes('started server')) {
      console.log('✅ Frontend iniciado com sucesso!');
      startElectron();
    }
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`[Frontend Error] ${data.toString()}`);
  });
}

function startElectron() {
  console.log('⚡ Iniciando Electron...');
  const electronProcess = spawn('npm', ['run', 'electron'], {
    stdio: 'inherit',
    shell: true
  });

  electronProcess.on('close', (code) => {
    console.log(`📦 Electron finalizado com código ${code}`);
  });
}

startDevelopment();
