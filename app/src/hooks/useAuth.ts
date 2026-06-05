/**
 * useAuth — Authentication domain hook with Clerk integration
 * Handles: login, register, logout, googleLogin, updateUserProfile, changePlan
 */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp, useUser } from '@clerk/clerk-react';
import type { AppState, PlanType, User } from '@/types';
import { supabase } from '@/lib/supabase';
import { syncLoginWithClerk } from '@/lib/clerkSync';

// API URL para fallback
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-five-sigma-73.vercel.app';

type SetState = React.Dispatch<React.SetStateAction<AppState>>;
type SetLoading = React.Dispatch<React.SetStateAction<boolean>>;
type SetError = React.Dispatch<React.SetStateAction<string | null>>;

// snake_case → camelCase helper (local, typed)
function snakeToCamel<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map(snakeToCamel) as unknown as T;
  return Object.keys(obj as object).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    (acc as Record<string, unknown>)[camelKey] = snakeToCamel((obj as Record<string, unknown>)[key]);
    return acc;
  }, {} as T);
}

// camelCase → snake_case helper (local, typed)
function camelToSnake<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map(camelToSnake) as unknown as T;
  return Object.keys(obj as object).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    (acc as Record<string, unknown>)[snakeKey] = camelToSnake((obj as Record<string, unknown>)[key]);
    return acc;
  }, {} as T);
}

export function useAuth(
  state: AppState,
  setState: SetState,
  setIsLoading: SetLoading,
  setError: SetError,
  initialState: AppState,
) {
  const navigate = useNavigate();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp } = useSignUp();
  const { user: clerkUser, isSignedIn } = useUser();

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Se já está logado, vai pro dashboard direto
      if (isSignedIn) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // ⚠️ CORREÇÃO: Primeiro tentar login via API tradicional
      // O Clerk pode estar com problema de configuração
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Login API bem-sucedido
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          // Tentar sincronizar com Clerk (não bloquear se falhar)
          try {
            const syncResult = await syncLoginWithClerk(email, password, {
              id: data.user.id,
              name: data.user.name,
              companyName: data.user.companyName,
              plan: data.user.plan,
            });

            if (!syncResult.success) {
              console.warn('[Auth] Falha ao sincronizar com Clerk:', syncResult.error);
            }
          } catch (syncErr) {
            console.warn('[Auth] Erro ao sincronizar com Clerk:', syncErr);
          }

          // Definir estado autenticado mesmo sem Clerk
          setState(prev => ({
            ...prev,
            user: data.user,
            isAuthenticated: true,
          }));

          navigate('/dashboard');
          return data.token;
        }
        
        // Se API retornou erro de credenciais
        throw new Error(data.error || 'E-mail ou senha incorretos');
      } catch (apiErr: any) {
        // Se API falhou, tentar Clerk como fallback
        console.log('[Auth] API falhou, tentando Clerk:', apiErr.message);
        
        if (!signIn) throw new Error('Serviço de autenticação indisponível');

        const result = await signIn.create({
          identifier: email,
          password,
        });
        
        if (result.status === 'complete') {
          if (result.createdSessionId) {
            await window.Clerk?.setActive?.({ session: result.createdSessionId });
          }
          navigate('/dashboard');
          return result.createdSessionId;
        }
      }
    } catch (err: unknown) {
      const message = (err as Error).message || 'Erro ao fazer login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setError, setIsLoading, signIn, setState, isSignedIn]);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    companyName?: string;
    plan?: PlanType;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // ⚠️ CORREÇÃO: Primeiro tentar criar no backend/API tradicional
      // O Clerk pode estar com problema de configuração ou limitação
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            companyName: data.companyName,
            plan: data.plan || 'free',
          }),
        });

        const responseData = await response.json();

        if (response.ok) {
          // Registro API bem-sucedido - salvar token e redirecionar
          if (responseData.token) {
            localStorage.setItem('token', responseData.token);
            localStorage.setItem('user', JSON.stringify(responseData.user));
          }
          
          // Tentar sincronizar com Clerk (não bloquear se falhar)
          try {
            if (signUp) {
              await signUp.create({
                emailAddress: data.email,
                password: data.password,
                firstName: data.name.split(' ')[0],
                lastName: data.name.split(' ').slice(1).join(' ') || '',
                unsafeMetadata: {
                  companyName: data.companyName,
                  plan: data.plan || 'free',
                },
              });
            }
          } catch (clerkSyncErr) {
            console.warn('[Auth] Falha ao sincronizar com Clerk (não crítico):', clerkSyncErr);
          }

          navigate('/dashboard');
          return responseData;
        }
        
        // Se API retornou erro, verificar se é "já existe"
        if (responseData.error?.includes('already exists') || 
            responseData.error?.includes('já cadastrado') ||
            responseData.error?.includes('já existe')) {
          throw new Error('E-mail já cadastrado');
        }
        
        throw new Error(responseData.error || 'Erro ao criar conta');
      } catch (apiErr: any) {
        // Se API falhou, tentar Clerk direto como fallback
        console.log('[Auth] API falhou, tentando Clerk:', apiErr.message);
        
        if (!signUp) throw new Error('Serviço de autenticação indisponível');

        const result = await signUp.create({
          emailAddress: data.email,
          password: data.password,
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' ') || '',
          unsafeMetadata: {
            companyName: data.companyName,
            plan: data.plan || 'free',
          },
        });

        if (result.status === 'complete') {
          navigate('/dashboard');
          return result.createdSessionId;
        } else {
          throw new Error('Registro incompleto - verifique seu email');
        }
      }
    } catch (err: unknown) {
      const message = (err as Error).message || 'Erro ao criar conta';
      if (message.includes('already exists') || message.includes('já cadastrado') || message.includes('já existe')) {
        setError('E-mail já cadastrado');
      } else {
        setError(message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setError, setIsLoading, signUp]);

  const logout = useCallback(async () => {
    try {
      // Clerk logout via window.Clerk (global)
      if (window.Clerk?.signOut) {
        await window.Clerk.signOut();
      }
      setState(initialState);
      navigate('/');
    } catch {
      setState(initialState);
      navigate('/');
    }
  }, [initialState, navigate, setState]);

  const googleLogin = useCallback(async (_accessToken?: string, _userInfo?: unknown) => {
    // Google OAuth é gerenciado pelo SignInButton do Clerk
    // Esta função é mantida para compatibilidade mas não faz nada
    return Promise.resolve();
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .update(camelToSnake(updates))
        .eq('id', state.user?.id)
        .select()
        .single();
      if (error) throw error;
      const userWithCamel = snakeToCamel(data);
      setState(prev => ({ ...prev, user: userWithCamel }));
      return userWithCamel;
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao atualizar perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.user?.id]);

  const changePlan = useCallback(async (newPlan: PlanType) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .update({ plan: newPlan })
        .eq('id', state.user?.id)
        .select()
        .single();
      if (error) throw error;
      const userWithCamel = snakeToCamel(data);
      setState(prev => ({ ...prev, user: userWithCamel }));
      return userWithCamel;
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao mudar plano');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.user?.id]);

  return { login, register, logout, googleLogin, updateUserProfile, changePlan };
}