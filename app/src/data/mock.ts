import type { Job, Candidate } from '@/types';

// ============================================
// DADOS MOCKADOS PARA DEMONSTRAÇÃO
// ============================================

// Vaga de exemplo: Desenvolvedor Frontend
export const mockJobFrontend: Job = {
  id: 'job-1',
  name: 'Desenvolvedor Frontend React',
  plan: 'pro',
  companyLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
  createdAt: new Date('2024-01-15'),
  template: 'ti',
  dashboardModel: 'analitico',
  colorTheme: 'blue',
  description: 'Processo seletivo para desenvolvedor frontend especializado em React',
  customFields: [
    {
      id: 'cf-1',
      name: 'Anos de experiência',
      type: 'number',
      icon: 'Briefcase',
      visibility: { card: false, table: true, detail: true },
    },
    {
      id: 'cf-2',
      name: 'Nível de Inglês',
      type: 'select',
      icon: 'Globe',
      visibility: { card: true, table: true, detail: true },
      options: ['Básico', 'Intermediário', 'Avançado', 'Fluente'],
    },
    {
      id: 'cf-3',
      name: 'Conhecimento em TypeScript',
      type: 'rating',
      icon: 'Star',
      visibility: { card: true, table: false, detail: true },
      maxRating: 5,
    },
    {
      id: 'cf-4',
      name: 'GitHub',
      type: 'link',
      icon: 'Github',
      visibility: { card: false, table: true, detail: true },
    },
    {
      id: 'cf-5',
      name: 'Disponibilidade para remoto',
      type: 'boolean',
      icon: 'CheckCircle',
      visibility: { card: true, table: true, detail: true },
    },
  ],
};

// Vaga de exemplo: Product Designer
export const mockJobDesigner: Job = {
  id: 'job-2',
  name: 'Product Designer Senior',
  plan: 'advanced',
  companyLogo: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=100&h=100&fit=crop',
  createdAt: new Date('2024-02-01'),
  template: 'ti',
  dashboardModel: 'padrao',
  colorTheme: 'purple',
  description: 'Vaga para designer sênior com experiência em produtos digitais',
  customFields: [
    {
      id: 'cf-1',
      name: 'Anos de experiência',
      type: 'number',
      icon: 'Briefcase',
      visibility: { card: false, table: true, detail: true },
    },
    {
      id: 'cf-2',
      name: 'Portfólio',
      type: 'link',
      icon: 'Palette',
      visibility: { card: false, table: true, detail: true },
    },
    {
      id: 'cf-3',
      name: 'Domínio do Figma',
      type: 'rating',
      icon: 'Star',
      visibility: { card: true, table: false, detail: true },
      maxRating: 5,
    },
    {
      id: 'cf-4',
      name: 'Experiência com Design System',
      type: 'boolean',
      icon: 'CheckCircle',
      visibility: { card: true, table: true, detail: true },
    },
    {
      id: 'cf-5',
      name: 'Nível de Inglês',
      type: 'select',
      icon: 'Globe',
      visibility: { card: false, table: true, detail: true },
      options: ['Básico', 'Intermediário', 'Avançado', 'Fluente'],
    },
    {
      id: 'cf-6',
      name: 'Habilidade com Prototipagem',
      type: 'rating',
      icon: 'Star',
      visibility: { card: true, table: false, detail: true },
      maxRating: 5,
    },
  ],
};

