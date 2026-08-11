import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { api } from '../api/client';
import type { User } from '../types/project';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        api.me()
            .then(setUser)
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const { user: loggedInUser, token } = await api.login(email, password);
        localStorage.setItem('token', token);
        setUser(loggedInUser);
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            const { user: newUser, token } = await api.register(
                name,
                email,
                password,
                password,
            );
            localStorage.setItem('token', token);
            setUser(newUser);
        },
        [],
    );

    const logout = useCallback(async () => {
        try {
            await api.logout();
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({ user, loading, login, register, logout }),
        [user, loading, login, register, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
