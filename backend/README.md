# TalentDash Backend API

Backend RESTful API para o TalentDash - Sistema de Recrutamento Inteligente.

## Tecnologias

- **Node.js** + **Express**
- **TypeScript**
- **JSON File Database** (persistência simples em arquivo)
- **JWT** para autenticação
- **bcryptjs** para hash de senhas

## Estrutura

```
backend/
├── src/
│   ├── controllers/     # Lógica dos endpoints
│   ├── middleware/      # Middleware (auth, etc)
│   ├── routes/          # Definição das rotas
│   ├── types/           # Tipos TypeScript
│   ├── db.ts            # Banco de dados (JSON file)
│   └── server.ts        # Entry point
├── data/                # Pasta de dados (database.json)
├── dist/                # Código compilado
└── package.json
```

## Instalação

```bash
cd backend
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Servidor roda em: `http://localhost:3001`

## Build

```bash
npm run build
npm start
```

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Criar conta |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Dados do usuário logado |
| PUT | `/api/auth/profile` | Atualizar perfil |
| PUT | `/api/auth/plan` | Mudar plano |

### Mapeamentos (Jobs)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/jobs` | Listar mapeamentos |
| GET | `/api/jobs/:id` | Detalhes do mapeamento |
| POST | `/api/jobs` | Criar mapeamento |
| PUT | `/api/jobs/:id` | Atualizar mapeamento |
| DELETE | `/api/jobs/:id` | Excluir mapeamento |

### Candidatos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/jobs/:jobId/candidates` | Listar candidatos |
| POST | `/api/jobs/:jobId/candidates` | Adicionar candidato |
| POST | `/api/jobs/:jobId/candidates/bulk` | Adicionar múltiplos |
| GET | `/api/jobs/:jobId/candidates/:id` | Detalhes do candidato |
| PUT | `/api/jobs/:jobId/candidates/:id` | Atualizar candidato |
| DELETE | `/api/jobs/:jobId/candidates/:id` | Excluir candidato |

### Pagamentos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/payments` | Listar métodos |
| POST | `/api/payments` | Adicionar método |
| PUT | `/api/payments/:id/default` | Definir padrão |
| DELETE | `/api/payments/:id` | Remover método |

### Health Check

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Status da API |

## Autenticação

Todas as rotas protegidas requerem o header:

```
Authorization: Bearer <token>
```

O token é obtido no login ou registro.

## Banco de Dados

Os dados são persistidos em `data/database.json`:

```json
{
  "users": [],
  "jobs": [],
  "candidates": [],
  "paymentMethods": []
}
```

## Variáveis de Ambiente

```env
PORT=3001
JWT_SECRET=sua-chave-secreta
NODE_ENV=development
```

## Frontend Integration

O frontend está configurado para se conectar ao backend via:

```typescript
// .env do frontend
VITE_API_URL=http://localhost:3001/api
```
