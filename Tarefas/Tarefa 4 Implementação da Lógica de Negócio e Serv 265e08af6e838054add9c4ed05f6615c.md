# Tarefa 4: Implementação da Lógica de Negócio e Serviços

**Nota Importante:** Em um framework tradicional, esta seria a fase de escrever muito código para criar, ler, atualizar e deletar dados do banco. **A grande vantagem do Strapi é que ele já fez 95% deste trabalho para você.**

Ao criar os "Content-Types" na tarefa anterior, o Strapi automaticamente gerou os serviços básicos de CRUD (Create, Read, Update, Delete) para `Andar` and `Sala`. Portanto, esta tarefa é menos sobre *escrever* código e mais sobre *validar a lógica existente* e *popular o sistema com conteúdo*.

### **Detalhes da Tarefa:**

1. **Entender os Serviços Auto-Gerados:**
    - Por curiosidade e conhecimento, navegue na estrutura de pastas do seu projeto.
    - Você encontrará em `src/api/sala/services/sala.js` e `src/api/andar/services/andar.js` os arquivos de serviço.
    - Você notará que eles estão praticamente vazios. Isso ocorre porque eles herdam toda a lógica principal do "core" do Strapi. Você só precisaria editar esses arquivos se tivesse uma regra de negócio muito customizada (ex: "ao criar uma sala, enviar um email"), o que não é o caso para este projeto.
2. **Popular o Sistema com Dados Iniciais (Content Seeding):**
    - Uma API sem dados não pode ser testada. Vamos agora usar o Painel de Administração para cadastrar as informações.
    - No menu à esquerda, em **Content Manager**, você verá **Andares** e **Salas**.
    - **Primeiro, cadastre os Andares:**
        - Clique em **Andares**.
        - Clique no botão **"+ Add new entry"**.
        - Cadastre alguns andares que existem no seu diretório (ex: 15, 16, 17). Salve cada um deles.
    - **Segundo, cadastre as Salas:**
        - Agora, clique em **Salas**.
        - Clique em **"+ Add new entry"**.
        - Preencha os campos `numero_sala` (ex: "1701") e `nome_ocupante` (ex: "INSTITUTO DE PESQUISAS ELDORADO").
        - Você verá um campo de `Andar` com uma lista suspensa. **Selecione o andar correspondente** que você acabou de criar. É aqui que o relacionamento da Tarefa 3 entra em ação.
        - Clique em **Save** e depois em **Publish**.
    - **Repita o processo:** Cadastre pelo menos umas 5 a 10 salas em diferentes andares. Ter uma boa quantidade de dados de exemplo é crucial para as próximas etapas.
3. **Validar a Lógica CRUD via Painel:**
    - Ao realizar as ações acima, você já está validando a lógica:
        - **Create:** Você conseguiu criar novos andares e salas.
        - **Read:** Você consegue ver a lista de todas as salas e andares cadastrados.
        - **Update:** Entre em uma sala já existente, edite o nome do ocupante e salve. A alteração deve persistir.
        - **Delete:** Apague uma sala de teste. Ela deve desaparecer da lista.
    - Essa validação confirma que os serviços e a conexão com o banco de dados estão funcionando perfeitamente.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 5 (Criação dos Endpoints da API)**, que é sobre expor esses dados para o mundo exterior (o monitor), você precisa ter:

1. **Backend Populado com Dados de Exemplo:** O seu sistema não está mais vazio. Existem múltiplos registros para `Andar` e para `Sala` visíveis no Content Manager.
2. **Relacionamentos Corretamente Atribuídos:** Suas salas de exemplo foram associadas aos andares corretos através do campo de relacionamento.
3. **Lógica CRUD Validada:** Você confirmou que consegue criar, ler a lista, ver detalhes, atualizar e deletar registros de `Andar` e `Sala` sem erros através do painel de administração.
4. **Conteúdo Publicado:** Para cada item que você cadastrou (Andares e Salas), você clicou no botão **"Publish"**. Conteúdo que está apenas "Salvo" (em modo "Draft") não aparecerá na API pública por padrão.