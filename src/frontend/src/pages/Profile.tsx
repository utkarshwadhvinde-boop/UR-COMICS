import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useComics } from "@/hooks/useComics";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, BookOpen, Edit2, Eye } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Comic } from "@/types/index"; 

function ProfileSkeleton() {
  return (
    <div
      className="px-4 sm:px-6 py-10 max-w-4xl mx-auto"
      data-ocid="profile.loading_state"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <Skeleton className="w-24 h-24 rounded-full bg-purple-900/30 shrink-0" />
        <div className="space-y-3 flex-1 w-full">
          <Skeleton className="h-7 w-48 bg-purple-900/30" />
          <Skeleton className="h-4 w-28 bg-purple-900/30" />
          <Skeleton className="h-4 w-full max-w-sm bg-purple-900/30" />
          <Skeleton className="h-4 w-3/4 max-w-xs bg-purple-900/30" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          <div key={i} className="bg-midnight-card rounded-xl overflow-hidden">
            <Skeleton className="w-full aspect-[9/14] bg-purple-900/30" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4 bg-purple-900/30" />
              <Skeleton className="h-3 w-1/2 bg-purple-900/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComicCard({
  comic,
  index,
}: {
  comic: import("@/types/index").Comic;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.07, 0.5) }}
      data-ocid={`profile.comic.item.${index + 1}`}
    >
      <Link
        to="/comics/$comicId"
        params={{ comicId: comic.id }}
        className="group block bg-midnight-card rounded-xl overflow-hidden border border-purple-900/20 hover:border-accent/40 transition-colors-fast shadow-card"
        data-ocid={`profile.comic.link.${index + 1}`}
      >
        <div className="relative w-full aspect-[9/14] overflow-hidden bg-purple-900/20">
          <img
            src={comic.cover_url ?? ""}
            alt={comic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-3">
          <h3 className="font-body text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors-fast">
            {comic.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <Eye className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-body">
              View comic
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProfilePage() {
  const { handle } = useParams({ strict: false }) as { handle: string };
  const { data: profile, isLoading, error, refetch } = useProfile(handle);
  const { data: allComics } = useComics();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedComics, setSavedComics] = useState<Comic[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookmarks")
      .select("comic_id, comics(*)")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const comics = data.map((b: any) => b.comics).filter(Boolean);
          setSavedComics(comics);
        }
      });
  }, [user]);

  const isOwnProfile = !!profile && !!user && profile.id === user.id;
  const creatorComics = (allComics ?? []).filter(
    (c) => profile && c.author_id === profile.id,
  );

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (handle?.slice(0, 2).toUpperCase() ?? "??");

  if (isLoading) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] px-4"
        data-ocid="profile.error_state"
      >
        <div className="bg-midnight-card border border-purple-900/30 rounded-2xl p-10 max-w-sm w-full text-center shadow-elevated">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Profile Not Found
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6">
            We couldn't find a profile for{" "}
            <span className="text-accent font-medium">@{handle}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-accent/30 text-accent hover:bg-accent/10"
              onClick={() => refetch()}
              data-ocid="profile.retry_button"
            >
              Try Again
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => navigate({ to: "/" })}
              data-ocid="profile.home_button"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="px-4 sm:px-6 py-10 max-w-4xl mx-auto"
      data-ocid="profile.page"
    >
      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-midnight-card border border-purple-900/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-elevated"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0" data-ocid="profile.avatar">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name ?? ""}
                className="w-24 h-24 rounded-full object-cover border-2 border-accent/40 glow-accent-sm"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-display font-bold text-white border-2 border-accent/40 glow-accent-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground truncate">
                {profile.display_name}
              </h1>
              {profile.is_creator && (
                <span
                  className="inline-flex items-center gap-1.5 bg-accent text-white text-xs px-3 py-1 rounded-full font-bold tracking-wide shrink-0"
                  data-ocid="profile.creator_badge"
                >
                  <BookOpen className="w-3 h-3" />
                  Creator
                </span>
              )}
            </div>
            <p className="text-muted-foreground font-body text-sm mb-3">
              @{profile.handle ?? handle}
            </p>
            {profile.bio && (
              <p className="text-foreground/80 font-body text-sm leading-relaxed max-w-lg">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Edit button (own profile only) */}
          {isOwnProfile && (
            <div className="shrink-0">
              <Link
                to="/profile/$handle/edit"
                params={{ handle: profile.handle ?? profile.id }}
                data-ocid="profile.edit_button"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-accent/30 text-accent hover:bg-accent/10 gap-2 transition-smooth"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Saved Comics Section */}
      {isOwnProfile && savedComics.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ marginBottom: "32px" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
              <span style={{ fontSize: "16px" }}>🔖</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Saved Comics
            </h2>
            <Badge variant="secondary" className="bg-accent/15 text-accent border-accent/20 font-body">
              {savedComics.length}
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedComics.map((comic, i) => (
              <ComicCard key={comic.id} comic={comic} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Creator Comics Section */}
      {profile.is_creator && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          data-ocid="profile.comics_section"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Published Comics
            </h2>
            {creatorComics.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-accent/15 text-accent border-accent/20 font-body"
              >
                {creatorComics.length}
              </Badge>
            )}
          </div>

          {creatorComics.length === 0 ? (
            <div
              className="bg-midnight-card border border-purple-900/20 rounded-xl p-10 text-center"
              data-ocid="profile.comics.empty_state"
            >
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground font-body text-sm">
                No published comics yet.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="profile.comics.list"
            >
              {creatorComics.map((comic, i) => (
                <ComicCard key={comic.id} comic={comic} index={i} />
              ))}
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
}
