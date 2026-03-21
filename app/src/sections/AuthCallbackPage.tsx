import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Página de callback do OAuth (Google, etc.)
 * O Supabase redireciona para cá após autenticação social.
 * Usa onAuthStateChange para aguardar a sessão ser estabelecida.
 */
export function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Escuta mudanças de auth — o Supabase processa o hash da URL automaticamente
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthCallback] event:', event, 'session:', !!session);

      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        navigate('/dashboard', { replace: true });
        return;
      }

      if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
        subscription.unsubscribe();
        navigate('/login', { replace: true });
        return;
      }
    });

    // Fallback: se depois de 5s não resolveu, tenta verificar sessão diretamente
    const timeout = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      subscription.unsubscribe();
      if (data.session) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
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
