# Tarefa 7: Implementação de Testes Automatizados

O objetivo desta fase é criar uma "rede de segurança" para o seu código. Testes automatizados são pequenos scripts que verificam se a sua API está se comportando como o esperado. Eles são executados para garantir que novas alterações não quebrem funcionalidades que já existiam.

**Aviso de Pragmatismo:** Para um projeto como este, onde 99% da lógica é gerenciada pelo Strapi e não há regras de negócio customizadas complexas, esta etapa é frequentemente considerada **opcional para a versão inicial**. O core do Strapi já é exaustivamente testado pelos seus desenvolvedores. Esta fase se torna **crucial** no momento em que você começa a adicionar sua própria lógica customizada (nos services, controllers ou lifecycles).

A seguir, descrevo o processo para que você conheça a prática recomendada.

### **Detalhes da Tarefa:**

1. **Escolha das Ferramentas de Teste:**
    - **Framework de Teste:** **Jest**. É o padrão de mercado para aplicações JavaScript/Node.js, conhecido por sua simplicidade e poder.
    - **Biblioteca de Requisições HTTP:** **Supertest**. Permite que seus testes façam chamadas HTTP reais para a sua aplicação Strapi, simulando o que o frontend faria.
2. **Configuração do Ambiente de Testes:**
    - **Instalar Dependências:** Adicionar o Jest e o Supertest ao seu projeto como dependências de desenvolvimento:Bash
        
        `yarn add jest supertest --dev`
        
    - **Criar um Banco de Dados de Teste:** É uma boa prática configurar o Strapi para usar um banco de dados separado (ex: um outro arquivo SQLite) quando os testes são executados. Isso garante que seus testes não modifiquem ou dependam dos seus dados de desenvolvimento. Essa configuração é feita através de arquivos de ambiente (`.env.test`).
    - **Adicionar o Script de Teste:** No seu arquivo `package.json`, adicione um script para rodar os testes:JSON
        
        `"scripts": {
          "test": "jest"
        }`
        
3. **Escrever os Casos de Teste (O que testar?):**
    - O foco seria testar as configurações que **nós** fizemos.
    - **Exemplo 1: Testar se a API pública está realmente pública.**
        - Criar um arquivo de teste para a API de `Sala`.
        - O teste faria uma requisição `GET` para `/api/salas`.
        - O teste verificaria se a resposta tem o status `200 OK`.
        - O teste verificaria se o corpo da resposta é um array de dados.
    - **Exemplo 2: Testar se a API pública está protegida contra escrita.**
        - O teste tentaria fazer uma requisição `POST` para `/api/salas` com dados de uma nova sala.
        - O teste verificaria se a resposta tem o status `403 Forbidden` (Acesso Proibido). Isso confirma que nossa configuração de permissões na Tarefa 5 está funcionando.
    - **Exemplo 3 (Hipotético): Testar lógica customizada.**
        - Se no futuro você adicionasse uma regra como "não permitir que o `nome_ocupante` tenha menos de 3 caracteres", você criaria um teste que tenta criar uma sala com um nome de 2 caracteres e verifica se a API retorna um erro de validação (ex: status `400 Bad Request`).

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída (caso decida implementá-la) e poder avançar para a **Tarefa 8 (Preparação do Ambiente para Produção)**, você precisa ter:

1. **Ferramentas de Teste Instaladas:** `jest` e `supertest` estão listados como `devDependencies` no seu arquivo `package.json`.
2. **Script de Teste Funcional:** O comando `yarn test` (ou `npm test`) pode ser executado no terminal e roda a suíte de testes sem erros de configuração.
3. **Suíte de Testes Mínima Implementada:** Pelo menos um arquivo de teste existe, cobrindo os cenários mais críticos:
    - O acesso público de leitura (`GET`) aos seus endpoints principais funciona.
    - As tentativas de escrita (`POST`, `PUT`, `DELETE`) nos endpoints públicos são corretamente bloqueadas.
4. **Testes Passando ("Green"):** A execução do comando de teste termina com sucesso, indicando que todas as verificações foram aprovadas e que a API está se comportando conforme o esperado.