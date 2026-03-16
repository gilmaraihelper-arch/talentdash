import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  type: 'en' | 'es' | 'rh' | 'tech';
  value?: string;
  className?: string;
}

const variants = {
  en: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'EN',
    icon: '🌐',
  },
  es: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    label: 'ES',
    icon: '🌐',
  },
  rh: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'RH',
    icon: '👥',
  },
  tech: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: 'TECH',
    icon: '💻',
  },
};

export function SkillBadge({ type, value, className }: SkillBadgeProps) {
  const variant = variants[type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border',
        variant.bg,
        variant.text,
        variant.border,
        className
      )}
    >
      <span>{variant.icon}</span>
      <span>{variant.label}</span>
      {value && <span className="opacity-75">{value}</span>}
    </span>
  );
}
