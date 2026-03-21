import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Página de callback do OAuth (Google, etc.)
 * O Supabase redireciona para cá após autenticação social.
 * Aguarda a sessão ser estabelecida e redireciona para o dashboard.
 */
export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // O Supabase processa automaticamente o hash/params da URL
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=auth_failed', { replace: true });
        return;
      }

      if (data.session) {
        navigate('/dashboard', { replace: true });
      } else {
        // Aguarda um pouco e tenta novamente (o Supabase pode estar processando)
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (retryData.session) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }, 1500);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Finalizando login...</p>
      </div>
    </div>
  );
}
