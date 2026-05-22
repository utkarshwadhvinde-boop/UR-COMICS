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
      className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg mx-2 transition-colors-fast ${
        isActive
          ? "text-accent bg-purple-900/40 font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-purple-900/30"
      }`}
      data-ocid={ocid}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="font-body">{label}</span>
    </Link>
  );
}

function ResumeReadingSection({ onClose }: { onClose: () => void }) {
  const { data: resumeItems, isLoading } = useResumeReading(undefined);

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-8 bg-purple-900/20 rounded mb-1 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!resumeItems?.length) return null;

  return (
    <div className="px-2 mb-1">
      <p className="px-4 py-1 text-xs text-muted-foreground font-body uppercase tracking-wider">
        Continue Reading
      </p>
      {(resumeItems as import("@/types/index").Comic[])
        .slice(0, 3)
        .map((comic, idx) => (
          <Link
            key={comic.id}
            to="/comics/$comicId"
            params={{ comicId: comic.id }}
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg mx-0 transition-colors-fast text-muted-foreground hover:text-foreground hover:bg-purple-900/30 group"
            data-ocid={`sidebar.resume_item.${idx + 1}`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0 text-accent/60 group-hover:text-accent" />
            <span className="font-body text-xs truncate flex-1">
              {comic.title}
            </span>
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
      className="flex flex-col h-full py-4 overflow-y-auto"
      aria-label="Sidebar navigation"
    >
      {/* Main links */}
      <div className="space-y-0.5 mb-3">
        <NavLink
          to="/"
          icon={Home}
          label="Home"
          ocid="sidebar.home_link"
          onClick={onClose}
        />
        <NavLink
          to="/trending"
          icon={Flame}
          label="Trending"
          ocid="sidebar.trending_link"
          onClick={onClose}
        />
      </div>

      {/* Continue reading */}
      {isAuthenticated && <ResumeReadingSection onClose={onClose} />}

      <div className="mx-4 border-t border-purple-900/30 my-3" />

      {/* Creator links */}
      {isAuthenticated && (
        <div className="space-y-0.5 mb-3">
          <p className="px-6 py-1 text-xs text-muted-foreground font-body uppercase tracking-wider">
            Creator
          </p>
          <NavLink
            to="/creator"
            icon={Layers}
            label="My Studio"
            ocid="sidebar.creator_link"
            onClick={onClose}
          />
          <NavLink
            to="/creator/comics/new"
            icon={BookOpen}
            label="New Comic"
            ocid="sidebar.new_comic_link"
            onClick={onClose}
          />
        </div>
      )}

      <div className="mx-4 border-t border-purple-900/30 my-3" />

      {/* FAQ */}
      <NavLink
        to="/faq"
        icon={HelpCircle}
        label="Help & FAQ"
        ocid="sidebar.faq_link"
        onClick={onClose}
      />

      {isAuthenticated && (
        <NavLink
  to={`/profile/${profile?.handle ?? user?.id}`}
  icon={User}
  label="My Profile"
  ocid="sidebar.profile_link"
  onClick={onClose}
/>
      )}

      <NavLink
        to="/privacy-policy"
        icon={User}
        label="Privacy Policy"
        ocid="sidebar.privacy_link"
        onClick={onClose}
      />

      {/* Auth */}
      <div className="mt-auto pt-3 px-2">
        {isAuthenticated ? (
          <>
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-purple-900/20 mx-0 mb-1">
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-display text-sm font-bold shrink-0">
                  {(user.email ?? user.id).slice(0, 1).toUpperCase()}
                </div>
                <span className="font-body text-xs text-muted-foreground truncate">
                  {(user.email ?? user.id).slice(0, 20)}…
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors-fast text-muted-foreground hover:text-foreground hover:bg-purple-900/30 font-body"
              data-ocid="sidebar.logout_button"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-lg text-accent font-body opacity-60">
            <LogIn className="w-4 h-4 shrink-0" />
            Sign In via Home
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-60 z-40"
        style={{
          background: "rgba(26, 11, 46, 0.85)",
          borderRight: "1px solid rgba(139, 92, 246, 0.18)",
        }}
        data-ocid="sidebar.panel"
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay + drawer */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={onClose}
          onKeyDown={onClose}
          role="presentation"
          aria-hidden="true"
          style={{ background: "rgba(0,0,0,0.6)" }}
        />
      )}
      <aside
        className={`md:hidden fixed left-0 top-16 bottom-0 w-60 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(26, 11, 46, 0.97)",
          borderRight: "1px solid rgba(139, 92, 246, 0.3)",
        }}
        aria-hidden={!isOpen}
        data-ocid="sidebar.mobile_panel"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
