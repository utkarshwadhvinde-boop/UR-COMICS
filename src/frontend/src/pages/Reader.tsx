import { ErrorFallback } from "@/components/ErrorFallback";
import { PageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useChapter } from "@/hooks/useChapter";
import { useChapters } from "@/hooks/useChapters";
import { useSaveReadProgress } from "@/hooks/useReadProgress";
import { cn } from "@/lib/utils";
import type { Chapter } from "@/types/index";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────
const SCROLL_KEY = (id: string) => `reader_scroll_${id}`;
const CHROME_HIDE_MS = 2000;
const PREFETCH_THRESHOLD = 0.8;

// ─── Shimmer placeholder ──────────────────────────────────────
function ImageShimmer({ aspectRatio = "9/16" }: { aspectRatio?: string }) {
  return (
    <div
      className="w-full max-w-2xl mx-auto bg-purple-900/20 animate-pulse"
      style={{ aspectRatio }}
      aria-hidden
    />
  );
}

// ─── Single webtoon image with reveal + shimmer ───────────────
interface WebtoonImageProps {
  src: string;
  alt: string;
  index: number;
  isVisible: boolean;
}

function WebtoonImage({ src, alt, index, isVisible }: WebtoonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!isVisible) {
    // Keep a sized placeholder to prevent layout shift
    return (
      <div
        className="w-full max-w-2xl mx-auto bg-muted/20"
        style={{ minHeight: "600px" }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className="relative w-full max-w-2xl mx-auto"
      data-ocid={`reader.item.${index + 1}`}
    >
      {!loaded && !errored && <ImageShimmer />}
      {errored ? (
        <div
          className="w-full flex items-center justify-center bg-purple-900/30 text-muted-foreground text-sm font-body py-20 min-h-[300px]"
          role="img"
          aria-label={`Page ${index + 1} failed to load`}
        >
          <span className="opacity-50">⚠ Page {index + 1} unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={index < 3 ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "w-full object-contain transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0 absolute inset-0",
          )}
        />
      )}
    </div>
  );
}

// ─── Image virtualization container ──────────────────────────
interface VirtualizedStripProps {
  imageUrls: string[];
  chapterId: string;
  onScrollProgress: (pct: number) => void;
  onCurrentPage: (page: number) => void;
}

