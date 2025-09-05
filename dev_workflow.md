Workflow Geral de Execução de Tarefas de Desenvolvimento para IA
Para cada tarefa solicitada (de "Configuração do Ambiente" a "Testes"), a IA deve seguir rigorosamente as cinco fases deste workflow: 1. Análise, 2. Planejamento, 3. Implementação, 4. Verificação e 5. Finalização.

**IMPORTANTE** Aplicar o uso de deepthink.
**IMPORTANTE** Teste referente ao servidor, rodar em segundo plano.
**IMPORTANTE** Ao testar o servidor do front-end, rode o servidor do back-end também em segundo plano.
**IMPORTANTE** Utilizou ou Irá utilizar CD ou simalares, verificar sempre se está na pasta correta.

Fase 1: Análise e Compreensão da Tarefa
Antes de gerar qualquer comando ou linha de código, a IA deve:

Identificar o Objetivo Principal: Qual é o resultado final e o propósito desta tarefa? (Ex: "Criar fisicamente as tabelas no banco de dados").

Estabelecer o Contexto: Revisar a tarefa anterior para entender o estado atual do projeto e identificar as dependências necessárias. (Ex: "Para a Tarefa 3, preciso que o schema.prisma da Tarefa 2 esteja completo e correto").

Definir os Critérios de Sucesso: Listar internamente os "Requisitos para Prosseguir". Esta lista será a "definição de concluído" e será usada na Fase 4 para validação.

Verificar Pré-requisitos: Confirmar quais ferramentas, pacotes ou configurações são necessários antes de iniciar a implementação.

Fase 2: Planejamento e Estruturação da Resposta
Com a tarefa compreendida, a IA deve estruturar a solução:

Dividir a Tarefa em Passos Lógicos: Quebrar a tarefa maior em um passo a passo sequencial e de fácil compreensão. (Ex: 1. Instalar dependência; 2. Modificar o Controller; 3. Modificar o Service).

Preparar Snippets e Comandos: Pré-formatar todos os comandos de terminal e blocos de código que serão necessários. O código deve ser completo, comentado (quando necessário) e seguir as melhores práticas do framework (NestJS).

Antecipar Pontos de Atenção: Identificar potenciais fontes de erro ou detalhes cruciais para o sucesso da tarefa. (Ex: "Lembre-se de importar o ParseIntPipe", "Garanta que o banco de dados de teste esteja separado do de desenvolvimento").

Fase 3: Implementação Guiada
Esta é a fase de geração da resposta detalhada:

Apresentar a Tarefa: Iniciar a resposta com o título, objetivo e contexto da tarefa, conforme definido na Fase 1.

Executar o Passo a Passo: Apresentar cada passo do plano de forma clara e ordenada.

Contextualizar Cada Ação: Explicar por que cada comando está sendo executado ou por que um bloco de código está sendo adicionado/modificado.

Fornir Código Explícito: Apresentar os blocos de código completos para evitar ambiguidades. Indicar claramente em qual arquivo (src/main.ts, src/energia/energia.service.ts, etc.) o código deve ser inserido.

Citar Fontes: Ao utilizar informações de arquivos fornecidos pelo usuário (como o Manual SM-3W-Lite.pdf ou as imagens de configuração), a IA deve incluir a citação apropriada (ex: ``) imediatamente após a informação.

Fase 4: Verificação e Validação
Para garantir a qualidade e o funcionamento da implementação, a IA deve:

Instruir sobre Verificação Imediata: Indicar ao usuário como verificar se cada passo foi bem-sucedido. (Ex: "Após rodar o comando, verifique se a pasta prisma/migrations foi criada", "Reinicie a aplicação com npm run start:dev para garantir que não há erros de compilação").

Prover Comandos de Teste: Quando aplicável, fornecer exemplos de como testar a nova funcionalidade. (Ex: "Use o cURL ou Postman para fazer uma requisição GET ao novo endpoint", "Acesse http://localhost:3000/api/docs para ver a documentação atualizada").

Revisar os Critérios de Sucesso: Confrontar o resultado da implementação com a lista de "Requisitos para Concluido" definida na Fase 1, garantindo que todos os pontos foram atendidos.

Fase 5: Finalização e Transição

Apresentar o Checklist Final: Exibir de forma clara e concisa a seção "✅ Requisitos para Prosseguir para a Próxima Tarefa". Esta é a confirmação formal de que a etapa foi concluída com sucesso.

**STATUS** Ao concluir uma tarefa mude o Status para Concluido.

Manter a Continuidade: A IA deve manter o estado do projeto em mente para garantir que a próxima tarefa comece exatamente de onde a anterior parou.


A conclusão de uma tarefa deve preparar o caminho e inciar a próxima: