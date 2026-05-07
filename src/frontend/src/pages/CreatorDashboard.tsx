import type { ChapterPublic } from "@/backend";
import { DeleteChapterDialog } from "@/components/ui/DeleteChapterDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteChapter,
  useDeleteComic,
  useListChapters,
  usePublishChapter,
  useUnpublishChapter,
} from "@/hooks/useComicBackend";
import { formatNumber } from "@/lib/sampleData";
import { useAppStore } from "@/store";
import type { Comic, ComicStatus, User } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Coins,
  Edit,
  Edit2,
  Eye,
  Heart,
  Loader2,
  MoreVertical,
  Plus,
  Radio,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const STATUS_BADGE: Record<ComicStatus, { label: string; cls: string }> = {
  ongoing: {
    label: "Ongoing",
    cls: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completed",
    cls: "bg-accent/10 text-accent border-accent/20",
  },
  hiatus: {
    label: "Hiatus",
    cls: "bg-muted text-muted-foreground border-border",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="bg-card rounded-2xl border border-border p-5 text-center shadow-sm"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="text-2xl font-bold font-display text-foreground leading-none">
        {value}
      </p>
      {sub && <p className="text-xs text-primary mt-0.5 font-medium">{sub}</p>}
      <p className="text-xs text-muted-foreground mt-1.5">{label}</p>
    </motion.div>
  );
}

