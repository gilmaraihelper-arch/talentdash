import { 
  ArrowLeft, 
  Download, 
  Users, 
  FileSpreadsheet, 
  Table,
  LayoutGrid,
  Eye,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BASIC_FIELDS } from '@/types';
import { generateTemplateCSV } from '@/data/mock';
import { InfoBox, Stepper } from '@/components/ui/custom';
import type { Store } from '@/hooks/useStore';

interface DataStructurePageProps {
  store: Store;
}

const nextSteps = [
  { id: 'download', title: 'Baixar Template', description: 'Planilha modelo' },
  { id: 'import', title: 'Importar Dados', description: 'Carregue candidatos' },
  { id: 'dashboard', title: 'Visualizar', description: 'Veja insights' },
];

export function DataStructurePage({ store }: DataStructurePageProps) {
  const { navigateTo, state, isLoading } = store;
  const job = state.selectedJob;
  
  // Aguarda o estado do React ser atualizado antes de redirecionar,
  // evitando redirect prematuro logo após createJob (setState é assíncrono)
  if (!job && isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Criando mapeamento...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    navigateTo('create-job');
    return null;
  }
  
  const handleDownloadTemplate = () => {
    const csv = generateTemplateCSV(job);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `template-${job.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
  };
  
  const allFields = [
    ...BASIC_FIELDS.map(f => ({ ...f, isBasic: true })),
    ...(job.customFields || []).map(f => ({ ...f, isBasic: false })),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigateTo('create-job')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Preparar Visualização</h1>
                <p className="text-sm text-slate-500">{job.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Mapeamento criado com sucesso! 🎉
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Seu mapeamento <strong>"{job.name}"</strong> está configurado e pronto para receber dados.
            Siga os passos abaixo para visualizar seus candidatos.
          </p>
        </div>

        {/* Próximos Passos */}
        <div className="mb-10">
          <Stepper steps={nextSteps} currentStep={0} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Download Template */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Passo 1: Baixar Planilha Modelo</CardTitle>
              <CardDescription>
                Baixe uma planilha CSV com todas as colunas configuradas 
                para importação em massa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoBox type="info">
                A planilha já vem com todas as colunas configuradas conforme seus critérios de análise. 
                Basta preencher e importar para visualizar!
              </InfoBox>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDownloadTemplate}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Template CSV
              </Button>
            </CardContent>
          </Card>

          {/* Add Candidates */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Passo 2: Importar Dados</CardTitle>
              <CardDescription>
                Carregue seus candidatos manualmente ou via planilha 
                para começar a visualizar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoBox type="tip">
                Você pode adicionar candidatos um a um ou importar vários de uma vez usando a planilha.
              </InfoBox>
              <Button 
                className="w-full"
                onClick={() => navigateTo('add-candidates')}
              >
                <Users className="w-4 h-4 mr-2" />
                Importar Candidatos
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview da Estrutura */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-slate-500" />
              <CardTitle>Estrutura dos Dados</CardTitle>
            </div>
            <CardDescription>
              Veja como seus dados serão organizados para visualização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InfoBox type="info" className="mb-4">
              Esta é a estrutura que será usada na planilha. 
              Cada coluna representa um critério que você configurou para análise.
            </InfoBox>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Coluna</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Visibilidade</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-slate-500">Exemplo</th>
                  </tr>
                </thead>
                <tbody>
                  {allFields.map((field) => (
                    <tr key={field.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {field.isBasic && (
                            <Badge variant="secondary" className="text-xs">Básico</Badge>
                          )}
                          {!field.isBasic && (
                            <Badge className="text-xs bg-purple-100 text-purple-700">Personalizado</Badge>
                          )}
                          <span className="font-medium">{field.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize text-xs">
                          {field.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          {field.visibility.table && (
                            <span className="flex items-center gap-1" title="Visível na tabela">
                              <Table className="w-4 h-4" />
                            </span>
                          )}
                          {field.visibility.card && (
                            <span className="flex items-center gap-1" title="Visível no card">
                              <LayoutGrid className="w-4 h-4" />
                            </span>
                          )}
                          {field.visibility.detail && (
                            <span className="flex items-center gap-1" title="Visível no detalhe">
                              <Eye className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {field.id === 'status' && 'triagem, entrevista, teste, offer, contratado, reprovado'}
                        {field.type === 'text' && 'Texto livre'}
                        {field.type === 'number' && '1234'}
                        {field.type === 'rating' && '⭐⭐⭐⭐⭐'}
                        {field.type === 'select' && field.options?.join(', ')}
                        {field.type === 'boolean' && 'Sim / Não'}
                        {field.type === 'link' && 'https://...'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dicas de Importação */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <InfoBox type="tip" title="Dica de Importação">
            <p className="mb-2">Ao preencher a planilha, use os valores exatos para o campo Status:</p>
            <code className="bg-blue-100 px-2 py-1 rounded text-xs block">
              triagem, entrevista, teste, offer, contratado, reprovado
            </code>
          </InfoBox>

          <InfoBox type="info" title="Campos Booleanos">
            <p>Para campos Sim/Não, use:</p>
            <p className="mt-1"><strong>Sim</strong> ou <strong>Não</strong> (com capitalização)</p>
          </InfoBox>
        </div>

        {/* CTA Final */}
        <div className="mt-10 text-center">
          <p className="text-slate-600 mb-4">
            Pronto para visualizar? Importe seus candidatos!
          </p>
          <Button 
            size="lg"
            onClick={() => navigateTo('add-candidates')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Users className="w-5 h-5 mr-2" />
            Cadastrar Candidatos
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
}
