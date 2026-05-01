import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Coins,
  Heart,
  Menu,
  Moon,
  Search,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  new_chapter: <BookOpen className="w-4 h-4 text-primary" />,
  coins: <Coins className="w-4 h-4 text-amber-500" />,
  like: <Heart className="w-4 h-4 text-rose-500" />,
  follow: <Zap className="w-4 h-4 text-green-500" />,
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function Header() {
  const {
    currentUser,
    isDarkMode,
    toggleDarkMode,
    toggleSidebar,
    isSidebarOpen,
    notifications,
    markNotificationsRead,
    setSearchQuery,
    searchQuery,
  } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      void navigate({ to: "/" });
    }
  };

  function handleOpenNotif() {
    setNotifOpen((v) => !v);
    if (!notifOpen && unreadCount > 0) {
      markNotificationsRead();
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-border",
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-md py-2"
          : "bg-card py-3",
      )}
      data-ocid="header"
    >
      <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-3">
        {/* Hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={toggleSidebar}
          data-ocid="sidebar.toggle"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <Logo
            size={scrolled ? "sm" : "md"}
            animate
            className={cn(
              "transition-all duration-300",
              scrolled && "scale-90",
            )}
          />
        </Link>

        {/* Search bar — desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comics, authors..."
              className="pl-10 rounded-xl bg-muted/60 border-transparent focus:border-primary/50 transition-smooth"
              data-ocid="header.search_input"
            />
          </div>
        </form>

        {/* Spacer */}
        <div className="flex-1 md:flex-none" />

        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Search"
          data-ocid="header.search_button"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Dark Mode */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          data-ocid="header.dark_mode_toggle"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            data-ocid="header.notifications_button"
            onClick={handleOpenNotif}
          >
            <Bell className="w-5 h-5" />
          </Button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-primary text-primary-foreground rounded-full flex items-center justify-center pointer-events-none">
              {unreadCount}
            </span>
          )}

          {/* Notification dropdown */}
          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 animate-scale-in"
              data-ocid="header.notifications.popover"
            >
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-smooth border-b border-border/40 last:border-0",
                        !n.isRead && "bg-primary/5",
                      )}
                      data-ocid="header.notification.item"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-muted flex items-center justify-center mt-0.5">
                        {NOTIF_ICONS[n.type] ?? (
                          <Bell className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground line-clamp-1">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-border">
                <button
                  type="button"
                  className="w-full text-xs text-primary hover:text-primary/80 transition-smooth py-1"
                  onClick={() => setNotifOpen(false)}
                  data-ocid="header.notifications.close_button"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Coins */}
        <Link to="/coins">
          <Badge
            variant="secondary"
            className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-xl cursor-pointer hover:bg-primary/10 transition-smooth"
            data-ocid="header.coins_badge"
          >
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold">
              {currentUser?.coins ?? 0}
            </span>
          </Badge>
        </Link>

        {/* Avatar / Login */}
        <Link to="/profile" data-ocid="header.profile_link">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-8 h-8 rounded-full object-cover border-2 border-primary/30 hover:border-primary transition-smooth"
            />
          ) : (
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold hover:opacity-90 transition-smooth">
              {(currentUser?.username?.[0] ?? "U").toUpperCase()}
            </div>
          )}
        </Link>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 animate-scale-in">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comics..."
                className="pl-10 rounded-xl bg-muted/60"
                autoFocus
                data-ocid="header.mobile_search_input"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
