import { useState } from 'react';
import { 
  GripVertical, 
  X, 
  Settings, 
  Plus,
  Save,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  BarChart3,
  PieChart,
  Users,
  TrendingUp,
  Check,
  DollarSign,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type WidgetType = 
  | 'kpi-total' 
  | 'kpi-entrevista' 
  | 'kpi-contratados' 
  | 'kpi-media-salarial'
  | 'chart-funnel'
  | 'chart-pie'
  | 'chart-bar'
  | 'candidate-list'
  | 'candidate-cards';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  config?: Record<string, any>;
}

interface DashboardEditorProps {
  widgets: DashboardWidget[];
  onWidgetsChange: (widgets: DashboardWidget[]) => void;
  isEditing: boolean;
  onSave: () => void;
  renderWidget: (widget: DashboardWidget) => React.ReactNode;
}

const WIDGET_TEMPLATES: { type: WidgetType; title: string; size: DashboardWidget['size']; icon: any; description: string }[] = [
  { type: 'kpi-total', title: 'Total de Candidatos', size: 'small', icon: Users, description: 'Mostra o total de candidatos no processo' },
  { type: 'kpi-entrevista', title: 'Em Entrevista', size: 'small', icon: TrendingUp, description: 'Candidatos na fase de entrevistas' },
  { type: 'kpi-contratados', title: 'Contratados', size: 'small', icon: Check, description: 'Total de contratações realizadas' },
  { type: 'kpi-media-salarial', title: 'Média Salarial', size: 'small', icon: DollarSign, description: 'Pretensão salarial média' },
  { type: 'chart-funnel', title: 'Funil do Processo', size: 'medium', icon: BarChart3, description: 'Gráfico de barras com distribuição por etapa' },
  { type: 'chart-pie', title: 'Distribuição', size: 'medium', icon: PieChart, description: 'Gráfico de pizza com status dos candidatos' },
  { type: 'candidate-list', title: 'Lista de Candidatos', size: 'full', icon: List, description: 'Lista detalhada em formato de tabela' },
  { type: 'candidate-cards', title: 'Cards de Candidatos', size: 'full', icon: LayoutGrid, description: 'Cards visuais dos candidatos' },
];

const SIZE_CLASSES = {
  small: 'col-span-1',
  medium: 'col-span-1 lg:col-span-2',
  large: 'col-span-1 lg:col-span-3',
  full: 'col-span-1 lg:col-span-4 xl:col-span-5',
};

const SIZE_LABELS = {
  small: 'Pequeno (1 col)',
  medium: 'Médio (2 cols)',
  large: 'Grande (3 cols)',
  full: 'Completo (4+ cols)',
};

