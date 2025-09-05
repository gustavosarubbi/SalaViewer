# Tarefa 11: Validação Final e Testes de Aceitação (End-to-End)

O objetivo desta fase é realizar uma verificação completa e manual de todo o sistema que foi implantado. Vamos simular o uso real da aplicação, tanto pela perspectiva de um administrador de conteúdo quanto pela perspectiva da aplicação frontend que consumirá os dados. Este é o "test drive" final antes de entregar as chaves.

### **Detalhes da Tarefa (Checklist de Validação):**

Execute os seguintes testes diretamente no ambiente de produção local que você acabou de configurar.

**Cenário 1: A Perspectiva do Administrador**

- **[ ] 1.1 - Acesso ao Painel:**
    - Em um computador na rede local, acesse o painel de administração usando o IP estático do servidor (ex: `http://192.168.1.50:1337/admin`).
    - **Teste:** Consegue ver a tela de login? Consegue fazer login com o usuário administrador que você criou?
- **[ ] 1.2 - Criação de Dados (Create):**
    - Navegue até "Content Manager" -> "Andares" e crie um novo andar de teste (ex: Andar "99").
    - Navegue até "Salas" e crie uma nova sala de teste (ex: Sala "9901", Ocupante "Teste Final"), associando-a ao Andar "99".
    - **Teste:** Os dados foram salvos e publicados sem erros?
- **[ ] 1.3 - Atualização de Dados (Update):**
    - Encontre a sala "9901" que você acabou de criar.
    - Edite o campo "Ocupante" para "Teste Final - Atualizado" e salve/publique a alteração.
    - **Teste:** A alteração foi salva corretamente?
- **[ ] 1.4 - Exclusão de Dados (Delete):**
    - Encontre a sala de teste "9901" e o andar "99" e exclua ambos.
    - **Teste:** Os registros desapareceram das listas no painel de administração?

**Cenário 2: A Perspectiva do Frontend (Consumindo a API)**

- **[ ] 2.1 - Acesso e Consistência da API:**
    - Enquanto realiza os testes do Cenário 1, mantenha uma aba do navegador aberta acessando a API pública (`http://192.168.1.50:1337/api/salas`).
    - **Teste:** Após criar a Sala "9901", ela apareceu na resposta da API? Após atualizá-la, a informação mudou no JSON? Após excluí-la, ela desapareceu do JSON?
- **[ ] 2.2 - Validação do Relacionamento (Populate):**
    - Acesse o endpoint da API com o parâmetro `populate`: `http://192.168.1.50:1337/api/salas?populate=*`
    - **Teste:** A estrutura do JSON está correta? Para cada sala, os dados completos do seu respectivo andar estão incluídos no mesmo objeto? Este é um teste crítico para o frontend.

---

### ✅ Critérios de Aceitação para a Conclusão do Backend

Ao marcar todos os itens do checklist acima como concluídos, você atingiu os critérios finais de aceitação do projeto. Isso significa que:

1. **O Fluxo de Gerenciamento está 100% Funcional:** Um administrador consegue, de forma autônoma, gerenciar todo o ciclo de vida do conteúdo no ambiente de produção.
2. **A API Pública é Confiável e Consistente:** A API reflete com precisão e em tempo real os dados gerenciados no painel, servindo-os na estrutura correta que o frontend precisa.
3. **O Sistema está Estável:** A aplicação está rodando de forma contínua no servidor local sem falhas ou erros durante os testes.

---

Ao concluir com sucesso todos os testes desta etapa, você pode oficialmente considerar o trabalho no backend finalizado.

**Parabéns!** Você percorreu o ciclo de vida completo de desenvolvimento e implantação de um backend robusto, seguro e profissional. Desde o planejamento inicial, passando pela configuração do ambiente, modelagem de dados, conteinerização com Docker, até a implantação final e os testes de aceitação. Você construiu uma fundação sólida e aderiu às melhores práticas da indústria.

**O seu backend está oficialmente pronto.**