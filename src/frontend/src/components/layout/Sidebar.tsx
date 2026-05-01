import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BookOpen,
  Coins,
  HelpCircle,
  Home,
  TrendingUp,
  Upload,
  User,
  X,
} from "lucide-react";
import { Logo } from "./Logo";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, ocid: "sidebar.home_link" },
  {
    to: "/trending",
    label: "Trending",
    icon: TrendingUp,
    ocid: "sidebar.trending_link",
  },
  {
    to: "/library",
    label: "Continue Reading",
    icon: BookOpen,
    ocid: "sidebar.library_link",
  },
  { to: "/create", label: "Upload", icon: Upload, ocid: "sidebar.upload_link" },
  {
    to: "/faq",
    label: "Help & FAQs",
    icon: HelpCircle,
    ocid: "sidebar.faq_link",
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
    ocid: "sidebar.profile_link",
  },
  { to: "/coins", label: "UR Coins", icon: Coins, ocid: "sidebar.coins_link" },
] as const;

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen, currentUser } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 w-72 bg-card border-r border-border shadow-lg",
          "flex flex-col transition-transform duration-300 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        data-ocid="sidebar.panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            data-ocid="sidebar.close_button"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User info */}
        {currentUser && (
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                {(currentUser.username?.[0] ?? "U").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {currentUser.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.coins} coins
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth",
                  isActive
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-foreground hover:bg-muted hover:text-foreground",
                )}
                data-ocid={ocid}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary-foreground/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} UR Comics
          </p>
        </div>
      </aside>
    </>
  );
}