// Candidatos mockados para Desenvolvedor Frontend
export const mockCandidatesFrontend: Candidate[] = [
  {
    id: 'cand-1',
    jobId: 'job-1',
    nome: 'Ana Carolina Silva',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 28,
    cidade: 'São Paulo, SP',
    curriculo: 'https://example.com/cv-ana.pdf',
    pretensaoSalarial: 8500,
    salarioAtual: 6500,
    status: 'entrevista',
    observacoes: 'Excelente conhecimento em React e TypeScript. Comunicação clara e objetiva.',
    customFields: {
      'cf-1': 4,
      'cf-2': 'Avançado',
      'cf-3': 5,
      'cf-4': 'https://github.com/anacarolina',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'cand-2',
    jobId: 'job-1',
    nome: 'Bruno Mendes Costa',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 32,
    cidade: 'Rio de Janeiro, RJ',
    curriculo: 'https://example.com/cv-bruno.pdf',
    pretensaoSalarial: 12000,
    salarioAtual: 10000,
    status: 'teste',
    observacoes: 'Sênior com experiência em grandes projetos. Teste técnico agendado.',
    customFields: {
      'cf-1': 8,
      'cf-2': 'Fluente',
      'cf-3': 5,
      'cf-4': 'https://github.com/brunomendes',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: 'cand-3',
    jobId: 'job-1',
    nome: 'Carla Oliveira Santos',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 25,
    cidade: 'Belo Horizonte, MG',
    curriculo: 'https://example.com/cv-carla.pdf',
    pretensaoSalarial: 6000,
    salarioAtual: 4500,
    status: 'triagem',
    observacoes: 'Plena em transição de carreira. Perfil promissor.',
    customFields: {
      'cf-1': 3,
      'cf-2': 'Intermediário',
      'cf-3': 4,
      'cf-4': 'https://github.com/carlaoliveira',
      'cf-5': false,
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'cand-4',
    jobId: 'job-1',
    nome: 'Daniel Pereira Lima',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 30,
    cidade: 'Curitiba, PR',
    curriculo: 'https://example.com/cv-daniel.pdf',
    pretensaoSalarial: 9500,
    salarioAtual: 8000,
    status: 'offer',
    observacoes: 'Excelente fit cultural. Aguardando resposta do candidato.',
    customFields: {
      'cf-1': 6,
      'cf-2': 'Avançado',
      'cf-3': 4,
      'cf-4': 'https://github.com/danielpereira',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'cand-5',
    jobId: 'job-1',
    nome: 'Elena Rodrigues',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 27,
    cidade: 'Porto Alegre, RS',
    curriculo: 'https://example.com/cv-elena.pdf',
    pretensaoSalarial: 7500,
    salarioAtual: 6000,
    status: 'contratado',
    observacoes: 'Contratada! Início em 01/03/2024.',
    customFields: {
      'cf-1': 5,
      'cf-2': 'Intermediário',
      'cf-3': 5,
      'cf-4': 'https://github.com/elena',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: 'cand-6',
    jobId: 'job-1',
    nome: 'Felipe Andrade',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 35,
    cidade: 'São Paulo, SP',
    curriculo: 'https://example.com/cv-felipe.pdf',
    pretensaoSalarial: 15000,
    salarioAtual: 13000,
    status: 'reprovado',
    observacoes: 'Pretensão salarial acima do budget da vaga.',
    customFields: {
      'cf-1': 10,
      'cf-2': 'Fluente',
      'cf-3': 5,
      'cf-4': 'https://github.com/felipeandrade',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'cand-7',
    jobId: 'job-1',
    nome: 'Gabriela Martins',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 26,
    cidade: 'Florianópolis, SC',
    curriculo: 'https://example.com/cv-gabriela.pdf',
    pretensaoSalarial: 7000,
    salarioAtual: 5500,
    status: 'triagem',
    observacoes: 'Perfil júnior com bom potencial de crescimento.',
    customFields: {
      'cf-1': 2,
      'cf-2': 'Básico',
      'cf-3': 3,
      'cf-4': 'https://github.com/gabrielamartins',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'cand-8',
    jobId: 'job-1',
    nome: 'Henrique Souza',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 29,
    cidade: 'Brasília, DF',
    curriculo: 'https://example.com/cv-henrique.pdf',
    pretensaoSalarial: 9000,
    salarioAtual: 7500,
    status: 'entrevista',
    observacoes: 'Boa experiência com Next.js. Entrevista técnica agendada.',
    customFields: {
      'cf-1': 5,
      'cf-2': 'Avançado',
      'cf-3': 4,
      'cf-4': 'https://github.com/henriquesouza',
      'cf-5': true,
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-21'),
  },
];

// Candidatos mockados para Product Designer
export const mockCandidatesDesigner: Candidate[] = [
  {
    id: 'cand-d1',
    jobId: 'job-2',
    nome: 'Isabela Ferreira',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 31,
    cidade: 'São Paulo, SP',
    curriculo: 'https://example.com/cv-isabela.pdf',
    pretensaoSalarial: 11000,
    salarioAtual: 9000,
    status: 'entrevista',
    observacoes: 'Portfólio impressionante. Experiência em produtos B2B.',
    customFields: {
      'cf-1': 7,
      'cf-2': 'https://isabelaferreira.com',
      'cf-3': 5,
      'cf-4': true,
      'cf-5': 'Avançado',
      'cf-6': 5,
    },
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'cand-d2',
    jobId: 'job-2',
    nome: 'João Pedro Almeida',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 28,
    cidade: 'Rio de Janeiro, RJ',
    curriculo: 'https://example.com/cv-joaopedro.pdf',
    pretensaoSalarial: 8500,
    salarioAtual: 7000,
    status: 'triagem',
    observacoes: 'Designer com background em desenvolvimento.',
    customFields: {
      'cf-1': 4,
      'cf-2': 'https://joaopedro.design',
      'cf-3': 4,
      'cf-4': false,
      'cf-5': 'Intermediário',
      'cf-6': 4,
    },
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-03'),
  },
  {
    id: 'cand-d3',
    jobId: 'job-2',
    nome: 'Larissa Costa',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 33,
    cidade: 'Belo Horizonte, MG',
    curriculo: 'https://example.com/cv-larissa.pdf',
    pretensaoSalarial: 13000,
    salarioAtual: 11000,
    status: 'teste',
    observacoes: 'Sênior com experiência internacional. Teste de case em andamento.',
    customFields: {
      'cf-1': 9,
      'cf-2': 'https://larissacosta.com',
      'cf-3': 5,
      'cf-4': true,
      'cf-5': 'Fluente',
      'cf-6': 5,
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-08'),
  },
  {
    id: 'cand-d4',
    jobId: 'job-2',
    nome: 'Marcos Vinícius',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 26,
    cidade: 'Curitiba, PR',
    curriculo: 'https://example.com/cv-marcos.pdf',
    pretensaoSalarial: 6500,
    salarioAtual: 5000,
    status: 'reprovado',
    observacoes: 'Portfólio não atende aos requisitos da vaga.',
    customFields: {
      'cf-1': 3,
      'cf-2': 'https://marcosvinicius.design',
      'cf-3': 3,
      'cf-4': false,
      'cf-5': 'Básico',
      'cf-6': 3,
    },
    createdAt: new Date('2024-02-04'),
    updatedAt: new Date('2024-02-06'),
  },
  {
    id: 'cand-d5',
    jobId: 'job-2',
    nome: 'Natália Barbosa',
    email: 'ana.silva@email.com',
    telefone: '11999990001',
    idade: 30,
    cidade: 'São Paulo, SP',
    curriculo: 'https://example.com/cv-natalia.pdf',
    pretensaoSalarial: 10000,
    salarioAtual: 8500,
    status: 'offer',
    observacoes: 'Excelente apresentação do case. Negociação em andamento.',
    customFields: {
      'cf-1': 6,
      'cf-2': 'https://nataliabarbosa.com',
      'cf-3': 5,
      'cf-4': true,
      'cf-5': 'Avançado',
      'cf-6': 4,
    },
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-10'),
  },
];

// Todas as vagas mockadas
export const mockJobs: Job[] = [mockJobFrontend, mockJobDesigner];

// Todos os candidatos mockados
export const mockCandidates: Candidate[] = [
  ...mockCandidatesFrontend,
  ...mockCandidatesDesigner,
];

// Gerar planilha modelo em formato CSV bem formatado
export function generateTemplateCSV(job: Job): string {
  // BOM para suporte a caracteres especiais (UTF-8)
  const BOM = '\uFEFF';
  
  // Instruções no início do arquivo
  const instructions = [
    '# TEMPLATE TALENTDASH - IMPORTACAO DE CANDIDATOS',
    `# Vaga: ${job.name}`,
    '#',
    '# INSTRUCOES:',
    '# 1. Preencha os dados abaixo da linha de cabecalho',
    '# 2. Nao altere os nomes das colunas',
    '# 3. Para o campo Status, use apenas: triagem, entrevista, teste, offer, contratado, reprovado',
    '# 4. Para campos booleanos (Sim/Nao), use exatamente: Sim ou Nao',
    '# 5. Salve o arquivo como CSV (separado por virgulas)',
    '#',
  ];
  
  const basicHeaders = [
    'Nome',
    'Idade',
    'Cidade',
    'Curriculo_URL',
    'Pretensao_Salarial',
    'Salario_Atual',
    'Status',
    'Observacoes',
  ];
  
  const customHeaders = job.customFields.map(cf => cf.name.replace(/\s+/g, '_'));
  const allHeaders = [...basicHeaders, ...customHeaders];
  
  // Exemplo de linha com dados realistas
  const exampleRow = [
    '"João Silva"',
    '"28"',
    '"São Paulo, SP"',
    '"https://linkedin.com/in/joao-silva"',
    '"8500"',
    '"6500"',
    '"triagem"',
    '"Candidato com ótimo perfil técnico"',
    ...job.customFields.map(cf => {
      switch (cf.type) {
        case 'number': return '"5"';
        case 'rating': return '"4"';
        case 'boolean': return '"Sim"';
        case 'select': return `"${cf.options?.[0] || ''}"`;
        case 'link': return '"https://github.com/joaosilva"';
        default: return '"Experiência relevante"';
      }
    }),
  ];
  
  // Segundo exemplo
  const exampleRow2 = [
    '"Maria Santos"',
    '"32"',
    '"Rio de Janeiro, RJ"',
    '"https://linkedin.com/in/maria-santos"',
    '"12000"',
    '"9500"',
    '"entrevista"',
    '"Sênior com experiência internacional"',
    ...job.customFields.map(cf => {
      switch (cf.type) {
        case 'number': return '"8"';
        case 'rating': return '"5"';
        case 'boolean': return '"Sim"';
        case 'select': return `"${cf.options?.[1] || cf.options?.[0] || ''}"`;
        case 'link': return '"https://portfolio.com/maria"';
        default: return '"Destaque em liderança"';
      }
    }),
  ];
  
  // Linha em branco para o usuário começar a preencher
  const emptyRow = allHeaders.map(() => '""');
  
  const lines = [
    ...instructions,
    allHeaders.join(';'),
    exampleRow.join(';'),
    exampleRow2.join(';'),
    emptyRow.join(';'),
  ];
  
  return BOM + lines.join('\n');
}

// Status válidos para importação
export const VALID_STATUSES = [
  'triagem',
  'entrevista',
  'teste',
  'offer',
  'contratado',
  'reprovado',
];
