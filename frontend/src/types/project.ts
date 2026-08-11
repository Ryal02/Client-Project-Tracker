export const STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed'] as const;
export const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export type ProjectStatus = (typeof STATUSES)[number];
export type ProjectPriority = (typeof PRIORITIES)[number];

export interface Project {
  id: number;
  client_name: string;
  project_name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ProjectFormData {
  client_name: string;
  project_name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
}

export interface ProjectFilters {
  search: string;
  status: string;
  priority: string;
  sort_by: string;
  sort_dir: 'asc' | 'desc';
}