export function DashboardEditor({
  widgets,
  onWidgetsChange,
  isEditing,
  onSave,
  renderWidget,
}: DashboardEditorProps) {
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleAddWidget = (template: typeof WIDGET_TEMPLATES[0]) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: template.type,
      title: template.title,
      size: template.size,
    };
    
    onWidgetsChange([...widgets, newWidget]);
    setShowAddWidget(false);
  };

  const handleRemoveWidget = (widgetId: string) => {
    onWidgetsChange(widgets.filter(w => w.id !== widgetId));
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar o dashboard para o padrão?')) {
      onWidgetsChange(getDefaultWidgets());
    }
  };

  const handleSizeChange = (widgetId: string, newSize: DashboardWidget['size']) => {
    onWidgetsChange(widgets.map(w => 
      w.id === widgetId ? { ...w, size: newSize } : w
    ));
  };

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    const index = widgets.findIndex(w => w.id === widgetId);
    if (index === -1) return;
    
    const newWidgets = [...widgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newWidgets.length) return;
    
    [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
    onWidgetsChange(newWidgets);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggingId(widgetId);
    e.dataTransfer.effectAllowed = 'move';
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    e.dataTransfer.setDragImage(el, rect.width / 2, 30);
  };

  const handleDragOver = (e: React.DragEvent, _widgetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }

    const draggedIndex = widgets.findIndex(w => w.id === draggingId);
    const targetIndex = widgets.findIndex(w => w.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggingId(null);
      return;
    }
    
    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);
    
    onWidgetsChange(newWidgets);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Toolbar */}
      {isEditing && (
        <div className="bg-slate-900 text-white px-4 lg:px-8 py-3 flex items-center justify-between shrink-0 shadow-lg">
          <div className="flex items-center gap-4">
            <Badge className="bg-amber-500 text-white border-0">
              <Settings className="w-3 h-3 mr-1" />
              Modo Edição
            </Badge>
            <span className="text-sm text-slate-400 hidden sm:inline">
              Arraste para reordenar • Clique nos 3 pontos para configurar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddWidget(true)}
              className="text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Resetar</span>
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Save className="w-4 h-4 mr-1" />
              Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="flex-1 overflow-auto px-4 lg:px-8 py-4 bg-slate-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {widgets.map((widget, index) => (
            <div 
              key={widget.id} 
              className={cn(
                SIZE_CLASSES[widget.size],
                "transition-all duration-200",
                draggingId === widget.id && "opacity-50 scale-95",
                isEditing && "cursor-move"
              )}
              draggable={isEditing}
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDrop={(e) => handleDrop(e, widget.id)}
              onDragEnd={handleDragEnd}
            >
              <Card 
                className={cn(
                  "h-full overflow-hidden transition-all duration-200",
                  isEditing 
                    ? "shadow-lg ring-2 ring-amber-400/60 hover:ring-amber-400" 
                    : "shadow-sm hover:shadow-md"
                )}
              >
                {/* Widget Header */}
                <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between space-y-0 border-b bg-slate-50/50">
                  <div className="flex items-center gap-2 min-w-0">
                    {isEditing && (
                      <div className="p-1 rounded hover:bg-slate-200 transition-colors">
                        <GripVertical className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-700 truncate">{widget.title}</span>
                  </div>
                  
                  {isEditing && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-400 hover:text-slate-600"
                        onClick={() => moveWidget(widget.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-400 hover:text-slate-600"
                        onClick={() => moveWidget(widget.id, 'down')}
                        disabled={index === widgets.length - 1}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
                            <Settings className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem disabled className="text-xs text-slate-500">Tamanho do Widget</DropdownMenuItem>
                          {(['small', 'medium', 'large', 'full'] as const).map((size) => (
                            <DropdownMenuItem key={size} onClick={() => handleSizeChange(widget.id, size)}>
                              {SIZE_LABELS[size]}
                              {widget.size === size && <Check className="w-4 h-4 ml-auto text-emerald-500" />}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRemoveWidget(widget.id)} className="text-rose-600">
                            <X className="w-4 h-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </CardHeader>

                {/* Widget Content */}
                <CardContent className="p-0 h-[calc(100%-50px)] overflow-auto">
                  {renderWidget(widget)}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Add Widget Dialog */}
      <Dialog open={showAddWidget} onOpenChange={setShowAddWidget}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Adicionar Widget
            </DialogTitle>
            <DialogDescription>
              Escolha um widget para adicionar ao seu dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
            {WIDGET_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.type}
                  onClick={() => handleAddWidget(template)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{template.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{template.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function getDefaultWidgets(): DashboardWidget[] {
  return [
    { id: 'kpi-1', type: 'kpi-total', title: 'Total de Candidatos', size: 'small' },
    { id: 'kpi-2', type: 'kpi-entrevista', title: 'Em Entrevista', size: 'small' },
    { id: 'kpi-3', type: 'kpi-contratados', title: 'Contratados', size: 'small' },
    { id: 'kpi-4', type: 'kpi-media-salarial', title: 'Média Salarial', size: 'small' },
    { id: 'chart-1', type: 'chart-funnel', title: 'Funil do Processo', size: 'medium' },
    { id: 'chart-2', type: 'chart-pie', title: 'Distribuição', size: 'medium' },
    { id: 'candidates', type: 'candidate-cards', title: 'Candidatos', size: 'full' },
  ];
}
