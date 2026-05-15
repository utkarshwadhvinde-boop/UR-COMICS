import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
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

  // Sign-in fields
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign-up fields
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first field when opening
  useEffect(() => {
    if (open) {
      clearError();
      setLocalError(null);
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [open, clearError]);

  // ESC to close
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
    const ok = await login(siEmail, siPassword);
    if (ok) {
      onClose();
      setSiEmail("");
      setSiPassword("");
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (suPassword !== suConfirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    if (suPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    const ok = await signUp(suEmail, suPassword, suName);
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-purple-800/40 bg-[#0a0a0f] shadow-2xl"
        style={{ boxShadow: "0 0 48px 0 rgba(139,92,246,0.18)" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Close"
          data-ocid="auth.close_button"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <img
            src="/assets/img-20260428-wa0003-019e21dd-b107-767a-9daf-d9785d41d9cd.jpg"
            alt="UR COMICS"
            className="h-14 w-auto object-contain rounded-md mb-3"
          />
          <p className="text-muted-foreground text-sm text-center">
            {tab === "signin"
              ? "Welcome back. Sign in to continue."
              : "Create your account and start reading."}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex mx-6 mb-4 rounded-lg bg-white/5 p-1 gap-1"
          role="tablist"
        >
          {(["signin", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t);
                clearError();
                setLocalError(null);
              }}
              className={cn(
                "flex-1 py-1.5 rounded-md text-sm font-medium transition-colors",
                tab === t
                  ? "bg-accent text-white shadow"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={t === "signin" ? "auth.signin_tab" : "auth.signup_tab"}
            >
              {t === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="px-6 pb-8">
          {tab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="si-email"
                  className="block text-xs font-medium text-muted-foreground mb-1"
                >
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
                  data-ocid="auth.email_input"
                />
              </div>
              <div>
                <label
                  htmlFor="si-password"
                  className="block text-xs font-medium text-muted-foreground mb-1"
                >
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
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  data-ocid="auth.password_input"
                />
              </div>

              {combinedError && (
                <p
                  className="text-red-400 text-xs"
                  data-ocid="auth.error_state"
                >
                  {combinedError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-md font-semibold text-sm text-white transition-all disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #8B5CF6 60%, #a78bfa 100%)",
                  boxShadow: isLoading
                    ? "none"
                    : "0 0 16px rgba(139,92,246,0.4)",
                }}
                data-ocid="auth.submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-label="Loading"
                    >
                      <title>Loading</title>
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Signing in\u2026
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="su-name"
                  className="block text-xs font-medium text-muted-foreground mb-1"
                >
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
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
                  placeholder="YourName"
                  data-ocid="auth.display_name_input"
                />
              </div>
              <div>
                <label
                  htmlFor="su-email"
                  className="block text-xs font-medium text-muted-foreground mb-1"
                >
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
                  data-ocid="auth.signup_email_input"
                />
              </div>
              <div>
                <label
                  htmlFor="su-password"
                  className="block text-xs font-medium text-muted-foreground mb-1"
                >
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
                  data-ocid="auth.signup_password_input"
                />
              </div>
              <div>
                <label
                  htmlFor="su-confirm"
                  className="block text-xs font-medium text-muted-foreground mb-1"
                >
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
                  data-ocid="auth.confirm_password_input"
                />
              </div>

              {combinedError && (
                <p
                  className="text-red-400 text-xs"
                  data-ocid="auth.error_state"
                >
                  {combinedError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-md font-semibold text-sm text-white transition-all disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #8B5CF6 60%, #a78bfa 100%)",
                  boxShadow: isLoading
                    ? "none"
                    : "0 0 16px rgba(139,92,246,0.4)",
                }}
                data-ocid="auth.signup_submit_button"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      role="img"
                    >
                      <title>Loading</title>
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Creating account\u2026
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
