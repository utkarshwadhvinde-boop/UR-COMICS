import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login, signUp } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      if (tab === "signin") {
        const ok = await login(email, password);
        if (ok) { toast.success("Welcome back!"); onClose(); }
        else toast.error("Invalid email or password.");
      } else {
        const ok = await signUp(email, password, displayName);
        if (ok) { toast.success("Account created! Please check your email."); onClose(); }
        else toast.error("Failed to create account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "#f5f0e8",
    border: "2px solid #111",
    color: "#111",
    fontSize: "14px",
    outline: "none",
    fontFamily: "monospace",
    boxSizing: "border-box",
    boxShadow: "3px 3px 0px #111",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        padding: "16px",
        boxSizing: "border-box",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: "400px",
        background: "#f5f0e8",
        border: "3px solid #111",
        boxShadow: "6px 6px 0px #111",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ background: "#111", padding: "16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)", backgroundSize: "10px 10px", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#cc0000", fontSize: "10px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "3px", margin: "0 0 4px", textTransform: "uppercase" }}>
                UR COMICS
              </p>
              <p style={{ color: "#fff", fontSize: "16px", fontWeight: 900, fontFamily: "serif", margin: 0 }}>
                {tab === "signin" ? "Welcome back" : "Join UR COMICS"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px", fontFamily: "monospace", padding: "4px" }}
            >
              x
            </button>
          </div>
        </div>

        <div style={{ padding: "20px" }}>
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
              width: "100%", padding: "12px", marginBottom: "16px",
              background: "#fff", border: "2px solid #111",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              fontSize: "14px", fontWeight: 700, color: "#111", cursor: "pointer",
              fontFamily: "monospace", boxSizing: "border-box",
              boxShadow: "3px 3px 0px #111", textTransform: "uppercase", letterSpacing: "1px",
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

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "2px", background: "#111" }} />
            <span style={{ color: "#666", fontSize: "12px", fontFamily: "monospace", fontWeight: 700 }}>OR</span>
            <div style={{ flex: 1, height: "2px", background: "#111" }} />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setTab("signin")}
              style={{
                flex: 1, padding: "10px", border: "2px solid #111",
                borderRight: "none", cursor: "pointer", fontFamily: "monospace",
                fontWeight: 900, fontSize: "12px", textTransform: "uppercase",
                background: tab === "signin" ? "#111" : "#fff",
                color: tab === "signin" ? "#fff" : "#111",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab("signup")}
              style={{
                flex: 1, padding: "10px", border: "2px solid #111",
                cursor: "pointer", fontFamily: "monospace",
                fontWeight: 900, fontSize: "12px", textTransform: "uppercase",
                background: tab === "signup" ? "#111" : "#fff",
                color: tab === "signup" ? "#fff" : "#111",
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tab === "signup" && (
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontFamily: "monospace", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", color: "#111" }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontFamily: "monospace", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", color: "#111" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontFamily: "monospace", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1px", color: "#111" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                style={inputStyle}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: "100%", padding: "14px",
                background: isLoading ? "#999" : "#cc0000",
                border: "2px solid #111",
                color: "#fff", fontFamily: "monospace",
                fontWeight: 900, fontSize: "14px",
                cursor: isLoading ? "not-allowed" : "pointer",
                textTransform: "uppercase", letterSpacing: "2px",
                boxShadow: isLoading ? "none" : "4px 4px 0px #111",
                boxSizing: "border-box",
              }}
            >
              {isLoading ? "Loading..." : tab === "signin" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
                }
