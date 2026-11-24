import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import { clearSession, getSession, saveSession } from '@/lib/session-storage';

type AuthContextValue = {
  session: string | null;
  isLoading: boolean;
  storageError: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  retryLoading: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setStorageError(null);

    try {
      setSession(await getSession());
    } catch (error) {
      console.error('Não foi possível carregar a sessão salva.', error);
      setStorageError(
        error instanceof Error ? error.message : 'O armazenamento seguro está indisponível.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const signIn = useCallback(async (token: string) => {
    await saveSession(token);
    setStorageError(null);
    setSession(token);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  const value: AuthContextValue = {
    session,
    isLoading,
    storageError,
    signIn,
    signOut,
    retryLoading: () => void loadSession(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
