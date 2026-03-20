/**
 * useCandidates — Candidates domain hook
 * Handles: addCandidates, addCandidate, updateCandidate, deleteCandidate,
 *          getJobCandidates, selectCandidate, addLocalCandidates
 */
import { useCallback } from 'react';
import type { AppState, Candidate } from '@/types';
import {
  createCandidate as createCandidateDb,
  updateCandidate as updateCandidateDb,
  deleteCandidate as deleteCandidateDb,
} from '@/lib/supabase';

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

function camelToSnake<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map(camelToSnake) as unknown as T;
  return Object.keys(obj as object).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    (acc as Record<string, unknown>)[snakeKey] = camelToSnake((obj as Record<string, unknown>)[key]);
    return acc;
  }, {} as T);
}

export function useCandidates(
  state: AppState,
  setState: SetState,
  setIsLoading: SetLoading,
  setError: SetError,
) {
  const addCandidates = useCallback(async (candidates: Candidate[]) => {
    if (!state.selectedJob) return;
    try {
      setIsLoading(true);
      const createdCandidates: Candidate[] = [];
      for (const c of candidates) {
        const candidateData = {
          job_id: state.selectedJob.id,
          nome: c.nome,
          idade: c.idade,
          cidade: c.cidade,
          curriculo: c.curriculo,
          pretensao_salarial: c.pretensaoSalarial,
          salario_atual: c.salarioAtual,
          status: c.status,
          observacoes: c.observacoes,
          custom_fields: c.customFields,
        };
        const newCandidate = await createCandidateDb(candidateData as Partial<Candidate>);
        createdCandidates.push(snakeToCamel(newCandidate) as Candidate);
      }
      setState(prev => ({
        ...prev,
        candidates: [...prev.candidates, ...createdCandidates],
      }));
      return createdCandidates;
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao adicionar candidatos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.selectedJob]);

  const addCandidate = useCallback(async (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!state.selectedJob) return;
    try {
      setIsLoading(true);
      const candidateData = {
        job_id: state.selectedJob.id,
        nome: candidate.nome,
        idade: candidate.idade,
        cidade: candidate.cidade,
        curriculo: candidate.curriculo,
        pretensao_salarial: candidate.pretensaoSalarial,
        salario_atual: candidate.salarioAtual,
        status: candidate.status,
        observacoes: candidate.observacoes,
        custom_fields: candidate.customFields,
      };
      const newCandidate = await createCandidateDb(candidateData as Partial<Candidate>);
      const candidateWithCamel = snakeToCamel(newCandidate) as Candidate;
      setState(prev => ({
        ...prev,
        candidates: [...prev.candidates, candidateWithCamel],
      }));
      return candidateWithCamel;
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao adicionar candidato');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.selectedJob]);

  const updateCandidate = useCallback(async (candidateId: string, updates: Partial<Candidate>) => {
    if (!state.selectedJob) return;
    try {
      setIsLoading(true);
      const updatesWithSnake = camelToSnake(updates) as Partial<Candidate>;
      const updatedCandidate = await updateCandidateDb(candidateId, updatesWithSnake);
      const candidateWithCamel = snakeToCamel(updatedCandidate) as Candidate;
      setState(prev => ({
        ...prev,
        candidates: prev.candidates.map(c =>
          c.id === candidateId ? candidateWithCamel : c
        ),
      }));
      return candidateWithCamel;
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao atualizar candidato');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.selectedJob]);

  const deleteCandidate = useCallback(async (candidateId: string) => {
    if (!state.selectedJob) return;
    try {
      setIsLoading(true);
      await deleteCandidateDb(candidateId);
      setState(prev => ({
        ...prev,
        candidates: prev.candidates.filter(c => c.id !== candidateId),
      }));
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao excluir candidato');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setError, setIsLoading, setState, state.selectedJob]);

  const getJobCandidates = useCallback((jobId: string) => {
    return state.candidates.filter(c => c.jobId === jobId);
  }, [state.candidates]);

  const selectCandidate = useCallback((candidate: Candidate | null) => {
    setState(prev => ({ ...prev, selectedCandidate: candidate }));
  }, [setState]);

  const addLocalCandidates = useCallback((candidates: Candidate[]) => {
    setState(prev => ({
      ...prev,
      candidates: [...prev.candidates, ...candidates],
    }));
  }, [setState]);

  return {
    addCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    getJobCandidates,
    selectCandidate,
    addLocalCandidates,
  };
}
