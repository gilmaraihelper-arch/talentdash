import { CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react';
import { StarRating } from './StarRating';
import type { CustomField } from '@/types';

interface FieldRendererProps {
  field: CustomField;
  value: any;
  size?: 'sm' | 'md' | 'lg';
}

export function FieldRenderer({ field, value, size = 'md' }: FieldRendererProps) {
  if (value === undefined || value === null || value === '') {
    return <span className="text-muted-foreground italic">-</span>;
  }

  switch (field.type) {
    case 'rating':
      return (
        <StarRating 
          rating={value} 
          maxRating={field.maxRating || 5} 
          size={size}
        />
      );

    case 'boolean':
      return value === true || value === 'Sim' || value === 'sim' ? (
        <div className="flex items-center gap-1.5 text-emerald-600">
          <CheckCircle className="w-4 h-4" />
          <span>Sim</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-red-500">
          <XCircle className="w-4 h-4" />
          <span>Não</span>
        </div>
      );

    case 'link':
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
        >
          <LinkIcon className="w-4 h-4" />
          <span className="truncate max-w-[150px]">
            {value.replace(/^https?:\/\//, '').replace(/^www\./, '')}
          </span>
        </a>
      );

    case 'select':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {value}
        </span>
      );

    case 'number':
      return (
        <span className="font-medium">
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </span>
      );

    case 'text':
    default:
      return (
        <span className="line-clamp-2" title={value}>
          {value}
        </span>
      );
  }
}
