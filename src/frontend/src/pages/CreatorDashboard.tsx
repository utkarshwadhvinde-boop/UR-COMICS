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
import { formatNumber } from "@/lib/sampleData";
import { useAppStore } from "@/store";
import type { Comic, ComicStatus } from "@/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Coins,
  Edit,
  Eye,
  Heart,
  Plus,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_BADGE: Record<ComicStatus, { label: string; class: string }> = {
  ongoing: {
    label: "Ongoing",
    class: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completed",
    class: "bg-accent/10 text-accent border-accent/20",
  },
  hiatus: {
    label: "Hiatus",
    class: "bg-muted text-muted-foreground border-border",
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

function StatusToggle({
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
        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-smooth ${STATUS_BADGE[comic.status].class}`}
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
}) {
  const navigate = useNavigate();
  const coinsEarned = Math.floor(comic.views / 10);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center gap-4 bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-smooth"
      data-ocid={`creator_dashboard.comic.item.${index + 1}`}
    >
      {/* Cover */}
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

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-semibold text-foreground truncate max-w-[200px]">
            {comic.title}
          </h3>
          <StatusToggle comic={comic} onChange={onStatusChange} />
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
            {formatNumber(coinsEarned)}
          </span>
        </div>
      </div>

      {/* Actions */}
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
    </motion.div>
  );
}

export default function CreatorDashboardPage() {
  const { currentUser, comics, deleteComic, updateComic } = useAppStore();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const myComics = comics.filter((c) => c.creatorId === currentUser?.id);
  const totalViews = myComics.reduce((a, c) => a + c.views, 0);
  const totalLikes = myComics.reduce((a, c) => a + c.likes, 0);
  const totalCoins = Math.floor(totalViews / 10);
  const totalChapters = myComics.reduce((a, c) => a + c.chapters.length, 0);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteComic(deleteTarget.id);
    toast.success(`"${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
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
      {/* Header */}
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

      {/* Stats Grid */}
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

      {/* Earnings banner */}
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

      {/* Comics list */}
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

      {/* Delete confirm dialog */}
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
              <strong>"{deleteTarget?.title}"</strong>? This action cannot be
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
              className="rounded-xl"
              data-ocid="creator_dashboard.delete_confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