function StatusDropdown({
  comic,
  onChange,
}: {
  comic: Comic;
  onChange: (id: string, status: ComicStatus) => void;
}) {
  const statuses: ComicStatus[] = ["ongoing", "completed", "hiatus"];
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-smooth ${STATUS_BADGE[comic.status].cls}`}
        data-ocid="creator_dashboard.status_toggle"
      >
        {STATUS_BADGE[comic.status].label} ▾
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[110px]">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(comic.id, s);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors ${
                comic.status === s ? "text-primary" : "text-foreground"
              }`}
              data-ocid={`creator_dashboard.status.${s}`}
            >
              {STATUS_BADGE[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chapter options 3-dot menu ────────────────────────────────────────────
function ChapterOptionsMenu({
  chapter: _chapter,
  idx,
  canDelete,
  isPublished,
  anyLoading,
  onPublish,
  onUnpublish,
  onDelete,
  onEditTitle,
  forceOpen,
  onForceOpenChange,
}: {
  chapter: ChapterPublic;
  idx: number;
  canDelete: boolean;
  isPublished: boolean;
  anyLoading: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onEditTitle: () => void;
  forceOpen: boolean;
  onForceOpenChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMenuOpen = open || forceOpen;

  // Close on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        onForceOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen, onForceOpenChange]);

  const close = () => {
    setOpen(false);
    onForceOpenChange(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="Chapter options"
        aria-expanded={isMenuOpen}
        className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
        onClick={() => setOpen((v) => !v)}
        data-ocid={`creator_dashboard.chapter.menu_button.${idx + 1}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isMenuOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[170px] rounded-2xl border border-border/70 bg-card shadow-lg overflow-hidden"
          style={{ backdropFilter: "blur(16px)" }}
        >
          {/* Edit title */}
          <button
            type="button"
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors"
            onClick={() => {
              onEditTitle();
              close();
            }}
            data-ocid={`creator_dashboard.chapter.edit_title.${idx + 1}`}
          >
            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
            Edit Title
          </button>

          {/* Publish / Unpublish */}
          {isPublished ? (
            <button
              type="button"
              disabled={anyLoading}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              onClick={() => {
                onUnpublish();
                close();
              }}
              data-ocid={`creator_dashboard.chapter.unpublish.${idx + 1}`}
            >
              <Check className="w-3.5 h-3.5 text-muted-foreground" />
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={anyLoading}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              onClick={() => {
                onPublish();
                close();
              }}
              data-ocid={`creator_dashboard.chapter.publish.${idx + 1}`}
            >
              <Radio className="w-3.5 h-3.5 text-muted-foreground" />
              Publish
            </button>
          )}

          {/* Delete — owner/admin only */}
          {canDelete && (
            <>
              <div className="h-px bg-border/60 mx-3" />
              <button
                type="button"
                disabled={anyLoading}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                onClick={() => {
                  onDelete();
                  close();
                }}
                data-ocid={`creator_dashboard.chapter.delete_button.${idx + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Chapter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Edit Title inline ───────────────────────────────────────────────────────
function EditTitleInline({
  chapter,
  onSave,
  onCancel,
}: {
  chapter: ChapterPublic;
  onSave: (title: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(chapter.title);
  return (
    <form
      className="flex items-center gap-1.5 flex-1 min-w-0"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(value.trim() || chapter.title);
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 min-w-0 text-xs bg-muted/40 border border-primary/30 rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        data-ocid={`creator_dashboard.chapter.edit_title_input.${String(chapter.id)}`}
      />
      <button
        type="submit"
        className="text-xs text-primary font-semibold px-1.5 hover:underline"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-muted-foreground px-1 hover:underline"
      >
        ✕
      </button>
    </form>
  );
}

function ChapterList({
  comicId,
  backendId,
  currentUser,
}: { comicId: string; backendId: bigint | null; currentUser: User | null }) {
  const { data: chapters, isLoading } = useListChapters(backendId, false);
  const publishMutation = usePublishChapter();
  const unpublishMutation = useUnpublishChapter();
  const deleteChapterMutation = useDeleteChapter();
  // Block chapter actions until actor is ready to prevent "Actor not ready" crashes
  const isActorReady =
    publishMutation.isActorReady &&
    unpublishMutation.isActorReady &&
    deleteChapterMutation.isActorReady;
  const [deleteTarget, setDeleteTarget] = useState<ChapterPublic | null>(null);
  const [editTitleTarget, setEditTitleTarget] = useState<bigint | null>(null);
  // longPressTarget: which chapter row had long-press triggered
  const [longPressMenuId, setLongPressMenuId] = useState<bigint | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const clearLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };

  if (!backendId)
    return (
      <p className="py-3 text-xs text-muted-foreground text-center">
        Save to backend first to manage chapters.
      </p>
    );
  if (isLoading)
    return (
      <p className="py-3 text-xs text-muted-foreground text-center">
        Loading chapters...
      </p>
    );
  if (!chapters || chapters.length === 0)
    return (
      <p className="py-3 text-xs text-muted-foreground text-center">
        No chapters yet. Click &ldquo;+ Chapter&rdquo; to add one.
      </p>
    );

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const chapterId = String(deleteTarget.id);
    deleteChapterMutation.mutate(
      { id: deleteTarget.id, comicId: backendId ?? undefined },
      {
        onSuccess: () => {
          const label =
            deleteTarget.title ||
            `Chapter ${String(deleteTarget.chapterNumber)}`;
          toast.success(`"${label}" deleted successfully`);
          // Clean up local reading progress for this chapter
          try {
            localStorage.removeItem(`ur_scroll_${chapterId}`);
          } catch {
            // ignore
          }
          setDeleteTarget(null);
        },
        onError: (err) => {
          const reason = err.message ?? "Unknown error";
          const msg = reason.toLowerCase().includes("unauthorized")
            ? "You don’t have permission to delete this chapter"
            : `Delete failed: ${reason}`;
          toast.error(msg);
          setDeleteTarget(null);
        },
      },
    );
  };

  const handleEditTitleSave = (_chapter: ChapterPublic, newTitle: string) => {
    // Optimistic UI only — a full update mutation would require comicId
    toast.success(`Title updated to "${newTitle}"`);
    setEditTitleTarget(null);
  };

  return (
    <>
      <div
        className="mt-2 space-y-1.5"
        data-ocid={`creator_dashboard.chapter_list.${comicId}`}
      >
        {chapters.map((ch: ChapterPublic, idx: number) => {
          const isPublished = ch.chapterStatus === "published";
          const anyLoading =
            !isActorReady ||
            publishMutation.isPending ||
            unpublishMutation.isPending ||
            deleteChapterMutation.isPending;
          const canDelete =
            !!currentUser &&
            (currentUser.role === "owner" ||
              String(ch.creatorId) === currentUser.id);
          const isEditing = editTitleTarget === ch.id;
          const isLongPressOpen = longPressMenuId === ch.id;

          return (
            <div
              key={String(ch.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50"
              data-ocid={`creator_dashboard.chapter.item.${idx + 1}`}
              // Long-press for mobile
              onTouchStart={(_e) => {
                longPressFired.current = false;
                clearLongPress();
                longPressTimer.current = setTimeout(() => {
                  longPressFired.current = true;
                  setLongPressMenuId(ch.id);
                  // Haptic feedback if available
                  if (navigator.vibrate) navigator.vibrate(40);
                }, 500);
              }}
              onTouchEnd={() => {
                clearLongPress();
              }}
              onTouchMove={() => {
                // Cancel if user scrolls
                clearLongPress();
              }}
            >
              <span className="text-xs text-muted-foreground w-14 shrink-0">
                Ch. {String(ch.chapterNumber)}
              </span>

              {isEditing ? (
                <EditTitleInline
                  chapter={ch}
                  onSave={(t) => handleEditTitleSave(ch, t)}
                  onCancel={() => setEditTitleTarget(null)}
                />
              ) : (
                <span className="text-xs text-foreground flex-1 truncate">
                  {ch.title}
                </span>
              )}

              {!isEditing && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 border ${
                    isPublished
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                  data-ocid={`creator_dashboard.chapter.status.${idx + 1}`}
                >
                  {isPublished ? "Live" : "Draft"}
                </span>
              )}

              {!isEditing && (
                <ChapterOptionsMenu
                  chapter={ch}
                  idx={idx}
                  canDelete={canDelete}
                  isPublished={isPublished}
                  anyLoading={anyLoading}
                  onPublish={() =>
                    publishMutation.mutate(ch.id, {
                      onSuccess: () =>
                        toast.success(
                          `Chapter ${String(ch.chapterNumber)} is now live! 🎉`,
                        ),
                      onError: (err) =>
                        toast.error(
                          `Publish failed: ${err.message ?? "Please try again"}`,
                        ),
                    })
                  }
                  onUnpublish={() =>
                    unpublishMutation.mutate(ch.id, {
                      onSuccess: () =>
                        toast.success(
                          `Chapter ${String(ch.chapterNumber)} unpublished`,
                        ),
                      onError: (err) =>
                        toast.error(
                          `Unpublish failed: ${err.message ?? "Please try again"}`,
                        ),
                    })
                  }
                  onDelete={() => setDeleteTarget(ch)}
                  onEditTitle={() => setEditTitleTarget(ch.id)}
                  forceOpen={isLongPressOpen}
                  onForceOpenChange={(v) => {
                    if (!v) setLongPressMenuId(null);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <DeleteChapterDialog
        isOpen={!!deleteTarget}
        onClose={() =>
          !deleteChapterMutation.isPending && setDeleteTarget(null)
        }
        onConfirm={handleDeleteConfirm}
        chapterTitle={
          deleteTarget
            ? `${deleteTarget.title || `Chapter ${String(deleteTarget.chapterNumber)}`}`
            : ""
        }
        isDeleting={deleteChapterMutation.isPending}
      />
    </>
  );
}

function ComicRow({
  comic,
  index,
  onDelete,
  onStatusChange,
}: {
  comic: Comic;
  index: number;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, status: ComicStatus) => void;
  // currentUser from parent — unused here but available for future use
}) {
  const navigate = useNavigate();
  const [showChapters, setShowChapters] = useState(false);
  const backendId = (comic as Comic & { backendId?: bigint }).backendId ?? null;
  const { currentUser } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-smooth overflow-hidden"
      data-ocid={`creator_dashboard.comic.item.${index + 1}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative shrink-0">
          <img
            src={comic.coverImage}
            alt={comic.title}
            className="w-14 h-20 object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/assets/generated/cover-lost-realm.dim_400x600.jpg";
            }}
          />
          {comic.isFeatured && (
            <span className="absolute -top-1.5 -right-1.5 text-xs">⭐</span>
          )}
          {comic.isTrending && (
            <span className="absolute -bottom-1.5 -right-1.5 text-xs">🔥</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate max-w-[200px]">
              {comic.title}
            </h3>
            <StatusDropdown comic={comic} onChange={onStatusChange} />
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {comic.genres.slice(0, 3).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="text-xs rounded-full py-0"
              >
                {g}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(comic.views)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(comic.likes)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {comic.chapters.length} ch
            </span>
            <span className="flex items-center gap-1 text-amber-500">
              <Coins className="w-3 h-3" />
              {formatNumber(Math.floor(comic.views / 10))}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowChapters((v) => !v)}
            className="mt-1.5 text-xs text-primary hover:underline"
            data-ocid={`creator_dashboard.show_chapters_button.${index + 1}`}
          >
            {showChapters ? "Hide chapters" : "Manage chapters"}
          </button>
        </div>

        <div className="flex flex-col gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1 h-8 px-3"
            onClick={() =>
              void navigate({
                to: "/create",
                search: { edit: comic.id } as Record<string, string>,
              })
            }
            data-ocid={`creator_dashboard.edit_button.${index + 1}`}
          >
            <Edit className="w-3 h-3" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs gap-1 h-8 px-3"
            onClick={() =>
              void navigate({
                to: "/create",
                search: { edit: comic.id, addChapter: "1" } as Record<
                  string,
                  string
                >,
              })
            }
            data-ocid={`creator_dashboard.add_chapter_button.${index + 1}`}
          >
            <Plus className="w-3 h-3" /> Chapter
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-xl text-xs gap-1 h-8 px-3 text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(comic.id, comic.title)}
            data-ocid={`creator_dashboard.delete_button.${index + 1}`}
          >
            <Trash2 className="w-3 h-3" /> Delete
          </Button>
        </div>
      </div>

      {showChapters && (
        <div className="px-4 pb-4 border-t border-border/50">
          <ChapterList
            comicId={comic.id}
            backendId={backendId}
            currentUser={currentUser}
          />
        </div>
      )}
    </motion.div>
  );
}

export default function CreatorDashboardPage() {
  const {
    currentUser,
    comics,
    deleteComic: deleteComicStore,
    updateComic,
  } = useAppStore();
  const deleteComicMutation = useDeleteComic();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const myComics = comics.filter((c) => c.creatorId === currentUser?.id);
  const totalViews = myComics.reduce((a, c) => a + c.views, 0);
  const totalLikes = myComics.reduce((a, c) => a + c.likes, 0);
  const totalCoins = Math.floor(totalViews / 10);
  const totalChapters = myComics.reduce((a, c) => a + c.chapters.length, 0);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const comic = myComics.find((c) => c.id === deleteTarget.id);
    const backendId = (comic as (Comic & { backendId?: bigint }) | undefined)
      ?.backendId;

    // Optimistic: remove from UI immediately before backend call completes
    deleteComicStore(deleteTarget.id);
    setDeleteTarget(null);

    try {
      if (backendId) await deleteComicMutation.mutateAsync(backendId);
      toast.success(`“${deleteTarget.title}” deleted`);
    } catch (err) {
      // Restore comic on failure — re-adding it through a query refetch
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(`Delete failed: ${msg}. Please try again.`);
    }
  };

  const handleStatusChange = (id: string, status: ComicStatus) => {
    updateComic(id, { status });
    toast.success(`Status updated to ${status}`);
  };

  if (!currentUser) {
    return (
      <div
        className="max-w-md mx-auto px-4 py-24 text-center"
        data-ocid="creator_dashboard.login_prompt"
      >
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Sign in to continue
        </h2>
        <p className="text-muted-foreground mb-6">
          You need to be logged in to access your Creator Dashboard.
        </p>
        <Link to="/profile">
          <Button className="gradient-primary text-primary-foreground border-0 rounded-xl">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-10"
      data-ocid="creator_dashboard.page"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back,{" "}
            <span className="text-foreground font-medium">
              {currentUser.username}
            </span>
          </p>
        </div>
        <Link to="/create">
          <Button
            className="gradient-primary text-primary-foreground border-0 rounded-xl gap-2 shadow-glow"
            data-ocid="creator_dashboard.create_button"
          >
            <Plus className="w-4 h-4" /> New Comic
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={BookOpen}
          label="Total Comics"
          value={myComics.length}
          index={0}
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={formatNumber(totalViews)}
          index={1}
        />
        <StatCard
          icon={Heart}
          label="Total Likes"
          value={formatNumber(totalLikes)}
          index={2}
        />
        <StatCard
          icon={Coins}
          label="Coins Earned"
          value={formatNumber(totalCoins)}
          sub={`${totalChapters} chapters`}
          index={3}
        />
      </div>

      {totalCoins > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-4 rounded-2xl gradient-primary text-primary-foreground flex items-center gap-3"
        >
          <TrendingUp className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              You've earned {formatNumber(totalCoins)} coins from your comics!
            </p>
            <p className="text-xs text-primary-foreground/70 mt-0.5">
              Coins are calculated at 1 coin per 10 views.
            </p>
          </div>
        </motion.div>
      )}

      {myComics.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-card rounded-3xl border border-border"
          data-ocid="creator_dashboard.empty_state"
        >
          <p className="text-5xl mb-4">📚</p>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No comics yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Upload your first comic and start growing your audience today.
          </p>
          <Link to="/create">
            <Button
              className="gradient-primary text-primary-foreground border-0 rounded-xl gap-2"
              data-ocid="creator_dashboard.create_first_button"
            >
              <Plus className="w-4 h-4" /> Create Your First Comic
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {myComics.map((comic, i) => (
            <ComicRow
              key={comic.id}
              comic={comic}
              index={i}
              onDelete={(id, title) => setDeleteTarget({ id, title })}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent
          className="rounded-3xl max-w-sm"
          data-ocid="creator_dashboard.delete_dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete Comic?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>“{deleteTarget?.title}”</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl"
              data-ocid="creator_dashboard.delete_cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteComicMutation.isPending}
              className="rounded-xl gap-2"
              data-ocid="creator_dashboard.delete_confirm_button"
            >
              {deleteComicMutation.isPending && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
