# Tarefa 2: Configuração do Ambiente de Desenvolvimento Local

O objetivo desta fase é preparar a sua máquina para a construção do projeto. É a montagem da sua "oficina de trabalho", garantindo que todas as ferramentas e o projeto base estejam instalados e funcionando corretamente antes de escrever a primeira linha de código da lógica de negócio.

### **Detalhes da Tarefa:**

1. **Instalação dos Pré-requisitos de Sistema:**
    - **Node.js:** Instalar a versão LTS (Long-Term Support) mais recente. O Strapi depende do ambiente Node.js para rodar.
        - *Recomendação:* Utilizar um gerenciador de versões como o `nvm` (Node Version Manager) para poder alternar entre versões do Node.js facilmente, se necessário.
    - **Yarn (Gerenciador de Pacotes):** Embora o `npm` (que vem com o Node.js) funcione, o Strapi e seu ecossistema frequentemente utilizam o `Yarn`. Instale-o globalmente com `npm install -g yarn`.
    - **Git:** Essencial para o controle de versão do seu código.
2. **Instalação das Ferramentas de Desenvolvimento:**
    - **Editor de Código:** Instalar um editor moderno como o **Visual Studio Code (VS Code)**.
    - **Extensões Úteis para o VS Code:** Instalar extensões que ajudarão na produtividade, como `Prettier` (para formatação de código), `ESLint` (para identificar erros de código) e `Docker`.
    - **Docker Desktop:** Instalar o Docker na sua máquina. Durante o desenvolvimento, ele será usado para rodar o banco de dados PostgreSQL em um contêiner, mantendo seu sistema principal limpo e garantindo que o banco de dados seja idêntico ao de produção.
    - **Cliente de Banco de Dados (Opcional):** Instalar uma ferramenta com interface gráfica para visualizar o banco de dados, como `DBeaver` (multiplataforma e gratuito) ou `TablePlus`.
3. **Criação e Inicialização do Projeto Strapi:**
    - Abra seu terminal na pasta onde costuma guardar seus projetos.
    - Execute o comando oficial para criar um novo projeto Strapi:Bash
        
        # 
        
        `npx create-strapi-app@latest meu-projeto-backend --quickstart`
        
    - **O que este comando faz:**
        - Cria uma nova pasta chamada `meu-projeto-backend`.
        - Baixa a última versão do Strapi.
        - Instala todas as dependências necessárias.
        - A flag `-quickstart` configura o projeto para usar o banco de dados **SQLite** por padrão, o que é perfeito para a fase inicial de desenvolvimento, como planejado.
4. **Inicialização do Controle de Versão (Git):**
    - Navegue para dentro da pasta recém-criada: `cd meu-projeto-backend`.
    - Inicie um repositório Git: `git init`.
    - Adicione todos os arquivos ao versionamento: `git add .`.
    - Crie o primeiro "commit", salvando o estado inicial do projeto: `git commit -m "Initial commit: fresh Strapi v4 project"`.
    - Crie um repositório remoto (no GitHub, GitLab, etc.) e envie seu projeto para lá.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 3 (Modelagem e Criação da Estrutura de Dados)**, você precisa ter o seguinte:

1. **Ferramentas Essenciais Instaladas:** Você consegue executar `node -v`, `yarn -v`, e `git --version` no seu terminal e ver as versões corretas.
2. **Projeto Strapi Criado:** A pasta `meu-projeto-backend` existe na sua máquina com toda a estrutura de arquivos do Strapi.
3. **Servidor de Desenvolvimento Funcional:** Dentro da pasta do projeto, você consegue executar o comando `yarn develop`. Após a execução, o servidor Strapi deve iniciar com sucesso.
4. **Acesso ao Painel de Administração:** Com o servidor rodando, você consegue acessar `http://localhost:1337/admin` no seu navegador e criar o primeiro usuário administrador.
5. **Projeto Versionado:** O código inicial do projeto já está salvo em um primeiro commit no Git e, preferencialmente, enviado para um repositório remoto.