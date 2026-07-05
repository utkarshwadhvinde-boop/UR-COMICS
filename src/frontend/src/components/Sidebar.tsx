import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useResumeReading } from "@/hooks/useTrending";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Flame,
  HelpCircle,
  Home,
  Layers,
  LogIn,
  LogOut,
  User,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavLink({
  to,
  icon: Icon,
  label,
  ocid,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  ocid: string;
  onClick?: () => void;
}) {
  const routerState = useRouterState();
  const isActive =
    routerState.location.pathname === to ||
    (to !== "/" && routerState.location.pathname.startsWith(to));

  return (
    <Link
      to={to as "/"}
      onClick={onClick}
      data-ocid={ocid}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 16px",
        margin: "2px 8px",
        textDecoration: "none",
        fontSize: "13px",
        fontWeight: isActive ? 900 : 600,
        fontFamily: "monospace",
        color: isActive ? "#cc0000" : "#111",
        background: isActive ? "#fbbf2420" : "transparent",
        borderLeft: isActive ? "3px solid #cc0000" : "3px solid transparent",
        transition: "all 0.15s ease",
      }}
    >
      <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
      <span>{label}</span>
    </Link>
  );
}

function ResumeReadingSection({ onClose }: { onClose: () => void }) {
  const { data: resumeItems, isLoading } = useResumeReading(undefined);

  if (isLoading) return null;
  if (!resumeItems?.length) return null;

  return (
    <div style={{ padding: "0 8px", marginBottom: "8px" }}>
      <p style={{ padding: "4px 16px", fontSize: "10px", color: "#999", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>
        Continue Reading
      </p>
      {(resumeItems as import("@/types/index").Comic[]).slice(0, 3).map((comic, idx) => (
        <Link
          key={comic.id}
          to="/comics/$comicId"
          params={{ comicId: comic.id }}
          onClick={onClose}
          data-ocid={`sidebar.resume_item.${idx + 1}`}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", textDecoration: "none", color: "#555", fontSize: "12px", fontFamily: "serif" }}
        >
          <BookOpen style={{ width: 12, height: 12, flexShrink: 0, color: "#cc0000" }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{comic.title}</span>
        </Link>
      ))}
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { data: profile } = useProfile(user?.id);

  const sidebarContent = (
    <nav
      style={{ display: "flex", flexDirection: "column", height: "100%", padding: "16px 0", overflowY: "auto", background: "#f5f0e8" }}
      aria-label="Sidebar navigation"
    >
      {/* Screentone header */}
      <div style={{
        margin: "0 8px 16px",
        padding: "12px 16px",
        background: "#111",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.15,
          backgroundImage: "radial-gradient(circle, #fbbf24 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          pointerEvents: "none",
        }} />
        <p style={{ color: "#cc0000", fontSize: "10px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "2px", margin: 0, textTransform: "uppercase" }}>
          UR COMICS
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", fontFamily: "monospace", margin: "2px 0 0" }}>
          Read. Create. Discover.
        </p>
      </div>

      {/* Main links */}
      <div style={{ marginBottom: "8px" }}>
        <NavLink to="/" icon={Home} label="Home" ocid="sidebar.home_link" onClick={onClose} />
        <NavLink to="/trending" icon={Flame} label="Trending" ocid="sidebar.trending_link" onClick={onClose} />
        <NavLink to="/novels" icon={BookOpen} label="Novels" ocid="sidebar.novels_link" onClick={onClose} />
      </div>

      {/* Continue reading */}
      {isAuthenticated && <ResumeReadingSection onClose={onClose} />}

      {/* Divider */}
      <div style={{ margin: "8px 16px", height: "2px", background: "#111" }} />

      {/* Creator links */}
      {isAuthenticated && (
        <div style={{ marginBottom: "8px" }}>
          <p style={{ padding: "4px 16px", fontSize: "10px", color: "#999", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px" }}>
            Creator
          </p>
          <NavLink to="/creator" icon={Layers} label="My Studio" ocid="sidebar.creator_link" onClick={onClose} />
          <NavLink to="/creator/comics/new" icon={BookOpen} label="New Comic" ocid="sidebar.new_comic_link" onClick={onClose} />
          <NavLink to="/creator/novels/new" icon={BookOpen} label="New Novel" ocid="sidebar.new_novel_link" onClick={onClose} />
        </div>
      )}

      {/* Divider */}
      <div style={{ margin: "8px 16px", height: "2px", background: "#111" }} />

      {/* Other links */}
      <NavLink to="/faq" icon={HelpCircle} label="Help & FAQ" ocid="sidebar.faq_link" onClick={onClose} />
      {isAuthenticated && (
        <NavLink to={`/profile/${profile?.handle ?? user?.id}`} icon={User} label="My Profile" ocid="sidebar.profile_link" onClick={onClose} />
      )}
      <NavLink to="/privacy-policy" icon={User} label="Privacy Policy" ocid="sidebar.privacy_link" onClick={onClose} />
      <NavLink to="/terms" icon={User} label="Terms & Conditions" ocid="sidebar.terms_link" onClick={onClose} />

      {/* Auth */}
      <div style={{ marginTop: "auto", padding: "12px 8px 0", borderTop: "2px solid #111" }}>
        {isAuthenticated ? (
          <>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "#fff", border: "2px solid #111", margin: "0 8px 8px", boxShadow: "2px 2px 0px #111" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#cc0000", border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 900, fontFamily: "monospace", flexShrink: 0 }}>
                  {(user.email ?? user.id).slice(0, 1).toUpperCase()}
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "11px", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {(user.email ?? user.id).slice(0, 18)}…
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => { logout(); onClose(); }}
              data-ocid="sidebar.logout_button"
              style={{ display: "flex", width: "100%", alignItems: "center", gap: "10px", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", color: "#cc0000", fontSize: "13px", fontWeight: 700, fontFamily: "monospace" }}
            >
              <LogOut style={{ width: 16, height: 16 }} />
              Sign Out
            </button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", color: "#999", fontSize: "13px", fontFamily: "monospace" }}>
            <LogIn style={{ width: 16, height: 16 }} />
            Sign In via Home
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-60 z-40"
        style={{ background: "#f5f0e8", borderRight: "3px solid #111" }}
        data-ocid="sidebar.panel"
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={onClose}
          onKeyDown={onClose}
          role="presentation"
          aria-hidden="true"
          style={{ background: "rgba(0,0,0,0.5)" }}
        />
      )}
      <aside
        className={`md:hidden fixed left-0 top-16 bottom-0 w-60 z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#f5f0e8", borderRight: "3px solid #111" }}
        aria-hidden={!isOpen}
        data-ocid="sidebar.mobile_panel"
      >
        {sidebarContent}
      </aside>
    </>
  );
      }
