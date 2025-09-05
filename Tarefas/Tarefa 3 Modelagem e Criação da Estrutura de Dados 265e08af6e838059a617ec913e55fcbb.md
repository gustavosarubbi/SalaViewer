# Tarefa 3: Modelagem e Criação da Estrutura de Dados (Content-Types)

O objetivo aqui é usar as ferramentas visuais do Strapi para construir o "esqueleto" da nossa informação. Vamos criar as "gavetas" (Collections) e definir quais "etiquetas" (Fields) cada gaveta terá. Esta é a implementação prática do que foi mapeado na **Tarefa 1**.

### **Detalhes da Tarefa:**

**Pré-requisito:** Certifique-se de que seu servidor Strapi esteja rodando em modo de desenvolvimento. No terminal, dentro da pasta do projeto, execute: `yarn develop`.

1. **Acessar o Construtor de Tipos de Conteúdo (Content-Type Builder):**
    - No painel de administração do Strapi (`http://localhost:1337/admin`), navegue até o menu lateral esquerdo.
    - Em "PLUGINS", clique em **Content-Type Builder**. É aqui que toda a modelagem de dados acontece.
2. **Criar o "Collection Type" para `Andar`:**
    - Na tela do Content-Type Builder, clique em **"+ Create new collection type"**.
    - **Display name:** Digite `Andar` (o Strapi sugere o singular). O `API ID` será `andar`.
    - Clique em **Continue**.
    - Agora, vamos adicionar os campos (fields) que planejamos:
        - Clique em **"+ Add another field"**.
        - Selecione o tipo **Number**.
        - **Name:** `numero_andar`.
        - Na aba "Advanced Settings", marque-o como **Required field** e selecione "integer" como formato numérico.
        - Clique em **Finish**.
        - **(Opcional)** Adicione um campo do tipo **Text** chamado `nome_identificador` para casos como "Térreo", "Garagem", etc.
    - Clique no botão verde **Save** no canto superior direito e aguarde o servidor reiniciar.
3. **Criar o "Collection Type" para `Sala`:**
    - Volte para a tela principal do Content-Type Builder.
    - Clique novamente em **"+ Create new collection type"**.
    - **Display name:** Digite `Sala`.
    - Clique em **Continue**.
    - Adicione os campos:
        - Campo 1: Tipo **Text**, nome `numero_sala`, marque como **Required**.
        - Campo 2: Tipo **Text**, nome `nome_ocupante`, marque como **Required**.
4. **Criar o Relacionamento entre `Sala` e `Andar`:**
    - Ainda na edição do tipo `Sala`, clique em **"+ Add another field"**.
    - Selecione o tipo de campo **Relation**.
    - A tela de relacionamento aparecerá. Do lado direito, selecione `Andar`.
    - Agora, selecione o tipo de relação. A lógica é: um `Andar` pode ter várias `Salas`, e uma `Sala` pertence a apenas um `Andar`. Portanto, clique no ícone que representa **Many to One** (Vários para Um): `Salas` (ícone de vários) --- `Andar` (ícone de um). A descrição dirá: `Sala has one Andar`.
    - Clique em **Finish**.
    - Clique no botão verde **Save** e aguarde o servidor reiniciar.

Após salvar, o Strapi terá criado as tabelas no banco de dados (no arquivo SQLite, por enquanto) e também gerado os arquivos de modelo e rota na estrutura de pastas do seu projeto.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 4 (Implementação da Lógica de Negócio e Serviços)**, que no caso do Strapi é mais uma configuração, você precisa ter o seguinte:

1. **Collections Criadas:** Dentro do `Content-Type Builder`, os tipos de coleção `Andar` e `Sala` estão listados e configurados.
2. **Campos Definidos:** Todos os campos (`numero_andar`, `numero_sala`, etc.) foram criados com seus respectivos tipos e validações (ex: "Required").
3. **Relacionamento Funcional:** O relacionamento entre `Sala` e `Andar` está corretamente estabelecido.
4. **Visibilidade no Gerenciador de Conteúdo:** No menu principal à esquerda, na seção **Content Manager**, agora devem aparecer os links **Andares** e **Salas**. Clicar neles deve levar a uma tela onde você pode começar a adicionar conteúdo, embora ainda não tenha nenhum.