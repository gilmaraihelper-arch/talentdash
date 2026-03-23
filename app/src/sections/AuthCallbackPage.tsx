import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Página de callback do OAuth (Google, etc.)
 * O useStore.initAuth detecta a sessão automaticamente ao montar o App.
 * Esta página apenas garante redirect rápido após OAuth.
 */
export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let redirected = false;

    // Escuta mudança de estado - evento rápido e confiável
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user && !redirected) {
        redirected = true;
        subscription.unsubscribe();
        navigate('/dashboard', { replace: true });
      }
    });

    // Fallback: se não receber evento em 3s, verifica sessão diretamente
    const fallbackTimeout = setTimeout(() => {
      if (!redirected) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && !redirected) {
            redirected = true;
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }).catch(() => {
          navigate('/login', { replace: true });
        });
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
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