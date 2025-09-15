# SalaViewer Desktop - Aplicativo Electron

SalaViewer transformado em aplicativo desktop usando Electron, mantendo toda a funcionalidade web em uma interface nativa.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório** (se ainda não tiver):
```bash
git clone <seu-repositorio>
cd SalaViewer
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Instale dependências do backend e frontend**:
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## 🛠️ Desenvolvimento

### Modo Desenvolvimento
Para rodar em modo desenvolvimento com hot-reload:

```bash
npm run electron:dev
```

Este comando irá:
- Iniciar o backend em modo desenvolvimento
- Iniciar o frontend em modo desenvolvimento  
- Abrir o aplicativo Electron
- Recarregar automaticamente quando houver mudanças

### Modo Produção
Para testar o aplicativo compilado:

```bash
npm run build
npm run electron
```

## 📦 Build e Distribuição

### Gerar Instaladores

**Windows:**
```bash
npm run dist:win
```

**macOS:**
```bash
npm run dist:mac
```

**Linux:**
```bash
npm run dist:linux
```

**Todas as plataformas:**
```bash
npm run dist
```

### Arquivos Gerados
Os instaladores serão criados na pasta `dist-electron/`:
- **Windows**: `.exe` (NSIS) e `.exe` (Portable)
- **macOS**: `.dmg` e `.zip`
- **Linux**: `.AppImage`, `.deb` e `.rpm`

## 🏗️ Estrutura do Projeto

```
SalaViewer/
├── electron/                 # Código do Electron
│   ├── main.js              # Processo principal
│   └── preload.js           # Script de pré-carregamento
├── frontend/                # Frontend Next.js
├── backend/                 # Backend NestJS
├── scripts/                 # Scripts de build
│   ├── build-electron.js    # Script de build
│   └── dev-electron.js      # Script de desenvolvimento
├── build/                   # Recursos de build (ícones, etc.)
├── dist-electron/           # Instaladores gerados
├── package.json             # Configuração principal
└── electron-builder.yml     # Configuração do electron-builder
```

## ⚙️ Configurações

### Configuração do Electron
- **Janela**: 1400x900 (mínimo 1200x700)
- **Segurança**: Context isolation habilitado
- **Menu**: Menu nativo com opções de desenvolvimento

### Configuração do Build
- **App ID**: `com.esalas.salaviewer`
- **Produto**: SalaViewer
- **Ícones**: Suporte para Windows, macOS e Linux

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run electron` | Executa o app Electron |
| `npm run electron:dev` | Modo desenvolvimento completo |
| `npm run build` | Build completo (backend + frontend) |
| `npm run dist` | Gera instaladores para todas as plataformas |
| `npm run dist:win` | Gera instalador para Windows |
| `npm run dist:mac` | Gera instalador para macOS |
| `npm run dist:linux` | Gera instalador para Linux |
| `npm run pack` | Gera pasta com app (sem instalador) |
| `npm run clean` | Limpa arquivos de build |
| `npm run rebuild` | Limpa e reconstrói tudo |

## 🐛 Solução de Problemas

### Backend não inicia
- Verifique se a porta 1337 está livre
- Execute `npm run dev:backend` separadamente para debug

### Frontend não carrega
- Verifique se o frontend está rodando em http://localhost:3000
- Execute `npm run dev:frontend` separadamente para debug

### Erro de build
- Execute `npm run clean` e tente novamente
- Verifique se todas as dependências estão instaladas

### Instalador não funciona
- Verifique se o antivírus não está bloqueando
- Execute como administrador (Windows)
- Verifique os logs em `dist-electron/`

## 📱 Funcionalidades do Desktop

### Menu da Aplicação
- **Arquivo**: Recarregar, Forçar Recarregar, Sair
- **Visualizar**: Tela cheia, Zoom, Reset zoom
- **Desenvolvimento**: DevTools, Reiniciar Backend, Status
- **Ajuda**: Sobre, Abrir Logs

### Atalhos de Teclado
- `Ctrl+R`: Recarregar
- `Ctrl+Shift+R`: Forçar recarregar
- `F11`: Tela cheia
- `F12`: DevTools
- `Ctrl+Q`: Sair

### Recursos Nativos
- **Tray**: Ícone na bandeja do sistema
- **Notificações**: Notificações nativas do sistema
- **Atalhos**: Atalhos de teclado personalizados
- **Auto-atualização**: Sistema de atualização automática (futuro)

## 🔒 Segurança

- **Context Isolation**: Habilitado
- **Node Integration**: Desabilitado no renderer
- **Preload Script**: APIs seguras expostas
- **CSP**: Content Security Policy configurado

## 📊 Performance

- **Tamanho**: ~200-300MB (incluindo Node.js)
- **RAM**: ~150-250MB em uso
- **Startup**: ~3-5 segundos
- **Hot Reload**: ~1-2 segundos

## 🚀 Próximos Passos

- [ ] Sistema de atualização automática
- [ ] Notificações nativas
- [ ] Ícone na bandeja do sistema
- [ ] Atalhos globais
- [ ] Modo offline completo
- [ ] Backup automático do banco
- [ ] Logs centralizados

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do console
2. Execute em modo desenvolvimento para debug
3. Abra uma issue no repositório
4. Consulte a documentação do Electron

---

**Desenvolvido com ❤️ usando Electron, Next.js e NestJS**
