#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Iniciando build do SalaViewer Electron...\n');

// Função para executar comandos
function runCommand(command, cwd = process.cwd()) {
  console.log(`📦 Executando: ${command}`);
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
    console.log('✅ Comando executado com sucesso\n');
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
    console.log(`📁 Diretório criado: ${dir}`);
  }
}

// Função para copiar arquivos
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`📋 Arquivo copiado: ${src} -> ${dest}`);
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
  console.log('📦 Verificando dependências do Electron...');
  if (!fs.existsSync('node_modules/electron')) {
    runCommand('npm install');
  }

  // 3. Build do backend para Electron
  console.log('🔧 Fazendo build do backend para Electron...');
  runCommand('npm run build:electron');

  // 4. Build do frontend para Electron
  console.log('🎨 Fazendo build do frontend para Electron...');
  runCommand('npm run build:electron');

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
    electron: true
  };

  fs.writeFileSync(
    'build/app-info.json', 
    JSON.stringify(appInfo, null, 2)
  );

  console.log('✅ Build do Electron concluído com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   • Para testar: npm run electron');
  console.log('   • Para gerar instalador: npm run dist');
  console.log('   • Para gerar apenas Windows: npm run dist:win');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
