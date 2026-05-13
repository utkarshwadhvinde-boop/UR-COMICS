import { PageLoader } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { loginStatus } = useInternetIdentity();

  // Still checking auth state
  if (loginStatus === "logging-in") {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
