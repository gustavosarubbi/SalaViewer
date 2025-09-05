# Tarefa 1: Planejamento da Arquitetura e Escolha das Ferramentas

Esta é a fase mais importante do projeto. É o alicerce. Decisões erradas aqui podem custar muito tempo e esforço para serem corrigidas no futuro. O objetivo é criar um "mapa" claro antes de começar a "construir".

### **Detalhes da Tarefa:**

1. **Levantamento de Requisitos Funcionais:**
    - Definir exatamente o que o backend precisa fazer.
    - **Exemplos:**
        - O sistema deve permitir o cadastro de Andares.
        - O sistema deve permitir o cadastro de Salas, associando-as a um Andar.
        - O sistema deve permitir que um administrador com login e senha realize todas as operações de criação, leitura, atualização e exclusão (CRUD).
        - O sistema deve fornecer uma API pública (somente leitura) para que qualquer cliente (o monitor) possa consumir a lista de andares e salas.
2. **Levantamento de Requisitos Não-Funcionais:**
    - Definir as qualidades e restrições do sistema.
    - **Exemplos:**
        - **Segurança:** A área administrativa deve ser protegida e acessível apenas por usuários autorizados.
        - **Usabilidade:** O painel para gerenciar as salas deve ser intuitivo o suficiente para uma pessoa não-técnica utilizar.
        - **Performance:** A API pública deve responder rapidamente, mesmo com centenas de salas cadastradas.
        - **Manutenibilidade:** O projeto deve ser fácil de atualizar e dar manutenção no futuro.
3. **Decisão da Arquitetura:**
    - Com base nos requisitos, confirma-se a escolha da arquitetura. Conforme discutimos, a melhor abordagem é a **API Desacoplada (Headless)**.
    - **Justificativa:** Essa arquitetura oferece a flexibilidade necessária para que o backend sirva dados a múltiplos frontends (o monitor de hoje, um aplicativo amanhã) e permite que a interface de administração seja separada da exibição.
4. **Escolha Final das Ferramentas (Tech Stack):**
    - **Framework Backend:** **Strapi**.
        - *Justificativa:* Atende perfeitamente aos requisitos, gerando automaticamente a API e o painel de administração, o que acelera drasticamente o desenvolvimento.
    - **Banco de Dados:**
        - Para Desenvolvimento: **SQLite** (já vem embutido no Strapi, é um arquivo único, perfeito para iniciar).
        - Para Produção: **PostgreSQL**.
        - *Justificativa:* PostgreSQL é robusto, confiável e escalável, sendo a opção recomendada pelo próprio Strapi para ambientes de produção.
    - **Ferramenta de Implantação (Deployment):** **Docker**.
        - *Justificativa:* Garante que o ambiente de desenvolvimento seja idêntico ao de produção, simplificando a implantação e evitando problemas de "na minha máquina funciona".

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 2 (Configuração do Ambiente de Desenvolvimento Local)**, você precisa ter os seguintes artefatos e decisões claramente definidos:

1. **Documento de Requisitos Mínimos:** Uma lista, mesmo que simples (pode ser em um bloco de notas), com as funcionalidades essenciais que o backend deve ter.
2. **Tech Stack Formalmente Decidido:** Confirmação de que as ferramentas escolhidas (Strapi, PostgreSQL, Docker) são as finais e que a equipe (mesmo que seja só você) está de acordo.
3. **Estrutura de Dados Inicial Mapeada:** Um rascunho de quais "Collections" (tabelas) você vai criar e quais "Fields" (campos) cada uma terá.
    - **Exemplo:**
        - `Andar`:
            - `numero_andar` (Número, Obrigatório)
            - `nome_identificador` (Texto, ex: "Lobby")
        - `Sala`:
            - `numero_sala` (Texto, Obrigatório, ex: "101-A")
            - `nome_ocupante` (Texto, Obrigatório)
            - `relacionamento` com `Andar` (Uma Sala pertence a um Andar)