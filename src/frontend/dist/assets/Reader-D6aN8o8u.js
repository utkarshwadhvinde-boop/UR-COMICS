import { e as useParams, g as useNavigate, r as reactExports, j as jsxRuntimeExports, P as PageLoader, E as ErrorFallback, B as BookOpen, L as Link, d as Button, h as cn, i as LoaderCircle } from "./index-DBVmmKIh.js";
import { u as useChapter } from "./useChapter-C_Beo5Wj.js";
import { u as useChapters } from "./useChapters-DgAB5RZ_.js";
import { a as useSaveReadProgress } from "./useReadProgress-rIEz63c8.js";
import { m as motion } from "./proxy-DJdLu_xi.js";
import { A as AnimatePresence } from "./index-CKRw5vBU.js";
import { C as ChevronLeft } from "./chaptersService-CSOdR9Lz.js";
import { C as ChevronRight } from "./chevron-right-CevjjoHJ.js";
import "./useMutation-CJ4xUsLW.js";
const SCROLL_KEY = (id) => `reader_scroll_${id}`;
const CHROME_HIDE_MS = 2e3;
const PREFETCH_THRESHOLD = 0.8;
function ImageShimmer({ aspectRatio = "9/16" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-full max-w-2xl mx-auto bg-purple-900/20 animate-pulse",
      style: { aspectRatio },
      "aria-hidden": true
    }
  );
}
function WebtoonImage({ src, alt, index, isVisible }) {
  const [loaded, setLoaded] = reactExports.useState(false);
  const [errored, setErrored] = reactExports.useState(false);
  if (!isVisible) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full max-w-2xl mx-auto bg-muted/20",
        style: { minHeight: "600px" },
        "aria-hidden": true
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full max-w-2xl mx-auto",
      "data-ocid": `reader.item.${index + 1}`,
      children: [
        !loaded && !errored && /* @__PURE__ */ jsxRuntimeExports.jsx(ImageShimmer, {}),
        errored ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center justify-center bg-muted/30 text-muted-foreground text-sm font-body py-20", children: [
          "Failed to load page ",
          index + 1
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt,
            loading: index < 3 ? "eager" : "lazy",
            onLoad: () => setLoaded(true),
            onError: () => setErrored(true),
            className: cn(
              "w-full object-contain transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0 absolute inset-0"
            )
          }
        )
      ]
    }
  );
}
function VirtualizedStrip({
  imageUrls,
  chapterId,
  onScrollProgress,
  onCurrentPage
}) {
  const containerRef = reactExports.useRef(null);
  const [visibleSet, setVisibleSet] = reactExports.useState(() => {
    return /* @__PURE__ */ new Set([0, 1, 2]);
  });
  reactExports.useEffect(() => {
    const saved = localStorage.getItem(SCROLL_KEY(chapterId));
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number(saved), behavior: "instant" });
      });
    }
  }, [chapterId]);
  reactExports.useEffect(() => {
    let rafId;
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
        const pageHeight = el.scrollHeight / (imageUrls.length || 1);
        const page = Math.min(
          imageUrls.length,
          Math.floor(scrolled / pageHeight) + 1
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
  reactExports.useEffect(() => {
    var _a;
    const images = (_a = containerRef.current) == null ? void 0 : _a.querySelectorAll("[data-img-index]");
    if (!images) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSet((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const idx = Number(entry.target.dataset.imgIndex);
            if (entry.isIntersecting) next.add(idx);
          }
          return next;
        });
      },
      { rootMargin: "100% 0px 100% 0px", threshold: 0 }
    );
    for (const el of Array.from(images)) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: "flex flex-col items-stretch gap-0", children: imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-img-index": i, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    WebtoonImage,
    {
      src: url,
      alt: `Page ${i + 1}`,
      index: i,
      isVisible: visibleSet.has(i)
    }
  ) }, url)) });
}
function ReaderChrome({
  visible,
  comicId,
  chapter,
  prevChapter,
  nextChapter,
  currentPage,
  totalPages,
  prefetching
}) {
  const chromeVariants = {
    visible: { opacity: 1, pointerEvents: "auto" },
    hidden: { opacity: 0, pointerEvents: "none" }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.header,
      {
        variants: chromeVariants,
        animate: visible ? "visible" : "hidden",
        transition: { duration: 0.22 },
        className: "fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-4 px-4 py-3 backdrop-blur-md bg-background/80 border-b border-border/50",
        "data-ocid": "reader.header",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/comics/$comicId",
              params: { comicId },
              className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors duration-200 shrink-0",
              "data-ocid": "reader.back_link",
              tabIndex: visible ? 0 : -1,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Back" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-body text-muted-foreground truncate max-w-[200px] sm:max-w-xs", children: [
              "Chapter ",
              chapter.number
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display text-foreground truncate max-w-[200px] sm:max-w-sm", children: chapter.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                asChild: true,
                disabled: !prevChapter,
                className: cn(
                  "text-muted-foreground hover:text-accent",
                  !prevChapter && "opacity-30 pointer-events-none"
                ),
                "data-ocid": "reader.prev_button",
                children: prevChapter ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/comics/$comicId/chapters/$chapterId",
                    params: { comicId, chapterId: prevChapter.id },
                    tabIndex: visible ? 0 : -1,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                asChild: true,
                className: "text-muted-foreground hover:text-accent",
                "data-ocid": "reader.chapters_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/comics/$comicId",
                    params: { comicId },
                    tabIndex: visible ? 0 : -1,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5" })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                asChild: true,
                disabled: !nextChapter,
                className: cn(
                  "text-muted-foreground hover:text-accent",
                  !nextChapter && "opacity-30 pointer-events-none"
                ),
                "data-ocid": "reader.next_button",
                children: nextChapter ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/comics/$comicId/chapters/$chapterId",
                    params: { comicId, chapterId: nextChapter.id },
                    tabIndex: visible ? 0 : -1,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" }) })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.footer,
      {
        variants: chromeVariants,
        animate: visible ? "visible" : "hidden",
        transition: { duration: 0.22 },
        className: "fixed bottom-0 inset-x-0 z-50 flex items-center justify-between gap-3 px-4 py-3 backdrop-blur-md bg-background/80 border-t border-border/50",
        "data-ocid": "reader.footer",
        children: [
          prevChapter ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              asChild: true,
              className: "shrink-0 border-border/60 text-muted-foreground hover:text-foreground hover:border-accent",
              "data-ocid": "reader.prev_chapter_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/comics/$comicId/chapters/$chapterId",
                  params: { comicId, chapterId: prevChapter.id },
                  tabIndex: visible ? 0 : -1,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
                    "Prev"
                  ]
                }
              )
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            prefetching && /* @__PURE__ */ jsxRuntimeExports.jsx(
              LoaderCircle,
              {
                className: "w-3.5 h-3.5 animate-spin text-accent/60",
                "aria-label": "Prefetching next chapter"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-mono text-muted-foreground",
                "data-ocid": "reader.page_counter",
                children: totalPages > 0 ? `${currentPage} / ${totalPages}` : "—"
              }
            )
          ] }),
          nextChapter ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              asChild: true,
              className: "shrink-0 bg-accent text-accent-foreground hover:bg-accent/90",
              "data-ocid": "reader.next_chapter_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/comics/$comicId/chapters/$chapterId",
                  params: { comicId, chapterId: nextChapter.id },
                  tabIndex: visible ? 0 : -1,
                  children: [
                    "Next ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
                  ]
                }
              )
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20" })
        ]
      }
    )
  ] });
}
function ReaderPage() {
  const { comicId, chapterId } = useParams({
    from: "/comics/$comicId/chapters/$chapterId"
  });
  const navigate = useNavigate();
  const {
    data: chapter,
    isLoading,
    isError,
    refetch
  } = useChapter(comicId, chapterId);
  const { data: chapters } = useChapters(comicId);
  const { mutate: saveProgress } = useSaveReadProgress();
  const published = (chapters == null ? void 0 : chapters.filter((c) => c.is_published).sort((a, b) => a.number - b.number)) ?? [];
  const currentIndex = published.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? published[currentIndex - 1] : null;
  const nextChapter = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;
  const [showChrome, setShowChrome] = reactExports.useState(true);
  const hideTimer = reactExports.useRef(null);
  const resetHideTimer = reactExports.useCallback(() => {
    setShowChrome(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowChrome(false), CHROME_HIDE_MS);
  }, []);
  reactExports.useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);
  reactExports.useEffect(() => {
    const handleKey = (e) => {
      resetHideTimer();
      if (e.key === "ArrowLeft" && prevChapter) {
        navigate({
          to: "/comics/$comicId/chapters/$chapterId",
          params: { comicId, chapterId: prevChapter.id }
        });
      } else if (e.key === "ArrowRight" && nextChapter) {
        navigate({
          to: "/comics/$comicId/chapters/$chapterId",
          params: { comicId, chapterId: nextChapter.id }
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, comicId, prevChapter, nextChapter, resetHideTimer]);
  const saveDebounceRef = reactExports.useRef(null);
  const handleSaveScroll = reactExports.useCallback(() => {
    if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    saveDebounceRef.current = setTimeout(() => {
      saveProgress({
        comic_id: comicId,
        chapter_id: chapterId,
        scroll_pixel_y: BigInt(Math.round(window.scrollY))
      });
    }, 1e3);
  }, [comicId, chapterId, saveProgress]);
  reactExports.useEffect(() => {
    window.addEventListener("scroll", handleSaveScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleSaveScroll);
      if (saveDebounceRef.current) clearTimeout(saveDebounceRef.current);
    };
  }, [handleSaveScroll]);
  reactExports.useEffect(() => {
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
  const [prefetching, setPrefetching] = reactExports.useState(false);
  const prefetchedRef = reactExports.useRef(false);
  const { refetch: prefetchNext } = useChapter(
    nextChapter ? comicId : void 0,
    nextChapter == null ? void 0 : nextChapter.id
  );
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const handleScrollProgress = reactExports.useCallback(
    (pct) => {
      if (pct >= PREFETCH_THRESHOLD && nextChapter && !prefetchedRef.current) {
        prefetchedRef.current = true;
        setPrefetching(true);
        prefetchNext().finally(() => setPrefetching(false));
      }
    },
    [nextChapter, prefetchNext]
  );
  reactExports.useEffect(() => {
    prefetchedRef.current = false;
    setPrefetching(false);
    setCurrentPage(1);
  }, [chapterId]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoader, {});
  if (isError)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorFallback,
      {
        message: "Failed to load chapter.",
        onRetry: () => refetch()
      }
    );
  if (!chapter) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorFallback, { message: "Chapter not found." });
  const imageUrls = chapter.image_blobs.map((b) => b.getDirectURL());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.35 },
      className: "relative bg-background min-h-screen",
      onMouseMove: resetHideTimer,
      onTouchStart: resetHideTimer,
      onClick: resetHideTimer,
      "data-ocid": "reader.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReaderChrome,
          {
            visible: showChrome,
            comicId,
            chapter,
            prevChapter,
            nextChapter,
            currentPage,
            totalPages: imageUrls.length,
            prefetching
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "main",
          {
            className: "pt-14 pb-20 flex flex-col items-stretch",
            "data-ocid": "reader.canvas_target",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.3 },
                children: imageUrls.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground",
                    "data-ocid": "reader.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 opacity-30" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "No pages in this chapter yet." })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  VirtualizedStrip,
                  {
                    imageUrls,
                    chapterId,
                    onScrollProgress: handleScrollProgress,
                    onCurrentPage: setCurrentPage
                  }
                )
              },
              chapterId
            ) })
          }
        )
      ]
    }
  );
}
export {
  ReaderPage
};
