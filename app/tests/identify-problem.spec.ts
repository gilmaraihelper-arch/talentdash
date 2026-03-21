import { test, expect, type Page } from '@playwright/test';

/**
 * Testes E2E para identificar o problema de navegação
 * 
 * PROBLEMA: Botão "Criar Mapeamento" não navega para DataStructurePage
 */

test.describe('Identificação do Problema de Navegação', () => {
  
  test('verificar se navigateTo está no bloco try correto', async () => {
    const fs = await import('fs');
    const content = fs.readFileSync('./src/sections/CreateJobPage.tsx', 'utf-8');
    
    // Encontrar a função handleCreateJob
    const startIndex = content.indexOf('const handleCreateJob');
    const endIndex = content.indexOf('\n  };', startIndex + 50);
    const functionContent = content.substring(startIndex, endIndex);
    
    console.log('=== Função handleCreateJob ===');
    console.log(functionContent);
    console.log('==============================');
    
    // Verificar posições relativas
    const tryIndex = functionContent.indexOf('try {');
    const catchIndex = functionContent.indexOf('catch');
    const createJobIndex = functionContent.indexOf('await createJob(');
    const navigateIndex = functionContent.indexOf("navigateTo('data-structure')");
    
    console.log('\nPosições no código:');
    console.log('- try:     ', tryIndex);
    console.log('- catch:   ', catchIndex);
    console.log('- createJob:', createJobIndex);
    console.log('- navigate: ', navigateIndex);
    
    // Verificar se navigateTo está entre try e catch
    const inTryBlock = tryIndex >= 0 && catchIndex > tryIndex && 
                       navigateIndex > tryIndex && navigateIndex < catchIndex;
    
    console.log('\n- navigateTo dentro do bloco try:', inTryBlock);
    
    // O código parece estar correto
    expect(inTryBlock).toBe(true);
  });
  
  test('verificar possível problema com createJob retornando erro', async () => {
    // O problema pode ser que createJob está falhando
    // Vamos verificar se há alguma condição que pode causar falha
    
    const fs = await import('fs');
    const useJobsContent = fs.readFileSync('./src/hooks/useJobs.ts', 'utf-8');
    
    // Encontrar a função createJob
    const startIndex = useJobsContent.indexOf('const createJob = useCallback(');
    const nextFunction = useJobsContent.indexOf('\n  const ', startIndex + 10);
    const endIndex = nextFunction > 0 ? nextFunction : useJobsContent.length;
    const functionContent = useJobsContent.substring(startIndex, endIndex);
    
    console.log('=== Função createJob em useJobs ===');
    console.log(functionContent.substring(0, 1000));
    console.log('=====================================');
    
    // Verificar se há algum problema no fluxo
    const hasUserIdCheck = functionContent.includes('if (!state.user?.id)');
    const hasErrorHandling = functionContent.includes('throw err');
    const hasReturn = functionContent.includes('return jobWithCamel');
    
    console.log('\nVerificações:');
    console.log('- Verifica userId:', hasUserIdCheck);
    console.log('- Lança erros:', hasErrorHandling);
    console.log('- Retorna job:', hasReturn);
  });
  
  test('verificar se jobData está sendo passado corretamente', async () => {
    // O problema pode estar nos dados sendo passados para createJob
    
    const fs = await import('fs');
    const content = fs.readFileSync('./src/sections/CreateJobPage.tsx', 'utf-8');
    
    // Encontrar a chamada de createJob
    const callStart = content.indexOf('await createJob(');
    const callEnd = content.indexOf('});', callStart) + 2;
    const callContent = content.substring(callStart, callEnd);
    
    console.log('=== Chamada de createJob ===');
    console.log(callContent);
    console.log('=============================');
    
    // Verificar os parâmetros
    const hasName = callContent.includes('jobInfo.jobName.trim()');
    const hasPlan = callContent.includes('selectedPlan');
    const hasCustomFields = callContent.includes('customFields');
    const hasOptions = callContent.includes('template:') || 
                       callContent.includes('dashboardModel:') ||
                       callContent.includes('colorTheme:');
    
    console.log('\nParâmetros:');
    console.log('- name:', hasName);
    console.log('- plan:', hasPlan);
    console.log('- customFields:', hasCustomFields);
    console.log('- options:', hasOptions);
  });
});

test.describe('Sugestão de Correção', () => {
  
  test('documentar correção recomendada', async () => {
    console.log(`
============================================================
RECOMENDAÇÃO DE CORREÇÃO:
============================================================

O código atual parece estar correto, mas há possíveis problemas:

1. VERIFICAR SE createJob ESTÁ FALHANDO
   - Adicione console.log antes e depois do await createJob
   - Verifique se há erros no console do navegador
   - Verifique a aba Network para ver a resposta da API

2. POSSÍVEL CORREÇÃO:
   No arquivo src/sections/CreateJobPage.tsx, modificar:

   const handleCreateJob = async () => {
     if (!jobInfo.jobName.trim()) return;

     setIsCreating(true);

     try {
       console.log('Iniciando criação do job...');
       
       await createJob(jobInfo.jobName.trim(), selectedPlan, customFields, {
         template: selectedTemplate,
         dashboardModel: selectedDashboardModel,
         colorTheme: selectedColorTheme,
         description: jobInfo.jobDescription,
       });
       
       console.log('Job criado com sucesso, navegando...');
       navigateTo('data-structure');
     } catch (error) {
       const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
       console.error('Erro ao criar mapeamento:', errMsg);
       alert('Erro ao criar: ' + errMsg);  // Este alert está sendo mostrado?
     } finally {
       setIsCreating(false);
     }
   };

3. VERIFICAR SE O ALERT ESTÁ SENDO MOSTRADO
   - Se o alert "Erro ao criar: ..." aparece, o problema é na API
   - Se não aparece nada, o navigateTo pode estar falhando

4. VERIFICAR SUPABASE
   - RLS policies podem estar bloqueando a inserção
   - Verificar se a tabela 'jobs' tem as permissões corretas

============================================================
`);
  });
});
