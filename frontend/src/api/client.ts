const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

import type { Project, ProjectFormData, User } from '../types/project';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data.message || 'An error occurred',
      response.status,
      data.errors,
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    request<{ user: User; token: string }>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    }),

  logout: () => request('/logout', { method: 'POST' }),

  me: () => request<User>('/me'),

  getProjects: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return request<Project[]>(`/projects?${query}`);
  },

  getProject: (id: number) => request<Project>(`/projects/${id}`),

  createProject: (data: ProjectFormData) =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProject: (id: number, data: Partial<ProjectFormData>) =>
    request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteProject: (id: number) =>
    request(`/projects/${id}`, { method: 'DELETE' }),
};

export { ApiError };
