import { u as useAppStore, j as jsxRuntimeExports, B as BookOpen, L as Link, a as Button } from "./index-BgVxhZ2x.js";
import { C as ComicCard } from "./ComicCard-DHybIGMg.js";
import "./dialog-CK3Mijd_.js";
import "./index-DzUsK6bF.js";
import "./index-ClD3NfkI.js";
import "./index-Z3-QW_0S.js";
import "./eye-BI0bfbT1.js";
import "./lock-BKIpFKPe.js";
import "./bookmark-DJdzD4PA.js";
import "./star-BZqe7TZP.js";
function LibraryPage() {
  const { comics, readingProgress } = useAppStore();
  const continueReadingComics = readingProgress.sort((a, b) => b.lastReadAt - a.lastReadAt).map((p) => {
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
        continueReadingComics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: continueReadingComics.map(
          (item, i) => item ? /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic: item.comic, index: i }, item.comic.id) : null
        ) })
      ]
    }
  );
}
export {
  LibraryPage as default
};
