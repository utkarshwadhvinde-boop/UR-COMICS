import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getChapterById, getComicById } from "@/lib/sampleData";
import { useAppStore } from "@/store";
import type { Comment } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BookmarkIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Heart,
  Home,
  Keyboard,
  MessageCircle,
  Moon,
  Play,
  Sun,
  ThumbsUp,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── helpers ────────────────────────────────────────────────────────────────────

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

const PANEL_PALETTES: [string, string][] = [
  ["oklch(0.22 0.04 265)", "oklch(0.18 0.06 290)"],
  ["oklch(0.18 0.05 250)", "oklch(0.22 0.04 310)"],
  ["oklch(0.20 0.06 280)", "oklch(0.16 0.04 240)"],
  ["oklch(0.25 0.05 270)", "oklch(0.20 0.06 300)"],
  ["oklch(0.16 0.04 295)", "oklch(0.22 0.05 265)"],
  ["oklch(0.20 0.03 255)", "oklch(0.24 0.06 285)"],
  ["oklch(0.18 0.06 310)", "oklch(0.20 0.04 265)"],
  ["oklch(0.22 0.05 275)", "oklch(0.17 0.03 295)"],
];

function formatTime(minutes: number): string {
  if (minutes < 1) return "< 1 min";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
}

function timeAgo(ts: number): string {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── sub-components ─────────────────────────────────────────────────────────────

function ComicPagePanel({
  index,
  title,
  chapter,
}: {
  index: number;
  title: string;
  chapter: string;
}) {
  const [from, to] = PANEL_PALETTES[index % PANEL_PALETTES.length];
  return (
    <div
      className="w-full select-none"
      style={{
        aspectRatio: "3/4",
        background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)",
          pointerEvents: "none",
        }}
      />
      <div className="text-center z-10 px-4">
        <p
          className="font-display font-bold text-center"
          style={{
            fontSize: "clamp(4rem,15vw,8rem)",
            color: "rgba(255,255,255,0.08)",
            lineHeight: 1,
          }}
        >
          {index + 1}
        </p>
        <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          {title} · {chapter}
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
          Page {index + 1}
        </p>
      </div>
    </div>
  );
}

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
      style={{ background: "rgba(0,0,0,0.75)" }}
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

      {/* Add comment form */}
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

      {/* Comments list */}
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
                    className={`w-3.5 h-3.5 ${likedIds.has(c.id) ? "text-primary fill-primary" : ""}`}
                  />
                  {c.likes > 0 && <span>{c.likes}</span>}
                </button>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {c.content}
              </p>
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
    isDarkMode,
    toggleDarkMode,
    updateProgress,
    readingProgress,
    currentUser,
    likeComic,
    bookmarkComic,
    comics,
    updateUser,
  } = useAppStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showKeyHints, setShowKeyHints] = useState(false);

  // Get live comic from store (handles user-created comics)
  const comic = useMemo(
    () => comics.find((c) => c.id === comicId) ?? getComicById(comicId),
    [comics, comicId],
  );
  const chapter = useMemo(
    () =>
      comic?.chapters.find((ch) => ch.id === chapterId) ??
      getChapterById(comicId, chapterId),
    [comic, comicId, chapterId],
  );
  const savedProgress = readingProgress.find((p) => p.comicId === comicId);
  const chapterIndex =
    comic?.chapters.findIndex((ch) => ch.id === chapterId) ?? 0;
  const prevChapter = comic?.chapters[chapterIndex - 1];
  const nextChapter = comic?.chapters[chapterIndex + 1];

  const isLiked = currentUser?.likedComics.includes(comicId) ?? false;
  const isBookmarked = currentUser?.bookmarks.includes(comicId) ?? false;
  const numPages = chapter?.pages.length ?? 8;
  const readingMinutes = Math.max(1, Math.round(numPages * 0.5));
  const pageIndices = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i),
    [numPages],
  );

  // Determine if chapter needs unlock
  const needsUnlock =
    chapter?.isPremium &&
    !isUnlocked &&
    !(currentUser?.unlockedChapters.includes(chapterId) ?? false);

  const savedScrollPos =
    savedProgress?.chapterId === chapterId
      ? savedProgress.scrollPosition
      : null;

  // Restore scroll position when savedScrollPos changes (new chapter loaded with saved position)
  useEffect(() => {
    if (savedScrollPos != null && scrollRef.current) {
      const pos = savedScrollPos;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: pos, behavior: "smooth" });
      }, 150);
    }
  }, [savedScrollPos]);

  // Reset unlock state when chapter changes — use ref to avoid stale closure
  const chapterIdRef = useRef(chapterId);
  useEffect(() => {
    if (chapterIdRef.current !== chapterId) {
      chapterIdRef.current = chapterId;
      setIsUnlocked(false);
      setShowUnlock(false);
    }
  });

  // Track scroll progress
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? Math.round((el.scrollTop / max) * 100) : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-save every 5 seconds
  const saveScroll = useCallback(() => {
    if (!scrollRef.current || !chapter) return;
    updateProgress({
      comicId,
      chapterId,
      scrollPosition: scrollRef.current.scrollTop,
      lastReadAt: Date.now(),
      chapterNumber: chapter.chapterNumber,
    });
  }, [comicId, chapterId, chapter, updateProgress]);

  useEffect(() => {
    saveTimerRef.current = setInterval(saveScroll, 5000);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      saveScroll(); // save on unmount too
    };
  }, [saveScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        scrollRef.current?.scrollBy({ top: 200, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        scrollRef.current?.scrollBy({ top: -200, behavior: "smooth" });
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
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, comicId, nextChapter, prevChapter]);

  const handleUnlockWithCoins = () => {
    const cost = chapter?.coinCost ?? 3;
    if (!currentUser || currentUser.coins < cost) return;
    updateUser({
      coins: currentUser.coins - cost,
      unlockedChapters: [...currentUser.unlockedChapters, chapterId],
    });
    setIsUnlocked(true);
    setShowUnlock(false);
  };

  const handleAdUnlock = () => {
    // Simulate rewarded ad
    setTimeout(() => {
      if (currentUser) {
        updateUser({
          unlockedChapters: [...currentUser.unlockedChapters, chapterId],
        });
      }
      setIsUnlocked(true);
      setShowUnlock(false);
    }, 1500);
    setShowUnlock(false);
  };

  if (!comic || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-4xl">📚</p>
        <h2 className="text-xl font-semibold text-foreground">
          Chapter not found
        </h2>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  // Chapter select options
  const chapterOptions = comic.chapters.map((ch) => ({
    value: ch.id,
    label: `${ch.title}${ch.isPremium ? " 🔒" : ""}`,
  }));

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.11 0.01 265)" }}
      data-ocid="reader.page"
    >
      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-0.5"
        style={{ background: "oklch(0.25 0.01 265)" }}
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
      <div
        className="sticky top-0 z-40 border-b flex flex-col"
        style={{
          background: "oklch(0.15 0.015 265 / 0.97)",
          borderColor: "oklch(0.25 0.01 265)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Row 1: home + title + actions */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Link to="/" data-ocid="reader.home_link">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back to home"
              className="shrink-0 hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Home className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white truncate leading-tight">
              {comic.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                {chapter.title}
              </p>
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                ·
              </span>
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <Clock className="w-3 h-3" />
                {formatTime(readingMinutes)} read
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {scrollPct}%
              </span>
            </div>
          </div>

          {/* Like */}
          <button
            type="button"
            onClick={() => likeComic(comicId)}
            className="p-1.5 rounded-lg transition-smooth hover:bg-white/10"
            aria-label={isLiked ? "Unlike" : "Like"}
            data-ocid="reader.like_button"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isLiked ? "text-rose-400 fill-rose-400" : "text-white/50"}`}
            />
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
              className={`w-4 h-4 transition-colors ${isBookmarked ? "text-primary fill-primary" : "text-white/50"}`}
            />
          </button>

          {/* Dark mode */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg transition-smooth hover:bg-white/10"
            aria-label="Toggle dark mode"
            data-ocid="reader.dark_mode_toggle"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-white/50" />
            ) : (
              <Moon className="w-4 h-4 text-white/50" />
            )}
          </button>

          {/* Keyboard hints */}
          <button
            type="button"
            onClick={() => setShowKeyHints((v) => !v)}
            className="p-1.5 rounded-lg transition-smooth hover:bg-white/10 hidden sm:block"
            aria-label="Keyboard shortcuts"
            data-ocid="reader.keyboard_hints_toggle"
          >
            <Keyboard className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Row 2: chapter nav */}
        <div
          className="flex items-center gap-2 px-3 pb-2.5"
          style={{ borderTop: "1px solid oklch(0.22 0.01 265)" }}
        >
          {prevChapter ? (
            <Link
              to="/read/$comicId/$chapterId"
              params={{ comicId, chapterId: prevChapter.id }}
              data-ocid="reader.prev_chapter"
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-white/10 text-white/60 hover:text-white"
                aria-label="Previous chapter"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-white/20 cursor-not-allowed"
              disabled
              aria-label="No previous chapter"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
          )}

          <div className="flex-1">
            <Select
              value={chapterId}
              onValueChange={(val) =>
                void navigate({
                  to: "/read/$comicId/$chapterId",
                  params: { comicId, chapterId: val },
                })
              }
            >
              <SelectTrigger
                className="h-7 text-xs border-0 text-white/70 bg-white/5 focus:ring-ring"
                data-ocid="reader.chapter_select"
              >
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapterOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {chapterIndex + 1} / {comic.chapters.length}
          </span>

          {nextChapter ? (
            <Link
              to="/read/$comicId/$chapterId"
              params={{ comicId, chapterId: nextChapter.id }}
              data-ocid="reader.next_chapter"
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-white/10 text-white/60 hover:text-white"
                aria-label="Next chapter"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          ) : (
            <button
              type="button"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-white/20 cursor-not-allowed"
              disabled
              aria-label="No next chapter"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        {showKeyHints && (
          <div
            className="px-4 pb-3 text-xs grid grid-cols-2 gap-x-6 gap-y-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
            data-ocid="reader.keyboard_hints_panel"
          >
            <span>
              <kbd className="bg-white/10 px-1 rounded text-white/60">↑↓</kbd>{" "}
              Scroll
            </span>
            <span>
              <kbd className="bg-white/10 px-1 rounded text-white/60">n</kbd>{" "}
              Next chapter
            </span>
            <span>
              <kbd className="bg-white/10 px-1 rounded text-white/60">p</kbd>{" "}
              Prev chapter
            </span>
          </div>
        )}
      </div>

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 90px)" }}
        data-ocid="reader.canvas_target"
      >
        {/* Premium lock overlay */}
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
                  {chapter.coinCost} UR Coins
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
            {/* Blurred preview panels */}
            <div className="w-full max-w-2xl space-y-1 opacity-30 pointer-events-none blur-sm">
              {[0, 1, 2].map((i) => (
                <ComicPagePanel
                  key={`preview-${i}`}
                  index={i}
                  title={comic.title}
                  chapter={chapter.title}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Pages */}
            <div className="max-w-2xl mx-auto px-2 pt-4 space-y-1">
              {pageIndices.map((i) => (
                <ComicPagePanel
                  key={`page-${chapterId}-${i}`}
                  index={i}
                  title={comic.title}
                  chapter={chapter.title}
                />
              ))}
            </div>

            {/* Bottom chapter nav */}
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div
                className="rounded-2xl border p-4 space-y-3"
                style={{
                  background: "oklch(0.16 0.015 265)",
                  borderColor: "oklch(0.25 0.01 265)",
                }}
              >
                <p className="text-center text-sm font-semibold text-white">
                  End of {chapter.title}
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
                    <div className="flex-1 text-center">
                      <p
                        className="text-xs mb-2"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                      >
                        You've reached the latest chapter!
                      </p>
                      <Link to="/">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                          data-ocid="reader.back_home_button"
                        >
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comment section */}
            <div
              style={{
                background: "oklch(0.13 0.012 265)",
                borderTop: "1px solid oklch(0.22 0.01 265)",
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

        {/* Scroll-to-bottom spacer */}
        <div className="h-8" />
      </div>

      {/* ── Chapter dropdown icon hint ─────────────────────────────────────── */}
      <div
        className="fixed bottom-4 right-4 z-40"
        data-ocid="reader.scroll_hint"
      >
        <button
          type="button"
          onClick={() =>
            scrollRef.current?.scrollBy({ top: 300, behavior: "smooth" })
          }
          className="w-10 h-10 rounded-full flex items-center justify-center transition-smooth hover:scale-105 shadow-lg"
          style={{ background: "oklch(0.22 0.04 265 / 0.9)" }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* ── Unlock modal ──────────────────────────────────────────────────── */}
      {showUnlock && (
        <UnlockModal
          coinCost={chapter.coinCost}
          userCoins={currentUser?.coins ?? 0}
          onUnlock={handleUnlockWithCoins}
          onAdUnlock={handleAdUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
}
