import { c as createLucideIcon, f as useParams, j as jsxRuntimeExports, E as ErrorFallback, L as Link, g as Layers, e as Button, B as BookOpen } from "./index-yTllSx9S.js";
import { B as Badge } from "./badge-gMMAzD3C.js";
import { S as Skeleton } from "./skeleton-KJO8djK4.js";
import { u as useChapters } from "./useChapters-BfU7OmAH.js";
import { u as useComic } from "./useComic-rQa4Qg97.js";
import { u as useReadProgress } from "./useReadProgress-CO_a3esw.js";
import { C as ChevronLeft } from "./chaptersService-CLqlZx2h.js";
import { m as motion } from "./proxy-iTRpl-31.js";
import { C as ChevronRight } from "./chevron-right-hjhxTqx4.js";
import "./comicsService-DtcN4hqc.js";
import "./useMutation-tUJOmKg9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
];
const Hash = createLucideIcon("hash", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
function ChapterRow({
  chapter,
  comicId,
  index
}) {
  const date = new Date(
    Number(chapter.updated_at / 1000000n)
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05, duration: 0.3 },
      "data-ocid": `comic_detail.chapters.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/comics/$comicId/chapters/$chapterId",
          params: { comicId, chapterId: chapter.id },
          className: "flex items-center justify-between p-4 rounded-xl bg-card border border-accent/30 hover:border-accent/60 hover:bg-purple-900/30 hover:shadow-card transition-smooth group",
          "data-ocid": `comic_detail.chapter_read_link.${index + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-display text-sm leading-none", children: chapter.number }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-foreground font-medium truncate group-hover:text-accent transition-smooth", children: chapter.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                  date
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:inline-flex items-center gap-1 text-xs font-body font-medium text-accent border border-accent/30 bg-accent/10 rounded-full px-2.5 py-0.5 group-hover:bg-accent/20 transition-smooth", children: [
                "Read ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-accent transition-smooth sm:hidden" })
            ] })
          ]
        }
      )
    }
  );
}
function ComicDetailPage() {
  const { comicId } = useParams({ from: "/comics/$comicId" });
  const {
    data: comic,
    isLoading: comicLoading,
    isError: comicError,
    refetch: refetchComic
  } = useComic(comicId);
  const {
    data: chapters,
    isLoading: chaptersLoading,
    isError: chaptersError,
    refetch: refetchChapters
  } = useChapters(comicId);
  const { data: progress } = useReadProgress(comicId);
  const publishedChapters = (chapters ?? []).filter((ch) => ch.is_published).sort((a, b) => a.number - b.number);
  const firstChapter = publishedChapters[0];
  if (comicError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorFallback,
      {
        message: "Failed to load comic.",
        onRetry: () => refetchComic()
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", "data-ocid": "comic_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative overflow-hidden",
        style: {
          background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
        },
        children: [
          !comicLoading && comic && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 opacity-15 blur-2xl scale-110",
              style: {
                backgroundImage: `url(${comic.cover_blob.getDirectURL()})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/",
                className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-8 font-body group",
                "data-ocid": "comic_detail.back_link",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 group-hover:-translate-x-0.5 transition-smooth" }),
                  "Back to Home"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-8 lg:gap-12", children: [
              comicLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-44 h-64 sm:w-52 sm:h-72 rounded-xl flex-shrink-0 bg-muted" }) : comic ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.94, y: 12 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  transition: { duration: 0.45 },
                  className: "flex-shrink-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: comic.cover_blob.getDirectURL(),
                      alt: comic.title,
                      className: "w-44 sm:w-52 h-auto rounded-xl shadow-manga object-cover"
                    }
                  )
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end gap-4 min-w-0", children: comicLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-72 bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-sm bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3 bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-full bg-muted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-full bg-muted" })
                ] })
              ] }) : comic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 16 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.4, delay: 0.1 },
                  className: "flex flex-col gap-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl sm:text-5xl text-foreground leading-tight", children: comic.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground max-w-lg leading-relaxed", children: comic.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/15 text-accent border border-accent/30 font-body inline-flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-3 h-3" }),
                        publishedChapters.length,
                        " Chapter",
                        publishedChapters.length !== 1 ? "s" : ""
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-muted text-muted-foreground border border-border font-body inline-flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "w-3 h-3" }),
                        comic.author_id.toText().slice(0, 10),
                        "…"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mt-2", children: [
                      (progress == null ? void 0 : progress.chapter_id) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          asChild: true,
                          size: "lg",
                          variant: "outline",
                          className: "w-fit border-accent/50 text-accent hover:bg-accent/10 font-body font-semibold",
                          "data-ocid": "comic_detail.continue_button",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Link,
                            {
                              to: "/comics/$comicId/chapters/$chapterId",
                              params: { comicId, chapterId: progress.chapter_id },
                              search: { scrollY: String(progress.scroll_pixel_y) },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 mr-2" }),
                                "Continue Reading →"
                              ]
                            }
                          )
                        }
                      ),
                      firstChapter && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          asChild: true,
                          size: "lg",
                          className: "w-fit bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold shadow-manga",
                          "data-ocid": "comic_detail.read_button",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Link,
                            {
                              to: "/comics/$comicId/chapters/$chapterId",
                              params: { comicId, chapterId: firstChapter.id },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 mr-2" }),
                                "Start Reading"
                              ]
                            }
                          )
                        }
                      )
                    ] })
                  ]
                }
              ) : null })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
        "data-ocid": "comic_detail.chapters_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-5 h-5 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-foreground", children: "Chapters" }),
            !chaptersLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-sm text-muted-foreground font-body", children: [
              "(",
              publishedChapters.length,
              ")"
            ] })
          ] }) }),
          chaptersLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-4 p-4 rounded-xl bg-card border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-lg bg-muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2 bg-muted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/4 bg-muted" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full bg-muted" })
              ]
            },
            i
          )) }),
          chaptersError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ErrorFallback,
            {
              message: "Failed to load chapters.",
              onRetry: () => refetchChapters()
            }
          ),
          !chaptersLoading && !chaptersError && publishedChapters.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-20 gap-4",
              "data-ocid": "comic_detail.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-7 h-7 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-semibold", children: "No chapters yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1", children: "The creator hasn't published any chapters yet. Check back soon!" })
                ] })
              ]
            }
          ),
          !chaptersLoading && !chaptersError && publishedChapters.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: publishedChapters.map((chapter, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChapterRow,
            {
              chapter,
              comicId,
              index: i
            },
            chapter.id
          )) })
        ]
      }
    )
  ] });
}
export {
  ComicDetailPage
};
