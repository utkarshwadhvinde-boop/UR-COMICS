import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteChapter,
  useGetReadingProgress,
  useListChapters,
} from "@/hooks/useComicBackend";
import { useAppStore } from "@/store";
import type { Comment, CommentReply } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BookmarkIcon,
  ChevronLeft,
  ChevronRight,
  Coins,
  Heart,
  List,
  Maximize,
  MessageCircle,
  Minimize,
  MoreVertical,
  Play,
  RotateCcw,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ── helpers ──────────────────────────────────────────────────────────────────

const COMMENTS_KEY = (comicId: string, chapterId: string) =>
  `ur_comics_comments_${comicId}_${chapterId}`;

function loadComments(comicId: string, chapterId: string): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY(comicId, chapterId));
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function saveComments(
  comicId: string,
  chapterId: string,
  comments: Comment[],
): void {
  localStorage.setItem(
    COMMENTS_KEY(comicId, chapterId),
    JSON.stringify(comments),
  );
}

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/** Returns true if a URL is a real http(s) or data URL (not a blob: URL) */
function isUsableUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("blob:")) return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  if (url.startsWith("/") || url.startsWith("data:")) return true;
  return false;
}

/**
 * Resolves the ordered image URLs for a chapter.
 * Priority: imageKeys (object-storage) → images (legacy), filtered to usable URLs only.
 * imageOrder is applied after picking the source array.
 */
function resolveChapterImages(
  images: string[],
  imageKeys: string[],
  imageOrder: bigint[],
): string[] {
  // Prefer imageKeys if they contain real permanent URLs
  const source =
    imageKeys.length > 0 && imageKeys.some(isUsableUrl) ? imageKeys : images;

  // CRITICAL: Filter to usable URLs first — blob: URLs expire after tab close
  const usable = source.filter(isUsableUrl);

  if (usable.length === 0) return [];

  // Safety: only apply imageOrder if it maps exactly to the source array size.
  // A mismatched imageOrder (from a different version of the chapter) would
  // produce out-of-range indices and drop valid images.
  if (imageOrder.length === 0 || imageOrder.length !== source.length) {
    // No order, or mismatched order — fall back to natural order of usable URLs
    return usable;
  }

  // Apply imageOrder against the original source positions
  const maxLen = source.length;
  const ordered: string[] = [];
  for (const idx of imageOrder) {
    const i = Number(idx);
    if (i >= 0 && i < maxLen) {
      const url = source[i];
      if (url && isUsableUrl(url)) ordered.push(url);
    }
  }

  // If applying order produced nothing (e.g. all indices out-of-bounds or blobs),
  // fall back to the unordered usable list so images still show
  return ordered.length > 0 ? ordered : usable;
}

// ── LazyImage ─────────────────────────────────────────────────────────────────

interface LazyImageProps {
  src: string;
  index: number;
  alt: string;
}

function LazyImage({ src, index, alt }: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(index < 3);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  const handleRetry = () => {
    setError(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      ref={ref}
      className="w-full relative"
      style={{ background: "oklch(0.10 0.008 265)" }}
    >
      {!loaded && !error && (
        <Skeleton
          className="w-full"
          style={{
            minHeight: "60vw",
            aspectRatio: "3/4",
            borderRadius: 0,
            background: "oklch(0.16 0.012 265)",
          }}
        />
      )}
      {error ? (
        <div
          className="w-full flex flex-col items-center justify-center py-12 gap-3"
          style={{
            background: "oklch(0.14 0.01 265)",
            minHeight: "200px",
          }}
        >
          <RotateCcw
            className="w-6 h-6"
            style={{ color: "oklch(0.45 0.01 265)" }}
          />
          <p className="text-xs" style={{ color: "oklch(0.45 0.01 265)" }}>
            Image failed to load
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: "oklch(0.58 0.22 265 / 0.2)",
              color: "oklch(0.70 0.18 265)",
              border: "1px solid oklch(0.58 0.22 265 / 0.3)",
            }}
            data-ocid="reader.image_retry_button"
          >
            Tap to retry
          </button>
        </div>
      ) : visible ? (
        <img
          key={retryKey}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
          className="w-full block"
          style={{
            display: loaded ? "block" : "none",
            touchAction: "pan-y pinch-zoom",
            imageRendering: "auto",
          }}
        />
      ) : null}
    </div>
  );
}

// ── DeleteChapterModal ─────────────────────────────────────────────────────────

