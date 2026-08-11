import { Plus, Search } from 'lucide-react';
import type { ProjectFilters } from '../../types/project';
import { PRIORITIES, STATUSES } from '../../types/project';

interface ProjectToolbarProps {
    filters: ProjectFilters;
    onFiltersChange: (filters: ProjectFilters) => void;
    onCreate: () => void;
}

export function ProjectToolbar({
    filters,
    onFiltersChange,
    onCreate,
}: ProjectToolbarProps) {
    const update = (patch: Partial<ProjectFilters>) => {
        onFiltersChange({ ...filters, ...patch });
    };

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative min-w-[200px] max-w-sm flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={filters.search}
                        onChange={(e) => update({ search: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                </div>

                <select
                    value={filters.status}
                    onChange={(e) => update({ status: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) => update({ priority: e.target.value })}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                    <option value="">All Priorities</option>
                    {PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                            {priority}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={onCreate}
                className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
                <Plus className="h-4 w-4" />
                New Project
            </button>
        </div>
    );
}
