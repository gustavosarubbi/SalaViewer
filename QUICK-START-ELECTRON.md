# 🚀 SalaViewer Electron - Início Rápido

## ⚡ Instalação e Execução

### 1. Instalar Dependências
```bash
npm run install:electron
```

### 2. Executar em Desenvolvimento
```bash
npm run electron:dev
```

### 3. Executar Aplicativo Compilado
```bash
npm run build
npm run electron
```

## 📦 Gerar Instaladores

### Windows
```bash
npm run dist:win
```

### macOS
```bash
npm run dist:mac
```

### Linux
```bash
npm run dist:linux
```

### Todas as Plataformas
```bash
npm run dist
```

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run install:electron` | Instala todas as dependências |
| `npm run electron:dev` | Modo desenvolvimento completo |
| `npm run electron` | Executa o app Electron |
| `npm run build` | Build completo |
| `npm run dist` | Gera instaladores |
| `npm run clean` | Limpa arquivos de build |

## 📁 Estrutura Criada

```
SalaViewer/
├── electron/                 # Código do Electron
│   ├── main.js              # Processo principal
│   └── preload.js           # Script de segurança
├── scripts/                 # Scripts de automação
│   ├── install-electron.js  # Instalação
│   ├── build-electron.js    # Build
│   └── dev-electron.js      # Desenvolvimento
├── build/                   # Recursos de build
├── dist-electron/           # Instaladores gerados
└── README-ELECTRON.md       # Documentação completa
```

## 🎯 Próximos Passos

1. **Execute a instalação**: `npm run install:electron`
2. **Teste em desenvolvimento**: `npm run electron:dev`
3. **Gere instalador**: `npm run dist:win` (ou sua plataforma)
4. **Instale e teste**: Execute o instalador gerado

## 🔧 Solução de Problemas

### Backend não inicia
- Verifique se a porta 1337 está livre
- Execute `npm run dev:backend` para debug

### Frontend não carrega
- Verifique se está rodando em http://localhost:3000
- Execute `npm run dev:frontend` para debug

### Erro de build
- Execute `npm run clean` e tente novamente
- Verifique se todas as dependências estão instaladas

## 📞 Suporte

Para problemas:
1. Verifique os logs do console
2. Execute em modo desenvolvimento
3. Consulte README-ELECTRON.md para detalhes

---

**🎉 SalaViewer agora é um aplicativo desktop completo!**