interface DeleteChapterModalProps {
  chapterTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteChapterModal({
  chapterTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteChapterModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      data-ocid="reader.delete_dialog"
    >
      <div
        className="rounded-2xl border p-6 w-full max-w-sm space-y-4 shadow-xl"
        style={{
          background: "oklch(0.15 0.015 265 / 0.98)",
          borderColor: "oklch(0.28 0.01 265)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "oklch(0.35 0.15 15 / 0.3)" }}
          >
            <Trash2
              className="w-5 h-5"
              style={{ color: "oklch(0.65 0.18 15)" }}
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-white">
              Delete Chapter?
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {chapterTitle}
            </p>
          </div>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
          Are you sure you want to delete this chapter? This action{" "}
          <span
            className="font-semibold"
            style={{ color: "oklch(0.65 0.18 15)" }}
          >
            cannot be undone
          </span>
          .
        </p>
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              borderColor: "oklch(0.28 0.01 265)",
              color: "rgba(255,255,255,0.7)",
            }}
            data-ocid="reader.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              background: "oklch(0.50 0.18 15)",
              color: "white",
              border: "none",
            }}
            data-ocid="reader.delete_confirm_button"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-3.5 h-3.5 border border-white/30 border-t-white rounded-full" />
                Deleting…
              </span>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1.5" /> Delete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── UnlockModal ───────────────────────────────────────────────────────────────

interface UnlockModalProps {
  coinCost: number;
  userCoins: number;
  onUnlock: () => void;
  onAdUnlock: () => void;
  onClose: () => void;
}

function UnlockModal({
  coinCost,
  userCoins,
  onUnlock,
  onAdUnlock,
  onClose,
}: UnlockModalProps) {
  const canAfford = userCoins >= coinCost;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      data-ocid="reader.dialog"
    >
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <h2 className="font-display font-bold text-lg text-foreground">
              Premium Chapter
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            data-ocid="reader.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          This chapter requires{" "}
          <span className="font-bold text-foreground">{coinCost} UR Coins</span>{" "}
          to unlock.
        </p>
        <div className="bg-muted rounded-xl p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Your balance</span>
          <span className="font-bold text-foreground flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-500" /> {userCoins} Coins
          </span>
        </div>
        <div className="space-y-2">
          <Button
            className="w-full gradient-primary text-primary-foreground border-0 btn-press"
            onClick={onUnlock}
            disabled={!canAfford}
            data-ocid="reader.confirm_button"
          >
            {canAfford ? (
              <>
                <Coins className="w-4 h-4 mr-2" /> Unlock for {coinCost} Coins
              </>
            ) : (
              "Not enough coins"
            )}
          </Button>
          {!canAfford && (
            <Link to="/coins">
              <Button variant="outline" className="w-full">
                Get More Coins
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            className="w-full"
            onClick={onAdUnlock}
            data-ocid="reader.ad_unlock_button"
          >
            <Play className="w-4 h-4 mr-2" /> Watch Ad to Unlock Free
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── ChapterSidebar ────────────────────────────────────────────────────────────

interface ChapterSidebarProps {
  chapters: Array<{
    id: string;
    title: string;
    chapterNumber: number;
    isPremium: boolean;
  }>;
  currentChapterId: string;
  comicId: string;
  onClose: () => void;
}

function ChapterSidebar({
  chapters,
  currentChapterId,
  comicId,
  onClose,
}: ChapterSidebarProps) {
  const navigate = useNavigate();
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 w-full h-full cursor-default"
        style={{ background: "rgba(0,0,0,0.5)", border: "none" }}
        onClick={onClose}
        aria-label="Close chapter list"
        tabIndex={0}
      />
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(320px, 85vw)",
          background: "oklch(0.15 0.015 265 / 0.98)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid oklch(0.25 0.01 265)",
          animation: "slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
        data-ocid="reader.chapter_list_panel"
      >
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid oklch(0.22 0.01 265)" }}
        >
          <h3 className="font-display font-bold text-white text-sm">
            Chapters
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close chapter list"
            data-ocid="reader.chapter_list_close"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {chapters.map((ch) => {
            const isCurrent = ch.id === currentChapterId;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  void navigate({
                    to: "/read/$comicId/$chapterId",
                    params: { comicId, chapterId: ch.id },
                  });
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
                style={
                  isCurrent ? { background: "oklch(0.58 0.22 265 / 0.25)" } : {}
                }
                data-ocid={`reader.chapter_list.item.${ch.chapterNumber}`}
              >
                <span
                  className="text-xs font-bold rounded-md px-2 py-0.5 shrink-0"
                  style={{
                    background: isCurrent
                      ? "oklch(0.58 0.22 265)"
                      : "oklch(0.25 0.01 265)",
                    color: isCurrent ? "white" : "oklch(0.6 0.01 265)",
                    minWidth: "2.5rem",
                    textAlign: "center",
                  }}
                >
                  {ch.chapterNumber}
                </span>
                <span
                  className="text-sm truncate min-w-0"
                  style={{
                    color: isCurrent ? "white" : "oklch(0.7 0.006 265)",
                  }}
                >
                  {ch.title}
                  {ch.isPremium && " 🔒"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── ReplySection ──────────────────────────────────────────────────────────────

interface ReplySectionProps {
  commentId: string;
  username: string;
}

function ReplySection({ commentId, username }: ReplySectionProps) {
  const REPLIES_KEY = `ur_replies_${commentId}`;
  const [replies, setReplies] = useState<CommentReply[]>(() => {
    try {
      const raw = localStorage.getItem(REPLIES_KEY);
      return raw ? (JSON.parse(raw) as CommentReply[]) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    const reply: CommentReply = {
      id: `r-${Date.now()}`,
      parentCommentId: commentId,
      userId: "guest",
      username: username || "Anonymous",
      text: text.trim(),
      createdAt: Date.now(),
    };
    const next = [...replies, reply];
    setReplies(next);
    localStorage.setItem(REPLIES_KEY, JSON.stringify(next));
    setText("");
    setOpen(false);
  };

  return (
    <div className="pl-10 mt-2 space-y-2">
      {replies.map((r, idx) => (
        <div key={r.id ?? idx} className="flex items-start gap-2">
          <div
            className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0"
            aria-hidden
          >
            {r.username[0]?.toUpperCase()}
          </div>
          <div>
            <span className="text-xs font-semibold text-foreground">
              {r.username}
            </span>{" "}
            <span
              className="text-xs"
              style={{ color: "oklch(0.55 0.006 265)" }}
            >
              {timeAgo(r.createdAt)}
            </span>
            <p className="text-xs text-foreground mt-0.5 leading-relaxed">
              {r.text}
            </p>
          </div>
        </div>
      ))}
      {open ? (
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Write a reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-xs resize-none min-h-[56px]"
            data-ocid="reader.reply_textarea"
          />
          <div className="flex flex-col gap-1 shrink-0">
            <Button
              size="sm"
              className="gradient-primary text-primary-foreground border-0 btn-press text-xs h-8"
              onClick={submit}
              disabled={!text.trim()}
              data-ocid="reader.reply_submit_button"
            >
              Reply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-8"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="text-xs hover:text-primary transition-colors"
          style={{ color: "oklch(0.55 0.006 265)" }}
          onClick={() => setOpen(true)}
          data-ocid="reader.reply_button"
        >
          Reply
        </button>
      )}
    </div>
  );
}

// ── CommentSection ────────────────────────────────────────────────────────────

interface CommentSectionProps {
  comicId: string;
  chapterId: string;
  currentUsername: string;
}

function CommentSection({
  comicId,
  chapterId,
  currentUsername,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(() =>
    loadComments(comicId, chapterId),
  );
  const [guestName, setGuestName] = useState(currentUsername || "");
  const [text, setText] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const submit = () => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      comicId,
      chapterId,
      userId: "guest",
      username: guestName.trim() || "Anonymous Reader",
      avatar: "",
      content: text.trim(),
      likes: 0,
      createdAt: Date.now(),
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(comicId, chapterId, updated);
    setText("");
  };

  const likeComment = (id: string) => {
    if (likedIds.has(id)) return;
    setLikedIds((prev) => new Set([...prev, id]));
    const updated = comments.map((c) =>
      c.id === id ? { ...c, likes: c.likes + 1 } : c,
    );
    setComments(updated);
    saveComments(comicId, chapterId, updated);
  };

  return (
    <section className="border-t border-border mt-2 pt-6 pb-10 px-4 max-w-2xl mx-auto space-y-5">
      <h3 className="font-display font-bold text-foreground flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Comments ({comments.length})
      </h3>
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full text-sm bg-muted rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="reader.comment_name_input"
        />
        <Textarea
          placeholder="Share your thoughts about this chapter…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="resize-none min-h-[80px] text-sm"
          data-ocid="reader.comment_textarea"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            className="gradient-primary text-primary-foreground border-0 btn-press"
            onClick={submit}
            disabled={!text.trim()}
            data-ocid="reader.comment_submit_button"
          >
            Post Comment
          </Button>
        </div>
      </div>
      {comments.length === 0 ? (
        <div
          className="text-center py-8 text-muted-foreground"
          data-ocid="reader.comments_empty_state"
        >
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Be the first to comment!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c, i) => (
            <li
              key={c.id}
              className="bg-card border border-border rounded-2xl p-4 space-y-2"
              data-ocid={`reader.comment.item.${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground"
                    aria-hidden
                  >
                    {c.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {c.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {timeAgo(c.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => likeComment(c.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Like comment by ${c.username}`}
                  data-ocid={`reader.comment.like.${i + 1}`}
                >
                  <ThumbsUp
                    className={`w-3.5 h-3.5 ${
                      likedIds.has(c.id) ? "text-primary fill-primary" : ""
                    }`}
                  />
                  {c.likes > 0 && <span>{c.likes}</span>}
                </button>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {c.content}
              </p>
              <ReplySection
                commentId={c.id}
                username={currentUsername || guestName}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ── main component ─────────────────────────────────────────────────────────────

export default function ReaderPage() {
  const { comicId, chapterId } = useParams({
    from: "/read/$comicId/$chapterId",
  });
  const navigate = useNavigate();
  const {
    updateProgress,
    readingProgress,
    currentUser,
    likeComic,
    bookmarkComic,
    comics,
    updateUser,
  } = useAppStore();

  const backendComicId = useMemo(() => {
    const n = Number(comicId);
    return Number.isNaN(n) ? null : BigInt(n);
  }, [comicId]);

  const backendChapterId = useMemo(() => {
    const n = Number(chapterId);
    return Number.isNaN(n) ? null : BigInt(n);
  }, [chapterId]);

  const { data: backendChaptersRaw, isLoading: chaptersLoading } =
    useListChapters(backendComicId, true);

  const updateReadingProgress = useUpdateReadingProgress();
  const deleteChapterMutation = useDeleteChapter();

  // Reading progress from backend
  useGetReadingProgress(backendComicId, currentUser?.id ?? null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressSavedRef = useRef(false);
  const [scrollPct, setScrollPct] = useState(0);

  // localStorage key for scroll position, keyed by chapter ID for cross-session restore
  const localProgressKey = `ur_scroll_${chapterId}`;
  const [showUnlock, setShowUnlock] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showResumeBtn, setShowResumeBtn] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stickyNextVisible, setStickyNextVisible] = useState(false);

  const comic = useMemo(
    () => comics.find((c) => c.id === comicId),
    [comics, comicId],
  );

  const chapter = useMemo(() => {
    if (!backendChaptersRaw) return null;
    return backendChaptersRaw.find((ch) => ch.id === backendChapterId) ?? null;
  }, [backendChaptersRaw, backendChapterId]);

  const sidebarChapters = useMemo(() => {
    if (!backendChaptersRaw) return [];
    return backendChaptersRaw
      .slice()
      .sort((a, b) => Number(a.chapterNumber - b.chapterNumber))
      .map((ch) => ({
        id: String(ch.id),
        title: ch.title,
        chapterNumber: Number(ch.chapterNumber),
        isPremium: false,
      }));
  }, [backendChaptersRaw]);

  const sortedChapters = useMemo(() => {
    if (!backendChaptersRaw) return [];
    return backendChaptersRaw
      .slice()
      .sort((a, b) => Number(a.chapterNumber - b.chapterNumber));
  }, [backendChaptersRaw]);

  const chapterIndex = useMemo(() => {
    if (!backendChaptersRaw || !backendChapterId) return -1;
    return sortedChapters.findIndex((ch) => ch.id === backendChapterId);
  }, [backendChaptersRaw, backendChapterId, sortedChapters]);

  const prevBackendChapter =
    chapterIndex > 0 ? sortedChapters[chapterIndex - 1] : undefined;
  const nextBackendChapter =
    chapterIndex >= 0 && chapterIndex < sortedChapters.length - 1
      ? sortedChapters[chapterIndex + 1]
      : undefined;

  const prevChapter = prevBackendChapter
    ? { id: String(prevBackendChapter.id) }
    : undefined;
  const nextChapter = nextBackendChapter
    ? { id: String(nextBackendChapter.id) }
    : undefined;

  const isLiked = currentUser?.likedComics.includes(comicId) ?? isLikedLocal;
  const isBookmarked = currentUser?.bookmarks.includes(comicId) ?? false;

  // Resolve ordered image URLs using both imageKeys and images with fallback
  const orderedImages = useMemo(() => {
    if (!chapter) return [];
    return resolveChapterImages(
      chapter.images ?? [],
      chapter.imageKeys ?? [],
      chapter.imageOrder ?? [],
    );
  }, [chapter]);

  const numImages = orderedImages.length;

  const chapterDisplay = useMemo(() => {
    if (!chapter) return null;
    return {
      title: chapter.title,
      chapterNumber: Number(chapter.chapterNumber),
      isPremium: false,
      coinCost: 3,
    };
  }, [chapter]);

  // Check if current user is the chapter creator or admin
  const isCreatorOrAdmin = useMemo(() => {
    if (!chapter || !currentUser) return false;
    return chapter.creatorId === currentUser.id || currentUser.role === "owner";
  }, [chapter, currentUser]);

  const needsUnlock =
    chapterDisplay?.isPremium &&
    !isUnlocked &&
    !(currentUser?.unlockedChapters.includes(chapterId) ?? false);

  const savedProgress = readingProgress.find((p) => p.comicId === comicId);
  const savedScrollPos =
    savedProgress?.chapterId === chapterId
      ? savedProgress.scrollPosition
      : null;

  useEffect(() => {
    if (savedScrollPos != null && savedScrollPos > 200) {
      setShowResumeBtn(true);
    }
  }, [savedScrollPos]);

  const chapterIdRef = useRef(chapterId);
  useEffect(() => {
    if (chapterIdRef.current !== chapterId) {
      chapterIdRef.current = chapterId;
      setIsUnlocked(false);
      setShowUnlock(false);
      setShowResumeBtn(false);
      progressSavedRef.current = false;
      setStickyNextVisible(false);
    }
  });

  // Restore scroll position from localStorage when chapter loads
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    try {
      const saved = localStorage.getItem(localProgressKey);
      if (saved) {
        const pos = Number(saved);
        if (pos > 200) {
          // Delay slightly so images begin rendering before we scroll
          const timer = setTimeout(() => {
            el.scrollTo({ top: pos });
          }, 400);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // ignore localStorage errors
    }
  }, [localProgressKey]);

  // Scroll tracking + sticky next chapter reveal + auto-save progress
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? Math.round((el.scrollTop / max) * 100) : 0;
      setScrollPct(pct);

      // Show sticky next chapter button when past 80%
      if (pct >= 80 && nextChapter) {
        setStickyNextVisible(true);
      }

      // Save scroll position to localStorage for cross-session/cross-device recovery
      try {
        localStorage.setItem(localProgressKey, String(el.scrollTop));
      } catch {
        // ignore
      }

      // Auto-save backend progress once when 50%+ scrolled
      if (
        pct >= 50 &&
        !progressSavedRef.current &&
        currentUser &&
        backendComicId &&
        backendChapterId
      ) {
        progressSavedRef.current = true;
        updateReadingProgress.mutate({
          comicId: backendComicId,
          chapterId: backendChapterId,
          userId: currentUser.id,
        });
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [
    currentUser,
    backendComicId,
    backendChapterId,
    nextChapter,
    updateReadingProgress,
    localProgressKey,
  ]);

  const saveScroll = useCallback(() => {
    if (!scrollRef.current || !chapterDisplay) return;
    const pos = scrollRef.current.scrollTop;
    // Save to both store and localStorage for cross-session recovery
    updateProgress({
      comicId,
      chapterId,
      scrollPosition: pos,
      lastReadAt: Date.now(),
      chapterNumber: chapterDisplay.chapterNumber,
    });
    try {
      localStorage.setItem(localProgressKey, String(pos));
    } catch {
      // ignore
    }
  }, [comicId, chapterId, chapterDisplay, updateProgress, localProgressKey]);

  useEffect(() => {
    saveTimerRef.current = setInterval(saveScroll, 5000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      saveScroll();
    };
  }, [saveScroll]);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }, []);

  // Close options menu on outside click
  useEffect(() => {
    if (!showOptionsMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-ocid='reader.options_menu']") &&
        !target.closest("[data-ocid='reader.options_button']")
      ) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showOptionsMenu]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        scrollRef.current?.scrollBy({ top: 300, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        scrollRef.current?.scrollBy({ top: -300, behavior: "smooth" });
      } else if (e.key === "n" && nextChapter) {
        void navigate({
          to: "/read/$comicId/$chapterId",
          params: { comicId, chapterId: nextChapter.id },
        });
      } else if (e.key === "p" && prevChapter) {
        void navigate({
          to: "/read/$comicId/$chapterId",
          params: { comicId, chapterId: prevChapter.id },
        });
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        setShowOptionsMenu(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, comicId, nextChapter, prevChapter, toggleFullscreen]);

  const handleLike = () => {
    likeComic(comicId);
    setIsLikedLocal((v) => !v);
    setLikeCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
  };

  const handleUnlockWithCoins = () => {
    const cost = chapterDisplay?.coinCost ?? 3;
    if (!currentUser || currentUser.coins < cost) return;
    updateUser({
      coins: currentUser.coins - cost,
      unlockedChapters: [...currentUser.unlockedChapters, chapterId],
    });
    setIsUnlocked(true);
    setShowUnlock(false);
  };

  const handleAdUnlock = () => {
    setTimeout(() => {
      if (currentUser)
        updateUser({
          unlockedChapters: [...currentUser.unlockedChapters, chapterId],
        });
      setIsUnlocked(true);
      setShowUnlock(false);
    }, 1500);
    setShowUnlock(false);
  };

  const resumeReading = () => {
    if (savedScrollPos != null && scrollRef.current) {
      scrollRef.current.scrollTo({ top: savedScrollPos, behavior: "smooth" });
    }
    setShowResumeBtn(false);
  };

  const handleDeleteChapter = async () => {
    if (!backendChapterId) return;
    try {
      // Optimistic: close modal immediately for fast UX
      setShowDeleteModal(false);
      await deleteChapterMutation.mutateAsync({
        id: backendChapterId,
        comicId: backendComicId ?? undefined,
      });

      // Clean up continue-reading entry from local store so ghost entry is gone
      if (comicId && chapterId) {
        try {
          const CONTINUE_KEY = `ur_scroll_${chapterId}`;
          localStorage.removeItem(CONTINUE_KEY);
        } catch {
          // ignore localStorage errors
        }
      }

      toast.success("Chapter deleted successfully");
      // Navigate to home so deleted chapter cannot be accessed
      void navigate({ to: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete chapter",
      );
      // Re-open modal is not needed — just show the error
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (chaptersLoading) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4"
        style={{ background: "oklch(0.09 0.008 265)" }}
        data-ocid="reader.loading_state"
      >
        <div
          className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
          style={{
            boxShadow: "0 0 20px oklch(0.58 0.22 265 / 0.3)",
          }}
        />
        <p
          className="text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Loading chapter…
        </p>
      </div>
    );
  }

  if (!chapter || !chapterDisplay) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-4"
        style={{ background: "oklch(0.09 0.008 265)" }}
        data-ocid="reader.error_state"
      >
        <p className="text-5xl">📚</p>
        <h2 className="text-xl font-display font-bold text-white text-center">
          Chapter not available
        </h2>
        <p
          className="text-sm text-center max-w-xs"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          This chapter may have been deleted, not yet published, or is still
          being processed.
        </p>
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Link
            to="/read/$comicId/$chapterId"
            params={{ comicId, chapterId }}
            onClick={() => window.location.reload()}
          >
            <Button
              variant="outline"
              style={{
                borderColor: "oklch(0.35 0.01 265)",
                color: "rgba(255,255,255,0.7)",
              }}
              data-ocid="reader.retry_button"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </Link>
          <Link to="/">
            <Button
              style={{
                background: "oklch(0.58 0.22 265)",
                color: "white",
                border: "none",
              }}
              data-ocid="reader.back_home_button"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const comicTitle = comic?.title ?? "Comic";
  const readingMinutes = Math.max(1, Math.round(numImages * 0.5));

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.09 0.008 265)" }}
      data-ocid="reader.page"
    >
      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-0.5"
        style={{ background: "oklch(0.2 0.01 265)" }}
        aria-hidden
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${scrollPct}%`,
            background: "var(--gradient-primary)",
          }}
        />
      </div>

      {/* ── Sticky reader toolbar ─────────────────────────────────────────── */}
      {!isFullscreen && (
        <div
          className="sticky top-0 z-40 border-b flex flex-col"
          style={{
            background: "oklch(0.13 0.012 265 / 0.97)",
            borderColor: "oklch(0.22 0.01 265)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Row 1: nav + title + actions */}
          <div className="flex items-center gap-2 px-3 py-2.5">
            <Link to="/" data-ocid="reader.home_link">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Back to home"
                className="shrink-0 text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate leading-tight">
                {comicTitle}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p
                  className="text-xs truncate min-w-0"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {chapterDisplay.title}
                </p>
                {numImages > 0 && (
                  <span
                    className="text-xs shrink-0 px-1.5 py-0.5 rounded-md font-medium"
                    style={{
                      background: "oklch(0.58 0.22 265 / 0.18)",
                      color: "oklch(0.72 0.14 265)",
                    }}
                  >
                    {numImages}p
                  </span>
                )}
                <span
                  className="text-xs shrink-0"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  ·
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  ~{readingMinutes} min · {scrollPct}%
                </span>
              </div>
            </div>

            {/* Like */}
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-1 p-1.5 rounded-lg transition-smooth hover:bg-white/10"
              aria-label={isLiked ? "Unlike" : "Like"}
              data-ocid="reader.like_button"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked ? "text-rose-400 fill-rose-400" : "text-white/50"
                }`}
              />
              {likeCount > 0 && (
                <span
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {likeCount}
                </span>
              )}
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => bookmarkComic(comicId)}
              className="p-1.5 rounded-lg transition-smooth hover:bg-white/10"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              data-ocid="reader.bookmark_button"
            >
              <BookmarkIcon
                className={`w-4 h-4 transition-colors ${
                  isBookmarked ? "text-primary fill-primary" : "text-white/50"
                }`}
              />
            </button>

            {/* Chapter list */}
            <button
              type="button"
              onClick={() => setShowChapterList(true)}
              className="p-1.5 rounded-lg transition-smooth hover:bg-white/10"
              aria-label="Chapter list"
              data-ocid="reader.chapter_list_button"
            >
              <List className="w-4 h-4 text-white/50" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg transition-smooth hover:bg-white/10"
              aria-label="Fullscreen"
              data-ocid="reader.fullscreen_button"
            >
              <Maximize className="w-4 h-4 text-white/50" />
            </button>

            {/* Options menu (visible to creator/admin only) */}
            {isCreatorOrAdmin && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowOptionsMenu((v) => !v)}
                  className="p-1.5 rounded-lg transition-smooth hover:bg-white/10"
                  aria-label="Chapter options"
                  data-ocid="reader.options_button"
                >
                  <MoreVertical className="w-4 h-4 text-white/50" />
                </button>
                {showOptionsMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 rounded-xl border shadow-xl overflow-hidden z-50"
                    style={{
                      background: "oklch(0.16 0.015 265 / 0.98)",
                      borderColor: "oklch(0.28 0.01 265)",
                      backdropFilter: "blur(16px)",
                      minWidth: "160px",
                    }}
                    data-ocid="reader.options_menu"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
                      style={{ color: "oklch(0.65 0.18 15)" }}
                      data-ocid="reader.delete_button"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Chapter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Row 2: chapter prev/next */}
          <div
            className="flex items-center gap-2 px-3 pb-2.5"
            style={{ borderTop: "1px solid oklch(0.20 0.01 265)" }}
          >
            {prevChapter ? (
              <Link
                to="/read/$comicId/$chapterId"
                params={{ comicId, chapterId: prevChapter.id }}
                data-ocid="reader.prev_chapter"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-white/10 text-white/60 hover:text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-white/20 select-none">
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </span>
            )}

            <div className="flex-1 text-center">
              <span
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Ch. {chapterDisplay.chapterNumber} — {chapterIndex + 1}/
                {sortedChapters.length}
              </span>
            </div>

            {nextChapter ? (
              <Link
                to="/read/$comicId/$chapterId"
                params={{ comicId, chapterId: nextChapter.id }}
                data-ocid="reader.next_chapter"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-white/10 text-white/60 hover:text-white"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-white/20 select-none">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Scrollable reading area ──────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: isFullscreen ? "100vh" : "calc(100vh - 90px)" }}
        data-ocid="reader.canvas_target"
      >
        {needsUnlock ? (
          <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-4xl shadow-lg">
              🔒
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white mb-2">
                Premium Chapter
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)" }} className="text-sm">
                This chapter costs{" "}
                <span className="text-yellow-400 font-semibold">
                  {chapterDisplay.coinCost} UR Coins
                </span>{" "}
                to unlock.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button
                className="flex-1 gradient-primary text-primary-foreground border-0 btn-press"
                onClick={() => setShowUnlock(true)}
                data-ocid="reader.unlock_button"
              >
                <Coins className="w-4 h-4 mr-2" /> Unlock Chapter
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={handleAdUnlock}
                data-ocid="reader.ad_unlock_button"
              >
                <Play className="w-4 h-4 mr-2" /> Watch Ad
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Images: no images warning ─────────────────────────────── */}
            {numImages === 0 && (
              <div
                className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center"
                data-ocid="reader.images_empty_state"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.22 265 / 0.15)" }}
                >
                  <p className="text-3xl">🖼️</p>
                </div>
                <p className="font-display font-bold text-white">
                  Images are still uploading
                </p>
                <p
                  className="text-sm max-w-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  The chapter images have not finished uploading yet. Please try
                  again in a moment — your content is safe.
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: "oklch(0.58 0.22 265 / 0.2)",
                      color: "oklch(0.70 0.18 265)",
                      border: "1px solid oklch(0.58 0.22 265 / 0.3)",
                    }}
                    data-ocid="reader.refresh_button"
                  >
                    <RotateCcw className="w-4 h-4" /> Refresh Page
                  </button>
                  <Link to="/">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        background: "oklch(0.20 0.01 265)",
                        color: "rgba(255,255,255,0.6)",
                        border: "1px solid oklch(0.28 0.01 265)",
                      }}
                      data-ocid="reader.back_home_from_empty"
                    >
                      Back to Home
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* ── Chapter image strip (vertical scroll) ─────────────────── */}
            {numImages > 0 && (
              <div
                className="w-full mx-auto"
                style={{
                  maxWidth: "720px",
                  background: "#0a0a0c",
                }}
                data-ocid="reader.images_container"
              >
                {orderedImages.map((src, i) => (
                  <LazyImage
                    key={`${chapterId}-img-${src.slice(-40)}`}
                    src={src}
                    index={i}
                    alt={`${comicTitle} — ${chapterDisplay.title} — Page ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* ── Bottom chapter navigation ─────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div
                className="rounded-2xl border p-5 space-y-4"
                style={{
                  background: "oklch(0.14 0.012 265)",
                  borderColor: "oklch(0.22 0.01 265)",
                }}
              >
                {!nextChapter && (
                  <p
                    className="text-center text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    🎉 End of Series — check back later!
                  </p>
                )}
                <p className="text-center text-sm font-semibold text-white">
                  End of {chapterDisplay.title}
                </p>
                <div className="flex items-center justify-between gap-3">
                  {prevChapter ? (
                    <Link
                      to="/read/$comicId/$chapterId"
                      params={{ comicId, chapterId: prevChapter.id }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        data-ocid="reader.bottom_prev_chapter"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {nextChapter ? (
                    <Link
                      to="/read/$comicId/$chapterId"
                      params={{ comicId, chapterId: nextChapter.id }}
                      className="flex-1"
                    >
                      <Button
                        className="w-full gradient-primary text-primary-foreground border-0 btn-press"
                        data-ocid="reader.bottom_next_chapter"
                      >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        data-ocid="reader.back_home_button"
                      >
                        Back to Home
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* ── Comments ──────────────────────────────────────────────── */}
            <div
              style={{
                background: "oklch(0.11 0.01 265)",
                borderTop: "1px solid oklch(0.20 0.01 265)",
              }}
            >
              <CommentSection
                comicId={comicId}
                chapterId={chapterId}
                currentUsername={currentUser?.username ?? ""}
              />
            </div>
          </>
        )}
        <div className="h-8" />
      </div>

      {/* ── Sticky "Next Chapter" footer button (visible at 80%+ scroll) ────── */}
      {stickyNextVisible && nextChapter && !isFullscreen && (
        <div
          className="sticky bottom-0 left-0 right-0 z-30 px-4 py-3"
          style={{
            background:
              "linear-gradient(to top, oklch(0.10 0.01 265) 0%, transparent 100%)",
          }}
        >
          <div className="max-w-2xl mx-auto">
            <Link
              to="/read/$comicId/$chapterId"
              params={{ comicId, chapterId: nextChapter.id }}
              data-ocid="reader.sticky_next_chapter"
            >
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white btn-press transition-smooth"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "0 4px 24px oklch(0.58 0.22 265 / 0.4)",
                  minHeight: "52px", // large tap target for mobile
                }}
              >
                Next Chapter <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Fullscreen floating controls ───────────────────────────────────── */}
      {isFullscreen && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{
            background: "oklch(0.15 0.015 265 / 0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid oklch(0.25 0.01 265)",
          }}
          data-ocid="reader.fullscreen_controls"
        >
          {prevChapter && (
            <Link
              to="/read/$comicId/$chapterId"
              params={{ comicId, chapterId: prevChapter.id }}
            >
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Previous chapter"
                data-ocid="reader.fs_prev_chapter"
              >
                <ChevronLeft className="w-5 h-5 text-white/70" />
              </button>
            </Link>
          )}
          <span
            className="text-xs px-2"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {scrollPct}% · Ch. {chapterDisplay.chapterNumber}
          </span>
          {nextChapter && (
            <Link
              to="/read/$comicId/$chapterId"
              params={{ comicId, chapterId: nextChapter.id }}
            >
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Next chapter"
                data-ocid="reader.fs_next_chapter"
              >
                <ChevronRight className="w-5 h-5 text-white/70" />
              </button>
            </Link>
          )}
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "oklch(0.3 0.01 265)",
            }}
          />
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={toggleFullscreen}
            aria-label="Exit fullscreen"
            data-ocid="reader.exit_fullscreen_button"
          >
            <Minimize className="w-5 h-5 text-white/70" />
          </button>
        </div>
      )}

      {/* ── Resume reading floating button ────────────────────────────────── */}
      {showResumeBtn && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
          data-ocid="reader.resume_button"
        >
          <button
            type="button"
            onClick={resumeReading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-lg btn-press transition-smooth hover:scale-105"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "0 4px 20px oklch(0.58 0.22 265 / 0.4)",
            }}
          >
            <RotateCcw className="w-4 h-4" /> Resume reading
          </button>
        </div>
      )}

      {/* ── Chapter list sidebar ──────────────────────────────────────────── */}
      {showChapterList && (
        <ChapterSidebar
          chapters={sidebarChapters}
          currentChapterId={chapterId}
          comicId={comicId}
          onClose={() => setShowChapterList(false)}
        />
      )}

      {/* ── Unlock modal ──────────────────────────────────────────────────── */}
      {showUnlock && (
        <UnlockModal
          coinCost={chapterDisplay.coinCost}
          userCoins={currentUser?.coins ?? 0}
          onUnlock={handleUnlockWithCoins}
          onAdUnlock={handleAdUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}

      {/* ── Delete chapter confirmation modal ─────────────────────────────── */}
      {showDeleteModal && (
        <DeleteChapterModal
          chapterTitle={chapterDisplay.title}
          onConfirm={() => void handleDeleteChapter()}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={deleteChapterMutation.isPending}
        />
      )}
    </div>
  );
}
