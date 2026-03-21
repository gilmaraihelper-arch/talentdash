# Testes E2E do TalentDash

## Problema Reportado

O botão "Criar Mapeamento" na página CreateJobPage não navega para a página DataStructurePage após a criação bem-sucedida de um mapeamento.

## Estrutura dos Testes

```
tests/
├── createJob.spec.ts       # Testes básicos do fluxo de criação
├── debug.spec.ts           # Testes de debug
├── identify-problem.spec.ts # Análise do problema
├── investigation.spec.ts   # Investigação detalhada
└── README.md               # Este arquivo
```

## Como Executar os Testes

### Rodar todos os testes:
```bash
npm run test:e2e
# ou
npx playwright test
```

### Rodar testes específicos:
```bash
# Testes de análise de código
npx playwright test "identify-problem.spec.ts"

# Testes de investigação
npx playwright test "investigation.spec.ts"
```

## Resultados da Análise

### Código Atual
O código em `CreateJobPage.tsx` está estruturado corretamente:

```typescript
const handleCreateJob = async () => {
  if (!jobInfo.jobName.trim()) return;
  setIsCreating(true);
  
  try {
    await createJob(...);  // Chama a API
    navigateTo('data-structure');  // Navega após sucesso
  } catch (error) {
    // Trata erro
  } finally {
    setIsCreating(false);
  }
};
```

### Possíveis Causas do Problema

1. **Erro na API do Supabase**: A chamada `createJob` pode estar falhando silenciosamente
2. **RLS Policies**: Políticas de segurança do Supabase podem estar bloqueando a inserção
3. **Problema de rede**: Algum problema de conexão
4. **Race condition**: Algum problema com o estado do React

## Logs Adicionados

Para debug, foram adicionados logs em:

1. `src/sections/CreateJobPage.tsx` - Logs de início, sucesso e erro
2. `src/lib/supabase.ts` - Logs de requisição e resposta

Para verificar os logs:
1. Abra o navegador (F12)
2. Vá para a aba Console
3. Execute o fluxo de criação de mapeamento
4. Procure por mensagens com prefixo `[CreateJobPage]` ou `[Supabase]`

## Como Testar Manualmente

1. Faça login no TalentDash
2. Vá para o Dashboard
3. Clique em "Criar Novo Mapeamento"
4. Preencha as etapas:
   - Template (escolha um)
   - Informações (nome e descrição)
   - Critérios (opcional)
   - Dashboard (modelo e tema)
5. Chegue na etapa de Revisão
6. Clique em "Criar Mapeamento"
7. Verifique no console se há algum erro
8. Observe se a URL muda para `/dashboard/data-structure`

## Possíveis Soluções

### 1. Se o erro está sendo mostrado (alert)
- Verificar as RLS policies do Supabase
- Verificar se a tabela 'jobs' tem as permissões corretas

### 2. Se não há erro mas não navega
- Verificar se `navigateTo` está funcionando
- Verificar se há algum redirecionamento happening

### 3. Correção de Código
Se o problema for no código, uma possível correção seria:

```typescript
const handleCreateJob = async () => {
  if (!jobInfo.jobName.trim()) return;

  setIsCreating(true);

  try {
    console.log('Iniciando criação do job...');
    
    const result = await createJob(jobInfo.jobName.trim(), selectedPlan, customFields, {
      template: selectedTemplate,
      dashboardModel: selectedDashboardModel,
      colorTheme: selectedColorTheme,
      description: jobInfo.jobDescription,
    });
    
    console.log('Job criado:', result);
    
    // Verificar se o job foi realmente criado
    if (result && result.id) {
      console.log('Navegando para data-structure...');
      navigateTo('data-structure');
    } else {
      console.error('Job não foi criado corretamente');
      alert('Erro: Job não foi criado');
    }
  } catch (error) {
    console.error('Erro ao criar mapeamento:', error);
    alert('Erro ao criar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
  } finally {
    setIsCreating(false);
  }
};
```

## Contato

Se você encontrar o problema, por favor, documente:
1. O que aparece no console do navegador
2. Se há algum erro no Network tab
3. Se o alert de erro aparece ou não
