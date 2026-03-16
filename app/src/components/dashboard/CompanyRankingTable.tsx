import { cn } from '@/lib/utils';
import { Building2, Users, TrendingUp, Calendar, Globe } from 'lucide-react';

interface CompanyRankingItem {
  id: string;
  name: string;
  logo?: string;
  candidates: number;
  avgSalary: number;
  avgAge: number;
  englishPercentage: number;
}

interface CompanyRankingTableProps {
  data: CompanyRankingItem[];
  className?: string;
}

export function CompanyRankingTable({ data, className }: CompanyRankingTableProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-slate-200 overflow-hidden', className)}>
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Ranking de Empresas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate-500">Empresa</th>
              <th className="text-center py-3 px-2 text-xs font-medium text-slate-500">
                <div className="flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Cand.</span>
                </div>
              </th>
              <th className="text-center py-3 px-2 text-xs font-medium text-slate-500">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Média</span>
                </div>
              </th>
              <th className="text-center py-3 px-2 text-xs font-medium text-slate-500">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Idade</span>
                </div>
              </th>
              <th className="text-center py-3 px-2 text-xs font-medium text-slate-500">
                <div className="flex items-center justify-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>EN%</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((company, index) => (
              <tr
                key={company.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                      {company.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="text-sm font-semibold text-slate-700">{company.candidates}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="text-sm font-medium text-[#F7931E]">
                    R$ {(company.avgSalary / 1000).toFixed(1)}k
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="text-sm text-slate-600">{company.avgAge} anos</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${company.englishPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {company.englishPercentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
