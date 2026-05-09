import { c as createLucideIcon, i as useParams, k as useNavigate, u as useAppStore, r as reactExports, j as jsxRuntimeExports, L as Link, f as Button, C as Coins, S as Skeleton, X } from "./index-BU3WKumI.js";
import { T as Textarea } from "./textarea-UOGAT82K.js";
import { u as useListChapters, a as useUpdateReadingProgress, b as useDeleteChapter, c as useGetReadingProgress } from "./useComicBackend-1k09e5r7.js";
import { u as ue } from "./index-CPYKGEZc.js";
import { H as Heart } from "./heart-ouCiw-2K.js";
import { B as Bookmark } from "./bookmark-CkqBA0FG.js";
import { E as EllipsisVertical } from "./ellipsis-vertical-Bwj8JVN8.js";
import { T as Trash2 } from "./trash-2-BEpePkRK.js";
import { C as ChevronRight } from "./chevron-right-U1HKvEHX.js";
import { P as Play } from "./play-BSa1eXGn.js";
import { M as MessageCircle } from "./message-circle-BejEN3rj.js";
import { T as ThumbsUp } from "./thumbs-up-BMvPAiVc.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = createLucideIcon("list", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
];
const Maximize = createLucideIcon("maximize", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3", key: "hohbtr" }],
  ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3", key: "5jw1f3" }],
  ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3", key: "198tvr" }],
  ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3", key: "ph8mxp" }]
];
const Minimize = createLucideIcon("minimize", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const COMMENTS_KEY = (comicId, chapterId) => `ur_comics_comments_${comicId}_${chapterId}`;
function loadComments(comicId, chapterId) {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY(comicId, chapterId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveComments(comicId, chapterId, comments) {
  localStorage.setItem(
    COMMENTS_KEY(comicId, chapterId),
    JSON.stringify(comments)
  );
}
function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1e3;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function isUsableUrl(url) {
  if (!url) return false;
  if (url.startsWith("blob:")) return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  if (url.startsWith("/") || url.startsWith("data:")) return true;
  return false;
}
function resolveChapterImages(images, imageKeys, imageOrder) {
  const source = imageKeys.length > 0 && imageKeys.some(isUsableUrl) ? imageKeys : images;
  const usable = source.filter(isUsableUrl);
  if (usable.length === 0) return [];
  if (imageOrder.length === 0 || imageOrder.length !== source.length) {
    return usable;
  }
  const maxLen = source.length;
  const ordered = [];
  for (const idx of imageOrder) {
    const i = Number(idx);
    if (i >= 0 && i < maxLen) {
      const url = source[i];
      if (url && isUsableUrl(url)) ordered.push(url);
    }
  }
  return ordered.length > 0 ? ordered : usable;
}
function LazyImage({ src, index, alt }) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(index < 3);
  const [loaded, setLoaded] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(false);
  const [retryKey, setRetryKey] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        var _a;
        if ((_a = entries[0]) == null ? void 0 : _a.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);
  const handleRetry = () => {
    setError(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: "w-full relative",
      style: { background: "oklch(0.10 0.008 265)" },
      children: [
        !loaded && !error && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "w-full",
            style: {
              minHeight: "60vw",
              aspectRatio: "3/4",
              borderRadius: 0,
              background: "oklch(0.16 0.012 265)"
            }
          }
        ),
        error ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full flex flex-col items-center justify-center py-12 gap-3",
            style: {
              background: "oklch(0.14 0.01 265)",
              minHeight: "200px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RotateCcw,
                {
                  className: "w-6 h-6",
                  style: { color: "oklch(0.45 0.01 265)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: { color: "oklch(0.45 0.01 265)" }, children: "Image failed to load" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleRetry,
                  className: "text-xs px-3 py-1.5 rounded-lg transition-colors",
                  style: {
                    background: "oklch(0.58 0.22 265 / 0.2)",
                    color: "oklch(0.70 0.18 265)",
                    border: "1px solid oklch(0.58 0.22 265 / 0.3)"
                  },
                  "data-ocid": "reader.image_retry_button",
                  children: "Tap to retry"
                }
              )
            ]
          }
        ) : visible ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt,
            loading: "lazy",
            decoding: "async",
            onLoad: () => setLoaded(true),
            onError: () => {
              setError(true);
              setLoaded(true);
            },
            className: "w-full block",
            style: {
              display: loaded ? "block" : "none",
              touchAction: "pan-y pinch-zoom",
              imageRendering: "auto"
            }
          },
          retryKey
        ) : null
      ]
    }
  );
}
function DeleteChapterModal({
  chapterTitle,
  onConfirm,
  onCancel,
  isDeleting
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.85)" },
      "data-ocid": "reader.delete_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border p-6 w-full max-w-sm space-y-4 shadow-xl",
          style: {
            background: "oklch(0.15 0.015 265 / 0.98)",
            borderColor: "oklch(0.28 0.01 265)",
            backdropFilter: "blur(16px)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  style: { background: "oklch(0.35 0.15 15 / 0.3)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Trash2,
                    {
                      className: "w-5 h-5",
                      style: { color: "oklch(0.65 0.18 15)" }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base text-white", children: "Delete Chapter?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs mt-0.5",
                    style: { color: "rgba(255,255,255,0.5)" },
                    children: chapterTitle
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", style: { color: "rgba(255,255,255,0.6)" }, children: [
              "Are you sure you want to delete this chapter? This action",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-semibold",
                  style: { color: "oklch(0.65 0.18 15)" },
                  children: "cannot be undone"
                }
              ),
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "flex-1",
                  onClick: onCancel,
                  disabled: isDeleting,
                  style: {
                    borderColor: "oklch(0.28 0.01 265)",
                    color: "rgba(255,255,255,0.7)"
                  },
                  "data-ocid": "reader.delete_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "flex-1",
                  onClick: onConfirm,
                  disabled: isDeleting,
                  style: {
                    background: "oklch(0.50 0.18 15)",
                    color: "white",
                    border: "none"
                  },
                  "data-ocid": "reader.delete_confirm_button",
                  children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin w-3.5 h-3.5 border border-white/30 border-t-white rounded-full" }),
                    "Deleting…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-1.5" }),
                    " Delete"
                  ] })
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function UnlockModal({
  coinCost,
  userCoins,
  onUnlock,
  onAdUnlock,
  onClose
}) {
  const canAfford = userCoins >= coinCost;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.8)" },
      "data-ocid": "reader.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-lg space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: "🔒" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Premium Chapter" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: onClose,
              "aria-label": "Close",
              "data-ocid": "reader.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "This chapter requires",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
            coinCost,
            " UR Coins"
          ] }),
          " ",
          "to unlock."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted rounded-xl p-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Your balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 text-yellow-500" }),
            " ",
            userCoins,
            " Coins"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              className: "w-full gradient-primary text-primary-foreground border-0 btn-press",
              onClick: onUnlock,
              disabled: !canAfford,
              "data-ocid": "reader.confirm_button",
              children: canAfford ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 mr-2" }),
                " Unlock for ",
                coinCost,
                " Coins"
              ] }) : "Not enough coins"
            }
          ),
          !canAfford && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/coins", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full", children: "Get More Coins" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "w-full",
              onClick: onAdUnlock,
              "data-ocid": "reader.ad_unlock_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }),
                " Watch Ad to Unlock Free"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function ChapterSidebar({
  chapters,
  currentChapterId,
  comicId,
  onClose
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-40 w-full h-full cursor-default",
        style: { background: "rgba(0,0,0,0.5)", border: "none" },
        onClick: onClose,
        "aria-label": "Close chapter list",
        tabIndex: 0
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed top-0 right-0 h-full z-50 flex flex-col",
        style: {
          width: "min(320px, 85vw)",
          background: "oklch(0.15 0.015 265 / 0.98)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid oklch(0.25 0.01 265)",
          animation: "slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)"
        },
        "data-ocid": "reader.chapter_list_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-4 py-3 shrink-0",
              style: { borderBottom: "1px solid oklch(0.22 0.01 265)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-white text-sm", children: "Chapters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "p-1.5 rounded-lg hover:bg-white/10 transition-colors",
                    "aria-label": "Close chapter list",
                    "data-ocid": "reader.chapter_list_close",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-white/60" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto py-2", children: chapters.map((ch) => {
            const isCurrent = ch.id === currentChapterId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  void navigate({
                    to: "/read/$comicId/$chapterId",
                    params: { comicId, chapterId: ch.id }
                  });
                  onClose();
                },
                className: "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10",
                style: isCurrent ? { background: "oklch(0.58 0.22 265 / 0.25)" } : {},
                "data-ocid": `reader.chapter_list.item.${ch.chapterNumber}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-xs font-bold rounded-md px-2 py-0.5 shrink-0",
                      style: {
                        background: isCurrent ? "oklch(0.58 0.22 265)" : "oklch(0.25 0.01 265)",
                        color: isCurrent ? "white" : "oklch(0.6 0.01 265)",
                        minWidth: "2.5rem",
                        textAlign: "center"
                      },
                      children: ch.chapterNumber
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "text-sm truncate min-w-0",
                      style: {
                        color: isCurrent ? "white" : "oklch(0.7 0.006 265)"
                      },
                      children: [
                        ch.title,
                        ch.isPremium && " 🔒"
                      ]
                    }
                  )
                ]
              },
              ch.id
            );
          }) })
        ]
      }
    )
  ] });
}
function ReplySection({ commentId, username }) {
  const REPLIES_KEY = `ur_replies_${commentId}`;
  const [replies, setReplies] = reactExports.useState(() => {
    try {
      const raw = localStorage.getItem(REPLIES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const submit = () => {
    if (!text.trim()) return;
    const reply = {
      id: `r-${Date.now()}`,
      parentCommentId: commentId,
      userId: "guest",
      username: username || "Anonymous",
      text: text.trim(),
      createdAt: Date.now()
    };
    const next = [...replies, reply];
    setReplies(next);
    localStorage.setItem(REPLIES_KEY, JSON.stringify(next));
    setText("");
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-10 mt-2 space-y-2", children: [
    replies.map((r, idx) => {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0",
            "aria-hidden": true,
            children: (_a = r.username[0]) == null ? void 0 : _a.toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: r.username }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs",
              style: { color: "oklch(0.55 0.006 265)" },
              children: timeAgo(r.createdAt)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mt-0.5 leading-relaxed", children: r.text })
        ] })
      ] }, r.id ?? idx);
    }),
    open ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "Write a reply…",
          value: text,
          onChange: (e) => setText(e.target.value),
          className: "text-xs resize-none min-h-[56px]",
          "data-ocid": "reader.reply_textarea"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: "gradient-primary text-primary-foreground border-0 btn-press text-xs h-8",
            onClick: submit,
            disabled: !text.trim(),
            "data-ocid": "reader.reply_submit_button",
            children: "Reply"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "text-xs h-8",
            onClick: () => setOpen(false),
            children: "Cancel"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "text-xs hover:text-primary transition-colors",
        style: { color: "oklch(0.55 0.006 265)" },
        onClick: () => setOpen(true),
        "data-ocid": "reader.reply_button",
        children: "Reply"
      }
    )
  ] });
}
function CommentSection({
  comicId,
  chapterId,
  currentUsername
}) {
  const [comments, setComments] = reactExports.useState(
    () => loadComments(comicId, chapterId)
  );
  const [guestName, setGuestName] = reactExports.useState(currentUsername || "");
  const [text, setText] = reactExports.useState("");
  const [likedIds, setLikedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const submit = () => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      comicId,
      chapterId,
      userId: "guest",
      username: guestName.trim() || "Anonymous Reader",
      avatar: "",
      content: text.trim(),
      likes: 0,
      createdAt: Date.now()
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(comicId, chapterId, updated);
    setText("");
  };
  const likeComment = (id) => {
    if (likedIds.has(id)) return;
    setLikedIds((prev) => /* @__PURE__ */ new Set([...prev, id]));
    const updated = comments.map(
      (c) => c.id === id ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updated);
    saveComments(comicId, chapterId, updated);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-t border-border mt-2 pt-6 pb-10 px-4 max-w-2xl mx-auto space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-primary" }),
      "Comments (",
      comments.length,
      ")"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder: "Your name (optional)",
          value: guestName,
          onChange: (e) => setGuestName(e.target.value),
          className: "w-full text-sm bg-muted rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground border-0 focus:outline-none focus:ring-2 focus:ring-ring",
          "data-ocid": "reader.comment_name_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "Share your thoughts about this chapter…",
          value: text,
          onChange: (e) => setText(e.target.value),
          className: "resize-none min-h-[80px] text-sm",
          "data-ocid": "reader.comment_textarea"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          className: "gradient-primary text-primary-foreground border-0 btn-press",
          onClick: submit,
          disabled: !text.trim(),
          "data-ocid": "reader.comment_submit_button",
          children: "Post Comment"
        }
      ) })
    ] }),
    comments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-8 text-muted-foreground",
        "data-ocid": "reader.comments_empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-8 h-8 mx-auto mb-2 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Be the first to comment!" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: comments.map((c, i) => {
      var _a;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "bg-card border border-border rounded-2xl p-4 space-y-2",
          "data-ocid": `reader.comment.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground",
                    "aria-hidden": true,
                    children: (_a = c.username[0]) == null ? void 0 : _a.toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: c.username }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeAgo(c.createdAt) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => likeComment(c.id),
                  className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors",
                  "aria-label": `Like comment by ${c.username}`,
                  "data-ocid": `reader.comment.like.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ThumbsUp,
                      {
                        className: `w-3.5 h-3.5 ${likedIds.has(c.id) ? "text-primary fill-primary" : ""}`
                      }
                    ),
                    c.likes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c.likes })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: c.content }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ReplySection,
              {
                commentId: c.id,
                username: currentUsername || guestName
              }
            )
          ]
        },
        c.id
      );
    }) })
  ] });
}
function ReaderPage() {
  const { comicId, chapterId } = useParams({
    from: "/read/$comicId/$chapterId"
  });
  const navigate = useNavigate();
  const {
    updateProgress,
    readingProgress,
    currentUser,
    likeComic,
    bookmarkComic,
    comics,
    updateUser
  } = useAppStore();
  const backendComicId = reactExports.useMemo(() => {
    const n = Number(comicId);
    return Number.isNaN(n) ? null : BigInt(n);
  }, [comicId]);
  const backendChapterId = reactExports.useMemo(() => {
    const n = Number(chapterId);
    return Number.isNaN(n) ? null : BigInt(n);
  }, [chapterId]);
  const { data: backendChaptersRaw, isLoading: chaptersLoading } = useListChapters(backendComicId, true);
  const updateReadingProgress = useUpdateReadingProgress();
  const deleteChapterMutation = useDeleteChapter();
  useGetReadingProgress(backendComicId, (currentUser == null ? void 0 : currentUser.id) ?? null);
  const scrollRef = reactExports.useRef(null);
  const saveTimerRef = reactExports.useRef(null);
  const progressSavedRef = reactExports.useRef(false);
  const [scrollPct, setScrollPct] = reactExports.useState(0);
  const localProgressKey = `ur_scroll_${chapterId}`;
  const [showUnlock, setShowUnlock] = reactExports.useState(false);
  const [isUnlocked, setIsUnlocked] = reactExports.useState(false);
  const [isFullscreen, setIsFullscreen] = reactExports.useState(false);
  const [showChapterList, setShowChapterList] = reactExports.useState(false);
  const [showResumeBtn, setShowResumeBtn] = reactExports.useState(false);
  const [likeCount, setLikeCount] = reactExports.useState(0);
  const [isLikedLocal, setIsLikedLocal] = reactExports.useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = reactExports.useState(false);
  const [showDeleteModal, setShowDeleteModal] = reactExports.useState(false);
  const [stickyNextVisible, setStickyNextVisible] = reactExports.useState(false);
  const comic = reactExports.useMemo(
    () => comics.find((c) => c.id === comicId),
    [comics, comicId]
  );
  const chapter = reactExports.useMemo(() => {
    if (!backendChaptersRaw) return null;
    return backendChaptersRaw.find((ch) => ch.id === backendChapterId) ?? null;
  }, [backendChaptersRaw, backendChapterId]);
  const sidebarChapters = reactExports.useMemo(() => {
    if (!backendChaptersRaw) return [];
    return backendChaptersRaw.slice().sort((a, b) => Number(a.chapterNumber - b.chapterNumber)).map((ch) => ({
      id: String(ch.id),
      title: ch.title,
      chapterNumber: Number(ch.chapterNumber),
      isPremium: false
    }));
  }, [backendChaptersRaw]);
  const sortedChapters = reactExports.useMemo(() => {
    if (!backendChaptersRaw) return [];
    return backendChaptersRaw.slice().sort((a, b) => Number(a.chapterNumber - b.chapterNumber));
  }, [backendChaptersRaw]);
  const chapterIndex = reactExports.useMemo(() => {
    if (!backendChaptersRaw || !backendChapterId) return -1;
    return sortedChapters.findIndex((ch) => ch.id === backendChapterId);
  }, [backendChaptersRaw, backendChapterId, sortedChapters]);
  const prevBackendChapter = chapterIndex > 0 ? sortedChapters[chapterIndex - 1] : void 0;
  const nextBackendChapter = chapterIndex >= 0 && chapterIndex < sortedChapters.length - 1 ? sortedChapters[chapterIndex + 1] : void 0;
  const prevChapter = prevBackendChapter ? { id: String(prevBackendChapter.id) } : void 0;
  const nextChapter = nextBackendChapter ? { id: String(nextBackendChapter.id) } : void 0;
  const isLiked = (currentUser == null ? void 0 : currentUser.likedComics.includes(comicId)) ?? isLikedLocal;
  const isBookmarked = (currentUser == null ? void 0 : currentUser.bookmarks.includes(comicId)) ?? false;
  const orderedImages = reactExports.useMemo(() => {
    if (!chapter) return [];
    return resolveChapterImages(
      chapter.images ?? [],
      chapter.imageKeys ?? [],
      chapter.imageOrder ?? []
    );
  }, [chapter]);
  const numImages = orderedImages.length;
  const chapterDisplay = reactExports.useMemo(() => {
    if (!chapter) return null;
    return {
      title: chapter.title,
      chapterNumber: Number(chapter.chapterNumber),
      isPremium: false,
      coinCost: 3
    };
  }, [chapter]);
  const isCreatorOrAdmin = reactExports.useMemo(() => {
    if (!chapter || !currentUser) return false;
    return chapter.creatorId === currentUser.id || currentUser.role === "owner";
  }, [chapter, currentUser]);
  const needsUnlock = (chapterDisplay == null ? void 0 : chapterDisplay.isPremium) && !isUnlocked && !((currentUser == null ? void 0 : currentUser.unlockedChapters.includes(chapterId)) ?? false);
  const savedProgress = readingProgress.find((p) => p.comicId === comicId);
  const savedScrollPos = (savedProgress == null ? void 0 : savedProgress.chapterId) === chapterId ? savedProgress.scrollPosition : null;
  reactExports.useEffect(() => {
    if (savedScrollPos != null && savedScrollPos > 200) {
      setShowResumeBtn(true);
    }
  }, [savedScrollPos]);
  const chapterIdRef = reactExports.useRef(chapterId);
  reactExports.useEffect(() => {
    if (chapterIdRef.current !== chapterId) {
      chapterIdRef.current = chapterId;
      setIsUnlocked(false);
      setShowUnlock(false);
      setShowResumeBtn(false);
      progressSavedRef.current = false;
      setStickyNextVisible(false);
    }
  });
  reactExports.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    try {
      const saved = localStorage.getItem(localProgressKey);
      if (saved) {
        const pos = Number(saved);
        if (pos > 200) {
          const timer = setTimeout(() => {
            el.scrollTo({ top: pos });
          }, 400);
          return () => clearTimeout(timer);
        }
      }
    } catch {
    }
  }, [localProgressKey]);
  reactExports.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? Math.round(el.scrollTop / max * 100) : 0;
      setScrollPct(pct);
      if (pct >= 80 && nextChapter) {
        setStickyNextVisible(true);
      }
      try {
        localStorage.setItem(localProgressKey, String(el.scrollTop));
      } catch {
      }
      if (pct >= 50 && !progressSavedRef.current && currentUser && backendComicId && backendChapterId) {
        progressSavedRef.current = true;
        updateReadingProgress.mutate({
          comicId: backendComicId,
          chapterId: backendChapterId,
          userId: currentUser.id
        });
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [
    currentUser,
    backendComicId,
    backendChapterId,
    nextChapter,
    updateReadingProgress,
    localProgressKey
  ]);
  const saveScroll = reactExports.useCallback(() => {
    if (!scrollRef.current || !chapterDisplay) return;
    const pos = scrollRef.current.scrollTop;
    updateProgress({
      comicId,
      chapterId,
      scrollPosition: pos,
      lastReadAt: Date.now(),
      chapterNumber: chapterDisplay.chapterNumber
    });
    try {
      localStorage.setItem(localProgressKey, String(pos));
    } catch {
    }
  }, [comicId, chapterId, chapterDisplay, updateProgress, localProgressKey]);
  reactExports.useEffect(() => {
    saveTimerRef.current = setInterval(saveScroll, 5e3);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      saveScroll();
    };
  }, [saveScroll]);
  reactExports.useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);
  const toggleFullscreen = reactExports.useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }, []);
  reactExports.useEffect(() => {
    if (!showOptionsMenu) return;
    const handler = (e) => {
      const target = e.target;
      if (!target.closest("[data-ocid='reader.options_menu']") && !target.closest("[data-ocid='reader.options_button']")) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showOptionsMenu]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      var _a, _b;
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        (_a = scrollRef.current) == null ? void 0 : _a.scrollBy({ top: 300, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        (_b = scrollRef.current) == null ? void 0 : _b.scrollBy({ top: -300, behavior: "smooth" });
      } else if (e.key === "n" && nextChapter) {
        void navigate({
          to: "/read/$comicId/$chapterId",
          params: { comicId, chapterId: nextChapter.id }
        });
      } else if (e.key === "p" && prevChapter) {
        void navigate({
          to: "/read/$comicId/$chapterId",
          params: { comicId, chapterId: prevChapter.id }
        });
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "Escape") {
        setShowOptionsMenu(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, comicId, nextChapter, prevChapter, toggleFullscreen]);
  const handleLike = () => {
    likeComic(comicId);
    setIsLikedLocal((v) => !v);
    setLikeCount((c) => isLiked ? Math.max(0, c - 1) : c + 1);
  };
  const handleUnlockWithCoins = () => {
    const cost = (chapterDisplay == null ? void 0 : chapterDisplay.coinCost) ?? 3;
    if (!currentUser || currentUser.coins < cost) return;
    updateUser({
      coins: currentUser.coins - cost,
      unlockedChapters: [...currentUser.unlockedChapters, chapterId]
    });
    setIsUnlocked(true);
    setShowUnlock(false);
  };
  const handleAdUnlock = () => {
    setTimeout(() => {
      if (currentUser)
        updateUser({
          unlockedChapters: [...currentUser.unlockedChapters, chapterId]
        });
      setIsUnlocked(true);
      setShowUnlock(false);
    }, 1500);
    setShowUnlock(false);
  };
  const resumeReading = () => {
    if (savedScrollPos != null && scrollRef.current) {
      scrollRef.current.scrollTo({ top: savedScrollPos, behavior: "smooth" });
    }
    setShowResumeBtn(false);
  };
  const handleDeleteChapter = async () => {
    if (!backendChapterId) return;
    try {
      setShowDeleteModal(false);
      await deleteChapterMutation.mutateAsync({
        id: backendChapterId,
        comicId: backendComicId ?? void 0
      });
      if (comicId && chapterId) {
        try {
          const CONTINUE_KEY = `ur_scroll_${chapterId}`;
          localStorage.removeItem(CONTINUE_KEY);
        } catch {
        }
      }
      ue.success("Chapter deleted successfully");
      void navigate({ to: "/" });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete chapter"
      );
    }
  };
  if (chaptersLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 flex flex-col items-center justify-center gap-4",
        style: { background: "oklch(0.09 0.008 265)" },
        "data-ocid": "reader.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin",
              style: {
                boxShadow: "0 0 20px oklch(0.58 0.22 265 / 0.3)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm font-medium",
              style: { color: "rgba(255,255,255,0.55)" },
              children: "Loading chapter…"
            }
          )
        ]
      }
    );
  }
  if (!chapter || !chapterDisplay) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed inset-0 flex flex-col items-center justify-center gap-4 px-4",
        style: { background: "oklch(0.09 0.008 265)" },
        "data-ocid": "reader.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl", children: "📚" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-display font-bold text-white text-center", children: "Chapter not available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-center max-w-xs",
              style: { color: "rgba(255,255,255,0.45)" },
              children: "This chapter may have been deleted, not yet published, or is still being processed."
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2 flex-wrap justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/read/$comicId/$chapterId",
                params: { comicId, chapterId },
                onClick: () => window.location.reload(),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    style: {
                      borderColor: "oklch(0.35 0.01 265)",
                      color: "rgba(255,255,255,0.7)"
                    },
                    "data-ocid": "reader.retry_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4 mr-2" }),
                      " Retry"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                style: {
                  background: "oklch(0.58 0.22 265)",
                  color: "white",
                  border: "none"
                },
                "data-ocid": "reader.back_home_button",
                children: "Back to Home"
              }
            ) })
          ] })
        ]
      }
    );
  }
  const comicTitle = (comic == null ? void 0 : comic.title) ?? "Comic";
  const readingMinutes = Math.max(1, Math.round(numImages * 0.5));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col",
      style: { background: "oklch(0.09 0.008 265)" },
      "data-ocid": "reader.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed top-0 left-0 right-0 z-50 h-0.5",
            style: { background: "oklch(0.2 0.01 265)" },
            "aria-hidden": true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full transition-all duration-300",
                style: {
                  width: `${scrollPct}%`,
                  background: "var(--gradient-primary)"
                }
              }
            )
          }
        ),
        !isFullscreen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "sticky top-0 z-40 border-b flex flex-col",
            style: {
              background: "oklch(0.13 0.012 265 / 0.97)",
              borderColor: "oklch(0.22 0.01 265)",
              backdropFilter: "blur(12px)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", "data-ocid": "reader.home_link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    "aria-label": "Back to home",
                    className: "shrink-0 text-white/70 hover:text-white hover:bg-white/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-white truncate leading-tight", children: comicTitle }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs truncate min-w-0",
                        style: { color: "rgba(255,255,255,0.5)" },
                        children: chapterDisplay.title
                      }
                    ),
                    numImages > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-xs shrink-0 px-1.5 py-0.5 rounded-md font-medium",
                        style: {
                          background: "oklch(0.58 0.22 265 / 0.18)",
                          color: "oklch(0.72 0.14 265)"
                        },
                        children: [
                          numImages,
                          "p"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-xs shrink-0",
                        style: { color: "rgba(255,255,255,0.3)" },
                        children: "·"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-xs shrink-0",
                        style: { color: "rgba(255,255,255,0.35)" },
                        children: [
                          "~",
                          readingMinutes,
                          " min · ",
                          scrollPct,
                          "%"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleLike,
                    className: "flex items-center gap-1 p-1.5 rounded-lg transition-smooth hover:bg-white/10",
                    "aria-label": isLiked ? "Unlike" : "Like",
                    "data-ocid": "reader.like_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Heart,
                        {
                          className: `w-4 h-4 transition-colors ${isLiked ? "text-rose-400 fill-rose-400" : "text-white/50"}`
                        }
                      ),
                      likeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "text-xs",
                          style: { color: "rgba(255,255,255,0.5)" },
                          children: likeCount
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => bookmarkComic(comicId),
                    className: "p-1.5 rounded-lg transition-smooth hover:bg-white/10",
                    "aria-label": isBookmarked ? "Remove bookmark" : "Bookmark",
                    "data-ocid": "reader.bookmark_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bookmark,
                      {
                        className: `w-4 h-4 transition-colors ${isBookmarked ? "text-primary fill-primary" : "text-white/50"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowChapterList(true),
                    className: "p-1.5 rounded-lg transition-smooth hover:bg-white/10",
                    "aria-label": "Chapter list",
                    "data-ocid": "reader.chapter_list_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "w-4 h-4 text-white/50" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: toggleFullscreen,
                    className: "p-1.5 rounded-lg transition-smooth hover:bg-white/10",
                    "aria-label": "Fullscreen",
                    "data-ocid": "reader.fullscreen_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { className: "w-4 h-4 text-white/50" })
                  }
                ),
                isCreatorOrAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowOptionsMenu((v) => !v),
                      className: "p-1.5 rounded-lg transition-smooth hover:bg-white/10",
                      "aria-label": "Chapter options",
                      "data-ocid": "reader.options_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "w-4 h-4 text-white/50" })
                    }
                  ),
                  showOptionsMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "absolute right-0 top-full mt-1 rounded-xl border shadow-xl overflow-hidden z-50",
                      style: {
                        background: "oklch(0.16 0.015 265 / 0.98)",
                        borderColor: "oklch(0.28 0.01 265)",
                        backdropFilter: "blur(16px)",
                        minWidth: "160px"
                      },
                      "data-ocid": "reader.options_menu",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setShowOptionsMenu(false);
                            setShowDeleteModal(true);
                          },
                          className: "w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10",
                          style: { color: "oklch(0.65 0.18 15)" },
                          "data-ocid": "reader.delete_button",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
                            "Delete Chapter"
                          ]
                        }
                      )
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 px-3 pb-2.5",
                  style: { borderTop: "1px solid oklch(0.20 0.01 265)" },
                  children: [
                    prevChapter ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/read/$comicId/$chapterId",
                        params: { comicId, chapterId: prevChapter.id },
                        "data-ocid": "reader.prev_chapter",
                        className: "flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-white/10 text-white/60 hover:text-white",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }),
                          " Prev"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs px-2.5 py-1.5 text-white/20 select-none", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }),
                      " Prev"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "text-xs font-semibold",
                        style: { color: "rgba(255,255,255,0.5)" },
                        children: [
                          "Ch. ",
                          chapterDisplay.chapterNumber,
                          " — ",
                          chapterIndex + 1,
                          "/",
                          sortedChapters.length
                        ]
                      }
                    ) }),
                    nextChapter ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/read/$comicId/$chapterId",
                        params: { comicId, chapterId: nextChapter.id },
                        "data-ocid": "reader.next_chapter",
                        className: "flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-smooth hover:bg-white/10 text-white/60 hover:text-white",
                        children: [
                          "Next ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs px-2.5 py-1.5 text-white/20 select-none", children: [
                      "Next ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: scrollRef,
            className: "flex-1 overflow-y-auto",
            style: { maxHeight: isFullscreen ? "100vh" : "calc(100vh - 90px)" },
            "data-ocid": "reader.canvas_target",
            children: [
              needsUnlock ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-4xl shadow-lg", children: "🔒" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-white mb-2", children: "Premium Chapter" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "rgba(255,255,255,0.5)" }, className: "text-sm", children: [
                    "This chapter costs",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-yellow-400 font-semibold", children: [
                      chapterDisplay.coinCost,
                      " UR Coins"
                    ] }),
                    " ",
                    "to unlock."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full max-w-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "flex-1 gradient-primary text-primary-foreground border-0 btn-press",
                      onClick: () => setShowUnlock(true),
                      "data-ocid": "reader.unlock_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-4 h-4 mr-2" }),
                        " Unlock Chapter"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "outline",
                      className: "flex-1 border-white/20 text-white hover:bg-white/10",
                      onClick: handleAdUnlock,
                      "data-ocid": "reader.ad_unlock_button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }),
                        " Watch Ad"
                      ]
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                numImages === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center",
                    "data-ocid": "reader.images_empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-16 h-16 rounded-2xl flex items-center justify-center",
                          style: { background: "oklch(0.58 0.22 265 / 0.15)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl", children: "🖼️" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-white", children: "Images are still uploading" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-sm max-w-xs",
                          style: { color: "rgba(255,255,255,0.4)" },
                          children: "The chapter images have not finished uploading yet. Please try again in a moment — your content is safe."
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 flex-wrap justify-center", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => window.location.reload(),
                            className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                            style: {
                              background: "oklch(0.58 0.22 265 / 0.2)",
                              color: "oklch(0.70 0.18 265)",
                              border: "1px solid oklch(0.58 0.22 265 / 0.3)"
                            },
                            "data-ocid": "reader.refresh_button",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
                              " Refresh Page"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                            style: {
                              background: "oklch(0.20 0.01 265)",
                              color: "rgba(255,255,255,0.6)",
                              border: "1px solid oklch(0.28 0.01 265)"
                            },
                            "data-ocid": "reader.back_home_from_empty",
                            children: "Back to Home"
                          }
                        ) })
                      ] })
                    ]
                  }
                ),
                numImages > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full mx-auto",
                    style: {
                      maxWidth: "720px",
                      background: "#0a0a0c"
                    },
                    "data-ocid": "reader.images_container",
                    children: orderedImages.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      LazyImage,
                      {
                        src,
                        index: i,
                        alt: `${comicTitle} — ${chapterDisplay.title} — Page ${i + 1}`
                      },
                      `${chapterId}-img-${src.slice(-40)}`
                    ))
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "rounded-2xl border p-5 space-y-4",
                    style: {
                      background: "oklch(0.14 0.012 265)",
                      borderColor: "oklch(0.22 0.01 265)"
                    },
                    children: [
                      !nextChapter && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-center text-sm font-semibold",
                          style: { color: "rgba(255,255,255,0.6)" },
                          children: "🎉 End of Series — check back later!"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm font-semibold text-white", children: [
                        "End of ",
                        chapterDisplay.title
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
                        prevChapter ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Link,
                          {
                            to: "/read/$comicId/$chapterId",
                            params: { comicId, chapterId: prevChapter.id },
                            className: "flex-1",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Button,
                              {
                                variant: "outline",
                                className: "w-full border-white/20 text-white hover:bg-white/10",
                                "data-ocid": "reader.bottom_prev_chapter",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
                                  " Previous"
                                ]
                              }
                            )
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
                        nextChapter ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Link,
                          {
                            to: "/read/$comicId/$chapterId",
                            params: { comicId, chapterId: nextChapter.id },
                            className: "flex-1",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Button,
                              {
                                className: "w-full gradient-primary text-primary-foreground border-0 btn-press",
                                "data-ocid": "reader.bottom_next_chapter",
                                children: [
                                  "Next ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 ml-1" })
                                ]
                              }
                            )
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "outline",
                            className: "w-full border-white/20 text-white hover:bg-white/10",
                            "data-ocid": "reader.back_home_button",
                            children: "Back to Home"
                          }
                        ) })
                      ] })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      background: "oklch(0.11 0.01 265)",
                      borderTop: "1px solid oklch(0.20 0.01 265)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CommentSection,
                      {
                        comicId,
                        chapterId,
                        currentUsername: (currentUser == null ? void 0 : currentUser.username) ?? ""
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8" })
            ]
          }
        ),
        stickyNextVisible && nextChapter && !isFullscreen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "sticky bottom-0 left-0 right-0 z-30 px-4 py-3",
            style: {
              background: "linear-gradient(to top, oklch(0.10 0.01 265) 0%, transparent 100%)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/read/$comicId/$chapterId",
                params: { comicId, chapterId: nextChapter.id },
                "data-ocid": "reader.sticky_next_chapter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white btn-press transition-smooth",
                    style: {
                      background: "var(--gradient-primary)",
                      boxShadow: "0 4px 24px oklch(0.58 0.22 265 / 0.4)",
                      minHeight: "52px"
                      // large tap target for mobile
                    },
                    children: [
                      "Next Chapter ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                    ]
                  }
                )
              }
            ) })
          }
        ),
        isFullscreen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl",
            style: {
              background: "oklch(0.15 0.015 265 / 0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(0.25 0.01 265)"
            },
            "data-ocid": "reader.fullscreen_controls",
            children: [
              prevChapter && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/read/$comicId/$chapterId",
                  params: { comicId, chapterId: prevChapter.id },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                      "aria-label": "Previous chapter",
                      "data-ocid": "reader.fs_prev_chapter",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5 text-white/70" })
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "text-xs px-2",
                  style: { color: "rgba(255,255,255,0.6)" },
                  children: [
                    scrollPct,
                    "% · Ch. ",
                    chapterDisplay.chapterNumber
                  ]
                }
              ),
              nextChapter && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/read/$comicId/$chapterId",
                  params: { comicId, chapterId: nextChapter.id },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                      "aria-label": "Next chapter",
                      "data-ocid": "reader.fs_next_chapter",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5 text-white/70" })
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    width: "1px",
                    height: "20px",
                    background: "oklch(0.3 0.01 265)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "p-2 rounded-lg hover:bg-white/10 transition-colors",
                  onClick: toggleFullscreen,
                  "aria-label": "Exit fullscreen",
                  "data-ocid": "reader.exit_fullscreen_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize, { className: "w-5 h-5 text-white/70" })
                }
              )
            ]
          }
        ),
        showResumeBtn && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed bottom-20 left-1/2 -translate-x-1/2 z-40",
            "data-ocid": "reader.resume_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: resumeReading,
                className: "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-lg btn-press transition-smooth hover:scale-105",
                style: {
                  background: "var(--gradient-primary)",
                  boxShadow: "0 4px 20px oklch(0.58 0.22 265 / 0.4)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
                  " Resume reading"
                ]
              }
            )
          }
        ),
        showChapterList && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChapterSidebar,
          {
            chapters: sidebarChapters,
            currentChapterId: chapterId,
            comicId,
            onClose: () => setShowChapterList(false)
          }
        ),
        showUnlock && /* @__PURE__ */ jsxRuntimeExports.jsx(
          UnlockModal,
          {
            coinCost: chapterDisplay.coinCost,
            userCoins: (currentUser == null ? void 0 : currentUser.coins) ?? 0,
            onUnlock: handleUnlockWithCoins,
            onAdUnlock: handleAdUnlock,
            onClose: () => setShowUnlock(false)
          }
        ),
        showDeleteModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteChapterModal,
          {
            chapterTitle: chapterDisplay.title,
            onConfirm: () => void handleDeleteChapter(),
            onCancel: () => setShowDeleteModal(false),
            isDeleting: deleteChapterMutation.isPending
          }
        )
      ]
    }
  );
}
export {
  ReaderPage as default
};