function VirtualizedStrip({
  imageUrls,
  chapterId,
  onScrollProgress,
  onCurrentPage,
}: VirtualizedStripProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(() => {
    // Pre-reveal first 3 eagerly
    return new Set([0, 1, 2]);
  });

  // Restore scroll position on mount
  useEffect(() => {
    const saved = localStorage.getItem(SCROLL_KEY(chapterId));
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number(saved), behavior: "instant" });
      });
    }
  }, [chapterId]);

  // Save scroll position & emit progress
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        localStorage.setItem(SCROLL_KEY(chapterId), String(window.scrollY));
        const el = containerRef.current;
        if (!el) return;
        const scrolled = window.scrollY;
        const total = el.scrollHeight - window.innerHeight;
        const pct = total > 0 ? scrolled / total : 0;
        onScrollProgress(pct);
        // Estimate current page from scroll position
        const pageHeight = el.scrollHeight / (imageUrls.length || 1);
        const page = Math.min(
          imageUrls.length,
          Math.floor(scrolled / pageHeight) + 1,
        );
        onCurrentPage(page);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [chapterId, imageUrls.length, onScrollProgress, onCurrentPage]);

  // IntersectionObserver to reveal images within viewport ± 1 screen
  useEffect(() => {
    const images =
      containerRef.current?.querySelectorAll<HTMLElement>("[data-img-index]");
    if (!images) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSet((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const idx = Number((entry.target as HTMLElement).dataset.imgIndex);
            if (entry.isIntersecting) next.add(idx);
          }
          return next;
        });
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 },
    );
    for (const el of Array.from(images)) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-stretch gap-0">
      {imageUrls.map((url, i) => (
        <div key={url} data-img-index={i}>
          <WebtoonImage
            src={url}
            alt={`Page ${i + 1}`}
            index={i}
            isVisible={visibleSet.has(i)}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Chrome (header + footer overlays) ───────────────────────
interface ChromeProps {
  visible: boolean;
  comicId: string;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  currentPage: number;
  totalPages: number;
  prefetching: boolean;
}

function ReaderChrome({
  visible,
  comicId,
  chapter,
  prevChapter,
  nextChapter,
  currentPage,
  totalPages,
  prefetching,
}: ChromeProps) {
  const chromeVariants = {
    visible: { opacity: 1, pointerEvents: "auto" as const },
    hidden: { opacity: 0, pointerEvents: "none" as const },
  };

  return (
    <>
      {/* Top bar */}
      <motion.header
        variants={chromeVariants}
        animate={visible ? "visible" : "hidden"}
        transition={{ duration: 0.22 }}
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 px-4 py-3 backdrop-blur-md bg-background/80 border-b border-border/50"
        data-ocid="reader.header"
      >
        <Link
          to="/comics/$comicId"
          params={{ comicId }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors duration-200 shrink-0"
          data-ocid="reader.back_link"
          tabIndex={visible ? 0 : -1}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>

        <div className="flex flex-col items-center min-w-0">
          <p className="text-xs font-body text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
            Chapter {chapter.chapter_number}
          </p>
          <p className="text-sm font-display text-foreground truncate max-w-[200px] sm:max-w-sm">
            {chapter.title}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            asChild
            disabled={!prevChapter}
            className={cn(
              "text-muted-foreground hover:text-accent",
              !prevChapter && "opacity-30 pointer-events-none",
            )}
            data-ocid="reader.prev_button"
          >
            {prevChapter ? (
              <Link
                to="/comics/$comicId/chapters/$chapterId"
                params={{ comicId, chapterId: prevChapter.id }}
                tabIndex={visible ? 0 : -1}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
            ) : (
              <span>
                <ChevronLeft className="w-5 h-5" />
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-muted-foreground hover:text-accent"
            data-ocid="reader.chapters_button"
          >
            <Link
              to="/comics/$comicId"
              params={{ comicId }}
              tabIndex={visible ? 0 : -1}
            >
              <BookOpen className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            disabled={!nextChapter}
            className={cn(
              "text-muted-foreground hover:text-accent",
              !nextChapter && "opacity-30 pointer-events-none",
            )}
            data-ocid="reader.next_button"
          >
            {nextChapter ? (
              <Link
                to="/comics/$comicId/chapters/$chapterId"
                params={{ comicId, chapterId: nextChapter.id }}
                tabIndex={visible ? 0 : -1}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <span>
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </div>
      </motion.header>

      {/* Bottom bar */}
      <motion.footer
        variants={chromeVariants}
        animate={visible ? "visible" : "hidden"}
        transition={{ duration: 0.22 }}
        className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-between gap-3 px-4 py-3 backdrop-blur-md bg-background/80 border-t border-border/50"
        data-ocid="reader.footer"
      >
        {prevChapter ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="shrink-0 border-border/60 text-muted-foreground hover:text-foreground hover:border-accent"
            data-ocid="reader.prev_chapter_button"
          >
            <Link
              to="/comics/$comicId/chapters/$chapterId"
              params={{ comicId, chapterId: prevChapter.id }}
              tabIndex={visible ? 0 : -1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Link>
          </Button>
        ) : (
          <div className="w-20" />
        )}

        <div className="flex items-center gap-2">
          {prefetching && (
            <Loader2
              className="w-3.5 h-3.5 animate-spin text-accent/60"
              aria-label="Prefetching next chapter"
            />
          )}
          <span
            className="text-xs font-mono text-muted-foreground"
            data-ocid="reader.page_counter"
          >
            {totalPages > 0 ? `${currentPage} / ${totalPages}` : "—"}
          </span>
        </div>

        {nextChapter ? (
          <Button
            size="sm"
            asChild
            className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="reader.next_chapter_button"
          >
            <Link
              to="/comics/$comicId/chapters/$chapterId"
              params={{ comicId, chapterId: nextChapter.id }}
              tabIndex={visible ? 0 : -1}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        ) : (
          <div className="w-20" />
        )}
      </motion.footer>
    </>
  );
}

// ─── Reader page ──────────────────────────────────────────────
export function ReaderPage() {
  const { comicId, chapterId } = useParams({
    from: "/comics/$comicId/chapters/$chapterId",
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: chapter,
    isLoading,
    isError,
    refetch,
  } = useChapter(comicId, chapterId);

  const { data: chapters } = useChapters(comicId);
  const { mutate: saveProgress } = useSaveReadProgress(user?.id);

  // Derived chapter navigation
  const published =
    chapters
      ?.filter((c) => c.is_published)
      .sort((a, b) => a.chapter_number - b.chapter_number) ?? [];
  const currentIndex = published.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? published[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < published.length - 1 ? published[currentIndex + 1] : null;

  // Chrome visibility
  const [showChrome, setShowChrome] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setShowChrome(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowChrome(false), CHROME_HIDE_MS);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === "ArrowLeft" && prevChapter) {
        navigate({
          to: "/comics/$comicId/chapters/$chapterId",
          params: { comicId, chapterId: prevChapter.id },
        });
      } else if (e.key === "ArrowRight" && nextChapter) {
        navigate({
          to: "/comics/$comicId/chapters/$chapterId",
          params: { comicId, chapterId: nextChapter.id },
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, comicId, prevChapter, nextChapter, resetHideTimer]);

  // Auto-save scroll position (debounced 1s)
  const saveDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSaveScroll = useCallback(() => {
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => {
      saveProgress({
        comicId,
        lastChapterId: chapterId,
        lastPageNumber: Math.round(window.scrollY),
      });
    }, 1000);
  }, [comicId, chapterId, saveProgress]);

  useEffect(() => {
    window.addEventListener("scroll", handleSaveScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleSaveScroll);
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    };
  }, [handleSaveScroll]);

  // Restore scroll position from URL ?scrollY param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlScrollY = params.get("scrollY");
    if (urlScrollY) {
      const target = Number(urlScrollY);
      if (target > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: target, behavior: "instant" });
        });
      }
    }
  }, []);

  // Prefetch state
  const [prefetching, setPrefetching] = useState(false);
  const prefetchedRef = useRef(false);
  const { refetch: prefetchNext } = useChapter(
    nextChapter ? comicId : undefined,
    nextChapter?.id ?? undefined,
  );

  // Page counter
  const [currentPage, setCurrentPage] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const handleScrollProgress = useCallback(
    (pct: number) => {
      if (pct >= PREFETCH_THRESHOLD && nextChapter && !prefetchedRef.current) {
        prefetchedRef.current = true;
        setPrefetching(true);
        prefetchNext().finally(() => setPrefetching(false));
      }
    },
    [nextChapter, prefetchNext],
  );

  // Reset prefetch flag when chapter changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: chapterId triggers prefetch state reset on chapter navigation
  useEffect(() => {
    prefetchedRef.current = false;
    setPrefetching(false);
    setCurrentPage(1);
  }, [chapterId]);

  if (isLoading) return <PageLoader />;
  if (isError)
    return (
      <ErrorFallback
        message="Failed to load chapter."
        onRetry={() => refetch()}
      />
    );
  if (!chapter) return <ErrorFallback message="Chapter not found." />;

  // Extract image URLs from chapter pages, in page order
  const imageUrls = (chapter.pages ?? [])
    .filter((p) => p != null)
    .sort((a, b) => a.page_number - b.page_number)
    .map((p) => p.image_url)
    .filter((url): url is string => typeof url === "string" && url.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="relative bg-background min-h-screen"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={resetHideTimer}
      data-ocid="reader.page"
    >
      <ReaderChrome
        visible={showChrome}
        comicId={comicId}
        chapter={chapter as Chapter}
        prevChapter={prevChapter as Chapter | null}
        nextChapter={nextChapter as Chapter | null}
        currentPage={currentPage}
        totalPages={imageUrls.length}
        prefetching={prefetching}
      />

      {/* Image strip */}
      <main
        className="pt-14 pb-20 flex flex-col items-stretch"
        data-ocid="reader.canvas_target"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={chapterId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {imageUrls.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground"
                data-ocid="reader.empty_state"
              >
                <BookOpen className="w-10 h-10 opacity-30" />
                <p className="font-body text-sm">
                  No pages in this chapter yet.
                </p>
              </div>
            ) : (
              <VirtualizedStrip
                imageUrls={imageUrls}
                chapterId={chapterId}
                onScrollProgress={handleScrollProgress}
                onCurrentPage={setCurrentPage}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}
