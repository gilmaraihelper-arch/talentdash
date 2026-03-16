import type { User, Job, Candidate, PaymentMethod } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token storage
let authToken: string | null = localStorage.getItem('talentdash_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('talentdash_token', token);
  } else {
    localStorage.removeItem('talentdash_token');
  }
};

export const getAuthToken = () => authToken;

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  
  return data;
}

// ==================== AUTH ====================

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    companyName?: string;
    plan?: string;
  }): Promise<{ user: User; token: string }> => {
    const result = await apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(result.token);
    return result;
  },
  
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const result = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(result.token);
    return result;
  },
  
  getMe: async (): Promise<User> => {
    return apiRequest<User>('/auth/me');
  },
  
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  changePlan: async (plan: string): Promise<User> => {
    return apiRequest<User>('/auth/plan', {
      method: 'PUT',
      body: JSON.stringify({ plan }),
    });
  },
  
  logout: () => {
    setAuthToken(null);
  },
};

// ==================== JOBS ====================

export const jobsAPI = {
  getAll: async (): Promise<Job[]> => {
    return apiRequest<Job[]>('/jobs');
  },
  
  getById: async (id: string): Promise<Job> => {
    return apiRequest<Job>(`/jobs/${id}`);
  },
  
  create: async (data: Omit<Job, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    return apiRequest<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: Partial<Job>): Promise<Job> => {
    return apiRequest<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CANDIDATES ====================

export const candidatesAPI = {
  getAll: async (jobId: string): Promise<Candidate[]> => {
    return apiRequest<Candidate[]>(`/jobs/${jobId}/candidates`);
  },
  
  getById: async (jobId: string, id: string): Promise<Candidate> => {
    return apiRequest<Candidate>(`/jobs/${jobId}/candidates/${id}`);
  },
  
  create: async (jobId: string, data: Omit<Candidate, 'id' | 'jobId' | 'createdAt' | 'updatedAt'>): Promise<Candidate> => {
    return apiRequest<Candidate>(`/jobs/${jobId}/candidates`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  createBulk: async (jobId: string, candidates: Omit<Candidate, 'id' | 'jobId' | 'createdAt' | 'updatedAt'>[]): Promise<{ message: string; candidates: Candidate[] }> => {
    return apiRequest<{ message: string; candidates: Candidate[] }>(`/jobs/${jobId}/candidates/bulk`, {
      method: 'POST',
      body: JSON.stringify({ candidates }),
    });
  },
  
  update: async (jobId: string, id: string, data: Partial<Candidate>): Promise<Candidate> => {
    return apiRequest<Candidate>(`/jobs/${jobId}/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (jobId: string, id: string): Promise<void> => {
    return apiRequest<void>(`/jobs/${jobId}/candidates/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PAYMENTS ====================

export const paymentsAPI = {
  getAll: async (): Promise<PaymentMethod[]> => {
    return apiRequest<PaymentMethod[]>('/payments');
  },
  
  create: async (data: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    return apiRequest<PaymentMethod>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  setDefault: async (id: string): Promise<void> => {
    return apiRequest<void>(`/payments/${id}/default`, {
      method: 'PUT',
    });
  },
  
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/payments/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== HEALTH ====================

export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string; version: string }> => {
    return apiRequest('/health');
  },
};
