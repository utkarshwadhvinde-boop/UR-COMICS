import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const { identity, login, clear, loginStatus } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== undefined;
  const principal =
    isAuthenticated && identity ? identity.getPrincipal() : null;

  return {
    isAuthenticated,
    principal,
    login,
    logout: clear,
  };
}
