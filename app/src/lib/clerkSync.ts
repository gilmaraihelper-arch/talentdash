import { useSignIn, useSignUp, useUser } from '@clerk/clerk-react';

// Estender tipo Window para Clerk
declare global {
  interface Window {
    Clerk?: {
      client?: {
        signIn?: {
          create: (params: { identifier: string; password: string }) => Promise<{
            status: string;
            createdSessionId?: string;
          }>;
        };
        signUp?: {
          create: (params: {
            emailAddress: string;
            password: string;
            firstName: string;
            lastName: string;
            unsafeMetadata?: Record<string, any>;
          }) => Promise<{
            status: string;
            createdSessionId?: string;
          }>;
        };
      };
      setActive?: (params: { session?: string | null }) => Promise<void>;
      signOut?: () => Promise<void>;
      user?: any;
      session?: any;
    };
  }
}

/**
 * Sincroniza login tradicional (API REST) com Clerk
 * Quando o usuário faz login via API, também faz login no Clerk
 */
export async function syncLoginWithClerk(
  email: string,
  password: string,
  userData: {
    id: string;
    name: string;
    companyName?: string;
    plan?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se Clerk está disponível
    if (!window.Clerk?.client?.signIn) {
      return { success: false, error: 'Clerk não inicializado' };
    }

    // Tentar fazer login no Clerk
    try {
      const signIn = window.Clerk.client.signIn;
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        // Login no Clerk bem-sucedido
        if (window.Clerk.setActive) {
          await window.Clerk.setActive({ session: result.createdSessionId });
        }
        return { success: true };
      }
    } catch (signInError: any) {
      // Se o usuário não existe no Clerk, precisamos criar
      if (signInError.errors?.[0]?.code === 'form_identifier_not_found') {
        // Usuário não existe no Clerk, criar
        try {
          if (!window.Clerk.client?.signUp) {
            return { success: false, error: 'Clerk signUp não disponível' };
          }
          
          const signUp = window.Clerk.client.signUp;
          const result = await signUp.create({
            emailAddress: email,
            password,
            firstName: userData.name.split(' ')[0],
            lastName: userData.name.split(' ').slice(1).join(' ') || '',
            unsafeMetadata: {
              companyName: userData.companyName || '',
              plan: userData.plan || 'free',
            },
          });

          if (result.status === 'complete' && result.createdSessionId) {
            // Registro bem-sucedido, ativar sessão
            if (window.Clerk.setActive) {
              await window.Clerk.setActive({ session: result.createdSessionId });
            }
            return { success: true };
          } else if (result.status === 'missing_requirements') {
            // Pode precisar de verificação de email
            return { success: false, error: 'Verificação de email necessária' };
          }
        } catch (signUpError: any) {
          return { success: false, error: signUpError.message || 'Erro ao criar usuário no Clerk' };
        }
      } else {
        return { success: false, error: signInError.message || 'Erro no login do Clerk' };
      }
    }

    return { success: false, error: 'Não foi possível sincronizar com Clerk' };
  } catch (error: any) {
    console.error('[ClerkSync] Erro:', error);
    return { success: false, error: error.message || 'Erro desconhecido' };
  }
}

/**
 * Verifica se o usuário está autenticado no Clerk
 */
export function isClerkAuthenticated(): boolean {
  return window.Clerk?.user !== null && window.Clerk?.session !== null;
}

/**
 * Obtém o token do Clerk para enviar nas requisições API
 */
export async function getClerkToken(): Promise<string | null> {
  try {
    if (!window.Clerk?.session) return null;
    return await window.Clerk.session.getToken();
  } catch {
    return null;
  }
}
