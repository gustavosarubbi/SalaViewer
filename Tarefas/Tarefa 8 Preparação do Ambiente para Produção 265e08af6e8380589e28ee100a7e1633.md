# Tarefa 8: Preparação do Ambiente para Produção

O objetivo aqui é trocar as configurações temporárias de desenvolvimento por configurações robustas e seguras, adequadas para um servidor online. Isso envolve principalmente a configuração de um banco de dados real e o gerenciamento de chaves secretas.

### **Detalhes da Tarefa:**

1. **Configurar o Banco de Dados de Produção (PostgreSQL):**
    - **Por que mudar?** O SQLite é um banco de dados baseado em um único arquivo, ótimo para simplicidade no desenvolvimento. Em produção, ele não lida bem com múltiplos acessos simultâneos e não é tão resiliente. O PostgreSQL é um servidor de banco de dados robusto, projetado para isso.
    - **Instalar o Driver:** Primeiro, adicione o pacote Node.js para se conectar ao PostgreSQL:
        
        ```bash
        yarn add pg
        
        ```
        
    - **Criar o Arquivo de Configuração:** O Strapi usa pastas para gerenciar diferentes ambientes. Crie a seguinte estrutura de pastas e arquivo: `config/env/production/database.js`.
    - **Adicionar a Configuração:** Cole o seguinte código no arquivo `database.js`. Ele instrui o Strapi a obter as credenciais do banco de dados a partir de "variáveis de ambiente", o que é uma prática de segurança essencial.
        
        ```jsx
        // config/env/production/database.js
        const { parse } = require("pg-connection-string");
        
        module.exports = ({ env }) => {
          const { host, port, database, user, password } = parse(env("DATABASE_URL"));
          return {
            connection: {
              client: 'postgres',
              connection: {
                host,
                port,
                database,
                user,
                password,
                ssl: { rejectUnauthorized: false }, // Adicione esta linha se for conectar a um DB na nuvem (Heroku, Render, etc)
              },
              debug: false,
            },
          }
        };
        
        ```
        
2. **Gerenciar as Variáveis de Ambiente (`.env`):**
    - Segredos como senhas de banco de dados e chaves de API NUNCA devem ser escritos diretamente no código. Eles são gerenciados através de um arquivo `.env` na raiz do projeto.
    - Crie um arquivo chamado `.env` na pasta principal do seu projeto.
    - Adicione as seguintes variáveis. As chaves (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`) podem ser geradas com comandos `openssl rand -base64 32`.
        
        ```
        # .env
        HOST=0.0.0.0
        PORT=1337
        
        APP_KEYS=suaPrimeiraChaveAleatoria,suaSegundaChaveAleatoria
        API_TOKEN_SALT=suaChaveSaltAleatoria
        ADMIN_JWT_SECRET=seuSegredoJwtAleatorio
        
        DATABASE_URL=postgres://usuario:senha@host:port/nome_do_banco
        
        ```
        
    - **IMPORTANTE:** O arquivo `.env` **NUNCA** deve ser enviado para o Git. Garanta que a linha `.env` esteja presente no seu arquivo `.gitignore`.
3. **Configurar o Servidor de Produção:**
    - De forma similar ao banco de dados, vamos criar um arquivo para as configurações do servidor em produção: `config/env/production/server.js`.
    - Cole o seguinte conteúdo. Ele diz ao Strapi para usar as variáveis de ambiente `HOST` e `PORT`.
        
        ```jsx
        // config/env/production/server.js
        module.exports = ({ env }) => ({
          host: env('HOST', '0.0.0.0'),
          port: env.int('PORT', 1337),
          app: {
            keys: env.array('APP_KEYS'),
          },
        });
        
        ```
        
4. **Gerar o "Build" de Produção:**
    - O Strapi requer um "build" para otimizar o painel de administração para produção.
    - Execute o seguinte comando no seu terminal:
        
        ```bash
        NODE_ENV=production yarn build
        
        ```
        
    - Este comando irá criar uma pasta `build` otimizada que será usada quando o servidor rodar em modo de produção.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 9 (Conteinerização com Docker)**, você precisa ter:

1. **Dependência do Banco de Dados Adicionada:** O pacote `pg` está listado como uma dependência no seu arquivo `package.json`.
2. **Arquivos de Configuração de Produção Criados:** Os arquivos `config/env/production/database.js` e `config/env/production/server.js` existem e estão corretamente preenchidos.
3. **Arquivo `.env` Preparado:** O arquivo `.env` foi criado na raiz do projeto e contém todas as chaves e a URL do banco de dados (mesmo que com valores temporários para o banco de dados que será criado com o Docker).
4. **Arquivo `.gitignore` Verificado:** Você confirmou que a linha `.env` está no seu `.gitignore` para evitar o vazamento de segredos.
5. **Build de Produção Bem-Sucedido:** O comando `NODE_ENV=production yarn build` foi executado e completou sem erros, gerando a pasta `build`.