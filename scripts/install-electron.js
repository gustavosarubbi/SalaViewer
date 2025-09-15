#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Instalando SalaViewer Electron...\n');

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

try {
  // 1. Verificar se estamos no diretório correto
  if (!fs.existsSync('package.json')) {
    throw new Error('Execute este script na raiz do projeto');
  }

  // 2. Instalar dependências principais
  console.log('📦 Instalando dependências principais...');
  runCommand('npm install');

  // 3. Instalar dependências do backend
  console.log('📦 Instalando dependências do backend...');
  runCommand('npm install', 'backend');

  // 4. Instalar dependências do frontend
  console.log('📦 Instalando dependências do frontend...');
  runCommand('npm install', 'frontend');

  // 5. Criar diretórios necessários
  console.log('📁 Criando diretórios necessários...');
  ensureDir('build');
  ensureDir('dist-electron');
  ensureDir('logs');

  // 6. Copiar ícones se existirem
  const iconFiles = [
    { src: 'frontend/public/favicon.png', dest: 'build/icon.png' },
    { src: 'frontend/public/Logo E-Salas.png', dest: 'build/logo.png' }
  ];

  iconFiles.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, dest);
        console.log(`📋 Ícone copiado: ${src} -> ${dest}`);
      } catch (error) {
        console.warn(`⚠️ Não foi possível copiar ícone: ${src}`);
      }
    }
  });

  // 7. Verificar se o backend tem o banco de dados
  const dbPath = path.join('backend', 'database', 'salaviewer.db');
  if (!fs.existsSync(dbPath)) {
    console.log('📊 Criando banco de dados...');
    // O banco será criado automaticamente quando o backend iniciar
  }

  // 8. Criar arquivo de configuração do Electron
  const electronConfig = {
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    electron: true
  };

  fs.writeFileSync(
    'build/electron-config.json', 
    JSON.stringify(electronConfig, null, 2)
  );

  console.log('✅ Instalação do SalaViewer Electron concluída!');
  console.log('\n📋 Próximos passos:');
  console.log('   • Para desenvolvimento: npm run electron:dev');
  console.log('   • Para testar: npm run electron');
  console.log('   • Para gerar instalador: npm run dist');
  console.log('\n🎉 SalaViewer Electron está pronto para uso!');

} catch (error) {
  console.error('❌ Erro durante a instalação:', error.message);
  process.exit(1);
}
