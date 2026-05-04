import { Button } from "@/components/ui/button";
import { BookOpen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pages: string[];
  imageOrder: number[];
  chapterTitle: string;
  chapterNumber: number;
}

function LazyImage({
  src,
  alt,
  index,
}: { src: string; alt: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full bg-black"
      data-ocid={`chapter_preview.page.${index + 1}`}
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="w-full aspect-[3/4] flex items-center justify-center bg-muted/10">
          <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      )}
      {/* Page number badge */}
      {loaded && !error && (
        <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-sm">
          {index + 1}
        </span>
      )}
      {visible && !error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto block transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(false);
          }}
        />
      )}
      {error && (
        <div className="w-full aspect-[3/4] flex flex-col items-center justify-center text-muted-foreground text-sm gap-2 bg-muted/10">
          <BookOpen className="w-8 h-8 opacity-40" />
          <span className="text-xs opacity-60">
            Page {index + 1} unavailable
          </span>
        </div>
      )}
    </div>
  );
}

export function ChapterPreviewModal({
  isOpen,
  onClose,
  pages,
  imageOrder,
  chapterTitle,
  chapterNumber,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const orderedPages =
    imageOrder.length > 0
      ? imageOrder.map((idx) => pages[idx] ?? "").filter(Boolean)
      : pages.filter(Boolean);

  const title = chapterTitle.trim() || `Chapter ${chapterNumber}`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: "#0a0a0f" }}
      aria-modal="true"
      aria-label={`Preview: ${title}`}
      data-ocid="chapter_preview.dialog"
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/10"
        style={{
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(8px)",
        }}
        data-ocid="chapter_preview.header"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0 shadow-glow">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/50 leading-none mb-0.5">
              Chapter {chapterNumber} Preview
            </p>
            <h2 className="text-sm font-semibold text-white truncate max-w-[180px] sm:max-w-xs">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-white/40">
            {orderedPages.length} page{orderedPages.length !== 1 ? "s" : ""}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
            onClick={onClose}
            aria-label="Close preview"
            data-ocid="chapter_preview.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain"
        data-ocid="chapter_preview.scroll_area"
      >
        {orderedPages.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white/40"
            data-ocid="chapter_preview.empty_state"
          >
            <BookOpen className="w-12 h-12 opacity-30" />
            <p className="text-sm">No pages uploaded yet</p>
            <p className="text-xs opacity-60">
              Upload images to see your chapter preview
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto w-full">
            {orderedPages.map((src, idx) => (
              <LazyImage
                key={`${idx}-${src.slice(-20)}`}
                src={src}
                alt={`Page ${idx + 1}`}
                index={idx}
              />
            ))}
            {/* Bottom bar */}
            <div className="py-8 flex flex-col items-center gap-3 border-t border-white/10 mt-2">
              <p className="text-white/30 text-sm">
                End of preview — {orderedPages.length} page
                {orderedPages.length !== 1 ? "s" : ""}
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={onClose}
                data-ocid="chapter_preview.close_bottom_button"
              >
                <X className="w-4 h-4 mr-2" /> Close Preview
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
