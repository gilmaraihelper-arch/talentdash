import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticateWithRedirectCallback, useAuth } from '@clerk/clerk-react';

/**
 * Página de callback do OAuth via Clerk.
 * Processa o token OAuth e aguarda a sessão ser confirmada antes de redirecionar.
 */
function RedirectAfterAuth() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    if (!isLoaded || redirected.current) return;

    if (isSignedIn) {
      redirected.current = true;
      navigate('/dashboard', { replace: true });
    }

    // Fallback: aguarda até 8 segundos verificando a sessão
    const interval = setInterval(() => {
      if (isSignedIn && !redirected.current) {
        redirected.current = true;
        clearInterval(interval);
        navigate('/dashboard', { replace: true });
      }
    }, 300);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!redirected.current) {
        navigate('/login', { replace: true });
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLoaded, isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Finalizando login...</p>
      </div>
    </div>
  );
}

export function AuthCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      afterSignInUrl="/sso-callback"
      afterSignUpUrl="/sso-callback"
    />
  );
}

export function SsoCallbackPage() {
  return <RedirectAfterAuth />;
}
