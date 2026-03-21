/**
 * useStore — Global composition hook
 * Combines all domain hooks (useAuth, useJobs, useCandidates, usePayments)
 * and exposes the full Store interface for backward compatibility.
 *
 * All components that receive a `store` prop continue to work without changes.
 */
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  ViewType,
  AppState,
} from '@/types';
import {
  getCurrentUser,
  fetchUserProfile,
  signOut,
} from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useJobs } from './useJobs';
import { useCandidates } from './useCandidates';
import { usePayments } from './usePayments';

// ============================================
// TYPED CONVERSION HELPERS
// ============================================

/** Recursively converts snake_case keys to camelCase */
export function snakeToCamel<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map(snakeToCamel) as unknown as T;
  return Object.keys(obj as object).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, l) => l.toUpperCase());
    (acc as Record<string, unknown>)[camelKey] = snakeToCamel((obj as Record<string, unknown>)[key]);
    return acc;
  }, {} as T);
}

/** Recursively converts camelCase keys to snake_case */
export function camelToSnake<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return (obj as unknown[]).map(camelToSnake) as unknown as T;
  return Object.keys(obj as object).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    (acc as Record<string, unknown>)[snakeKey] = camelToSnake((obj as Record<string, unknown>)[key]);
    return acc;
  }, {} as T);
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: AppState = {
  currentView: 'landing',
  user: null,
  isAuthenticated: false,
  selectedJob: null,
  selectedCandidate: null,
  jobs: [],
  candidates: [],
};

// ============================================
// VIEW → PATH MAPPING (React Router)
// ============================================
const VIEW_TO_PATH: Record<ViewType, string> = {
  landing: '/',
  login: '/login',
  register: '/register',
  'user-dashboard': '/dashboard',
  'create-job': '/dashboard/create-job',
  'data-structure': '/dashboard/data-structure',
  'add-candidates': '/dashboard/add-candidates',
  dashboard: '/dashboard/analytics',
  'candidate-detail': '/dashboard/candidate/selected',
  admin: '/admin',
};

// ============================================
// COMPOSITION HOOK
// ============================================
export function useStore() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const navigate = useNavigate();

  // Domain hooks — pass shared state setters
  const jobs = useJobs(state, setState, setIsLoading, setError);
  const candidates = useCandidates(state, setState, setIsLoading, setError);
  const payments = usePayments(state, setState, setIsLoading, setError);
  const auth = useAuth(
    state,
    setState,
    setIsLoading,
    setError,
    jobs.loadJobs,
    initialState,
  );

  // ---- Session init ----
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && isMounted) {
          const profile = await fetchUserProfile(user.id);
          if (profile && isMounted) {
            const userWithCamel = snakeToCamel(profile);
            setState(prev => ({
              ...prev,
              user: userWithCamel,
              isAuthenticated: true,
            }));
            await jobs.loadJobs(user.id);
          }
        }
      } catch (err) {
        console.error('Failed to check auth:', err);
        try { await signOut(); } catch { /* ignore */ }
      } finally {
        if (isMounted) setIsAuthInitializing(false);
      }
    };

    initAuth();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Navigation (backward-compatible) ----
  const navigateTo = useCallback((view: ViewType) => {
    setState(prev => ({ ...prev, currentView: view }));
    const path = VIEW_TO_PATH[view] ?? '/';
    navigate(path);
  }, [navigate]);

  // ---- Utils ----
  const resetState = useCallback(() => setState(initialState), []);
  const clearError = useCallback(() => setError(null), []);

  return {
    state,
    isLoading,
    isAuthInitializing,
    error,
    navigateTo,
    // Auth
    login: auth.login,
    googleLogin: auth.googleLogin,
    register: auth.register,
    logout: auth.logout,
    updateUserProfile: auth.updateUserProfile,
    changePlan: auth.changePlan,
    // Jobs
    createJob: jobs.createJob,
    updateJob: jobs.updateJob,
    deleteJob: jobs.deleteJob,
    selectJob: jobs.selectJob,
    // Candidates
    addCandidates: candidates.addCandidates,
    addCandidate: candidates.addCandidate,
    addLocalCandidates: candidates.addLocalCandidates,
    updateCandidate: candidates.updateCandidate,
    deleteCandidate: candidates.deleteCandidate,
    getJobCandidates: candidates.getJobCandidates,
    selectCandidate: candidates.selectCandidate,
    // Payments
    addPaymentMethod: payments.addPaymentMethod,
    removePaymentMethod: payments.removePaymentMethod,
    setDefaultPaymentMethod: payments.setDefaultPaymentMethod,
    // Utils
    resetState,
    clearError,
  };
}

export type Store = ReturnType<typeof useStore>;
