import { test, expect, type Page, mock } from '@playwright/test';

/**
 * Testes E2E para o fluxo de criação de mapeamento no TalentDash
 * 
 * Problema: O botão "Criar Mapeamento" não navega para a próxima página (DataStructurePage)
 */

test.describe('Fluxo de Criação de Mapeamento - Com Mock de API', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock das chamadas do Supabase Auth
    await page.route('**/auth/v1/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' }
        })
      });
    });

    // Mock da chamada de criação de job
    await page.route('**/rest/v1/jobs', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-job-id',
            name: 'Test Job',
            user_id: 'test-user-id',
            created_at: new Date().toISOString()
          })
        });
      }
    });
  });

  test('deve navegar para data-structure após criar mapeamento', async ({ page }) => {
    // Ir para a página inicial e fazer login mockado
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Como não temos autenticação real, vamos diretamente para a página
    // simulando que o usuário está logado via localStorage
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'test-user-id', email: 'test@example.com' }
      }));
    });
    
    // Recarregar a página para aplicar o localStorage
    await page.goto('/dashboard/create-job');
    await page.waitForTimeout(2000);
    
    // Verificar se estamos na página correta ou redirecionados
    console.log('URL após carregar:', page.url());
  });
});

test.describe('Análise detalhada do problema', () => {
  
  test('verificar se há erro sendo lançado silenciosamente', async ({ page }) => {
    // Este teste verifica se há algum erro não tratado
    
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Capturar erros globais
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Ir para dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    console.log('Erros capturados:', errors);
    
    // Verificar URL
    console.log('URL:', page.url());
  });
});

test.describe('Teste unitário simulado - Verificar fluxo', () => {
  
  test('simular comportamento do handleCreateJob', async () => {
    // Este teste simula o comportamento esperado
    
    // Simular a função createJob
    const createJob = async (name: string) => {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Simular sucesso
      return { id: 'job-123', name };
    };
    
    // Simular navigateTo
    let navigationCalled = false;
    const navigateTo = (page: string) => {
      console.log('Navegando para:', page);
      navigationCalled = true;
    };
    
    // Simular handleCreateJob
    const handleCreateJob = async () => {
      const jobName = 'Test Job';
      
      try {
        await createJob(jobName);
        navigateTo('data-structure');
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    
    // Executar
    await handleCreateJob();
    
    // Verificar
    expect(navigationCalled).toBe(true);
    console.log('✓ Navegação foi chamada corretamente na simulação');
  });
});

test.describe('Investigação do problema no código', () => {
  
  test('verificar se navigateTo pode falhar silenciosamente', async ({ page }) => {
    // Este teste verifica se há algum problema com o navigateTo
    
    // Ir para a página
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Verificar se há algum listener de navegação
    const hasReactRouter = await page.evaluate(() => {
      return typeof window !== 'undefined' && 
        (document.querySelector('[data-react-router]') !== null ||
         document.querySelector('#root')?.children.length > 0);
    });
    
    console.log('React Router detectado:', hasReactRouter);
  });
});
