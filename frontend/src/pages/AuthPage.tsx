import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
    mode: 'login' | 'register';
}

export function AuthPage({ mode }: AuthPageProps) {
    const { login, register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err) {
            if (err instanceof ApiError) {
                const messages = err.errors
                    ? Object.values(err.errors).flat().join(' ')
                    : err.message;
                setError(messages);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30">
                        <svg
                            className="h-7 w-7 text-white"
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
                    <h1 className="text-2xl font-bold text-white">
                        Project Tracker
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Digital agency client project management
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-slate-900/5">
                    <h2 className="mb-6 text-lg font-semibold text-slate-900">
                        {mode === 'login'
                            ? 'Sign in to your account'
                            : 'Create an account'}
                    </h2>

                    {error && (
                        <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                                />
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50"
                        >
                            {loading
                                ? 'Please wait...'
                                : mode === 'login'
                                  ? 'Sign In'
                                  : 'Create Account'}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <p className="mt-4 text-center text-xs text-slate-400">
                            Demo: demo@agency.com / password
                        </p>
                    )}

                    <p className="mt-4 text-center text-sm text-slate-500">
                        {mode === 'login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <Link
                                    to="/register"
                                    className="font-medium text-brand-600 hover:text-brand-700"
                                >
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-brand-600 hover:text-brand-700"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
