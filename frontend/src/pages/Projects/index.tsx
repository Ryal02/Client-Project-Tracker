import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../../api/client';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import type { Project, ProjectFilters, ProjectFormData } from '../../types/project';
import { ProjectForm } from './ProjectForm';
import { ProjectHeader } from './ProjectHeader';
import { ProjectStats } from './ProjectStats';
import { ProjectTable } from './ProjectTable';
import { ProjectToolbar } from './ProjectToolbar';

const defaultFilters: ProjectFilters = {
    search: '',
    status: '',
    priority: '',
    sort_by: 'created_at',
    sort_dir: 'desc',
};

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
            const params: Record<string, string> = {
                sort_by: filters.sort_by,
                sort_dir: filters.sort_dir,
            };

            if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;

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
            const message =
                err instanceof ApiError ? err.message : 'Delete failed.';
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
                prev.sort_by === column && prev.sort_dir === 'asc'
                    ? 'desc'
                    : 'asc',
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <ProjectHeader userName={user?.name} onLogout={logout} />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <ProjectStats projects={projects} />

                <ProjectToolbar
                    filters={filters}
                    onFiltersChange={setFilters}
                    onCreate={() => setShowCreate(true)}
                />

                {error && (
                    <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                <ProjectTable
                    projects={projects}
                    loading={loading}
                    filters={filters}
                    deletingId={deletingId}
                    onSort={toggleSort}
                    onEdit={setEditingProject}
                    onDelete={handleDelete}
                />
            </main>

            {showCreate && (
                <Modal
                    title="Create New Project"
                    onClose={() => setShowCreate(false)}
                >
                    <ProjectForm
                        onSubmit={handleCreate}
                        onCancel={() => setShowCreate(false)}
                    />
                </Modal>
            )}

            {editingProject && (
                <Modal
                    title="Edit Project"
                    onClose={() => setEditingProject(null)}
                >
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
