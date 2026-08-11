import { LogOut } from 'lucide-react';

interface ProjectHeaderProps {
    userName?: string;
    onLogout: () => void;
}

export function ProjectHeader({ userName, onLogout }: ProjectHeaderProps) {
    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600">
                        <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Project Tracker
                        </h1>
                        <p className="text-xs text-slate-500">
                            Welcome back, {userName}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </header>
    );
}
