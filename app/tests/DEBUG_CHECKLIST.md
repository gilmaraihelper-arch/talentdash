# Check de Debug - Problema de Navegação

## Executando o Debug

Para identificar o problema, siga estes passos:

### 1. Prepare o Ambiente
```bash
cd /Users/gilmarai/Developer/talentdash/app
npm run dev
```

### 2. Abra o Navegador
1. Abra o Chrome/Edge em `http://localhost:5173`
2. Abra o DevTools (F12)
3. Vá para a aba **Console**

### 3. Faça Login
- Entre com sua conta Google ou email/senha

### 4. Reproduza o Problema
1. No Dashboard, clique em **"Criar Novo Mapeamento"**
2. Preencha as etapas:
   - **Template**: Escolha qualquer um
   - **Informações**: Nome = "Teste Debug", Descrição = "Teste"
   - **Critérios**: Pode pular
   - **Dashboard**: Pode pular
3. Chegue na etapa de **Revisão**
4. Clique no botão **"Criar Mapeamento"**

### 5. Observe o Console

**Se aparecerem estas mensagens:**
```
[CreateJobPage] Iniciando criação do job...
[CreateJobPage] Nome: Teste Debug
[Supabase] Criando job com dados: {...}
[Supabase] Job criado com sucesso: {...}
[CreateJobPage] Job criado com sucesso: {...}
[CreateJobPage] Navegando para data-structure...
```
✅ O código está funcionando corretamente!

**Se aparecer algum erro:**
```
[CreateJobPage] Erro ao criar mapeamento: {erro}
```
❌ O problema está na API do Supabase

**Se não aparecer nada no console:**
❌ O problema pode estar no clique do botão ou no React

### 6. Verifique a Network Tab
No DevTools, aba **Network**:
- Filtre por `jobs` ou `rest`
- Veja se há uma requisição POST para a tabela `jobs`
- Verifique o status da resposta

## Possíveis Soluções

### Se o erro for de RLS (Row Level Security):
1. Vá no painel do Supabase
2. Tables > jobs > Policies
3. Verifique se há políticas de INSERT para usuários autenticados

### Se for erro de rede:
1. Verifique a conexão com a internet
2. Verifique se o Supabase está online

### Se não houver erro mas não navegar:
Pode haver um problema no `navigateTo`. Verifique:
1. Se há algum redirecionamento happening
2. Se a URL muda no navegador

## Contato

Após identificar o problema, entre em contato com:
- Prints do console
- Prints da Network tab
- Mensagem de erro (se houver)
