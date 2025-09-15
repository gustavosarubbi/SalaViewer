# SalaViewer

Sistema de Gerenciamento de Salas - Aplicação Web

## Estrutura do Projeto

```
SalaViewer/
├── backend/          # API NestJS
└── frontend/         # Aplicação Next.js
```

## Instalação

1. Instalar dependências:
```bash
npm run install:all
```

2. Executar aplicação:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run backend` - Executa apenas o backend
- `npm run frontend` - Executa apenas o frontend  
- `npm run dev` - Executa backend e frontend simultaneamente
- `npm run build` - Gera build de produção do frontend
- `npm run install:all` - Instala dependências de ambos os projetos

## Tecnologias

- **Backend**: NestJS, TypeScript, SQLite
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS

## Desenvolvimento

O projeto está configurado para desenvolvimento local com:
- Backend rodando em: http://localhost:1337
- Frontend rodando em: http://localhost:3000