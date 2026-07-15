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
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error: err } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (err) {
            console.error("getSession error:", err);
            setError(err.message);
            setSession(null);
            setUser(null);
          } else {
            setSession(data?.session ?? null);
            setUser(data?.session?.user ?? null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("getSession exception:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      if (!email || !password) {
        setError("Email and password are required");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        setIsLoading(false);

        if (err) {
          console.error("Login error:", err);
          setError(err.message);
          return false;
        }

        return true;
      } catch (err) {
        setIsLoading(false);
        const errorMsg = err instanceof Error ? err.message : "Login failed";
        console.error("Login exception:", err);
        setError(errorMsg);
        return false;
      }
    },
    [],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName?: string,
    ): Promise<boolean> => {
      if (!email || !password) {
        setError("Email and password are required");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
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
          console.error("SignUp error:", err);
          setError(err.message);
          return false;
        }

        return true;
      } catch (err) {
        setIsLoading(false);
        const errorMsg = err instanceof Error ? err.message : "Sign up failed";
        console.error("SignUp exception:", err);
        setError(errorMsg);
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Logout failed");
    }
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
