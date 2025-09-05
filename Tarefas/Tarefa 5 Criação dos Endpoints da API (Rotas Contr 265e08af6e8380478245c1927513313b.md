# Tarefa 5: Criação dos Endpoints da API (Rotas/Controllers)

Assim como na Tarefa 4, o Strapi já gerou automaticamente os controllers e as rotas básicas para nós. Nossa tarefa aqui não é *criar* os endpoints do zero, mas sim *configurar as permissões* para torná-los publicamente acessíveis de forma segura (apenas para leitura).

### **Detalhes da Tarefa:**

1. **Entender as Rotas e Controllers Auto-Gerados:**
    - O Strapi segue uma convenção. Quando você criou o Content-Type `Sala`, ele criou um arquivo de rotas em `src/api/sala/routes/sala.js` e um de controller em `src/api/sala/controllers/sala.js`.
    - Estes arquivos definem as rotas padrão da API REST (ex: `GET /api/salas`, `GET /api/salas/:id`, `POST /api/salas`, etc.). Para nosso projeto, não precisamos modificar estes arquivos.
2. **Configurar as Permissões de Acesso (Roles & Permissions):**
    - Por padrão, o Strapi bloqueia todos os endpoints para acesso público por segurança. Nós precisamos liberar o acesso de **leitura**.
    - No painel de administração, vá em **Settings** no menu principal à esquerda.
    - Na seção "USERS & PERMISSIONS PLUGIN", clique em **Roles**.
    - Você verá duas roles (funções) padrão: **Authenticated** e **Public**. O nosso monitor será um usuário "Public", pois ele não fará login.
    - Clique na role **Public**.
3. **Liberar as Permissões para `Andar` e `Sala`:**
    - Dentro da página de edição da role "Public", você verá uma lista com "Permissions".
    - Encontre **Andar** na lista e marque as caixas para as seguintes ações:
        - **find:** Permite buscar a lista de todos os andares. (Corresponde a `GET /api/andares`)
        - **findOne:** Permite buscar um andar específico pelo seu ID. (Corresponde a `GET /api/andares/:id`)
    - Faça o mesmo para **Sala**:
        - Marque a caixa para **find**.
        - Marque a caixa para **findOne**.
    - **Importante:** **NÃO** marque as caixas `create`, `update` ou `delete`. Isso garante que o público só pode ler os dados, mas nunca modificá-los.
    - Clique no botão **Save** no canto superior direito.
4. **Testar os Endpoints da API:**
    - Agora que as permissões foram salvas, os endpoints estão "vivos". A maneira mais fácil de testar é usando seu próprio navegador.
    - Abra uma nova aba no navegador e acesse:
        
        http://localhost:1337/api/salas
        
    - **Resultado esperado:** Você deve ver uma grande quantidade de texto no formato JSON, contendo a lista de todas as salas que você cadastrou e publicou. Se você vir os dados, significa que funcionou! Se vir uma mensagem de erro "Forbidden", volte e verifique as permissões.
5. **Testar o Relacionamento (Populate):**
    - Você notará que na resposta de `/api/salas`, o campo `andar` não mostra os detalhes do andar, apenas uma referência a ele. Para resolver isso, o Strapi usa um parâmetro chamado `populate`.
    - Teste esta nova URL no seu navegador:
        
        http://localhost:1337/api/salas?populate=*
        
    - **Resultado esperado:** Agora, a resposta JSON para cada sala deve incluir um objeto `andar` completo, com o número do andar e todos os seus outros campos. É esta URL que nosso frontend provavelmente usará.

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 6 (Customização do Painel de Administração)**, você precisa ter:

1. **Permissões Públicas Habilitadas:** As ações `find` e `findOne` para `Andar` e `Sala` estão marcadas e salvas para a role "Public".
2. **Endpoints de Lista Funcionando:** Acessar `http://localhost:1337/api/andares` e `http://localhost:1337/api/salas` retorna uma resposta JSON com os dados (código 200 OK) e não um erro de permissão (código 403 Forbidden).
3. **Endpoint com "Populate" Funcionando:** Acessar `http://localhost:1337/api/salas?populate=*` retorna a lista de salas com os dados completos de seus respectivos andares aninhados na resposta.
4. **Endpoints de Escrita Protegidos:** Você tem a certeza de que as permissões de escrita (`create`, `update`, `delete`) **não** foram habilitadas para o público, garantindo a segurança do seu conteúdo.