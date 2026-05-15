import { ConfirmModal } from "@/components/ConfirmModal";
import { ErrorFallback } from "@/components/ErrorFallback";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { COMICS_QUERY_KEY, useComics } from "@/hooks/useComics";
import { useProfile } from "@/hooks/useProfile";
import { deleteComic } from "@/services/comicsService";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Eye, FolderOpen, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function CreatorDashboardPage() {
  const { data: comics, isLoading, isError, refetch } = useComics();
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const { data: profile } = useProfile(userId);
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const myComics =
    comics?.filter((c) => userId && c.author_id === userId) ?? [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    // Snapshot current cache for rollback
    const previous = queryClient.getQueryData<typeof comics>(COMICS_QUERY_KEY);
    // Optimistic update — remove immediately from UI
    queryClient.setQueryData(COMICS_QUERY_KEY, (old: typeof comics) =>
      (old ?? []).filter((c) => c.id !== deleteTarget),
    );
    try {
      await deleteComic(deleteTarget);
      await queryClient.invalidateQueries({ queryKey: COMICS_QUERY_KEY });
      toast.success("Comic deleted.");
    } catch {
      // Rollback on failure
      queryClient.setQueryData(COMICS_QUERY_KEY, previous);
      toast.error("Failed to delete comic.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-ocid="creator_dashboard.page"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl text-foreground">
              Creator Studio
            </h1>
            {profile?.is_creator && (
              <span
                className="bg-accent text-white text-xs px-3 py-1 rounded-full font-body font-medium"
                data-ocid="creator_dashboard.creator_badge"
              >
                Creator
              </span>
            )}
          </div>
          <p className="text-muted-foreground font-body text-sm">
            Manage your comics and chapters
          </p>
        </div>
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          data-ocid="creator_dashboard.new_comic_button"
        >
          <Link to="/creator/comics/new">
            <Plus className="w-4 h-4 mr-2" /> New Comic
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorFallback
          message="Failed to load your comics."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && myComics.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 gap-4"
          data-ocid="creator_dashboard.empty_state"
        >
          <BookOpen className="w-14 h-14 text-muted-foreground" />
          <p className="font-body text-base text-muted-foreground">
            You haven't created any comics yet.
          </p>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link to="/creator/comics/new">
              <Plus className="w-4 h-4 mr-2" /> Create your first comic
            </Link>
          </Button>
        </motion.div>
      )}

      {!isLoading && !isError && myComics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {myComics.map((comic, i) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.07,
                type: "spring",
                stiffness: 280,
                damping: 24,
              }}
              className="rounded-xl overflow-hidden bg-card border border-purple-900/40 hover:border-accent/60 group flex flex-col"
              data-ocid={`creator_dashboard.comics.item.${i + 1}`}
            >
              {/* Cover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={comic.cover_url ?? ""}
                  alt={comic.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover overlay — quick actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-3">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="w-full text-xs"
                    data-ocid={`creator_dashboard.view_button.${i + 1}`}
                  >
                    <Link to="/comics/$comicId" params={{ comicId: comic.id }}>
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(comic.id)}
                    className="w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    data-ocid={`creator_dashboard.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                  </Button>
                </div>
              </div>

              {/* Card footer */}
              <div className="p-3 flex flex-col gap-2">
                <h3 className="font-display text-sm text-foreground line-clamp-2 leading-snug">
                  {comic.title}
                </h3>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 w-fit"
                >
                  Comic
                </Badge>
                <Button
                  asChild
                  size="sm"
                  className="w-full mt-1 bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-accent-foreground text-xs transition-colors duration-200"
                  data-ocid={`creator_dashboard.manage_button.${i + 1}`}
                >
                  <Link
                    to="/creator/comics/$comicId"
                    params={{ comicId: comic.id }}
                  >
                    <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> Manage
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete comic?"
        description="This will permanently delete the comic and all its chapters. This cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete Comic"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        destructive
      />
    </div>
  );
}
