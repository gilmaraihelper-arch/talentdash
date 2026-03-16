import { Info, Lightbulb, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type HelpType = 'info' | 'tip' | 'warning';

interface HelpTooltipProps {
  content: string;
  type?: HelpType;
  children?: React.ReactNode;
  className?: string;
}

const icons = {
  info: Info,
  tip: Lightbulb,
  warning: AlertCircle,
};

const colors = {
  info: 'text-blue-500 hover:text-blue-600',
  tip: 'text-amber-500 hover:text-amber-600',
  warning: 'text-red-500 hover:text-red-600',
};

export function HelpTooltip({ content, type = 'info', children, className }: HelpTooltipProps) {
  const Icon = icons[type];

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button className={cn('inline-flex items-center justify-center transition-colors', colors[type], className)}>
              <Icon className="w-4 h-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 text-sm"
          sideOffset={5}
        >
          <div className="flex items-start gap-2">
            <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', colors[type])} />
            <p className="text-slate-700">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface InfoBoxProps {
  title?: string;
  children: React.ReactNode;
  type?: HelpType;
  className?: string;
}

const boxStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  tip: 'bg-amber-50 border-amber-200 text-amber-800',
  warning: 'bg-red-50 border-red-200 text-red-800',
};

const iconColors = {
  info: 'text-blue-500',
  tip: 'text-amber-500',
  warning: 'text-red-500',
};

export function InfoBox({ title, children, type = 'info', className }: InfoBoxProps) {
  const Icon = icons[type];

  return (
    <div className={cn('p-4 rounded-lg border', boxStyles[type], className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColors[type])} />
        <div>
          {title && <p className="font-semibold mb-1">{title}</p>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}
