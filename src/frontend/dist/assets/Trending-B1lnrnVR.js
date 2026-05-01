import { u as useAppStore, j as jsxRuntimeExports, B as BookOpen, L as Link, a as Button } from "./index-BgVxhZ2x.js";
import { C as ComicCard } from "./ComicCard-DHybIGMg.js";
import { F as Flame } from "./flame-BYSH-brk.js";
import { S as Sparkles } from "./sparkles-D51bt8AU.js";
import "./dialog-CK3Mijd_.js";
import "./index-DzUsK6bF.js";
import "./index-ClD3NfkI.js";
import "./index-Z3-QW_0S.js";
import "./eye-BI0bfbT1.js";
import "./lock-BKIpFKPe.js";
import "./bookmark-DJdzD4PA.js";
import "./star-BZqe7TZP.js";
function TrendingPage() {
  const { comics } = useAppStore();
  const trending = [...comics].sort((a, b) => b.views - a.views);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-screen-xl mx-auto px-4 py-10",
      "data-ocid": "trending.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-7 h-7 text-orange-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Trending Now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Most popular comics this week" })
          ] })
        ] }),
        trending.length === 0 ? (
          /* Empty state — no comics on the platform yet */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
          )
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4", children: trending.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic, index: i }, comic.id)) })
      ]
    }
  );
}
export {
  TrendingPage as default
};
