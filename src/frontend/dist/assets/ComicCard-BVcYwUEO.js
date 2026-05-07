import { c as createLucideIcon, u as useAppStore, r as reactExports, j as jsxRuntimeExports, L as Link, g as formatNumber, h as Badge, a as cn, f as Button } from "./index-CK63xfI2.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-DCwfDPJb.js";
import { E as Eye } from "./eye-BIWL6yox.js";
import { H as Heart } from "./heart-DJn7e0GP.js";
import { L as Lock } from "./lock-C7N71VmV.js";
import { B as Bookmark } from "./bookmark-Dzj7T4_I.js";
import { S as Star } from "./star-Dkq_K0ZL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = createLucideIcon("bookmark-check", __iconNode);
function ComicCard({
  comic,
  index = 0,
  variant = "default",
  engagementScore
}) {
  var _a, _b;
  const { currentUser, bookmarkComic, likeComic } = useAppStore();
  const isBookmarked = (currentUser == null ? void 0 : currentUser.bookmarks.includes(comic.id)) ?? false;
  const isLiked = (currentUser == null ? void 0 : currentUser.likedComics.includes(comic.id)) ?? false;
  const [showPremiumModal, setShowPremiumModal] = reactExports.useState(false);
  const [imageError, setImageError] = reactExports.useState(false);
  const chapterCount = comic.chapters.length;
  const ocidBase = `comic.item.${index + 1}`;
  const firstChapterId = ((_a = comic.chapters[0]) == null ? void 0 : _a.id) ?? "";
  const hasCover = typeof comic.coverImage === "string" && comic.coverImage.length > 0 && (comic.coverImage.startsWith("http://") || comic.coverImage.startsWith("https://"));
  if (!hasCover || imageError) return null;
  function handleCardClick(e) {
    if (comic.isPremium && !(currentUser == null ? void 0 : currentUser.unlockedChapters.includes(firstChapterId))) {
      e.preventDefault();
      setShowPremiumModal(true);
    }
  }
  if (variant === "compact") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex gap-3 items-start p-3 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-smooth cursor-pointer group",
        "data-ocid": ocidBase,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/read/$comicId/$chapterId",
              params: { comicId: comic.id, chapterId: firstChapterId },
              onClick: handleCardClick,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: comic.coverImage,
                  alt: comic.title,
                  className: "w-14 h-20 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-smooth",
                  loading: "lazy",
                  onError: () => setImageError(true)
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/read/$comicId/$chapterId",
                params: { comicId: comic.id, chapterId: firstChapterId },
                onClick: handleCardClick,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-smooth", children: comic.title })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: comic.author }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5 flex-wrap", children: [
              comic.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-400/20", children: "⭐ Featured" }),
              comic.isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20", children: "🔒 Premium" }),
              !comic.isFeatured && !comic.isPremium && comic.genres[0] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20", children: comic.genres[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                formatNumber(comic.views)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
                formatNumber(comic.likes)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground/60 mt-1 capitalize", children: [
              comic.status,
              " · ",
              chapterCount,
              " ch"
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "group relative flex flex-col rounded-2xl bg-card overflow-hidden transition-smooth border border-border/50 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]",
          variant === "featured" && "shadow-md"
        ),
        "data-ocid": ocidBase,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/read/$comicId/$chapterId",
              params: { comicId: comic.id, chapterId: firstChapterId },
              className: "relative block overflow-hidden aspect-[2/3]",
              onClick: handleCardClick,
              "data-ocid": `${ocidBase}.link`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: comic.coverImage,
                    alt: comic.title,
                    className: "w-full h-full object-cover group-hover:scale-105 transition-smooth duration-300",
                    loading: "lazy",
                    onError: () => setImageError(true)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" }),
                comic.isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/30 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-background/90 rounded-2xl px-4 py-3 flex flex-col items-center gap-1 shadow-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 text-amber-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Premium" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 flex flex-col gap-1 z-10", children: [
                  comic.isTrending && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0.5 gradient-primary text-white border-0 shadow-sm", children: "🔥 Hot" }),
                  comic.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0.5 bg-amber-500/90 text-white border-0 shadow-sm", children: "⭐ Featured" }),
                  comic.isPremium && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 py-0.5 bg-black/70 text-amber-400 border-0 shadow-sm", children: "🔒 Premium" })
                ] }),
                engagementScore !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background/90 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/30", children: formatNumber(Math.round(engagementScore)) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: cn(
                      "absolute bottom-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-smooth",
                      "bg-background/80 opacity-0 group-hover:opacity-100 hover:bg-primary/20 z-10"
                    ),
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      bookmarkComic(comic.id);
                    },
                    "aria-label": isBookmarked ? "Remove bookmark" : "Bookmark",
                    "data-ocid": `${ocidBase}.bookmark_button`,
                    children: isBookmarked ? /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCheck, { className: "w-4 h-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "w-4 h-4 text-foreground" })
                  }
                ),
                engagementScore === void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] font-medium text-foreground z-10", children: [
                  chapterCount,
                  " ch"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/read/$comicId/$chapterId",
                params: { comicId: comic.id, chapterId: firstChapterId },
                onClick: handleCardClick,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-smooth", children: comic.title })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: comic.author }),
            comic.genres[0] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "self-start text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20", children: comic.genres[0] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5 text-amber-400 fill-amber-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: comic.rating })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                  formatNumber(comic.views)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: (e) => {
                      e.stopPropagation();
                      likeComic(comic.id);
                    },
                    className: cn(
                      "flex items-center gap-0.5 text-xs transition-smooth btn-press",
                      isLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"
                    ),
                    "aria-label": "Like",
                    "data-ocid": `${ocidBase}.like_button`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: cn("w-3 h-3", isLiked && "fill-rose-500") }),
                      formatNumber(comic.likes)
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showPremiumModal, onOpenChange: setShowPremiumModal, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-sm rounded-2xl",
        "data-ocid": "premium.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5 text-amber-500" }),
              "Premium Content"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "This comic requires UR Coins to unlock." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-muted/50 border border-border space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: comic.coverImage,
                  alt: comic.title,
                  className: "w-12 h-16 object-cover rounded-lg"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: comic.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: comic.author }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-500 text-xs font-bold", children: [
                    "🪙 ",
                    ((_b = comic.chapters[0]) == null ? void 0 : _b.coinCost) ?? 3,
                    " coins"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "per chapter" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "You have",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-500 font-semibold", children: [
                "🪙 ",
                (currentUser == null ? void 0 : currentUser.coins) ?? 0,
                " coins"
              ] }),
              " ",
              "available."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "flex-1 rounded-xl",
                onClick: () => setShowPremiumModal(false),
                "data-ocid": "premium.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/coins", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full gradient-primary text-white border-0 rounded-xl shadow-glow",
                "data-ocid": "premium.get_coins_button",
                children: "Get Coins"
              }
            ) })
          ] })
        ]
      }
    ) })
  ] });
}
export {
  ComicCard as C
};
