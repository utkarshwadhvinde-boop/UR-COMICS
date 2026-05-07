import { c as createLucideIcon, j as jsxRuntimeExports, S as Skeleton, r as reactExports, a as cn, u as useAppStore, b as useQueryClient, d as useListComicsQuery, e as useGetTrending, B as BookOpen, L as Link, f as Button, g as formatNumber, T as TrendingUp, h as Badge } from "./index-CK63xfI2.js";
import { C as ComicCard } from "./ComicCard-BVcYwUEO.js";
import { A as ALL_GENRES, G as GenreChip } from "./GenreChip-D51c_tJy.js";
import { P as Primitive } from "./index-DQcuy1C9.js";
import { F as Flame, S as Sparkles } from "./sparkles-B5j7NW4q.js";
import { Z as Zap } from "./zap-BXUrukvp.js";
import { S as Star } from "./star-Dkq_K0ZL.js";
import { C as ChevronRight } from "./chevron-right-C6tZ54zV.js";
import "./dialog-DCwfDPJb.js";
import "./index-BdPONaf0.js";
import "./eye-BIWL6yox.js";
import "./heart-DJn7e0GP.js";
import "./lock-C7N71VmV.js";
import "./bookmark-Dzj7T4_I.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
];
const Trophy = createLucideIcon("trophy", __iconNode);
function SkeletonCard() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-2xl bg-card overflow-hidden border border-border/50 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[2/3] w-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-full rounded-none" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/5 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-14 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-8 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-14 rounded" })
      ] })
    ] })
  ] });
}
function SkeletonRow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 rounded-xl bg-card border border-border/50 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-14 h-20 rounded-lg shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/5 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/5 rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-10 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-10 rounded" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/5 rounded" })
    ] })
  ] });
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
function isValidComic(comic) {
  return typeof comic.coverImage === "string" && comic.coverImage.length > 0 && (comic.coverImage.startsWith("http://") || comic.coverImage.startsWith("https://"));
}
const ITEMS_PER_PAGE = 20;
const SKELETON_KEYS_10 = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "s10"
];
const SKELETON_KEYS_6 = ["r1", "r2", "r3", "r4", "r5", "r6"];
const SKELETON_KEYS_5 = ["t1", "t2", "t3", "t4", "t5"];
function trendingScore(c) {
  return c.likes * 0.5 + c.views * 0.1;
}
function ComicsEmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-card border border-border/50 text-center",
      "data-ocid": "comics.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-12 h-12 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-400/20 border border-orange-400/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-3", children: "No comics yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground mb-2 font-medium", children: "Be the first to upload!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-8", children: "This platform is powered entirely by creators like you. Upload your first comic and start building your audience today." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/create", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "gradient-primary text-white border-0 px-8 py-3 h-auto rounded-2xl font-semibold text-base shadow-glow hover:opacity-90 transition-smooth btn-press",
            "data-ocid": "comics.upload_cta_button",
            children: "📤 Upload Your Comic"
          }
        ) })
      ]
    }
  );
}
function HeroBanner({ comic }) {
  var _a, _b;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", "data-ocid": "hero.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 bg-cover bg-center scale-105",
        style: {
          backgroundImage: "url('/assets/generated/hero-bg.dim_1400x600.jpg')"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0",
        style: {
          background: "linear-gradient(135deg, oklch(0.10 0.04 265 / 0.94) 0%, oklch(0.14 0.05 290 / 0.87) 50%, oklch(0.12 0.04 310 / 0.92) 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-screen-xl mx-auto px-4 py-12 md:py-18 flex flex-col md:flex-row items-center gap-10 z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center md:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center md:justify-start mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/logo.png",
              alt: "UR Comics",
              className: "h-10 w-auto drop-shadow-[0_0_12px_rgba(90,59,255,0.7)] animate-fade-in-up",
              onError: (e) => {
                const el = e.currentTarget;
                el.style.display = "none";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-2xl font-display font-bold text-white/90 drop-shadow-[0_0_8px_rgba(90,59,255,0.5)]",
              "aria-hidden": "true",
              children: "UR Comics"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 border border-primary/40 text-white/90 text-xs font-semibold mb-4 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3.5 h-3.5 text-orange-400" }),
          "Featured Series"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-4 drop-shadow-lg", children: comic.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base md:text-lg text-white/75 max-w-lg mb-6 line-clamp-3", children: comic.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 justify-center md:justify-start mb-6", children: [
          comic.genres.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 backdrop-blur-sm",
              children: g
            },
            g
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-3 py-1 rounded-full bg-primary/30 border border-primary/40 text-white/90 backdrop-blur-sm capitalize", children: comic.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 justify-center md:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/read/$comicId/$chapterId",
              params: {
                comicId: comic.id,
                chapterId: ((_a = comic.chapters[0]) == null ? void 0 : _a.id) ?? ""
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "gradient-primary text-white border-0 px-8 py-3 h-auto rounded-2xl font-semibold text-base shadow-glow hover:opacity-90 transition-smooth btn-press",
                  "data-ocid": "hero.read_now_button",
                  children: "▶ Read Now"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-white/60 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" }),
              formatNumber(comic.views),
              " views"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
              comic.chapters.length,
              " Chapters"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-4 h-4 text-amber-400 fill-amber-400" }),
              comic.rating
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 z-10 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-primary/40 blur-2xl scale-110 opacity-60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/read/$comicId/$chapterId",
            params: {
              comicId: comic.id,
              chapterId: ((_b = comic.chapters[0]) == null ? void 0 : _b.id) ?? ""
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: comic.coverImage,
                alt: comic.title,
                className: "relative w-44 md:w-60 rounded-2xl shadow-2xl border-2 border-white/20 hover:scale-105 transition-smooth"
              }
            )
          }
        ),
        comic.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "gradient-primary text-white border-0 shadow-glow text-xs px-2 py-0.5", children: "⭐ Featured" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" })
  ] });
}
function HomePage() {
  var _a, _b, _c;
  const { searchQuery, readingProgress, currentUser, setComics } = useAppStore();
  const [activeGenre, setActiveGenre] = reactExports.useState("All");
  const [visibleCount, setVisibleCount] = reactExports.useState(ITEMS_PER_PAGE);
  const sentinelRef = reactExports.useRef(null);
  const qc = useQueryClient();
  const { data: backendComics = [], isLoading } = useListComicsQuery();
  const { data: trendingBackend = [] } = useGetTrending(5);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      qc.setQueryData(
        ["backend", "comics"],
        (prev) => prev ? prev.filter(
          (c) => typeof c.coverUrl === "string" && c.coverUrl.length > 0 && (c.coverUrl.startsWith("http://") || c.coverUrl.startsWith("https://"))
        ) : prev
      );
      qc.setQueryData(
        ["backend", "trending", 5],
        (prev) => prev ? prev.filter(
          (c) => typeof c.coverUrl === "string" && c.coverUrl.length > 0 && (c.coverUrl.startsWith("http://") || c.coverUrl.startsWith("https://"))
        ) : prev
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [qc]);
  reactExports.useEffect(() => {
    if (backendComics.length > 0) {
      const mapped = backendComics.filter((c) => !!c.coverUrl).map((c) => ({
        id: String(c.id),
        title: c.title,
        description: c.description,
        author: c.author,
        coverImage: c.coverUrl,
        genres: c.genres,
        status: "ongoing",
        likes: Number(c.likesCount),
        views: Number(c.viewsCount),
        rating: 0,
        chapters: [],
        createdAt: Number(c.createdAt),
        updatedAt: Number(c.createdAt),
        isFeatured: c.isFeatured,
        isTrending: c.isTrending,
        isPremium: c.isPremium,
        isPinned: c.isPinned,
        creatorId: c.creatorId,
        isOwnerComic: c.ownerUploaded
      }));
      setComics(mapped);
    }
  }, [backendComics, setComics]);
  const comics = backendComics.map((c) => ({
    id: String(c.id),
    title: c.title,
    description: c.description,
    author: c.author,
    coverImage: c.coverUrl,
    genres: c.genres,
    status: "ongoing",
    likes: Number(c.likesCount),
    views: Number(c.viewsCount),
    rating: 0,
    chapters: [],
    createdAt: Number(c.createdAt),
    updatedAt: Number(c.createdAt),
    isFeatured: c.isFeatured,
    isTrending: c.isTrending,
    isPremium: c.isPremium,
    isPinned: c.isPinned,
    creatorId: c.creatorId,
    isOwnerComic: c.ownerUploaded
  }));
  const visibleComics = comics.filter(isValidComic);
  const hasComics = visibleComics.length > 0;
  const heroComic = visibleComics.find((c) => c.isFeatured) ?? visibleComics[0];
  const streak = (currentUser == null ? void 0 : currentUser.dailyStreak) ?? 0;
  reactExports.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting)
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const prevFilterRef = reactExports.useRef(`${activeGenre}|${searchQuery}`);
  const filterKey = `${activeGenre}|${searchQuery}`;
  if (prevFilterRef.current !== filterKey) {
    prevFilterRef.current = filterKey;
    setVisibleCount(ITEMS_PER_PAGE);
  }
  const filtered = visibleComics.filter((c) => {
    const matchesGenre = activeGenre === "All" || c.genres.includes(activeGenre);
    const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.author.toLowerCase().includes(searchQuery.toLowerCase()) || c.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });
  const sorted = [...filtered].sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
  );
  const paginated = sorted.slice(0, visibleCount);
  const hasMore = paginated.length < sorted.length;
  const continueReadingItems = readingProgress.sort((a, b) => b.lastReadAt - a.lastReadAt).map((p) => {
    const comic = visibleComics.find((c) => c.id === p.comicId);
    return comic ? { comic, progress: p } : null;
  }).filter(Boolean).slice(0, 4);
  const trendingComics = trendingBackend.length > 0 ? trendingBackend.filter(
    (c) => typeof c.coverUrl === "string" && c.coverUrl.length > 0 && (c.coverUrl.startsWith("http://") || c.coverUrl.startsWith("https://"))
  ).map((c) => ({
    id: String(c.id),
    title: c.title,
    description: c.description,
    author: c.author,
    coverImage: c.coverUrl,
    genres: c.genres,
    status: "ongoing",
    likes: Number(c.likesCount),
    views: Number(c.viewsCount),
    rating: 0,
    chapters: [],
    createdAt: Number(c.createdAt),
    updatedAt: Number(c.createdAt),
    isFeatured: c.isFeatured,
    isTrending: c.isTrending,
    isPremium: c.isPremium,
    isPinned: c.isPinned,
    creatorId: c.creatorId,
    isOwnerComic: c.ownerUploaded
  })) : [...visibleComics].sort((a, b) => trendingScore(b) - trendingScore(a)).slice(0, 5);
  const popularThisWeek = [...visibleComics].sort((a, b) => b.likes - a.likes).slice(0, 3);
  const recentlyUpdated = [...visibleComics].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6);
  const getRecommended = reactExports.useCallback(() => {
    const bookmarkedGenres = visibleComics.filter((c) => readingProgress.some((p) => p.comicId === c.id)).flatMap((c) => c.genres);
    if (bookmarkedGenres.length === 0) return visibleComics.slice(0, 4);
    const genreCount = {};
    for (const g of bookmarkedGenres) genreCount[g] = (genreCount[g] ?? 0) + 1;
    return [...visibleComics].sort(
      (a, b) => b.genres.reduce((s, g) => s + (genreCount[g] ?? 0), 0) - a.genres.reduce((s, g) => s + (genreCount[g] ?? 0), 0)
    ).filter((c) => !readingProgress.some((p) => p.comicId === c.id)).slice(0, 4);
  }, [visibleComics, readingProgress]);
  const recommended = getRecommended();
  const hasReadingHistory = readingProgress.length > 0;
  if (!isLoading && !hasComics) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", "data-ocid": "hero.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center scale-105",
            style: {
              backgroundImage: "url('/assets/generated/hero-bg.dim_1400x600.jpg')"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0",
            style: {
              background: "linear-gradient(135deg, oklch(0.10 0.04 265 / 0.94) 0%, oklch(0.14 0.05 290 / 0.87) 50%, oklch(0.12 0.04 310 / 0.92) 100%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/assets/logo.png",
              alt: "UR Comics",
              className: "h-14 w-auto mb-4 drop-shadow-[0_0_14px_rgba(90,59,255,0.8)] animate-fade-in-up",
              onError: (e) => {
                e.currentTarget.style.display = "none";
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl md:text-3xl font-display font-bold text-white/90 drop-shadow-lg", children: "The future of comics starts here" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComicsEmptyState, {}) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    heroComic && /* @__PURE__ */ jsxRuntimeExports.jsx(HeroBanner, { comic: heroComic }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-screen-xl mx-auto px-4 py-8 space-y-14", children: [
      streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center",
          "data-ocid": "hero.streak_banner",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 backdrop-blur-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-4 h-4 text-orange-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground", children: [
              "🔥 ",
              streak,
              " day streak! Keep reading"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-amber-400" })
          ] })
        }
      ),
      continueReadingItems.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "continue_reading.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "Continue Reading",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
            to: "/library"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4", children: continueReadingItems.map(({ comic, progress }, i) => {
          const chapter = comic.chapters.find(
            (ch) => ch.id === progress.chapterId
          );
          const totalChapters = comic.chapters.length;
          const chapterIdx = comic.chapters.findIndex(
            (ch) => ch.id === progress.chapterId
          );
          const pct = totalChapters > 0 ? Math.round((chapterIdx + 1) / totalChapters * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex gap-3 items-center p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-smooth group",
              "data-ocid": `continue_reading.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/read/$comicId/$chapterId",
                    params: {
                      comicId: comic.id,
                      chapterId: progress.chapterId
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: comic.coverImage,
                        alt: comic.title,
                        className: "w-14 h-20 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-smooth",
                        loading: "lazy"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-smooth", children: comic.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Ch. ",
                    (chapter == null ? void 0 : chapter.chapterNumber) ?? "?",
                    " — ",
                    chapter == null ? void 0 : chapter.title
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        pct,
                        "% read"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        chapterIdx + 1,
                        "/",
                        totalChapters,
                        " chapters"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "h-1.5" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/read/$comicId/$chapterId",
                      params: {
                        comicId: comic.id,
                        chapterId: progress.chapterId
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          className: "mt-2 h-7 px-3 text-xs text-primary hover:bg-primary/10 rounded-lg",
                          "data-ocid": `continue_reading.resume_button.${i + 1}`,
                          children: "Resume →"
                        }
                      )
                    }
                  )
                ] })
              ]
            },
            comic.id
          );
        }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "continue_reading.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "Continue Reading",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
            to: "/library"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-10 mt-4 rounded-2xl bg-card border border-border/40 text-center",
            "data-ocid": "continue_reading.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-3", children: "📖" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-base text-foreground mb-1", children: "Start reading to see your progress here" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Your reading history and progress will appear once you begin a comic." }),
              visibleComics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/read/$comicId/$chapterId",
                  params: {
                    comicId: ((_a = visibleComics[0]) == null ? void 0 : _a.id) ?? "",
                    chapterId: ((_c = (_b = visibleComics[0]) == null ? void 0 : _b.chapters[0]) == null ? void 0 : _c.id) ?? ""
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      className: "mt-4 gradient-primary text-white border-0 rounded-xl shadow-glow",
                      "data-ocid": "continue_reading.start_button",
                      children: "Start Reading"
                    }
                  )
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "genre.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "Browse by Genre",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🎭" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide", children: ALL_GENRES.map((genre, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          GenreChip,
          {
            genre,
            isActive: activeGenre === genre,
            onClick: () => setActiveGenre(
              activeGenre === genre && genre !== "All" ? "All" : genre
            ),
            index: i
          },
          genre
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "comics.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: searchQuery ? `Search: "${searchQuery}"` : activeGenre === "All" ? "All Comics" : `${activeGenre} Comics`,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "📚" })
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4", children: SKELETON_KEYS_10.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, k)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-16 bg-card rounded-2xl mt-4 border border-border",
            "data-ocid": "comics.filter_empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-3", children: "🔍" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground mb-1", children: "No results for this filter" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Try a different genre or search term." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "mt-4",
                  onClick: () => setActiveGenre("All"),
                  "data-ocid": "comics.clear_filter_button",
                  children: "Clear Filter"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4", children: paginated.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic, index: i }, comic.id)) }),
          hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: sentinelRef, className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: SKELETON_KEYS_5.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, k)) }) }),
          !hasMore && sorted.length > ITEMS_PER_PAGE && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: [
            "All ",
            sorted.length,
            " comics loaded"
          ] })
        ] })
      ] }),
      trendingComics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "bg-muted/30 -mx-4 px-4 py-8 rounded-3xl",
          "data-ocid": "trending.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Trending Now",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-5 h-5 text-orange-500" }),
                to: "/trending"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 mt-4 scrollbar-hide", children: trendingComics.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "shrink-0 w-40",
                "data-ocid": `trending.item.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ComicCard,
                  {
                    comic,
                    index: i,
                    variant: "featured",
                    engagementScore: trendingScore(comic)
                  }
                )
              },
              comic.id
            )) })
          ]
        }
      ),
      popularThisWeek.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "popular.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "Popular This Week",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "w-5 h-5 text-amber-500" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4", children: popularThisWeek.map((comic, i) => {
          var _a2;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/read/$comicId/$chapterId",
              params: {
                comicId: comic.id,
                chapterId: ((_a2 = comic.chapters[0]) == null ? void 0 : _a2.id) ?? ""
              },
              className: "group",
              "data-ocid": `popular.item.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-smooth", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg ${i === 0 ? "gradient-primary text-white shadow-glow" : i === 1 ? "bg-amber-400/20 text-amber-600 border border-amber-400/30" : "bg-muted text-muted-foreground border border-border"}`,
                    children: [
                      "#",
                      i + 1
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: comic.coverImage,
                    alt: comic.title,
                    className: "w-12 h-16 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-smooth",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-smooth", children: comic.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: comic.author }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 text-amber-400 fill-amber-400" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: comic.rating }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
                      "· ",
                      formatNumber(comic.likes),
                      " likes"
                    ] })
                  ] })
                ] })
              ] })
            },
            comic.id
          );
        }) })
      ] }),
      recentlyUpdated.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "recent.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            title: "Recently Updated",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-blue-500" })
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4", children: SKELETON_KEYS_6.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRow, {}, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4", children: recentlyUpdated.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ComicCard,
          {
            comic,
            index: i,
            variant: "compact"
          },
          comic.id
        )) })
      ] }),
      recommended.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          className: "bg-muted/20 -mx-4 px-4 py-8 rounded-3xl border border-border/30",
          "data-ocid": "recommended.section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SectionHeader,
              {
                title: "Recommended For You",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-purple-400" })
              }
            ),
            !hasReadingHistory && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "✨ Explore these picks — handpicked to get you started!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4", children: recommended.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic, index: i }, comic.id)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4" })
    ] })
  ] });
}
function SectionHeader({ title, icon, to }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-display font-bold text-foreground flex items-center gap-2", children: [
      icon,
      title
    ] }),
    to && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to,
        className: "flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-smooth",
        "data-ocid": "section.view_all_link",
        children: [
          "View All ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
        ]
      }
    )
  ] });
}
export {
  HomePage as default
};
