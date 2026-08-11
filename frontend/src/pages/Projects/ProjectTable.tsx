import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Pencil,
    Trash2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Project, ProjectFilters } from '../../types/project';
import { PriorityBadge, StatusBadge } from './ProjectBadges';

const SORT_COLUMNS = [
    { key: 'client_name', label: 'Client' },
    { key: 'project_name', label: 'Project' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'start_date', label: 'Start' },
    { key: 'due_date', label: 'Due' },
] as const;

interface ProjectTableProps {
    projects: Project[];
    loading: boolean;
    filters: ProjectFilters;
    deletingId: number | null;
    onSort: (column: string) => void;
    onEdit: (project: Project) => void;
    onDelete: (id: number) => void;
}

function SortIcon({
    column,
    sortBy,
    sortDir,
}: {
    column: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
}) {
    if (sortBy !== column) {
        return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />;
    }

    return sortDir === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5 text-brand-600" />
    ) : (
        <ArrowDown className="h-3.5 w-3.5 text-brand-600" />
    );
}

export function ProjectTable({
    projects,
    loading,
    filters,
    deletingId,
    onSort,
    onEdit,
    onDelete,
}: ProjectTableProps) {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80">
                            {SORT_COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 font-medium text-slate-600"
                                >
                                    <button
                                        onClick={() => onSort(col.key)}
                                        className="flex items-center gap-1.5 transition hover:text-slate-900"
                                    >
                                        {col.label}
                                        <SortIcon
                                            column={col.key}
                                            sortBy={filters.sort_by}
                                            sortDir={filters.sort_dir}
                                        />
                                    </button>
                                </th>
                            ))}
                            <th className="px-4 py-3 font-medium text-slate-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-12 text-center text-slate-400"
                                >
                                    Loading projects...
                                </td>
                            </tr>
                        ) : projects.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-12 text-center text-slate-400"
                                >
                                    No projects found. Create your first project
                                    to get started.
                                </td>
                            </tr>
                        ) : (
                            projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="transition hover:bg-slate-50/50"
                                >
                                    <td className="px-4 py-3.5 font-medium text-slate-900">
                                        {project.client_name}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div>
                                            <p className="font-medium text-slate-800">
                                                {project.project_name}
                                            </p>
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
                                        <PriorityBadge
                                            priority={project.priority}
                                        />
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600">
                                        {format(
                                            parseISO(project.start_date),
                                            'MMM d, yyyy',
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600">
                                        {format(
                                            parseISO(project.due_date),
                                            'MMM d, yyyy',
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => onEdit(project)}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    onDelete(project.id)
                                                }
                                                disabled={
                                                    deletingId === project.id
                                                }
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
    );
}
