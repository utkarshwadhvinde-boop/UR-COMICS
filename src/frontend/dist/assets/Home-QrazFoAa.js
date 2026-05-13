import { c as createLucideIcon, u as useTrending, a as useResumeReading, b as useAuth, r as reactExports, j as jsxRuntimeExports, B as BookOpen, L as Link, F as Flame, d as Button, R as RefreshCw, E as ErrorFallback } from "./index-DBVmmKIh.js";
import { S as SkeletonCardRow } from "./SkeletonCard-CedAK0KD.js";
import { B as Badge } from "./badge-4nQqznig.js";
import { I as Input } from "./input-BzqWAKa9.js";
import { u as useComics } from "./useComics-jJvdMud7.js";
import { m as motion } from "./proxy-DJdLu_xi.js";
import { S as Search } from "./search-CSs9Qe4L.js";
import { T as TrendingUp } from "./trending-up-y8rq3VDt.js";
import { C as ChevronRight } from "./chevron-right-CevjjoHJ.js";
import { E as Eye } from "./eye-DjE34-AV.js";
import "./skeleton-CkgraJgd.js";
import "./comicsService-BozSeBsV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function ComicCard({
  comic,
  index,
  hotScore
}) {
  const coverUrl = comic.cover_blob.getDirectURL();
  const updatedDate = new Date(
    Number(comic.updated_at / 1000000n)
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.07, duration: 0.35 },
      className: "group",
      "data-ocid": `comics.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/comics/$comicId",
          params: { comicId: comic.id },
          className: "block",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl overflow-hidden bg-card border border-border shadow-card group-hover:shadow-elevated group-hover:border-accent/30 transition-smooth", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: coverUrl,
                  alt: comic.title,
                  className: "w-full h-full object-cover group-hover:scale-[1.02] transition-smooth",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" }),
              hotScore !== void 0 && hotScore > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 rounded-full bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-body font-semibold text-accent border border-accent/30", children: [
                "🔥 ",
                Math.round(hotScore)
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-body font-semibold text-accent-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3 h-3" }),
                " Read Now"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm text-foreground line-clamp-2 leading-snug", children: comic.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body line-clamp-1", children: [
                "by ",
                comic.author_id.toText().slice(0, 12),
                "…"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-body", children: updatedDate }) })
            ] })
          ] })
        }
      )
    }
  );
}
function SectionHeader({
  title,
  icon: Icon,
  actionLabel,
  actionTo
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-foreground", children: title })
    ] }),
    actionLabel && actionTo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: actionTo,
        className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-smooth font-body",
        children: [
          actionLabel,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
        ]
      }
    )
  ] });
}
function TrendingItem({
  comic,
  index,
  hotScore
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, x: -12 },
      whileInView: { opacity: 1, x: 0 },
      viewport: { once: true },
      transition: { delay: index * 0.08 },
      "data-ocid": `trending.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/comics/$comicId",
          params: { comicId: comic.id },
          className: "flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-accent/40 hover:shadow-card transition-smooth group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-display text-accent/50 w-7 text-center flex-shrink-0", children: index + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: comic.cover_blob.getDirectURL(),
                alt: comic.title,
                className: "w-11 h-11 rounded-lg object-cover flex-shrink-0 shadow-card"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-foreground font-medium truncate group-hover:text-accent transition-smooth", children: comic.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                hotScore !== void 0 && hotScore > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-semibold", children: [
                  "🔥 ",
                  Math.round(hotScore)
                ] }) : "Trending now"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-accent transition-smooth flex-shrink-0" })
          ]
        }
      )
    }
  );
}
function HomePage() {
  const { data: comics, isLoading, isError, isFetching, refetch } = useComics();
  const { data: trending } = useTrending(6);
  const { data: resumeItems, isLoading: resumeLoading } = useResumeReading();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = reactExports.useState("");
  const allComics = comics ?? [];
  const filtered = search.trim() ? allComics.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase())
  ) : allComics;
  const trendingComics = trending && trending.length > 0 ? trending.slice(0, 6).map((entry) => allComics.find((c) => c.id === entry.comic_id)).filter((c) => c !== void 0) : allComics.slice(0, 6);
  const trendingWithScores = (trending ?? []).reduce(
    (acc, t) => {
      acc[t.comic_id] = t.hot_score;
      return acc;
    },
    {}
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background min-h-screen", children: [
    isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8",
        "data-ocid": "home.resume_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-foreground", children: "Resume Reading" })
          ] }),
          resumeLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-shrink-0 w-28 bg-muted/40 animate-pulse rounded-lg",
              style: { aspectRatio: "9/16" }
            },
            i
          )) }) : resumeItems && resumeItems.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2", children: resumeItems.map(
            ([comicObj, progress], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, x: -12 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: i * 0.07 },
                className: "flex-shrink-0 w-28",
                "data-ocid": `home.resume.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/comics/$comicId/chapters/$chapterId",
                    params: {
                      comicId: comicObj.id,
                      chapterId: progress.chapter_id
                    },
                    search: { scrollY: String(progress.scroll_pixel_y) },
                    className: "block group",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-midnight-card border border-purple-900/40 rounded-lg overflow-hidden", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "relative",
                          style: { aspectRatio: "9/16" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: comicObj.cover_blob.getDirectURL(),
                                alt: comicObj.title,
                                className: "w-full h-full object-cover group-hover:scale-[1.03] transition-smooth",
                                loading: "lazy"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-0 right-0 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent font-body font-semibold", children: "Continue →" }) })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-body text-foreground line-clamp-2 leading-tight", children: comicObj.title }) })
                    ] })
                  }
                )
              },
              comicObj.id
            )
          ) }) : null
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative w-full overflow-hidden",
        style: { minHeight: isAuthenticated ? "80vh" : "100vh" },
        "data-ocid": "home.hero_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center",
              style: { minHeight: isAuthenticated ? "80vh" : "100vh" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, ease: "easeOut" },
                    className: "max-w-2xl",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-accent/20 text-accent border border-accent/40 font-body text-xs mb-5 inline-flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3" }),
                        "New releases every week"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-6xl sm:text-7xl md:text-8xl text-foreground leading-none mb-6", children: [
                        "Your next",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent", children: "obsession" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                        "starts here."
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-lg text-muted-foreground max-w-md mb-8 leading-relaxed", children: "Thousands of webtoons and manga from independent creators — updated daily. Dive in." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          initial: { opacity: 0, y: 12 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: 0.3, duration: 0.4 },
                          className: "flex flex-col sm:flex-row gap-3 items-start",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Button,
                              {
                                asChild: true,
                                size: "lg",
                                className: "bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 shadow-manga",
                                "data-ocid": "home.cta_primary_button",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#new-arrivals", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 mr-2" }),
                                  "Start Reading"
                                ] })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Button,
                              {
                                asChild: true,
                                variant: "outline",
                                size: "lg",
                                className: "font-body border-border hover:border-accent/50 hover:text-accent",
                                "data-ocid": "home.cta_secondary_button",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/creator", children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 mr-2" }),
                                  "Creator Studio"
                                ] })
                              }
                            )
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 1.2, duration: 0.5 },
                    className: "absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body tracking-widest uppercase", children: "Scroll" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          animate: { y: [0, 6, 0] },
                          transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                          className: "w-0.5 h-8 bg-gradient-to-b from-accent/60 to-transparent rounded-full"
                        }
                      )
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "new-arrivals",
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16",
        "data-ocid": "home.featured_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-foreground", children: "New Arrivals" }),
              isFetching && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 text-accent animate-spin ml-1" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "text",
                    placeholder: "Search comics…",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    className: "pl-9 h-9 w-52 bg-card border-border font-body text-sm focus:border-accent/60 transition-smooth",
                    "data-ocid": "home.search_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => refetch(),
                  disabled: isFetching,
                  className: "h-9 w-9 hover:text-accent transition-smooth",
                  "aria-label": "Refresh comics",
                  "data-ocid": "home.refresh_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RefreshCw,
                    {
                      className: `w-4 h-4 ${isFetching ? "animate-spin" : ""}`
                    }
                  )
                }
              )
            ] })
          ] }),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCardRow, { count: 6 }),
          isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ErrorFallback,
            {
              message: "Failed to load comics.",
              onRetry: () => refetch()
            }
          ),
          !isLoading && !isError && filtered.length === 0 && !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-24 gap-5",
              "data-ocid": "home.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-muted/60 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-body font-semibold text-lg", children: "No comics yet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm mt-1 max-w-xs", children: "Be the first to publish! Open Creator Studio and start your series today." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    className: "bg-accent text-accent-foreground hover:bg-accent/90 font-body",
                    "data-ocid": "home.creator_cta_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/creator", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 mr-2" }),
                      "Open Creator Studio"
                    ] })
                  }
                )
              ]
            }
          ),
          !isLoading && !isError && filtered.length === 0 && search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-16 gap-3",
              "data-ocid": "home.no_results_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-sm", children: [
                  "No comics match",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                    "“",
                    search,
                    "”"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSearch(""),
                    className: "text-xs text-accent font-body hover:underline",
                    children: "Clear search"
                  }
                )
              ]
            }
          ),
          !isLoading && !isError && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", children: filtered.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ComicCard,
            {
              comic,
              index: i,
              hotScore: trendingWithScores[comic.id]
            },
            comic.id
          )) })
        ]
      }
    ),
    !isLoading && !isError && trendingComics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-muted/20 border-y border-border py-16",
        "data-ocid": "home.trending_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { title: "Trending", icon: TrendingUp }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: trendingComics.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TrendingItem,
            {
              comic,
              index: i,
              hotScore: trendingWithScores[comic.id]
            },
            comic.id
          )) })
        ] })
      }
    )
  ] });
}
export {
  HomePage
};
