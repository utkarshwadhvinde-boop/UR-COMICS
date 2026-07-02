import { useAuth } from "@/hooks/useAuth";
import { cn, isValidEmail, sanitizeDisplayName, sanitizeText } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = "signin" | "signup";

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, signUp, isLoading, error, clearError } = useAuth();
  const [tab, setTab] = useState<Tab>("signin");

  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      clearError();
      setLocalError(null);
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [open, clearError]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const combinedError = localError ?? error;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const email = sanitizeText(siEmail);
    if (!isValidEmail(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (!siPassword) {
      setLocalError("Please enter your password.");
      return;
    }
    const ok = await login(email, siPassword);
    if (ok) {
      onClose();
      setSiEmail("");
      setSiPassword("");
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    const cleanName = sanitizeDisplayName(suName);
    if (!cleanName) {
      setLocalError("Display name is required and must be under 100 characters.");
      return;
    }
    const email = sanitizeText(suEmail);
    if (!isValidEmail(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (suPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (suPassword !== suConfirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    const ok = await signUp(email, suPassword, cleanName);
    if (ok) {
      onClose();
      setSuName("");
      setSuEmail("");
      setSuPassword("");
      setSuConfirm("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      aria-label="Authentication"
      data-ocid="auth.dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-purple-800/40 bg-[#0a0a0f] shadow-2xl"
        style={{ boxShadow: "0 0 48px 0 rgba(139,92,246,0.18)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <img
            src="/assets/IMG-20260428-WA0003.jpg"
            alt="UR COMICS"
            className="h-14 w-auto object-contain rounded-md mb-3"
          />
          <p className="text-muted-foreground text-sm text-center">
            {tab === "signin"
              ? "Welcome back. Sign in to continue."
              : "Create your account and start reading."}
          </p>
        </div>

        <div className="flex mx-6 mb-4 rounded-lg bg-white/5 p-1 gap-1" role="tablist">
          {(["signin", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => { setTab(t); clearError(); setLocalError(null); }}
              className={cn(
                "flex-1 py-1.5 rounded-md text-sm font-medium transition-colors",
                tab === t ? "bg-accent text-white shadow" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div className="px-6 pb-8">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={async () => {
              const { supabase } = await import("@/lib/supabase");
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: window.location.origin },
              });
            }}
            style={{
              width: "100%", padding: "10px", borderRadius: "10px", marginBottom: "16px",
              background: "#fff", border: "1px solid rgba(0,0,0,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              fontSize: "14px", fontWeight: 700, color: "#333", cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-label="Google">
              <title>Google</title>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <div>
                <label htmlFor="si-email" className="block text-xs font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  ref={firstInputRef}
                  id="si-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={siEmail}
                  onChange={(e) => setSiEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="si-password" className="block text-xs font-medium text-muted-foreground mb-1">
                  Password
                </label>
                <input
                  id="si-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={siPassword}
                  onChange={(e) => setSiPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {combinedError && <p className="text-red-400 text-xs">{combinedError}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-md font-semibold text-sm text-white transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #8B5CF6 60%, #a78bfa 100%)",
                  boxShadow: isLoading ? "none" : "0 0 16px rgba(139,92,246,0.4)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" role="img" aria-label="Loading">
                      <title>Loading</title>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4" noValidate>
              <div>
                <label htmlFor="su-name" className="block text-xs font-medium text-muted-foreground mb-1">
                  Display Name
                </label>
                <input
                  ref={firstInputRef}
                  id="su-name"
                  type="text"
                  autoComplete="nickname"
                  required
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                  maxLength={100}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="YourName"
                />
              </div>
              <div>
                <label htmlFor="su-email" className="block text-xs font-medium text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  id="su-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="su-password" className="block text-xs font-medium text-muted-foreground mb-1">
                  Password
                </label>
                <input
                  id="su-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={suPassword}
                  onChange={(e) => setSuPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label htmlFor="su-confirm" className="block text-xs font-medium text-muted-foreground mb-1">
                  Confirm Password
                </label>
                <input
                  id="su-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={suConfirm}
                  onChange={(e) => setSuConfirm(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="Re-enter password"
                />
              </div>

              {combinedError && <p className="text-red-400 text-xs">{combinedError}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-md font-semibold text-sm text-white transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #8B5CF6 60%, #a78bfa 100%)",
                  boxShadow: isLoading ? "none" : "0 0 16px rgba(139,92,246,0.4)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" role="img">
                      <title>Loading</title>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Creating account…
                  </span>
                ) : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
          }
