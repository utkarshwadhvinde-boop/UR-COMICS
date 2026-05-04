import { u as useAppStore, d as useListComicsQuery, a0 as useListProgress, j as jsxRuntimeExports, B as BookOpen, L as Link, f as Button } from "./index-DQm835mL.js";
function LibraryPage() {
  const { currentUser, readingProgress: localProgress } = useAppStore();
  const userId = (currentUser == null ? void 0 : currentUser.id) ?? null;
  const { data: backendComics = [] } = useListComicsQuery();
  const { data: backendProgress = [] } = useListProgress(userId);
  const comics = backendComics.map((c) => ({
    id: String(c.id),
    title: c.title,
    coverImage: c.coverUrl,
    author: c.author,
    chapters: []
  }));
  const mergedProgress = backendProgress.length > 0 ? backendProgress.map((p) => ({
    comicId: String(p.comicId),
    chapterId: String(p.chapterId),
    scrollPosition: Number(p.scrollPosition),
    lastReadAt: Number(p.lastReadAt),
    chapterNumber: 0
  })) : localProgress;
  const continueReadingItems = mergedProgress.sort((a, b) => b.lastReadAt - a.lastReadAt).map((p) => {
    const comic = comics.find((c) => c.id === p.comicId);
    if (!comic) return null;
    const chapter = comic.chapters.find((ch) => ch.id === p.chapterId);
    return { comic, progress: p, chapter };
  }).filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-screen-xl mx-auto px-4 py-10",
      "data-ocid": "library.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-7 h-7 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Continue Reading" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Pick up where you left off" })
          ] })
        ] }),
        continueReadingItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-20 bg-card rounded-2xl border border-border",
            "data-ocid": "library.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "📚" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Nothing to continue yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Start reading comics and they'll appear here." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "gradient-primary text-primary-foreground border-0 rounded-xl", children: "Explore Comics" }) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: continueReadingItems.map(
          (item, i) => item ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/read/$comicId/$chapterId",
              params: {
                comicId: item.comic.id,
                chapterId: item.progress.chapterId
              },
              className: "group block",
              "data-ocid": `library.item.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.comic.coverImage,
                    alt: item.comic.title,
                    className: "w-full aspect-[3/4] object-cover rounded-2xl group-hover:scale-105 transition-smooth",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 inset-x-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-white line-clamp-2", children: item.comic.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/70 mt-0.5", children: item.comic.author })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-primary/80 text-white font-medium backdrop-blur-sm", children: "Resume" }) })
              ] })
            },
            item.comic.id
          ) : null
        ) })
      ]
    }
  );
}
export {
  LibraryPage as default
};
