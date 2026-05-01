import { CoinBadge } from "@/components/ui/CoinBadge";
import { ComicCard } from "@/components/ui/ComicCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveUser } from "@/lib/localStorage";
import { useAppStore } from "@/store";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  BookmarkCheck,
  Calendar,
  Coins,
  Edit,
  Flame,
  Key,
  LogOut,
  Play,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function StatCard({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-card rounded-2xl border border-border p-4 text-center shadow-sm"
    >
      <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { currentUser, isLoggedIn, login, logout, comics, updateUser } =
    useAppStore();
  const navigate = useNavigate();

  // Auth state
  const [loginMode, setLoginMode] = useState<"login" | "signup">("login");
  const [loginOpen, setLoginOpen] = useState(false);
  const [authUsername, setAuthUsername] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Settings state
  const [newUsername, setNewUsername] = useState(currentUser?.username ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Daily streak check on mount — intentionally run once
  const checkedStreakRef = useRef(false);
  useEffect(() => {
    if (checkedStreakRef.current || !currentUser) return;
    checkedStreakRef.current = true;
    const now = Date.now();
    const lastLogin = currentUser.lastLogin ?? 0;
    const diffHours = (now - lastLogin) / 3600000;
    if (diffHours >= 24) {
      const isNewDay =
        new Date(now).toDateString() !== new Date(lastLogin).toDateString();
      const streak =
        isNewDay && diffHours < 48 ? (currentUser.dailyStreak ?? 0) + 1 : 1;
      updateUser({ dailyStreak: streak, lastLogin: now });
    }
  }, [currentUser, updateUser]);

  const bookmarkedComics = comics.filter((c) =>
    currentUser?.bookmarks.includes(c.id),
  );
  const readHistory = (currentUser?.readingHistory ?? [])
    .slice()
    .sort((a, b) => b.lastReadAt - a.lastReadAt);
  const followedCreators = currentUser?.followedCreators ?? [];
  const uniqueCreators = [
    ...new Set(
      comics
        .filter((c) => followedCreators.includes(c.creatorId))
        .map((c) => ({ id: c.creatorId, name: c.author })),
    ),
  ];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUsername.trim()) {
      toast.error("Enter a username");
      return;
    }
    login({
      id: `user-${Date.now()}`,
      username: authUsername.trim(),
      email: authEmail.trim(),
      avatar: "",
      coins: 100,
      bookmarks: [],
      likedComics: [],
      readingHistory: [],
      followedCreators: [],
      dailyStreak: 1,
      lastLogin: Date.now(),
      createdAt: Date.now(),
      role: "user",
      bio: "",
      unlockedChapters: [],
    });
    toast.success(
      loginMode === "signup" ? "Account created! 🎉" : "Welcome back! 👋",
    );
    setLoginOpen(false);
  };

  const handleSaveUsername = () => {
    if (!newUsername.trim() || newUsername === currentUser?.username) return;
    updateUser({ username: newUsername.trim() });
    toast.success("Username updated");
  };

  const handleChangePassword = () => {
    if (!newPw || newPw.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Passwords don't match");
      return;
    }
    toast.success("Password updated (local)");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setSettingsOpen(false);
  };

  const handleUnfollow = (creatorId: string) => {
    const updated = followedCreators.filter((id) => id !== creatorId);
    updateUser({ followedCreators: updated });
    toast.success("Unfollowed");
  };

  const handleUnbookmark = (comicId: string) => {
    const updated = (currentUser?.bookmarks ?? []).filter(
      (id) => id !== comicId,
    );
    updateUser({ bookmarks: updated });
    toast.success("Bookmark removed");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate({ to: "/" });
  };

  const joinDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center px-4"
        data-ocid="profile.page"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-4xl font-bold mx-auto mb-5 shadow-glow">
            U
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign in to access bookmarks, reading history, coins, and more.
          </p>
          <div className="flex gap-3 justify-center">
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gradient-primary text-primary-foreground border-0 rounded-xl px-6"
                  data-ocid="profile.login_button"
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Login
                </Button>
              </DialogTrigger>
              <DialogContent
                className="rounded-2xl sm:max-w-md"
                data-ocid="profile.login_dialog"
              >
                <DialogHeader>
                  <DialogTitle className="text-xl font-display">
                    {loginMode === "login"
                      ? "Welcome Back 👋"
                      : "Join UR Comics 🎉"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAuth} className="space-y-4 mt-2">
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <Input
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="Your username"
                      className="mt-1 rounded-xl"
                      data-ocid="profile.username_input"
                    />
                  </div>
                  {loginMode === "signup" && (
                    <>
                      <div>
                        <Label className="text-sm font-medium">
                          Email (optional)
                        </Label>
                        <Input
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="your@email.com"
                          type="email"
                          className="mt-1 rounded-xl"
                          data-ocid="profile.email_input"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Password</Label>
                        <Input
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="Create a password"
                          type="password"
                          className="mt-1 rounded-xl"
                          data-ocid="profile.password_input"
                        />
                      </div>
                    </>
                  )}
                  {loginMode === "login" && (
                    <div>
                      <Label className="text-sm font-medium">Password</Label>
                      <Input
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Your password"
                        type="password"
                        className="mt-1 rounded-xl"
                        data-ocid="profile.login_password_input"
                      />
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11"
                    data-ocid="profile.auth_submit_button"
                  >
                    {loginMode === "login" ? "Login" : "Create Account"}
                  </Button>
                  <button
                    type="button"
                    className="w-full text-sm text-primary hover:underline"
                    onClick={() =>
                      setLoginMode(loginMode === "login" ? "signup" : "login")
                    }
                  >
                    {loginMode === "login"
                      ? "New here? Create an account"
                      : "Already have an account? Login"}
                  </button>
                </form>
              </DialogContent>
            </Dialog>
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl px-6"
                  onClick={() => setLoginMode("signup")}
                  data-ocid="profile.signup_button"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-ocid="profile.page">
      {/* Hero Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl overflow-hidden mb-6"
      >
        {/* Gradient banner */}
        <div className="gradient-primary h-28 w-full" />
        <div className="bg-card border border-border border-t-0 rounded-b-3xl px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow border-4 border-card">
              {(currentUser?.username?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="flex gap-2 mt-2">
              {/* Settings Dialog */}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    data-ocid="profile.settings_button"
                  >
                    <Settings className="w-4 h-4 mr-1.5" /> Settings
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="rounded-2xl sm:max-w-md"
                  data-ocid="profile.settings_dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="font-display">
                      Account Settings
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-5 mt-2">
                    {/* Change username */}
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1.5 mb-2">
                        <Edit className="w-3.5 h-3.5" /> Username
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="New username"
                          className="rounded-xl"
                          data-ocid="profile.new_username_input"
                        />
                        <Button
                          onClick={handleSaveUsername}
                          className="rounded-xl gradient-primary text-primary-foreground border-0 shrink-0"
                          data-ocid="profile.save_username_button"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    {/* Change password */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5" /> Change Password
                      </Label>
                      <Input
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        placeholder="Current password"
                        type="password"
                        className="rounded-xl"
                        data-ocid="profile.current_password_input"
                      />
                      <Input
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder="New password"
                        type="password"
                        className="rounded-xl"
                        data-ocid="profile.new_password_input"
                      />
                      <Input
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        placeholder="Confirm new password"
                        type="password"
                        className="rounded-xl"
                        data-ocid="profile.confirm_password_input"
                      />
                      <Button
                        onClick={handleChangePassword}
                        variant="outline"
                        className="w-full rounded-xl"
                        data-ocid="profile.save_password_button"
                      >
                        <Shield className="w-4 h-4 mr-2" /> Update Password
                      </Button>
                    </div>
                    <Separator />
                    {/* Danger zone */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Danger Zone
                      </p>
                      <Dialog
                        open={deleteConfirmOpen}
                        onOpenChange={setDeleteConfirmOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                            data-ocid="profile.delete_account_button"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="rounded-2xl"
                          data-ocid="profile.delete_dialog"
                        >
                          <DialogHeader>
                            <DialogTitle className="text-destructive">
                              Delete Account?
                            </DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground">
                            This will permanently delete your account and all
                            saved data.
                          </p>
                          <div className="flex gap-3 mt-4">
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl"
                              onClick={() => setDeleteConfirmOpen(false)}
                              data-ocid="profile.delete_cancel_button"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1 rounded-xl"
                              onClick={() => {
                                handleLogout();
                                toast.success("Account deleted");
                              }}
                              data-ocid="profile.delete_confirm_button"
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl text-muted-foreground hover:text-destructive"
                data-ocid="profile.logout_button"
              >
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            </div>
          </div>

          {/* User info */}
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {currentUser?.username}
            </h1>
            {currentUser?.email && (
              <p className="text-sm text-muted-foreground">
                {currentUser.email}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <CoinBadge amount={currentUser?.coins ?? 0} />
              <Badge
                variant="secondary"
                className="flex items-center gap-1 rounded-xl text-orange-600 bg-orange-500/10 border-orange-500/20"
              >
                <Flame className="w-3.5 h-3.5" />
                {currentUser?.dailyStreak ?? 1} day streak
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" /> Joined {joinDate}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Bookmarks"
          value={bookmarkedComics.length}
          icon={BookmarkCheck}
          delay={0.05}
        />
        <StatCard
          label="Comics Read"
          value={readHistory.length}
          icon={BookOpen}
          delay={0.1}
        />
        <StatCard
          label="Following"
          value={uniqueCreators.length}
          icon={Users}
          delay={0.15}
        />
        <StatCard
          label="Coins"
          value={currentUser?.coins ?? 0}
          icon={Coins}
          delay={0.2}
        />
      </div>

      {/* Creator Dashboard Banner */}
      <div className="bg-muted/30 rounded-2xl border border-border p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">Creator Studio</p>
          <p className="text-sm text-muted-foreground">
            Publish and manage your comics
          </p>
        </div>
        <Link to="/creator-dashboard">
          <Button
            variant="outline"
            className="rounded-xl"
            data-ocid="profile.creator_dashboard_link"
          >
            <Edit className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </Link>
      </div>

      {/* Tabs: Bookmarks / History / Following */}
      <Tabs defaultValue="bookmarks" data-ocid="profile.tabs">
        <TabsList className="w-full rounded-2xl bg-muted/40 mb-6">
          <TabsTrigger
            value="bookmarks"
            className="flex-1 rounded-xl"
            data-ocid="profile.bookmarks_tab"
          >
            <BookmarkCheck className="w-4 h-4 mr-1.5" /> Bookmarks
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-1 rounded-xl"
            data-ocid="profile.history_tab"
          >
            <BookOpen className="w-4 h-4 mr-1.5" /> History
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="flex-1 rounded-xl"
            data-ocid="profile.following_tab"
          >
            <Users className="w-4 h-4 mr-1.5" /> Following
          </TabsTrigger>
        </TabsList>

        {/* Bookmarks */}
        <TabsContent value="bookmarks">
          {bookmarkedComics.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="profile.bookmarks_empty_state"
            >
              <BookmarkCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bookmarks yet</p>
              <p className="text-sm mt-1">
                Bookmark comics to find them quickly later.
              </p>
              <Link to="/">
                <Button
                  className="mt-4 rounded-xl gradient-primary text-primary-foreground border-0"
                  data-ocid="profile.browse_comics_button"
                >
                  Browse Comics
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {bookmarkedComics.map((c, i) => (
                <div key={c.id} className="relative group">
                  <ComicCard comic={c} index={i} />
                  <button
                    type="button"
                    onClick={() => handleUnbookmark(c.id)}
                    className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition-smooth"
                    aria-label="Remove bookmark"
                    data-ocid={`profile.unbookmark_button.${i + 1}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Reading History */}
        <TabsContent value="history">
          {readHistory.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="profile.history_empty_state"
            >
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No reading history yet</p>
              <p className="text-sm mt-1">
                Start reading to track your progress.
              </p>
              <Link to="/">
                <Button
                  className="mt-4 rounded-xl gradient-primary text-primary-foreground border-0"
                  data-ocid="profile.start_reading_button"
                >
                  Start Reading
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {readHistory.map((prog, i) => {
                const comic = comics.find((c) => c.id === prog.comicId);
                if (!comic) return null;
                const totalChapters = comic.chapters.length;
                const progressPct = totalChapters
                  ? Math.round((prog.chapterNumber / totalChapters) * 100)
                  : 0;
                const timeAgo = (() => {
                  const diff = Date.now() - prog.lastReadAt;
                  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
                  if (diff < 86400000)
                    return `${Math.floor(diff / 3600000)}h ago`;
                  return `${Math.floor(diff / 86400000)}d ago`;
                })();
                return (
                  <motion.div
                    key={prog.comicId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm"
                    data-ocid={`profile.history_item.${i + 1}`}
                  >
                    <Link
                      to="/read/$comicId/$chapterId"
                      params={{ comicId: comic.id, chapterId: prog.chapterId }}
                    >
                      <img
                        src={comic.coverImage}
                        alt={comic.title}
                        className="w-14 h-20 object-cover rounded-xl shrink-0 hover:scale-105 transition-smooth"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to="/read/$comicId/$chapterId"
                        params={{
                          comicId: comic.id,
                          chapterId: prog.chapterId,
                        }}
                      >
                        <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-smooth">
                          {comic.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Chapter {prog.chapterNumber} • {timeAgo}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{progressPct}%</span>
                        </div>
                        <Progress
                          value={progressPct}
                          className="h-1.5 rounded-full"
                        />
                      </div>
                    </div>
                    <Link
                      to="/read/$comicId/$chapterId"
                      params={{ comicId: comic.id, chapterId: prog.chapterId }}
                    >
                      <Button
                        size="sm"
                        className="rounded-xl gradient-primary text-primary-foreground border-0 shrink-0"
                        data-ocid={`profile.continue_button.${i + 1}`}
                      >
                        <Play className="w-3.5 h-3.5 mr-1" /> Continue
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Following */}
        <TabsContent value="following">
          {uniqueCreators.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="profile.following_empty_state"
            >
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Not following anyone yet</p>
              <p className="text-sm mt-1">
                Follow creators to see their updates.
              </p>
              <Link to="/">
                <Button
                  className="mt-4 rounded-xl gradient-primary text-primary-foreground border-0"
                  data-ocid="profile.discover_creators_button"
                >
                  Discover Creators
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {uniqueCreators.map((creator, i) => {
                const creatorComics = comics.filter(
                  (c) => c.creatorId === creator.id,
                );
                return (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border shadow-sm"
                    data-ocid={`profile.followed_creator.${i + 1}`}
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      {creator.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">
                        {creator.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {creatorComics.length} comic
                        {creatorComics.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-muted-foreground"
                      onClick={() => handleUnfollow(creator.id)}
                      data-ocid={`profile.unfollow_button.${i + 1}`}
                    >
                      Unfollow
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
