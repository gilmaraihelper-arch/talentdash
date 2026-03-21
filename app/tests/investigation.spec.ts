import { test, expect, type Page } from '@playwright/test';

/**
 * Testes E2E para o fluxo de criação de mapeamento no TalentDash
 * 
 * PROBLEMA: O botão "Criar Mapeamento" não navega para a próxima página (DataStructurePage)
 * 
 * Estes testes documentam o problema e verificam o comportamento esperado.
 */

test.describe('Fluxo Completo de Criação de Mapeamento', () => {
  
  /**
   * Teste principal que verifica a criação de mapeamento
   * Este teste requer autenticação real ou mock
   */
  test('deve criar mapeamento e navegar para data-structure', async ({ page }) => {
    // Setup: fazer login (se possível)
    // Nota: Em ambiente de teste, isso requer credenciais reais
    
    // Ir para página de login
    await page.goto('/login');
    await page.waitForTimeout(1000);
    
    // Verificar se a página de login carregou
    await expect(page.getByText('Entrar')).toBeVisible();
    
    // O teste seria:
    // 1. Preencher email e senha
    // 2. Clicar em entrar
    // 3. Navegar para /dashboard/create-job
    // 4. Preencher as etapas
    // 5. Clicar em "Criar Mapeamento"
    // 6. Verificar se navegou para /dashboard/data-structure
    
    console.log('Este teste requer credenciais de login para executar completamente');
    test.skip();
  });
});

