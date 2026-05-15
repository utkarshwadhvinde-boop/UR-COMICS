import { c as createLucideIcon, u as useQuery, l as listGenres, g as getComicsByGenre, a as useAuth, r as reactExports, b as useTrending, d as useResumeReading, j as jsxRuntimeExports, L as Link, A as AuthModal, B as BookOpen } from "./index-WeXjJ7Am.js";
import { u as useComics } from "./useComics-CXCU-vzq.js";
import { S as Search } from "./search-CNnNvPke.js";
import { T as TrendingUp } from "./trending-up-DTzMGJ7F.js";
import { C as ChevronRight } from "./chevron-right-DnjSOj2h.js";
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
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);
const GENRES_QUERY_KEY = ["genres"];
const COMICS_BY_GENRE_QUERY_KEY = (genreSlug) => ["comics", "genre", genreSlug];
const FALLBACK_GENRES = [
  { id: "action", name: "Action", slug: "action" },
  { id: "adventure", name: "Adventure", slug: "adventure" },
  { id: "comedy", name: "Comedy / Funny", slug: "comedy" },
  { id: "sci-fi", name: "Sci-Fi", slug: "sci-fi" },
  { id: "fantasy", name: "Fantasy", slug: "fantasy" },
  { id: "romance", name: "Romance", slug: "romance" },
  { id: "horror", name: "Horror", slug: "horror" },
  { id: "drama", name: "Drama", slug: "drama" },
  { id: "mystery", name: "Mystery", slug: "mystery" },
  { id: "thriller", name: "Thriller", slug: "thriller" },
  { id: "slice-of-life", name: "Slice of Life", slug: "slice-of-life" },
  { id: "martial-arts", name: "Martial Arts", slug: "martial-arts" },
  { id: "supernatural", name: "Supernatural", slug: "supernatural" },
  { id: "psychological", name: "Psychological", slug: "psychological" }
];
function useGenres() {
  return useQuery({
    queryKey: GENRES_QUERY_KEY,
    queryFn: async () => {
      try {
        const genres = await listGenres();
        return genres.length > 0 ? genres : FALLBACK_GENRES;
      } catch {
        return FALLBACK_GENRES;
      }
    },
    staleTime: 24 * 60 * 60 * 1e3,
    gcTime: 24 * 60 * 60 * 1e3
  });
}
function useComicsByGenre(genreSlug) {
  return useQuery({
    queryKey: COMICS_BY_GENRE_QUERY_KEY(genreSlug),
    queryFn: () => getComicsByGenre(genreSlug),
    enabled: genreSlug.length > 0,
    staleTime: 5 * 60 * 1e3,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
}
function ComicCard({ comic }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/comics/$comicId",
      params: { comicId: comic.id },
      className: "group flex-shrink-0 w-32 sm:w-36",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[9/14] rounded-xl overflow-hidden mb-2 border border-white/10 group-hover:border-purple-500/40 transition-all", children: comic.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: comic.cover_url,
            alt: comic.title,
            className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-purple-900/40 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-purple-400" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white text-xs font-semibold truncate group-hover:text-purple-300", children: comic.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-xs truncate", children: comic.author_name ?? "Unknown" })
      ]
    }
  );
}
function GenreRow({ genre }) {
  const { data: comics = [], isLoading } = useComicsByGenre(genre.slug);
  if (!isLoading && comics.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: genre.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/trending",
          className: "text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1",
          children: [
            "More ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 scrollbar-hide", children: isLoading ? ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-shrink-0 w-32 sm:w-36 aspect-[9/14] rounded-xl bg-white/5 animate-pulse"
      },
      `hero-skel-${k}`
    )) : comics.slice(0, 12).map((comic) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic }, comic.id)) })
  ] });
}
function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [showAuth, setShowAuth] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const { data: genres = [] } = useGenres();
  const { data: newArrivals = [], isLoading: newLoading } = useComics();
  const { data: trending = [] } = useTrending(6);
  const { data: resumeComics = [] } = useResumeReading(user == null ? void 0 : user.id);
  const handleSearchKey = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) ;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen",
      style: {
        background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)"
      },
      children: [
        !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden py-20 text-center px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl sm:text-6xl font-black text-white mb-4", children: [
              "UR ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-400", children: "COMICS" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-lg max-w-lg mx-auto mb-8", children: "Discover and read thousands of webtoons & manhwa from creators worldwide." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowAuth(true),
                className: "px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-2xl shadow-purple-500/25",
                style: {
                  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)"
                },
                children: "Get Started — It's Free"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8 space-y-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                onKeyDown: handleSearchKey,
                placeholder: "Search comics, creators, genres...",
                className: "w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 text-sm"
              }
            )
          ] }),
          isAuthenticated && resumeComics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-white mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-purple-400" }),
              "Continue Reading"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 scrollbar-hide", children: resumeComics.map((comic) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic }, comic.id)) })
          ] }),
          trending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-white flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-purple-400" }),
                "Trending Now"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/trending",
                  className: "text-purple-400 text-sm hover:text-purple-300 flex items-center gap-1",
                  children: [
                    "View all ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 scrollbar-hide", children: trending.map((comic) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic }, comic.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white mb-3", children: "New Arrivals" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-2 scrollbar-hide", children: newLoading ? ["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex-shrink-0 w-32 sm:w-36 aspect-[9/14] rounded-xl bg-white/5 animate-pulse"
              },
              `new-skel-${k}`
            )) : newArrivals.slice(0, 20).map((comic) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic }, comic.id)) })
          ] }),
          genres.map((genre) => /* @__PURE__ */ jsxRuntimeExports.jsx(GenreRow, { genre }, genre.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AuthModal, { open: showAuth, onClose: () => setShowAuth(false) })
      ]
    }
  );
}
export {
  HomePage
};
