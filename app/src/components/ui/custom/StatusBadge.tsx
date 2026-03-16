import { Badge } from '@/components/ui/badge';
import type { CandidateStatus } from '@/types';
import { STATUS_LABELS, STATUS_COLORS } from '@/types';

interface StatusBadgeProps {
  status: CandidateStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge
      className={`font-medium border-0 ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${STATUS_COLORS[status]}20`,
        color: STATUS_COLORS[status],
      }}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
