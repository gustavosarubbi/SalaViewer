# 🔒 Guia de Segurança - SalaViewer Backend

## 📋 Resumo de Segurança

Este documento descreve as medidas de segurança implementadas no backend do SalaViewer.

## ✅ Medidas de Segurança Implementadas

### 1. **Autenticação e Autorização**
- ✅ **JWT (JSON Web Tokens)** para autenticação
- ✅ **Hash de senhas** com bcrypt (salt rounds: 10)
- ✅ **Controle de roles** (admin) para autorização
- ✅ **Guards de autenticação** em todos os endpoints
- ✅ **Rate limiting** no endpoint de login (5 tentativas/minuto)

### 2. **Validação de Entrada**
- ✅ **Validação rigorosa** com class-validator
- ✅ **Whitelist ativado** (rejeita campos não permitidos)
- ✅ **Sanitização de dados** automática
- ✅ **Validação de senhas complexas** (8+ chars, maiúscula, minúscula, número, especial)

### 3. **Proteção contra Ataques**
- ✅ **Rate limiting global** (100 requests/minuto)
- ✅ **CORS configurado** dinamicamente
- ✅ **Headers de segurança** com helmet
- ✅ **Validação de tipos** com ParseIntPipe
- ✅ **Tratamento de exceções** global

### 4. **Configuração Segura**
- ✅ **Variáveis de ambiente** para todos os secrets
- ✅ **Configuração dinâmica** centralizada
- ✅ **Diferenciação de ambientes** (dev/prod)
- ✅ **Logs sanitizados** (dados sensíveis removidos)

### 5. **Proteção de Dados**
- ✅ **Logs sanitizados** para evitar vazamento de dados
- ✅ **Senhas não expostas** em logs
- ✅ **Tratamento seguro de erros**

## 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` baseado no `env.example`:

```bash
# Configurações do Backend
PORT=1337
HOST=localhost
NODE_ENV=development

# Configurações de Banco de Dados
DATABASE_PATH=./database/salaviewer.db

# Configurações de CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3003

# Configurações de JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Configurações de Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Configurações de Segurança
ADMIN_PASSWORD=your-secure-admin-password-here
```

## 🚨 Configurações de Produção

### **OBRIGATÓRIO para Produção:**

1. **Alterar JWT_SECRET**:
   ```bash
   JWT_SECRET=seu-jwt-secret-super-seguro-aqui
   ```

2. **Alterar ADMIN_PASSWORD**:
   ```bash
   ADMIN_PASSWORD=sua-senha-admin-super-segura-aqui
   ```

3. **Configurar NODE_ENV**:
   ```bash
   NODE_ENV=production
   ```

4. **Configurar HTTPS** (recomendado):
   - Use um proxy reverso (nginx, Apache)
   - Configure certificados SSL/TLS

## 🔍 Monitoramento de Segurança

### **Logs de Segurança**
- Tentativas de login falhadas são logadas
- Erros de autenticação são monitorados
- Rate limiting é aplicado automaticamente

### **Métricas Importantes**
- Número de tentativas de login por IP
- Erros de validação de entrada
- Tentativas de acesso não autorizado

## 🛡️ Headers de Segurança

O sistema implementa os seguintes headers de segurança:

- **Content-Security-Policy**: Previne XSS
- **X-Frame-Options**: Previne clickjacking
- **X-Content-Type-Options**: Previne MIME sniffing
- **Referrer-Policy**: Controla informações de referrer
- **X-XSS-Protection**: Proteção adicional contra XSS

## 🔐 Controle de Acesso

### **Roles Implementadas**
- **admin**: Acesso completo a todos os endpoints

### **Endpoints Protegidos**
- Todos os endpoints de `/api/salas/*` requerem autenticação + role admin
- Todos os endpoints de `/api/andares/*` requerem autenticação + role admin
- Endpoint `/api/auth/check-admin` requer autenticação

### **Endpoints Públicos**
- `POST /api/auth/local` - Login (com rate limiting)
- `GET /port-info.json` - Informações da porta

## 🚀 Deploy Seguro

### **Checklist de Deploy**
- [ ] Variáveis de ambiente configuradas
- [ ] JWT_SECRET alterado
- [ ] ADMIN_PASSWORD alterado
- [ ] NODE_ENV=production
- [ ] HTTPS configurado
- [ ] Firewall configurado
- [ ] Logs de segurança monitorados

### **Recomendações de Infraestrutura**
- Use um proxy reverso (nginx/Apache)
- Configure SSL/TLS
- Implemente backup regular do banco
- Monitore logs de segurança
- Use um WAF (Web Application Firewall)

## 🔄 Atualizações de Segurança

### **Dependências**
- Execute `npm audit` regularmente
- Mantenha dependências atualizadas
- Monitore vulnerabilidades conhecidas

### **Rotação de Secrets**
- Rotacione JWT_SECRET periodicamente
- Altere ADMIN_PASSWORD regularmente
- Monitore acessos administrativos

## 📞 Contato de Segurança

Para reportar vulnerabilidades de segurança:
- Email: security@salaviewer.com
- Use o canal de comunicação seguro

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Última atualização**: $(date)
**Versão**: 1.0.0
