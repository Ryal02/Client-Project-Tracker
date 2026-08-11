import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  LogOut,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../api/client';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { Modal } from '../components/Modal';
import { ProjectForm } from '../components/ProjectForm';
import { useAuth } from '../context/AuthContext';
import type { Project, ProjectFilters, ProjectFormData } from '../types/project';
import { PRIORITIES, STATUSES } from '../types/project';

const defaultFilters: ProjectFilters = {
  search: '',
  status: '',
  priority: '',
  sort_by: 'created_at',
  sort_dir: 'desc',
};

const sortColumns = [
  { key: 'client_name', label: 'Client' },
  { key: 'project_name', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'start_date', label: 'Start' },
  { key: 'due_date', label: 'Due' },
] as const;

export function ProjectsPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      params.sort_by = filters.sort_by;
      params.sort_dir = filters.sort_dir;

      const data = await api.getProjects(params);
      setProjects(data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timer);
  }, [fetchProjects]);

  const handleCreate = async (data: ProjectFormData) => {
    await api.createProject(data);
    setShowCreate(false);
    fetchProjects();
  };

  const handleUpdate = async (data: ProjectFormData) => {
    if (!editingProject) return;
    await api.updateProject(editingProject.id, data);
    setEditingProject(null);
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setDeletingId(id);
    try {
      await api.deleteProject(id);
      fetchProjects();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Delete failed.';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSort = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: column,
      sort_dir:
        prev.sort_by === column && prev.sort_dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (filters.sort_by !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />;
    }
    return filters.sort_dir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-brand-600" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-brand-600" />
    );
  };

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    highPriority: projects.filter((p) => p.priority === 'High').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Project Tracker</h1>
              <p className="text-xs text-slate-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Projects', value: stats.total, color: 'text-slate-900' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-amber-600' },
            { label: 'Completed', value: stats.completed, color: 'text-emerald-600' },
            { label: 'High Priority', value: stats.highPriority, color: 'text-rose-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {sortColumns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-medium text-slate-600">
                      <button
                        onClick={() => toggleSort(col.key)}
                        className="flex items-center gap-1.5 transition hover:text-slate-900"
                      >
                        {col.label}
                        <SortIcon column={col.key} />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                      Loading projects...
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                      No projects found. Create your first project to get started.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="transition hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        {project.client_name}
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-slate-800">{project.project_name}</p>
                          {project.description && (
                            <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <PriorityBadge priority={project.priority} />
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {format(parseISO(project.start_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {format(parseISO(project.due_date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showCreate && (
        <Modal title="Create New Project" onClose={() => setShowCreate(false)}>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreate(false)}
          />
        </Modal>
      )}

      {editingProject && (
        <Modal title="Edit Project" onClose={() => setEditingProject(null)}>
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdate}
            onCancel={() => setEditingProject(null)}
          />
        </Modal>
      )}
    </div>
  );
}