test.describe('Verificação de Elementos UI', () => {
  
  test('verificar elementos da página CreateJobPage', async ({ page }) => {
    // Ir para página diretamente
    await page.goto('/dashboard/create-job');
    await page.waitForTimeout(2000);
    
    // Deve redirecionar para login
    const url = page.url();
    console.log('URL atual:', url);
    
    // Verificar elementos da página de login
    if (url.includes('/login')) {
      await expect(page.getByRole('heading', { name: /entrar/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/senha/i)).toBeVisible();
    }
  });
});

test.describe('Análise do Problema de Navegação', () => {
  
  /**
   * Este teste documenta o problema reportado:
   * "quando clica no botão 'Criar Mapeamento' não navega para a próxima página"
   */
  test('DOCUMENTAÇÃO: Problema reportado pelo usuário', async () => {
    // O problema foi reportado pelo usuário:
    // - Botão "Criar Mapeamento" está em CreateJobPage.tsx
    // - Deve navegar para DataStructurePage após criação bem-sucedida
    // - Função handleCreateJob chama createJob() que retorna uma Promise
    // - Se bem-sucedida, chama navigateTo('data-structure')
    
    console.log('='.repeat(50));
    console.log('PROBLEMA DOCUMENTADO:');
    console.log('- Página: CreateJobPage.tsx');
    console.log('- Botão: "Criar Mapeamento"');
    console.log('- Ação esperada: Navegar para data-structure após sucesso');
    console.log('- Ação atual: Não navega');
    console.log('='.repeat(50));
    
    // Análise do código:
    // A função handleCreateJob está em CreateJobPage.tsx linhas 282-302
    // Ela chama:
    //   await createJob(...) 
    //   navigateTo('data-structure')
    // 
    // O problema pode ser:
    // 1. createJob() está lançando erro silencioso
    // 2. navigateTo() não está funcionando
    // 3. Algum problema de race condition
    
    const fs = await import('fs');
    const content = fs.readFileSync('./src/sections/CreateJobPage.tsx', 'utf-8');
    
    // Verificar estrutura do código
    const hasCorrectFlow = content.includes('await createJob(') && 
                          content.includes("navigateTo('data-structure')");
    
    console.log('\nAnálise do código:');
    console.log('- Fluxo correto (await + navigateTo):', hasCorrectFlow);
    
    // Verificar se o navigateTo está no lugar certo
    const navigateMatch = content.match(/navigateTo\(['"]data-structure['"]\)/);
    if (navigateMatch) {
      const index = content.indexOf(navigateMatch[0]);
      const beforeMatch = content.substring(0, index);
      const afterMatch = content.substring(index);
      
      const hasAwaitBefore = beforeMatch.includes('await createJob');
      const isInTryBlock = beforeMatch.split('catch').length > beforeMatch.split('try').length ? 
        beforeMatch.lastIndexOf('try') < beforeMatch.lastIndexOf('await createJob') : false;
      
      console.log('- await antes do navigateTo:', hasAwaitBefore);
      console.log('- navigateTo no bloco try:', isInTryBlock);
    }
    
    // O código parece estar correto
    // O problema pode estar na implementação do createJob ou navigateTo
    console.log('\nPossíveis causas do problema:');
    console.log('1. createJob() pode estar falhando silenciosamente');
    console.log('2. O erro pode não ser exibido ao usuário');
    console.log('3. Pode haver problema de RLS no Supabase');
    console.log('4. Pode haver problema de rede');
    
    expect(hasCorrectFlow).toBe(true);
  });
  
  test('verificar implementação do navigateTo no useStore', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('./src/hooks/useStore.ts', 'utf-8');
    
    // Verificar implementação do navigateTo
    const hasNavigateImport = content.includes("from 'react-router-dom'");
    const hasNavigateFunction = content.includes('const navigate = useNavigate()');
    const hasNavigateTo = content.includes('const navigateTo');
    
    console.log('\nAnálise do useStore.ts:');
    console.log('- Import de useNavigate:', hasNavigateImport);
    console.log('- Função navigate:', hasNavigateFunction);
    console.log('- Função navigateTo:', hasNavigateTo);
    
    // Verificar se navigateTo usa navigate corretamente
    const navigateToMatch = content.match(/const navigateTo = useCallback\(\([^)]*\) => \{[\s\S]*?navigate\([^)]*\)/);
    if (navigateToMatch) {
      console.log('- navigateTo chama navigate: OK');
    }
    
    expect(hasNavigateTo).toBe(true);
  });
  
  test('verificar implementação do createJob no useJobs', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('./src/hooks/useJobs.ts', 'utf-8');
    
    // Verificar implementação do createJob
    const hasCreateJob = content.includes('const createJob = useCallback(');
    const hasSetState = content.includes('setState');
    const hasThrow = content.includes('throw err');
    
    console.log('\nAnálise do useJobs.ts:');
    console.log('- Função createJob:', hasCreateJob);
    console.log('- setState para jobs:', hasSetState);
    console.log('- Lança erros:', hasThrow);
    
    // Verificar se o erro está sendo jogado corretamente
    const createJobSection = content.match(/const createJob = useCallback\(async[\s\S]*?^  \},/m);
    if (createJobSection) {
      const section = createJobSection[0];
      const hasReturnJob = section.includes('return jobWithCamel');
      const hasCatchThrow = section.includes('throw err');
      
      console.log('- Retorna job criado:', hasReturnJob);
      console.log('- Lança erro no catch:', hasCatchThrow);
    }
    
    expect(hasCreateJob).toBe(true);
  });
});

test.describe('Recomendações para Debug', () => {
  
  test('listar passos para reproduzir e corrigir o problema', async () => {
    console.log('\n' + '='.repeat(60));
    console.log('PASSOS PARA REPRODUZIR O PROBLEMA:');
    console.log('='.repeat(60));
    console.log('1. Fazer login no TalentDash');
    console.log('2. Ir para Dashboard');
    console.log('3. Clicar em "Criar Novo Mapeamento"');
    console.log('4. Preencher as etapas:');
    console.log('   - Template (escolher um)');
    console.log('   - Informações (nome e descrição)');
    console.log('   - Critérios (opcional)');
    console.log('   - Dashboard (modelo e tema)');
    console.log('5. Chegar na etapa de Revisão');
    console.log('6. Clicar em "Criar Mapeamento"');
    console.log('7. Observar: Não navega para data-structure');
    console.log('');
    console.log('='.repeat(60));
    console.log('POSSÍVEIS CORREÇÕES:');
    console.log('='.repeat(60));
    console.log('1. Adicionar console.log para debug:');
    console.log('   - console.log("Antes de createJob")');
    console.log('   - console.log("Após createJob")');
    console.log('   - console.log("Navegando...")');
    console.log('');
    console.log('2. Verificar erros no console do navegador');
    console.log('');
    console.log('3. Verificar Network tab para ver se API调用成功');
    console.log('');
    console.log('4. Verificar RLS policies do Supabase');
    console.log('');
    console.log('5. Verificar se há erro sendo capturado no catch');
    console.log('='.repeat(60));
  });
});
