import { d as useListComicsQuery, r as reactExports, j as jsxRuntimeExports, B as BookOpen, L as Link, f as Button } from "./index-BU3WKumI.js";
import { C as ComicCard } from "./ComicCard-rsDP0LVP.js";
import { F as Flame, S as Sparkles } from "./sparkles-CBvyok7X.js";
import "./dialog-DT-hOwyc.js";
import "./index-OcAYLIxh.js";
import "./eye-DqdzshDN.js";
import "./heart-ouCiw-2K.js";
import "./lock-Bn1H4fvo.js";
import "./bookmark-CkqBA0FG.js";
import "./star-g4ZLCFtW.js";
function TrendingPage() {
  const { data: backendComics = [], isLoading } = useListComicsQuery();
  const [activeGenre, setActiveGenre] = reactExports.useState("All");
  const [visibleCount, setVisibleCount] = reactExports.useState(20);
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
  const GENRES = [
    "All",
    "Fantasy",
    "Sci-Fi",
    "Action",
    "Romance",
    "Thriller",
    "Horror",
    "Slice of Life",
    "Comedy",
    "Drama",
    "Adventure"
  ];
  const scored = [...comics].filter((c) => activeGenre === "All" || c.genres.includes(activeGenre)).sort(
    (a, b) => b.likes * 0.5 + b.views * 0.1 - (a.likes * 0.5 + a.views * 0.1)
  );
  const visible = scored.slice(0, visibleCount);
  const hasMore = visibleCount < scored.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-screen-xl mx-auto px-4 py-10",
      "data-ocid": "trending.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-7 h-7 text-orange-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Trending Now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Most popular comics this week" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide", children: GENRES.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setActiveGenre(g);
              setVisibleCount(20);
            },
            className: `shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-smooth border ${activeGenre === g ? "gradient-primary text-primary-foreground border-transparent shadow-glow" : "bg-card border-border text-muted-foreground hover:border-primary/50"}`,
            "data-ocid": `trending.genre_filter.${g.toLowerCase().replace(/ /g, "_")}`,
            children: g
          },
          g
        )) }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] rounded-2xl bg-muted animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 rounded bg-muted animate-pulse w-3/4" })
        ] }, k)) }) : scored.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-24 px-6 rounded-3xl bg-card border border-border/50 text-center",
            "data-ocid": "trending.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-12 h-12 text-white" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-400/20 border border-orange-400/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-orange-400" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-3", children: "No comics yet." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground mb-2 font-medium", children: "Be the first to upload!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-8", children: "Once comics are uploaded, the most popular ones will appear here ranked by views and engagement." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/create", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "gradient-primary text-white border-0 px-8 py-3 h-auto rounded-2xl font-semibold text-base shadow-glow hover:opacity-90 transition-smooth btn-press",
                  "data-ocid": "trending.upload_cta_button",
                  children: "📤 Upload Your Comic"
                }
              ) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: visible.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic, index: i }, comic.id)) }),
          hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "rounded-xl px-8",
              onClick: () => setVisibleCount((v) => v + 20),
              "data-ocid": "trending.load_more_button",
              children: "Load More"
            }
          ) })
        ] })
      ]
    }
  );
}
export {
  TrendingPage as default
};
