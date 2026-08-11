import type { ProjectPriority, ProjectStatus } from '../../types/project';

const statusStyles: Record<ProjectStatus, string> = {
    Planning: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'In Progress': 'bg-amber-50 text-amber-700 ring-amber-600/20',
    'On Hold': 'bg-slate-100 text-slate-600 ring-slate-500/20',
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};

const priorityStyles: Record<ProjectPriority, string> = {
    Low: 'bg-slate-50 text-slate-600 ring-slate-500/20',
    Medium: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    High: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${priorityStyles[priority]}`}
        >
            {priority}
        </span>
    );
}
