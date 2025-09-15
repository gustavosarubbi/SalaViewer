#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando SalaViewer Electron em modo desenvolvimento...\n');

// Função para executar comandos em paralelo
function runParallel(commands) {
  const processes = commands.map(({ command, args, cwd, name }) => {
    console.log(`📦 Iniciando ${name}...`);
    
    const process = spawn(command, args, {
      cwd: cwd || process.cwd(),
      stdio: 'inherit',
      shell: true
    });

    process.on('error', (error) => {
      console.error(`❌ Erro em ${name}:`, error.message);
    });

    process.on('close', (code) => {
      console.log(`📦 ${name} finalizado com código ${code}`);
    });

    return process;
  });

  return processes;
}

// Função para aguardar um tempo
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startDevelopment() {
  try {
    // 1. Verificar se estamos no diretório correto
    const fs = require('fs');
    if (!fs.existsSync('package.json')) {
      throw new Error('Execute este script na raiz do projeto');
    }

    // 2. Instalar dependências se necessário
    console.log('📦 Verificando dependências...');
    if (!fs.existsSync('node_modules')) {
      console.log('📦 Instalando dependências...');
      const installProcess = spawn('npm', ['install'], {
        stdio: 'inherit',
        shell: true
      });
      
      await new Promise((resolve, reject) => {
        installProcess.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`npm install falhou com código ${code}`));
        });
      });
    }

    // 3. Iniciar backend e frontend em paralelo
    console.log('🔧 Iniciando backend e frontend...');
    
    const processes = runParallel([
      {
        command: 'npm',
        args: ['run', 'start:dev'],
        cwd: path.join(process.cwd(), 'backend'),
        name: 'Backend'
      },
      {
        command: 'npm',
        args: ['run', 'dev'],
        cwd: path.join(process.cwd(), 'frontend'),
        name: 'Frontend'
      }
    ]);

    // 4. Aguardar um pouco para os serviços iniciarem
    console.log('⏳ Aguardando serviços iniciarem...');
    await wait(5000);

    // 5. Iniciar Electron
    console.log('⚡ Iniciando Electron...');
    const electronProcess = spawn('npm', ['run', 'electron'], {
      stdio: 'inherit',
      shell: true
    });

    electronProcess.on('close', (code) => {
      console.log(`📦 Electron finalizado com código ${code}`);
      
      // Finalizar outros processos
      processes.forEach(process => {
        if (process && !process.killed) {
          process.kill();
        }
      });
    });

    // 6. Tratamento de sinais para finalizar tudo
    process.on('SIGINT', () => {
      console.log('\n🛑 Finalizando todos os processos...');
      
      processes.forEach(process => {
        if (process && !process.killed) {
          process.kill('SIGINT');
        }
      });
      
      if (electronProcess && !electronProcess.killed) {
        electronProcess.kill('SIGINT');
      }
      
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro durante o desenvolvimento:', error.message);
    process.exit(1);
  }
}

startDevelopment();
