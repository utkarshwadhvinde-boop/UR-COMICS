import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setIsLoading(false);
      if (err) {
        setError(err.message);
        return false;
      }
      return true;
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName?: string,
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split("@")[0],
            username: displayName || email.split("@")[0],
          },
        },
      });
      setIsLoading(false);
      if (err) {
        setError(err.message);
        return false;
      }
      return true;
    },
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signUp,
    logout,
    clearError,
  };
}
