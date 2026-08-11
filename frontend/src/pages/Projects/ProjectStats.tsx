import type { Project } from '../../types/project';

interface ProjectStatsProps {
    projects: Project[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
    const stats = [
        {
            label: 'Total Projects',
            value: projects.length,
            color: 'text-slate-900',
        },
        {
            label: 'In Progress',
            value: projects.filter((p) => p.status === 'In Progress').length,
            color: 'text-amber-600',
        },
        {
            label: 'Completed',
            value: projects.filter((p) => p.status === 'Completed').length,
            color: 'text-emerald-600',
        },
        {
            label: 'High Priority',
            value: projects.filter((p) => p.priority === 'High').length,
            color: 'text-rose-600',
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
                >
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
