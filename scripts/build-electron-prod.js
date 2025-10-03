#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para executar comandos
function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
  } catch (error) {
    console.error(`❌ Erro ao executar comando: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Função para verificar se diretório existe
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Função para copiar arquivos
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
  } catch (error) {
    console.error(`❌ Erro ao copiar arquivo: ${src}`);
    console.error(error.message);
  }
}

try {
  // 1. Verificar se estamos no diretório correto
  if (!fs.existsSync('package.json')) {
    throw new Error('Execute este script na raiz do projeto');
  }

  // 2. Instalar dependências do Electron se necessário
  if (!fs.existsSync('node_modules/electron')) {
    runCommand('npm install');
  }

  // 3. Build do backend
  runCommand('npm run build:backend');

  // 4. Build do frontend para Electron (usando next.config.electron.js)
  runCommand('npm run build:frontend');

  // 5. Verificar se os builds foram criados
  const backendDist = path.join('backend', 'dist');
  const frontendOut = path.join('frontend', 'out');

  if (!fs.existsSync(backendDist)) {
    throw new Error('Backend build não encontrado');
  }

  if (!fs.existsSync(frontendOut)) {
    throw new Error('Frontend build não encontrado');
  }

  // 6. Criar diretório de build se não existir
  ensureDir('build');

  // 7. Copiar ícones se existirem
  const iconFiles = [
    { src: 'frontend/public/favicon.png', dest: 'build/icon.png' },
    { src: 'frontend/public/Logo E-Salas.png', dest: 'build/logo.png' }
  ];

  iconFiles.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });

  // 8. Criar arquivo de informações da aplicação
  const appInfo = {
    name: 'SalaViewer',
    version: '1.0.0',
    description: 'Sistema de Gerenciamento de Salas',
    buildDate: new Date().toISOString(),
    electron: true,
    config: 'next.config.electron.js'
  };

  fs.writeFileSync(
    'build/app-info.json', 
    JSON.stringify(appInfo, null, 2)
  );

  console.log('✅ Build concluído com sucesso!');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
