import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const displayLabel =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";
  const displayInitial = displayLabel.slice(0, 1).toUpperCase() || "U";

  return (
    <>
      <header
        data-ocid="header.bar"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "12px",
          background: "#111",
          borderBottom: "3px solid #cc0000",
          boxSizing: "border-box",
        }}
      >
        {/* Yellow screentone overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          pointerEvents: "none",
        }} />

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          data-ocid="header.mobile_menu_button"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#fff", padding: "8px", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
          className="md:hidden"
        >
          <Menu style={{ width: 20, height: 20 }} />
        </button>

        {/* Logo */}
        <Link
          to="/"
          data-ocid="header.logo_link"
          style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}
        >
          <img
            src="/assets/IMG-20260428-WA0003.jpg"
            style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "4px", border: "2px solid #cc0000" }}
            alt="UR COMICS"
          />
          <span style={{ fontFamily: "serif", fontSize: "18px", fontWeight: 900, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#fff" }}>UR</span>
            <span style={{ color: "#cc0000", marginLeft: "4px" }}>COMICS</span>
          </span>
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Auth section */}
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              data-ocid="header.account_button"
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#cc0000", border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontFamily: "monospace", fontSize: "13px",
                fontWeight: 900, flexShrink: 0,
              }}
            >
              {displayInitial}
            </div>
            <button
              type="button"
              onClick={logout}
              data-ocid="header.logout_button"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.6)", display: "flex",
                alignItems: "center", gap: "4px", fontFamily: "monospace",
                fontSize: "12px", padding: "4px",
              }}
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            data-ocid="header.login_button"
            style={{
              padding: "8px 18px",
              background: "#cc0000",
              border: "2px solid #fff",
              color: "#fff",
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: "13px",
              cursor: "pointer",
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "3px 3px 0px #fff",
            }}
          >
            Sign In
          </button>
        )}
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
