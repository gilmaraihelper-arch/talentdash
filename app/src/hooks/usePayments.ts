/**
 * usePayments — Payment Methods domain hook
 * Handles: addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod
 */
import { useCallback } from 'react';
import type { AppState, PaymentMethod } from '@/types';
import { supabase } from '@/lib/supabase';

type SetState = React.Dispatch<React.SetStateAction<AppState>>;
type SetLoading = React.Dispatch<React.SetStateAction<boolean>>;
type SetError = React.Dispatch<React.SetStateAction<string | null>>;

function snakeToCamel<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map(snakeToCamel) as unknown as T;
  return Object.keys(obj as object).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    (acc as Record<string, unknown>)[camelKey] = snakeToCamel((obj as Record<string, unknown>)[key]);
    return acc;
  }, {} as T);
}

export function usePayments(
  state: AppState,
  setState: SetState,
  setIsLoading: SetLoading,
  setError: SetError,
) {
  const addPaymentMethod = useCallback(async (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    try {
      setIsLoading(true);
      const newMethods = [...(state.user?.paymentMethods || []), paymentMethod];
      const { data, error } = await supabase
        .from('users')
        .update({ payment_methods: newMethods })
        .eq('id', state.user?.id)
        .select()
        .single();
      if (error) throw error;
      const userWithCamel = snakeToCamel(data);
      setState(prev => ({ ...prev, user: userWithCamel }));
      return paymentMethod;
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao adicionar método de pagamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.user?.id, state.user?.paymentMethods]);

  const removePaymentMethod = useCallback(async (paymentMethodId: string) => {
    try {
      setIsLoading(true);
      const newMethods = state.user?.paymentMethods?.filter(pm => pm.id !== paymentMethodId) || [];
      const { data, error } = await supabase
        .from('users')
        .update({ payment_methods: newMethods })
        .eq('id', state.user?.id)
        .select()
        .single();
      if (error) throw error;
      const userWithCamel = snakeToCamel(data);
      setState(prev => ({ ...prev, user: userWithCamel }));
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao remover método de pagamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.user?.id, state.user?.paymentMethods]);

  const setDefaultPaymentMethod = useCallback(async (paymentMethodId: string) => {
    try {
      setIsLoading(true);
      const newMethods = state.user?.paymentMethods?.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId,
      })) || [];
      const { data, error } = await supabase
        .from('users')
        .update({ payment_methods: newMethods })
        .eq('id', state.user?.id)
        .select()
        .single();
      if (error) throw error;
      const userWithCamel = snakeToCamel(data);
      setState(prev => ({ ...prev, user: userWithCamel }));
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao definir método padrão');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.user?.id, state.user?.paymentMethods]);

  return { addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod };
}
