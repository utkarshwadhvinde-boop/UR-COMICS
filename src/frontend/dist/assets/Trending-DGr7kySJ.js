import { b as useTrending, j as jsxRuntimeExports, H as Flame, L as Link } from "./index-WeXjJ7Am.js";
import { S as Skeleton } from "./skeleton-Dm3SSr1u.js";
import { T as TrendingUp } from "./trending-up-DTzMGJ7F.js";
import { m as motion } from "./proxy-D84Mpcf5.js";
function TrendingCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-midnight-card rounded-xl overflow-hidden border border-purple-900/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[9/14] bg-purple-900/20" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 bg-purple-900/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 bg-purple-900/20" })
    ] })
  ] });
}
function TrendingCard({
  comic,
  rank
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: Math.min(rank * 0.06, 0.4) },
      "data-ocid": `trending.item.${rank}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/comics/$comicId",
          params: { comicId: comic.id },
          className: "group block bg-midnight-card rounded-xl overflow-hidden border border-purple-900/20 hover:border-accent/40 transition-colors-fast",
          "data-ocid": `trending.card_link.${rank}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[9/14] overflow-hidden bg-purple-900/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: comic.cover_url ?? "",
                  alt: comic.title,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 border border-accent/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-display font-bold text-accent", children: rank }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 border border-orange-500/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-2.5 h-2.5 text-orange-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-body text-orange-300", children: comic.view_count })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body text-sm font-medium text-foreground truncate mb-1 group-hover:text-accent transition-colors-fast", children: comic.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                comic.view_count.toLocaleString(),
                " views"
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function TrendingPage() {
  const { data: trendingEntries, isLoading: trendingLoading } = useTrending(24);
  const trendingComics = (trendingEntries ?? []).map((comic, idx) => ({
    comic,
    rank: idx + 1
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 py-8", "data-ocid": "trending.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Trending Now" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Ranked by reads and views in the last 24 hours" })
      ] })
    ] }),
    trendingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
        "data-ocid": "trending.loading_state",
        children: Array.from({ length: 12 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingCardSkeleton, {}, i)
        ))
      }
    ) : trendingComics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-24 text-muted-foreground font-body",
        "data-ocid": "trending.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-12 h-12 mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-foreground mb-1", children: "Nothing trending yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Be the first to start reading and make something popular!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/",
              className: "inline-block mt-6 px-5 py-2 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm font-body hover:bg-accent/25 transition-colors-fast",
              "data-ocid": "trending.browse_link",
              children: "Browse All Comics"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4", children: trendingComics.map(({ comic, rank }) => /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingCard, { comic, rank }, comic.id)) })
  ] });
}
export {
  TrendingPage
};
