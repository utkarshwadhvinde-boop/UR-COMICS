import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { isAuthenticated, principal, login, logout } = useAuth();

  const displayInitial = principal
    ? principal.toString().slice(0, 1).toUpperCase()
    : "?";

  return (
    <header
      className="glass-header fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 gap-3"
      data-ocid="header.bar"
    >
      {/* Mobile hamburger */}
      <button
        type="button"
        className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-smooth"
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        data-ocid="header.mobile_menu_button"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 group"
        data-ocid="header.logo_link"
      >
        <img
          src="/assets/img-20260428-wa0003-019e21dd-b107-767a-9daf-d9785d41d9cd.jpg"
          className="h-10 w-auto object-contain rounded-sm"
          alt="UR COMICS"
        />
        <span
          className="font-display text-xl tracking-tight leading-none hidden sm:block"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="text-foreground">UR</span>
          <span className="text-accent ml-1">COMICS</span>
        </span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Auth section */}
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-muted-foreground font-body truncate max-w-32">
            {principal?.toString().slice(0, 8)}…
          </span>
          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 border border-accent/40 text-accent font-display text-sm font-bold hover:bg-accent/30 transition-smooth"
            aria-label="Account menu"
            data-ocid="header.account_button"
          >
            {displayInitial}
          </button>
          <button
            type="button"
            onClick={logout}
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-smooth font-body"
            data-ocid="header.logout_button"
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={login}
          className="px-4 py-1.5 rounded-md bg-accent text-accent-foreground text-sm font-body font-medium hover:bg-accent/90 transition-smooth glow-accent-sm"
          data-ocid="header.login_button"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
