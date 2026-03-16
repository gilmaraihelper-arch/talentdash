import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';

interface HorizontalBarChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  title: string;
  className?: string;
  showValues?: boolean;
}

export function HorizontalBarChart({
  data,
  title,
  className,
  showValues = true,
}: HorizontalBarChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((d) => d.value), 1);
  }, [data]);

  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 p-4', className)}>
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-xs text-slate-600 w-20 truncate shrink-0">{item.name}</span>
            <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#F7931E',
                }}
              />
            </div>
            {showValues && (
              <span className="text-xs font-medium text-slate-700 w-8 text-right">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
