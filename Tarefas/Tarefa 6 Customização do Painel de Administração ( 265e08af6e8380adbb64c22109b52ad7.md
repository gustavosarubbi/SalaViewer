# Tarefa 6: Customização do Painel de Administração (Admin Panel)

O objetivo desta fase é refinar a interface administrativa do Strapi para torná-la o mais intuitiva e à prova de erros possível para um usuário final, como um gerente de condomínio ou recepcionista, que não possui conhecimento técnico.

### **Detalhes da Tarefa:**

**Pré-requisito:** Seu servidor Strapi deve estar rodando em modo de desenvolvimento (`yarn develop`).

1. **Acessar as Configurações de Visualização (Views):**
    - No painel de administração, vá novamente em **Content-Type Builder** (em "PLUGINS").
    - Selecione um dos seus tipos de conteúdo, por exemplo, **Sala**.
    - Na tela de edição dos campos, você verá um botão ou aba chamada **"Configure the view"**. Clique nele.
2. **Customizar a "List View" (A Tabela de Listagem de Salas):**
    - Esta é a primeira tela que o usuário vê ao clicar em "Salas" no Content Manager.
    - **Adicionar Colunas Relevantes:** Por padrão, a tabela pode não mostrar informações de relacionamentos. Clique em "Add a field" e adicione o campo **andar** à tabela. Agora o administrador pode ver a qual andar uma sala pertence sem precisar clicar para editar.
    - **Reordenar Colunas:** Arraste as colunas para uma ordem mais lógica, como: `numero_sala`, `nome_ocupante`, `andar`.
    - **Definir o Título da Entrada:** Em "Settings", você pode mudar o "Entry title" (título principal da entrada). Em vez de mostrar o ID numérico, configure para mostrar o campo `numero_sala`. Isso torna a lista muito mais legível.
3. **Customizar a "Edit View" (O Formulário de Edição de Sala):**
    - Esta é a tela onde o administrador cadastra ou edita uma sala.
    - **Reordenar Campos:** Arraste os campos de entrada para uma ordem que faça sentido no preenchimento.
    - **Ajustar Largura dos Campos:** Você pode definir se um campo ocupa a largura total da tela ou apenas uma fração (ex: 6/12 da largura), permitindo colocar campos lado a lado.
    - **Adicionar Textos de Ajuda:** Clique para editar um campo (ex: `numero_sala`). Na seção "Settings", você pode adicionar um "Description" (descrição) ou "Placeholder".
        - **Exemplo:** Para o campo `numero_sala`, adicione na descrição: "Formato: Apenas números. Ex: 1701". Isso guia o usuário e evita erros de digitação.
4. **Repetir o Processo para `Andar`:**
    - Volte ao Content-Type Builder, selecione `Andar` e configure suas views também. A consistência na experiência do usuário é importante.
5. **Salvar as Alterações:**
    - Após cada conjunto de customizações, clique em **Save**. Essas configurações são salvas em arquivos JSON dentro da estrutura do seu projeto (ex: em `src/api/sala/content-types/sala/lifecycles.js` e outros arquivos de schema), o que significa que elas também são parte do seu código e serão versionadas pelo Git.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 7 (Implementação de Testes Automatizados)**, você precisa ter:

1. **List Views Otimizadas:** As tabelas de listagem para `Andar` e `Sala` no Content Manager agora exibem as colunas mais importantes em uma ordem lógica, facilitando a visualização rápida da informação (ex: a sala e o andar correspondente na mesma linha).
2. **Edit Views Intuitivas:** Os formulários de criação/edição estão bem organizados, com campos em uma sequência lógica e textos de ajuda onde necessário para guiar o preenchimento.
3. **UX do Administrador Aprimorada:** O processo geral de adicionar ou editar uma sala é claro e simples. A navegação pelo painel está mais eficiente para as tarefas do dia a dia.