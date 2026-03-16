# 🚀 Guia de Deploy - TalentDash Backend

## 📋 Pré-requisitos

- Conta no Railway (https://railway.app)
- Conta no GitHub (já configurada)
- PostgreSQL database (Railway fornece gratuitamente)

---

## 🎯 Deploy do Backend (3 Passos)

### Passo 1: Criar Projeto no Railway

1. Acesse https://railway.app/new
2. Clique em "Deploy from GitHub repo"
3. Selecione o repositório `gilmaraihelper-arch/talentdash`
4. Clique em "Add variables" e configure:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=sua-chave-super-secreta-minimo-32-caracteres
JWT_EXPIRES_IN=7d
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Railway preenche automaticamente
CORS_ORIGIN=https://talentdash.vercel.app,http://localhost:3000
```

### Passo 2: Adicionar Banco de Dados

1. No dashboard do projeto, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Railway criará automaticamente a variável `DATABASE_URL`

### Passo 3: Deploy Automático

1. O deploy acontece automaticamente ao fazer push para main
2. Ou clique em "Deploy" no dashboard
3. URL será gerada: `https://talentdash-api.up.railway.app`

---

## 🔄 Migrações do Banco

Após o primeiro deploy, execute as migrações:

```bash
# No Railway CLI (ou console web)
railway run npx prisma migrate deploy
```

Ou via console web:
1. Vá para a aba "Deployments"
2. Clique nos "..." do deploy atual
3. Selecione "Open Console"
4. Execute: `npx prisma migrate deploy`

---

## 🌐 Configurar Frontend

### Vercel Environment Variables

No dashboard do Vercel, adicione:

```
VITE_API_URL=https://talentdash-api.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=427520958252-kpg19h7u9jlsildmdjpcv3ma00709tct.apps.googleusercontent.com
```

### Redeploy do Frontend

O Vercel faz deploy automático ao detectar mudanças no GitHub.

---

## ✅ Verificação Pós-Deploy

### Testar Backend

```bash
# Health check
curl https://talentdash-api.up.railway.app/api/health

# Deve retornar: { "status": "ok" }
```

### Testar API

```bash
# Criar usuário
curl -X POST https://talentdash-api.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","password":"senha123","name":"Teste"}'
```

---

## 📊 Estrutura de Variáveis de Ambiente

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3001

# Database (Railway preenche automaticamente)
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=sua-chave-super-secreta-aqui
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://talentdash.vercel.app

# Google OAuth (opcional para backend)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Frontend (.env.local)

```env
VITE_API_URL=https://talentdash-api.up.railway.app/api
VITE_GOOGLE_CLIENT_ID=427520958252-kpg19h7u9jlsildmdjpcv3ma00709tct.apps.googleusercontent.com
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Database connection failed"

1. Verifique se a variável `DATABASE_URL` está configurada
2. Verifique se o PostgreSQL está rodando
3. Tente reconectar o database no Railway

### Erro: "CORS policy"

1. Verifique a variável `CORS_ORIGIN`
2. Adicione a URL do frontend exata
3. Redeploy o backend

### Erro: "JWT expired"

1. Verifique a variável `JWT_EXPIRES_IN`
2. Padrão é "7d" (7 dias)
3. Redeploy se mudar

---

## 📈 Monitoramento

### Railway Dashboard

- Logs em tempo tempo
- Métricas de CPU/Memória
- Uso de banda
- Status dos serviços

### Health Check

```bash
# Verificar status
curl https://talentdash-api.up.railway.app/api/health

# Verificar banco
curl https://talentdash-api.up.railway.app/api/health/db
```

---

## 💰 Custos Estimados (Railway)

| Recurso | Custo Mensal |
|---------|-------------|
| Backend (512MB RAM) | $5 |
| PostgreSQL (1GB) | $0 (incluído) |
| Banda (até 100GB) | $0 (incluído) |
| **Total estimado** | **$5/mês** |

*Railway tem $5 de crédito gratuito mensal para starters*

---

## 🚀 Comandos Úteis

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy manual
railway up

# Ver logs
railway logs

# Abrir console
railway run bash

# Executar migrações
railway run npx prisma migrate deploy

# Gerar cliente Prisma
railway run npx prisma generate

# Abrir Prisma Studio
railway run npx prisma studio
```

---

## 📞 Suporte

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- Discord Railway: https://discord.gg/railway

---

## ✅ Checklist de Deploy

- [ ] Projeto criado no Railway
- [ ] Repositório GitHub conectado
- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL adicionado
- [ ] Deploy realizado com sucesso
- [ ] Migrações executadas
- [ ] Health check passando
- [ ] Frontend conectado ao backend
- [ ] Testes de autenticação OK
- [ ] Testes de CRUD OK

---

**Status**: 🟡 Pronto para deploy (aguardando ação manual no Railway dashboard)

**Tempo estimado**: 10-15 minutos
