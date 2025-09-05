# Tarefa 9: Conteinerização da Aplicação com Docker

O objetivo desta fase é criar os arquivos de configuração do Docker que descrevem exatamente como construir e executar nosso backend e seu banco de dados. O resultado final será a capacidade de iniciar todo o sistema de backend, incluindo o banco de dados, com um único comando (`docker-compose up`).

### **Detalhes da Tarefa:**

1. **Criar o `Dockerfile`:**
    - Na raiz do seu projeto, crie um arquivo chamado `Dockerfile` (sem extensão).
    - Este arquivo é a "receita" para construir a imagem do seu aplicativo Strapi.
    - Cole o seguinte conteúdo nele:Dockerfile
        
        `# Dockerfile
        
        # Estágio 1: Instalar dependências
        FROM node:18-alpine AS deps
        # Instalar dependências do sistema operacional necessárias para o build
        RUN apk add --no-cache libc6-compat
        WORKDIR /opt/app
        
        # Copiar package.json e yarn.lock para aproveitar o cache do Docker
        COPY package.json yarn.lock ./
        # Instalar as dependências de produção
        RUN yarn install --frozen-lockfile
        
        # Estágio 2: Construir a aplicação
        FROM node:18-alpine AS builder
        WORKDIR /opt/app
        COPY --from=deps /opt/app/node_modules ./node_modules
        COPY . .
        
        # Executar o build de produção que criamos na tarefa anterior
        ENV NODE_ENV=production
        RUN yarn build
        
        # Estágio 3: Imagem final de produção
        FROM node:18-alpine AS runner
        WORKDIR /opt/app
        
        # Copiar apenas os artefatos necessários para rodar a aplicação
        COPY --from=builder /opt/app/package.json .
        COPY --from=builder /opt/app/yarn.lock .
        COPY --from=builder /opt/app/dist ./dist
        COPY --from=builder /opt/app/build ./build
        COPY --from=builder /opt/app/node_modules ./node_modules
        COPY --from=builder /opt/app/public ./public # Para servir arquivos de upload# Expor a porta que o Strapi usa
        EXPOSE 1337
        
        # Comando para iniciar a aplicação
        CMD ["yarn", "start"]`
        
2. **Criar o arquivo `.dockerignore`:**
    - Para evitar que arquivos desnecessários (e pesados) sejam copiados para a imagem Docker, crie um arquivo `.dockerignore` na raiz do projeto.
    - Cole o seguinte conteúdo:
        
        `# .dockerignore
        .git
        .env
        node_modules/
        build/
        npm-debug.log`
        
3. **Criar o arquivo `docker-compose.yml`:**
    - Este é o arquivo orquestrador. Na raiz do projeto, crie um arquivo chamado `docker-compose.yml`.
    - Ele irá definir dois serviços: nosso backend (`strapi`) e nosso banco de dados (`db`).
    - Cole o seguinte conteúdo:YAML
        
        `# docker-compose.yml
        version: '3.8'
        
        services:
          strapi:
            container_name: strapi_backend
            build: .
            image: meu-diretorio/strapi
            restart: unless-stopped
            env_file: .env # Carrega as variáveis de ambiente do arquivo .env
            environment:
              DATABASE_CLIENT: ${DATABASE_CLIENT}
              DATABASE_URL: ${DATABASE_URL}
              JWT_SECRET: ${JWT_SECRET}
              ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
              API_TOKEN_SALT: ${API_TOKEN_SALT}
              APP_KEYS: ${APP_KEYS}
              NODE_ENV: ${NODE_ENV}
            volumes:
              - ./public/uploads:/opt/app/public/uploads # Persiste os arquivos de imagem/upload
            ports:
              - '1337:1337'
            depends_on:
              - db
        
          db:
            container_name: strapi_database
            image: postgres:14.5-alpine
            restart: unless-stopped
            env_file: .env # Carrega as variáveis para configurar o Postgres
            environment:
              POSTGRES_USER: ${DATABASE_USERNAME}
              POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
              POSTGRES_DB: ${DATABASE_NAME}
            volumes:
              - strapi-data:/var/lib/postgresql/data # Persiste os dados do banco de dados
            ports:
              - '5432:5432'
        
        volumes:
          strapi-data:`
        
4. **Atualizar o Arquivo `.env` para o Docker:**
    - O backend dentro do Docker precisa se conectar ao banco de dados usando o nome do serviço do Docker, não `localhost`.
    - Atualize seu arquivo `.env` para refletir as variáveis usadas no `docker-compose.yml`:Plaintext
        
        `# .env - Atualizado para Docker
        HOST=0.0.0.0
        PORT=1337
        NODE_ENV=production
        
        APP_KEYS=...
        API_TOKEN_SALT=...
        ADMIN_JWT_SECRET=...
        JWT_SECRET=... # Adicione a mesma chave do ADMIN_JWT_SECRET se não tiver outra
        
        DATABASE_CLIENT=postgres
        # Note que o host agora é "db", o nome do serviço no docker-compose
        DATABASE_URL=postgres://strapi_user:strapi_password@db:5432/strapi_db
        
        # Variáveis para o container do Postgres
        DATABASE_USERNAME=strapi_user
        DATABASE_PASSWORD=strapi_password
        DATABASE_NAME=strapi_db`
        
    - **Atenção:** Use senhas fortes e altere os valores de usuário/senha/nome do banco conforme sua preferência, garantindo que sejam os mesmos no `DATABASE_URL` e nas variáveis `POSTGRES_*`.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 10 (Estratégia de Backup)**, você precisa ter:

1. **Arquivos Docker Criados:** Os arquivos `Dockerfile`, `.dockerignore`, e `docker-compose.yml` existem na raiz do projeto e estão corretamente preenchidos.
2. **Arquivo `.env` Atualizado:** O arquivo `.env` foi atualizado para conter todas as variáveis necessárias para os contêineres `strapi` e `db`.
3. **Build da Imagem Bem-Sucedido:** Ao rodar `docker-compose build` no terminal, o processo termina sem erros, indicando que a imagem do seu Strapi foi criada com sucesso.
4. **Sistema Totalmente Funcional via Docker:** O comando `docker-compose up` inicia ambos os contêineres (banco de dados e backend) sem falhas. Após a inicialização, você consegue:
    - Acessar o painel de administração em `http://localhost:1337/admin`.
    - Acessar a API pública em `http://localhost:1337/api/salas`.
    - Cadastrar um novo dado, rodar `docker-compose down` e depois `docker-compose up`, e verificar que o dado **persiste**, validando que os volumes do banco de dados e dos uploads estão funcionando.