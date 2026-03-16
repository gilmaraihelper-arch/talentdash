import { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PLANS, type PlanType } from '@/types';
import type { Store } from '@/hooks/useStore';

interface RegisterPageProps {
  store: Store;
}

const plans: { key: PlanType; name: string; price: string; description: string; features: string[] }[] = [
  {
    key: 'free',
    name: 'Free',
    price: 'Grátis',
    description: 'Para experimentar',
    features: ['50 candidatos', 'Campos básicos', 'Dashboard simples'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 'R$ 49/mês',
    description: 'Mais popular',
    features: ['Candidatos ilimitados', '5 campos personalizados', 'Templates', 'Exportação'],
  },
  {
    key: 'advanced',
    name: 'Advanced',
    price: 'R$ 99/mês',
    description: 'Para equipes',
    features: ['15 campos personalizados', 'Analytics avançado', 'API access', 'Suporte prioritário'],
  },
];

export function RegisterPage({ store }: RegisterPageProps) {
  const { navigateTo, register } = store;
  const [step, setStep] = useState<'plan' | 'form'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      companyName: formData.companyName,
      plan: selectedPlan,
    });
    
    setIsLoading(false);
  };

  if (step === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
        
        <div className="w-full max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                TalentDash
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Escolha seu plano
            </h1>
            <p className="text-slate-600">
              Comece grátis ou escolha um plano para mais recursos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.key}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === plan.key
                    ? 'ring-2 ring-indigo-500 shadow-lg'
                    : 'border-slate-200'
                }`}
                onClick={() => setSelectedPlan(plan.key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {selectedPlan === plan.key && (
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-4">{plan.price}</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 h-12"
              onClick={() => setStep('form')}
            >
              Continuar com {PLANS[selectedPlan].name}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <button
              onClick={() => navigateTo('login')}
              className="text-center text-sm text-slate-500 hover:text-slate-700"
            >
              Já tem uma conta? Entrar
            </button>
            
            <button
              onClick={() => navigateTo('landing')}
              className="text-center text-sm text-slate-500 hover:text-slate-700"
            >
              ← Voltar para a página inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <Badge className="bg-indigo-100 text-indigo-700">
                <Sparkles className="w-3 h-3 mr-1" />
                {PLANS[selectedPlan].name}
              </Badge>
            </div>
            <CardDescription>
              Preencha seus dados para começar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`pl-10 ${errors.name ? 'border-rose-500' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 ${errors.email ? 'border-rose-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-10 pr-10 ${errors.password ? 'border-rose-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Empresa (opcional)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Nome da sua empresa"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 rounded border-slate-300" required />
                <span className="text-xs text-slate-600">
                  Concordo com os{' '}
                  <button type="button" className="text-indigo-600 hover:underline">Termos de Serviço</button>
                  {' '}e{' '}
                  <button type="button" className="text-indigo-600 hover:underline">Política de Privacidade</button>
                </span>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
            
            <Separator className="my-4" />
            
            <button
              onClick={() => setStep('plan')}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700"
            >
              ← Voltar para escolha do plano
            </button>
            
            <p className="text-center text-sm text-slate-600">
              Já tem uma conta?{' '}
              <button
                onClick={() => navigateTo('login')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Entrar
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
