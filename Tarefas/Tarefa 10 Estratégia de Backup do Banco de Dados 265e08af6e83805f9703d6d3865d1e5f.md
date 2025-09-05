# Tarefa 10: Estratégia de Backup do Banco de Dados

O objetivo desta fase é definir, criar e testar um procedimento confiável para fazer cópias de segurança de todos os dados importantes da aplicação. O código pode ser recuperado do Git, mas os dados inseridos pelos usuários são insubstituíveis. Um backup funcional é sua apólice de seguro contra falhas de hardware, corrupção de dados ou erro humano.

### **Detalhes da Tarefa:**

1. **Identificar os Dados a Serem Backupeados:**
No nosso projeto, existem duas fontes de dados que precisam ser salvas:
    - **1. O Banco de Dados PostgreSQL:** Contém todas as informações sobre andares, salas, ocupantes, usuários administradores, etc. Estes dados vivem dentro do volume Docker que nomeamos `strapi-data` no arquivo `docker-compose.yml`.
    - **2. Os Arquivos de Upload (Mídia):** Quaisquer imagens ou documentos enviados através do painel de administração. Estes arquivos ficam na pasta `./public/uploads` do host, que está mapeada para o contêiner.
2. **Definir e Criar o Processo de Backup:**
Existem duas abordagens principais, uma manual e uma automatizada.
    - **A) Backup Manual (Para começar):**
        - **Banco de Dados:** Usaremos a ferramenta nativa do PostgreSQL, `pg_dump`, executando-a de fora para dentro do contêiner Docker. Com os contêineres rodando, execute este comando no terminal do seu servidor (host):Bash
            
            `docker-compose exec -T db pg_dump -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} > backup_db_$(date +%Y-%m-%d_%H%M).sql`
            
            - **O que faz este comando:**
                - `docker-compose exec -T db`: Executa um comando dentro do contêiner chamado `db` sem alocar um terminal interativo.
                - `pg_dump ...`: O comando do PostgreSQL para exportar o banco de dados. Ele pegará o usuário e nome do banco das suas variáveis de ambiente.
                - `> backup... .sql`: Redireciona a saída (o backup completo em formato SQL) para um arquivo no seu servidor, com data e hora no nome.
        - **Arquivos de Upload:** Simplesmente crie um arquivo compactado da pasta de uploads.Bash
            
            `tar -czvf backup_uploads_$(date +%Y-%m-%d_%H%M).tar.gz ./public/uploads`
            
    - **B) Backup Automatizado (Recomendado para Produção):**
        - O ideal é que o processo acima aconteça sem intervenção humana, por exemplo, toda madrugada.
        - **Criar um Script de Backup:** Crie um arquivo no servidor, por exemplo `/home/user/backup.sh`, e coloque os comandos do backup manual dentro dele.Bash
            
            `#!/bin/bash
            # /home/user/backup.sh
            
            # Navega até a pasta do projeto
            cd /path/to/your/strapi-project
            
            # Cria os backups com timestamp
            docker-compose exec -T db pg_dump -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} > /home/user/backups/backup_db_$(date +%Y-%m-%d_%H%M).sql
            tar -czvf /home/user/backups/backup_uploads_$(date +%Y-%m-%d_%H%M).tar.gz ./public/uploads
            
            # (Opcional, mas recomendado) Apaga backups mais antigos que 7 dias
            find /home/user/backups/* -mtime +7 -delete
            
            # (Opcional, avançado) Envia os backups para um armazenamento na nuvem (ex: AWS S3)
            # aws s3 sync /home/user/backups/ s3://meu-bucket-de-backups`
            
        - **Agendar a Execução com Cron Job:** O `cron` é um agendador de tarefas do Linux. Edite o `crontab` do seu usuário (`crontab -e`) e adicione uma linha para executar seu script todos os dias às 2h da manhã:
            
            `0 2 * * * /bin/bash /home/user/backup.sh`
            
3. **Planejar e Testar a Restauração:**
Um backup que nunca foi testado não é um backup confiável. Periodicamente, você deve simular um desastre.
    - Pegue um arquivo de backup `.sql` recente.
    - Em um ambiente de teste (nunca em produção!), execute o comando de restauração para garantir que o arquivo é válido:Bash
        
        `cat backup_db_xxxx.sql | docker-compose exec -T db psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME}`
        

---

### ✅ Requisitos para Prosseguir para a Próxima Tarefa

Para considerar esta fase concluída e poder avançar para a **Tarefa 11 (Implantação)**, você precisa ter:

1. **Procedimento de Backup Documentado:** Você tem um guia claro (pode ser um arquivo `README.md`) que explica passo a passo como realizar um backup manual.
2. **Script de Backup Criado e Testado:** Se optou pela automação, o script `backup.sh` existe, tem as permissões corretas de execução (`chmod +x backup.sh`) e funciona quando executado manualmente.
3. **Estratégia de Armazenamento e Retenção Decidida:** Você sabe onde os backups serão guardados (localmente, na nuvem) e por quanto tempo (ex: 7 dias, 30 dias).
4. **Primeiro Backup de Teste Realizado com Sucesso:** Você executou o procedimento de backup pelo menos uma vez e tem em mãos os arquivos (`.sql` e `.tar.gz`), confirmando que o processo funciona.
5. **(Recomendado) Primeiro Teste de Restauração Bem-Sucedido:** Você validou que consegue usar os arquivos de backup para restaurar os dados em um ambiente de teste.