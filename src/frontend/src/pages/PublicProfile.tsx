import { ComicCard } from "@/components/ui/ComicCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateOrUpdateProfile,
  useFollowUser,
  useGetFollowers,
  useGetFollowing,
  useGetProfile,
  useIsFollowing,
  useListComicsQuery,
  useUnfollowUser,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Link, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  Heart,
  MessageCircle,
  UserCheck,
  UserPlus,
  Users,
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
}: { title: string; userIds: string[]; open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="rounded-2xl sm:max-w-sm"
        data-ocid="public_profile.followers_dialog"
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
                data-ocid={`public_profile.follower_item.${i + 1}`}
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

export default function PublicProfilePage() {
  const { userId } = useParams({ from: "/profile/$userId" });
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
        { month: "long", year: "numeric" },
      )
    : "\u2014";

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
        data-ocid="public_profile.page"
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
        data-ocid="public_profile.page"
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
    <div
      className="max-w-4xl mx-auto px-4 py-8"
      data-ocid="public_profile.page"
    >
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
            {viewerId && viewerId !== userId && (
              <Button
                className={cn(
                  "rounded-xl mt-2",
                  effectiveFollowing
                    ? ""
                    : "gradient-primary text-primary-foreground border-0",
                )}
                variant={effectiveFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                disabled={followMut.isPending || unfollowMut.isPending}
                data-ocid="public_profile.follow_button"
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
            )}
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
              <Calendar className="w-3.5 h-3.5" /> Joined {joinDate}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatBtn
          value={followers.length}
          label="Followers"
          onClick={() => setFollowersOpen(true)}
          delay={0.05}
        />
        <StatBtn
          value={following.length}
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
            data-ocid="public_profile.comics_empty_state"
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
