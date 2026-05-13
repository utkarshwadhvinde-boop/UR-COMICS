import { ComicCard } from "@/components/ui/ComicCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateOrUpdateProfile,
  useFollowUser,
  useGetFollowers,
  useGetFollowing,
  useIsFollowing,
  useListComics,
  useListComicsQuery,
  useUnfollowUser,
} from "@/hooks/useBackend";
import { useListComics } from "@/hooks/useBackend";
import { useAppStore } from "@/store";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  Edit,
  Heart,
  Key,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function StatBtn({
  value,
  label,
  onClick,
  delay = 0,
}: {
  value: number | string;
  label: string;
  onClick?: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      onClick={onClick}
      className={`text-center px-4 py-3 rounded-2xl bg-card border border-border ${
        onClick ? "hover:border-primary/50 cursor-pointer" : "cursor-default"
      } transition-smooth`}
    >
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </motion.button>
  );
}

function FollowerListModal({
  title,
  userIds,
  open,
  onClose,
}: {
  title: string;
  userIds: string[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="rounded-2xl sm:max-w-sm"
        data-ocid="profile.followers_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>
        {userIds.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No one yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {userIds.map((uid, i) => (
              <Link
                key={uid}
                to="/profile/$userId"
                params={{ userId: uid }}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 transition-smooth"
                data-ocid={`profile.follower_item.${i + 1}`}
              >
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {uid[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm text-foreground truncate">{uid}</span>
              </Link>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Own profile: editable */
function OwnProfile() {
  const { currentUser, logout, updateUser } = useAppStore();
  const userId = currentUser?.id;
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useGetProfile(
    userId ?? null,
  );
  const { data: allComics = [] } = useListComics();
  const { data: followers = [] } = useGetFollowers(userId ?? null);
  const { data: following = [] } = useGetFollowing(userId ?? null);
  const updateProfile = useCreateOrUpdateProfile();

  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(currentUser?.username ?? "");
  const [editBio, setEditBio] = useState(currentUser?.bio ?? "");
  const [newUsername, setNewUsername] = useState(currentUser?.username ?? "");

  const myComics = allComics.filter((c) => c.creatorId === userId);

  const joinDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  async function handleSaveProfile() {
    if (!userId) return;
    try {
      await updateProfile.mutateAsync({
        userId,
        username: editUsername.trim() || (currentUser?.username ?? ""),
        bio: editBio.trim() || undefined,
      });
      updateUser({ username: editUsername.trim(), bio: editBio.trim() });
      toast.success("Profile updated!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update profile");
    }
  }

  async function handleSaveUsername() {
    if (!userId || !newUsername.trim()) return;
    try {
      await updateProfile.mutateAsync({
        userId,
        username: newUsername.trim(),
      });
      updateUser({ username: newUsername.trim() });
      toast.success("Username updated");
      setSettingsOpen(false);
    } catch {
      toast.error("Failed to update username");
    }
  }

  function handleLogout() {
    logout();
    toast.success("Logged out");
    navigate({ to: "/" });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-ocid="profile.page">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl overflow-hidden mb-6"
      >
        <div className="gradient-primary h-28 w-full" />
        <div className="bg-card border border-border border-t-0 rounded-b-3xl px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow border-4 border-card">
              {(currentUser?.username?.[0] ?? "U").toUpperCase()}
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  setEditUsername(currentUser?.username ?? "");
                  setEditBio(currentUser?.bio ?? "");
                  setEditOpen(true);
                }}
                data-ocid="profile.edit_button"
              >
                <Edit className="w-4 h-4 mr-1.5" /> Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setSettingsOpen(true)}
                data-ocid="profile.settings_button"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
                data-ocid="profile.logout_button"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {currentUser?.username}
            </h1>
            {currentUser?.bio && (
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                {currentUser.bio}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Joined {joinDate}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatBtn
          value={Number(profile?.followerCount ?? followers.length)}
          label="Followers"
          onClick={() => setFollowersOpen(true)}
          delay={0.05}
        />
        <StatBtn
          value={Number(profile?.followingCount ?? following.length)}
          label="Following"
          onClick={() => setFollowingOpen(true)}
          delay={0.1}
        />
        <StatBtn value={myComics.length} label="Series" delay={0.15} />
        <StatBtn
          value={Number(profile?.totalLikesReceived ?? 0)}
          label="Likes"
          delay={0.2}
        />
      </div>

      {/* Creator banner */}
      <div className="bg-muted/30 rounded-2xl border border-border p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">Creator Studio</p>
          <p className="text-sm text-muted-foreground">
            Manage your comics and chapters
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

      {/* My Comics */}
      <div>
        <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> My Series
        </h2>
        {profileLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="space-y-2">
                <Skeleton className="aspect-[3/4] rounded-2xl" />
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : myComics.length === 0 ? (
          <div
            className="text-center py-12 bg-card rounded-2xl border border-border"
            data-ocid="profile.comics_empty_state"
          >
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-medium text-foreground">
              No series uploaded yet
            </p>
            <Link to="/create">
              <Button
                className="mt-4 rounded-xl gradient-primary text-primary-foreground border-0"
                data-ocid="profile.upload_cta_button"
              >
                Upload Series
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {myComics.map((c, i) => (
              <ComicCard
                key={String(c.id)}
                comic={{
                  id: String(c.id),
                  title: c.title,
                  description: c.description,
                  author: c.author,
                  coverImage: c.coverUrl,
                  genres: c.genres as never,
                  status: "ongoing",
                  likes: Number(c.likesCount),
                  views: Number(c.viewsCount),
                  rating: 0,
                  chapters: [],
                  createdAt: Number(c.createdAt),
                  updatedAt: Number(c.createdAt),
                  isFeatured: c.isFeatured,
                  isTrending: c.isTrending,
                  isPremium: c.isPremium,
                  isPinned: c.isPinned,
                  creatorId: c.creatorId,
                  isOwnerComic: c.ownerUploaded,
                }}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit profile dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="rounded-2xl sm:max-w-md"
          data-ocid="profile.edit_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-sm font-medium mb-2 block">Username</Label>
              <Input
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="Your username"
                className="rounded-xl"
                data-ocid="profile.edit_username_input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Bio</Label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell the world about yourself..."
                className="rounded-xl resize-none"
                rows={3}
                data-ocid="profile.edit_bio_input"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setEditOpen(false)}
                data-ocid="profile.edit_cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl gradient-primary text-primary-foreground border-0"
                onClick={handleSaveProfile}
                disabled={updateProfile.isPending}
                data-ocid="profile.edit_save_button"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent
          className="rounded-2xl sm:max-w-md"
          data-ocid="profile.settings_dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Account Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 mt-2">
            <div>
              <Label className="text-sm font-medium flex items-center gap-1.5 mb-2">
                <Edit className="w-3.5 h-3.5" /> Change Username
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
                  disabled={updateProfile.isPending}
                  data-ocid="profile.save_username_button"
                >
                  Save
                </Button>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Danger Zone
              </p>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setDeleteOpen(true)}
                  data-ocid="profile.delete_account_button"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </Button>
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
                    This will permanently delete your account and all saved
                    data.
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => setDeleteOpen(false)}
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

      <FollowerListModal
        title="Followers"
        userIds={followers}
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
      />
      <FollowerListModal
        title="Following"
        userIds={following}
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
      />
    </div>
  );
}

/** Public creator profile: readonly + follow button */
function PublicProfile({ userId }: { userId: string }) {
  const { currentUser } = useAppStore();
  const viewerId = currentUser?.id;

  const { data: profile, isLoading } = useGetProfile(userId);
  const { data: allComics = [] } = useListComicsQuery();
  const { data: isFollowingNow = false } = useIsFollowing(
    viewerId ?? null,
    userId,
  );
  const { data: followers = [] } = useGetFollowers(userId);
  const { data: following = [] } = useGetFollowing(userId);
  const followMut = useFollowUser();
  const unfollowMut = useUnfollowUser();
  const [optimisticFollow, setOptimisticFollow] = useState<boolean | null>(
    null,
  );
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const effectiveFollowing = optimisticFollow ?? isFollowingNow;
  const creatorComics = allComics.filter((c) => c.creatorId === userId);

  const joinDate = profile?.createdAt
    ? new Date(Number(profile.createdAt) / 1_000_000).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        },
      )
    : "—";

  async function handleFollowToggle() {
    if (!viewerId) {
      toast.error("Sign in to follow creators");
      return;
    }
    setOptimisticFollow(!effectiveFollowing);
    try {
      if (effectiveFollowing) {
        await unfollowMut.mutateAsync({
          followerId: viewerId,
          followeeId: userId,
        });
        toast.success("Unfollowed");
      } else {
        await followMut.mutateAsync({
          followerId: viewerId,
          followeeId: userId,
        });
        toast.success("Following!");
      }
    } catch {
      setOptimisticFollow(null);
      toast.error("Action failed");
    }
  }

  if (isLoading) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-8 space-y-4"
        data-ocid="profile.page"
      >
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        data-ocid="profile.page"
      >
        <p className="text-muted-foreground">Creator not found.</p>
        <Link to="/">
          <Button className="mt-4 rounded-xl" variant="outline">
            Go Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-ocid="profile.page">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl overflow-hidden mb-6"
      >
        <div className="gradient-primary h-28 w-full" />
        <div className="bg-card border border-border border-t-0 rounded-b-3xl px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-glow"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow border-4 border-card">
                {profile.username[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <Button
              className={`rounded-xl mt-2 ${effectiveFollowing ? "" : "gradient-primary text-primary-foreground border-0"}`}
              variant={effectiveFollowing ? "outline" : "default"}
              onClick={handleFollowToggle}
              disabled={followMut.isPending || unfollowMut.isPending}
              data-ocid="profile.follow_button"
            >
              {effectiveFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 mr-1.5" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-1.5" /> Follow
                </>
              )}
            </Button>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {profile.username}
            </h1>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                {profile.bio}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              Joined {joinDate}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatBtn
          value={Number(profile.followerCount)}
          label="Followers"
          onClick={() => setFollowersOpen(true)}
          delay={0.05}
        />
        <StatBtn
          value={Number(profile.followingCount)}
          label="Following"
          onClick={() => setFollowingOpen(true)}
          delay={0.1}
        />
        <StatBtn value={creatorComics.length} label="Series" delay={0.15} />
        <StatBtn
          value={Number(profile.totalLikesReceived)}
          label="Likes"
          delay={0.2}
        />
      </div>

      {/* Series grid */}
      <div>
        <h2 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Published Series
        </h2>
        {creatorComics.length === 0 ? (
          <div
            className="text-center py-12 bg-card rounded-2xl border border-border"
            data-ocid="profile.comics_empty_state"
          >
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-medium text-foreground">
              No published series yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {creatorComics.map((c, i) => (
              <ComicCard
                key={String(c.id)}
                comic={{
                  id: String(c.id),
                  title: c.title,
                  description: c.description,
                  author: c.author,
                  coverImage: c.coverUrl,
                  genres: c.genres as never,
                  status: "ongoing",
                  likes: Number(c.likesCount),
                  views: Number(c.viewsCount),
                  rating: 0,
                  chapters: [],
                  createdAt: Number(c.createdAt),
                  updatedAt: Number(c.createdAt),
                  isFeatured: c.isFeatured,
                  isTrending: c.isTrending,
                  isPremium: c.isPremium,
                  isPinned: c.isPinned,
                  creatorId: c.creatorId,
                  isOwnerComic: c.ownerUploaded,
                }}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      <FollowerListModal
        title="Followers"
        userIds={followers}
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
      />
      <FollowerListModal
        title="Following"
        userIds={following}
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
      />
    </div>
  );
}

/** Root export — dispatches to own vs public profile */
export default function ProfilePage() {
  const { currentUser, isLoggedIn, login, logout } = useAppStore();
  // Call useParams unconditionally at top level (hooks rules)
  const params = useParams({ strict: false }) as { userId?: string };
  const profileUserId = params.userId ?? null;

  const isOwnProfile =
    !profileUserId ||
    profileUserId === currentUser?.id ||
    profileUserId === "me";

  // Not logged in + viewing own profile
  if (!isLoggedIn && isOwnProfile) {
    return <LoginPrompt login={login} logout={logout} />;
  }

  if (!isOwnProfile && profileUserId) {
    return <PublicProfile userId={profileUserId} />;
  }

  return <OwnProfile />;
}

function LoginPrompt({
  login,
}: {
  login: (user: import("@/types").User) => void;
  logout: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Enter a username");
      return;
    }
    login({
      id: `user-${Date.now()}`,
      username: username.trim(),
      email: "",
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
      mode === "signup" ? "Account created! 🎉" : "Welcome back! 👋",
    );
    setOpen(false);
  }

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
          <Button
            className="gradient-primary text-primary-foreground border-0 rounded-xl px-6"
            onClick={() => {
              setMode("login");
              setOpen(true);
            }}
            data-ocid="profile.login_button"
          >
            <UserCheck className="w-4 h-4 mr-2" /> Login
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-6"
            onClick={() => {
              setMode("signup");
              setOpen(true);
            }}
            data-ocid="profile.signup_button"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Sign Up
          </Button>
        </div>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="rounded-2xl sm:max-w-md"
          data-ocid="profile.login_dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              {mode === "login" ? "Welcome Back 👋" : "Join UR Comics 🎉"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4 mt-2">
            <div>
              <Label className="text-sm font-medium">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="mt-1 rounded-xl"
                data-ocid="profile.username_input"
              />
            </div>
            <Button
              type="submit"
              className="w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11"
              data-ocid="profile.auth_submit_button"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </Button>
            <button
              type="button"
              className="w-full text-sm text-primary hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login"
                ? "New here? Create an account"
                : "Already have an account? Login"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
