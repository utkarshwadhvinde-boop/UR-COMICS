import { c as createLucideIcon, j as jsxRuntimeExports, f as Button, u as useAppStore, r as reactExports, L as Link, B as BookOpen, g as formatNumber, C as Coins, T as TrendingUp, k as useNavigate, h as Badge } from "./index-BU3WKumI.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-DT-hOwyc.js";
import { T as Trash2 } from "./trash-2-BEpePkRK.js";
import { L as LoaderCircle } from "./loader-circle-UTANioOl.js";
import { j as useDeleteComic, u as useListChapters, h as usePublishChapter, k as useUnpublishChapter, b as useDeleteChapter } from "./useComicBackend-1k09e5r7.js";
import { u as ue } from "./index-CPYKGEZc.js";
import { P as Plus } from "./plus-uQovYA7X.js";
import { E as Eye } from "./eye-DqdzshDN.js";
import { H as Heart } from "./heart-ouCiw-2K.js";
import { m as motion } from "./proxy-wBHUi49N.js";
import { S as SquarePen } from "./square-pen-BiqPhqtb.js";
import { E as EllipsisVertical } from "./ellipsis-vertical-Bwj8JVN8.js";
import { P as Pen } from "./pen-BGeaEc3H.js";
import { C as Check } from "./check-DHYa4mWz.js";
import "./index-OcAYLIxh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("radio", __iconNode);
function DeleteChapterDialog({
  isOpen,
  onClose,
  onConfirm,
  chapterTitle,
  isDeleting
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: isOpen,
      onOpenChange: (open) => !open && !isDeleting && onClose(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "rounded-3xl max-w-sm modal-glass",
          "data-ocid": "delete_chapter.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-destructive/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5 text-destructive" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-display font-bold text-foreground", children: "Delete Chapter" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-sm text-muted-foreground leading-relaxed", children: [
                "Are you sure you want to delete",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                  "“",
                  chapterTitle,
                  "”"
                ] }),
                "? This action cannot be undone and all associated images will be permanently removed."
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1 rounded-xl",
                  onClick: onClose,
                  disabled: isDeleting,
                  "data-ocid": "delete_chapter.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "destructive",
                  className: "flex-1 rounded-xl gap-2 font-semibold",
                  onClick: onConfirm,
                  disabled: isDeleting,
                  "data-ocid": "delete_chapter.confirm_button",
                  children: [
                    isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
                    isDeleting ? "Deleting..." : "Delete Chapter"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const STATUS_BADGE = {
  ongoing: {
    label: "Ongoing",
    cls: "bg-primary/10 text-primary border-primary/20"
  },
  completed: {
    label: "Completed",
    cls: "bg-accent/10 text-accent border-accent/20"
  },
  hiatus: {
    label: "Hiatus",
    cls: "bg-muted text-muted-foreground border-border"
  }
};
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.08, duration: 0.35 },
      className: "bg-card rounded-2xl border border-border p-5 text-center shadow-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground leading-none", children: value }),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary mt-0.5 font-medium", children: sub }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: label })
      ]
    }
  );
}
function StatusDropdown({
  comic,
  onChange
}) {
  const statuses = ["ongoing", "completed", "hiatus"];
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: `text-xs px-2.5 py-1 rounded-full border font-medium transition-smooth ${STATUS_BADGE[comic.status].cls}`,
        "data-ocid": "creator_dashboard.status_toggle",
        children: [
          STATUS_BADGE[comic.status].label,
          " ▾"
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[110px]", children: statuses.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => {
          onChange(comic.id, s);
          setOpen(false);
        },
        className: `w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors ${comic.status === s ? "text-primary" : "text-foreground"}`,
        "data-ocid": `creator_dashboard.status.${s}`,
        children: STATUS_BADGE[s].label
      },
      s
    )) })
  ] });
}
function ChapterOptionsMenu({
  chapter: _chapter,
  idx,
  canDelete,
  isPublished,
  anyLoading,
  onPublish,
  onUnpublish,
  onDelete,
  onEditTitle,
  forceOpen,
  onForceOpenChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  const menuRef = reactExports.useRef(null);
  const isMenuOpen = open || forceOpen;
  reactExports.useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        onForceOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen, onForceOpenChange]);
  const close = () => {
    setOpen(false);
    onForceOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: menuRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Chapter options",
        "aria-expanded": isMenuOpen,
        className: "h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0",
        onClick: () => setOpen((v) => !v),
        "data-ocid": `creator_dashboard.chapter.menu_button.${idx + 1}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "w-4 h-4" })
      }
    ),
    isMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute right-0 top-full mt-1.5 z-50 min-w-[170px] rounded-2xl border border-border/70 bg-card shadow-lg overflow-hidden",
        style: { backdropFilter: "blur(16px)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-primary/10 transition-colors",
              onClick: () => {
                onEditTitle();
                close();
              },
              "data-ocid": `creator_dashboard.chapter.edit_title.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                "Edit Title"
              ]
            }
          ),
          isPublished ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: anyLoading,
              className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50",
              onClick: () => {
                onUnpublish();
                close();
              },
              "data-ocid": `creator_dashboard.chapter.unpublish.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                "Unpublish"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: anyLoading,
              className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50",
              onClick: () => {
                onPublish();
                close();
              },
              "data-ocid": `creator_dashboard.chapter.publish.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                "Publish"
              ]
            }
          ),
          canDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border/60 mx-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled: anyLoading,
                className: "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50",
                onClick: () => {
                  onDelete();
                  close();
                },
                "data-ocid": `creator_dashboard.chapter.delete_button.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  "Delete Chapter"
                ]
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function EditTitleInline({
  chapter,
  onSave,
  onCancel
}) {
  const [value, setValue] = reactExports.useState(chapter.title);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      className: "flex items-center gap-1.5 flex-1 min-w-0",
      onSubmit: (e) => {
        e.preventDefault();
        onSave(value.trim() || chapter.title);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value,
            onChange: (e) => setValue(e.target.value),
            className: "flex-1 min-w-0 text-xs bg-muted/40 border border-primary/30 rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary",
            "data-ocid": `creator_dashboard.chapter.edit_title_input.${String(chapter.id)}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            className: "text-xs text-primary font-semibold px-1.5 hover:underline",
            children: "Save"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            className: "text-xs text-muted-foreground px-1 hover:underline",
            children: "✕"
          }
        )
      ]
    }
  );
}
function ChapterList({
  comicId,
  backendId,
  currentUser
}) {
  const { data: chapters, isLoading } = useListChapters(backendId, false);
  const publishMutation = usePublishChapter();
  const unpublishMutation = useUnpublishChapter();
  const deleteChapterMutation = useDeleteChapter();
  const isActorReady = publishMutation.isActorReady && unpublishMutation.isActorReady && deleteChapterMutation.isActorReady;
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [editTitleTarget, setEditTitleTarget] = reactExports.useState(null);
  const [longPressMenuId, setLongPressMenuId] = reactExports.useState(null);
  const longPressTimer = reactExports.useRef(null);
  const longPressFired = reactExports.useRef(false);
  const clearLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  };
  if (!backendId)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-3 text-xs text-muted-foreground text-center", children: "Save to backend first to manage chapters." });
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-3 text-xs text-muted-foreground text-center", children: "Loading chapters..." });
  if (!chapters || chapters.length === 0)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-3 text-xs text-muted-foreground text-center", children: "No chapters yet. Click “+ Chapter” to add one." });
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const chapterId = String(deleteTarget.id);
    deleteChapterMutation.mutate(
      { id: deleteTarget.id, comicId: backendId ?? void 0 },
      {
        onSuccess: () => {
          const label = deleteTarget.title || `Chapter ${String(deleteTarget.chapterNumber)}`;
          ue.success(`"${label}" deleted successfully`);
          try {
            localStorage.removeItem(`ur_scroll_${chapterId}`);
          } catch {
          }
          setDeleteTarget(null);
        },
        onError: (err) => {
          const reason = err.message ?? "Unknown error";
          const msg = reason.toLowerCase().includes("unauthorized") ? "You don’t have permission to delete this chapter" : `Delete failed: ${reason}`;
          ue.error(msg);
          setDeleteTarget(null);
        }
      }
    );
  };
  const handleEditTitleSave = (_chapter, newTitle) => {
    ue.success(`Title updated to "${newTitle}"`);
    setEditTitleTarget(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mt-2 space-y-1.5",
        "data-ocid": `creator_dashboard.chapter_list.${comicId}`,
        children: chapters.map((ch, idx) => {
          const isPublished = ch.chapterStatus === "published";
          const anyLoading = !isActorReady || publishMutation.isPending || unpublishMutation.isPending || deleteChapterMutation.isPending;
          const canDelete = !!currentUser && (currentUser.role === "owner" || String(ch.creatorId) === currentUser.id);
          const isEditing = editTitleTarget === ch.id;
          const isLongPressOpen = longPressMenuId === ch.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50 transition-colors hover:bg-muted/50",
              "data-ocid": `creator_dashboard.chapter.item.${idx + 1}`,
              onTouchStart: (_e) => {
                longPressFired.current = false;
                clearLongPress();
                longPressTimer.current = setTimeout(() => {
                  longPressFired.current = true;
                  setLongPressMenuId(ch.id);
                  if (navigator.vibrate) navigator.vibrate(40);
                }, 500);
              },
              onTouchEnd: () => {
                clearLongPress();
              },
              onTouchMove: () => {
                clearLongPress();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-14 shrink-0", children: [
                  "Ch. ",
                  String(ch.chapterNumber)
                ] }),
                isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EditTitleInline,
                  {
                    chapter: ch,
                    onSave: (t) => handleEditTitleSave(ch, t),
                    onCancel: () => setEditTitleTarget(null)
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground flex-1 truncate", children: ch.title }),
                !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs px-2 py-0.5 rounded-full font-medium shrink-0 border ${isPublished ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`,
                    "data-ocid": `creator_dashboard.chapter.status.${idx + 1}`,
                    children: isPublished ? "Live" : "Draft"
                  }
                ),
                !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChapterOptionsMenu,
                  {
                    chapter: ch,
                    idx,
                    canDelete,
                    isPublished,
                    anyLoading,
                    onPublish: () => publishMutation.mutate(ch.id, {
                      onSuccess: () => ue.success(
                        `Chapter ${String(ch.chapterNumber)} is now live! 🎉`
                      ),
                      onError: (err) => ue.error(
                        `Publish failed: ${err.message ?? "Please try again"}`
                      )
                    }),
                    onUnpublish: () => unpublishMutation.mutate(ch.id, {
                      onSuccess: () => ue.success(
                        `Chapter ${String(ch.chapterNumber)} unpublished`
                      ),
                      onError: (err) => ue.error(
                        `Unpublish failed: ${err.message ?? "Please try again"}`
                      )
                    }),
                    onDelete: () => setDeleteTarget(ch),
                    onEditTitle: () => setEditTitleTarget(ch.id),
                    forceOpen: isLongPressOpen,
                    onForceOpenChange: (v) => {
                      if (!v) setLongPressMenuId(null);
                    }
                  }
                )
              ]
            },
            String(ch.id)
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteChapterDialog,
      {
        isOpen: !!deleteTarget,
        onClose: () => !deleteChapterMutation.isPending && setDeleteTarget(null),
        onConfirm: handleDeleteConfirm,
        chapterTitle: deleteTarget ? `${deleteTarget.title || `Chapter ${String(deleteTarget.chapterNumber)}`}` : "",
        isDeleting: deleteChapterMutation.isPending
      }
    )
  ] });
}
function ComicRow({
  comic,
  index,
  onDelete,
  onStatusChange
}) {
  const navigate = useNavigate();
  const [showChapters, setShowChapters] = reactExports.useState(false);
  const backendId = comic.backendId ?? null;
  const { currentUser } = useAppStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06, duration: 0.3 },
      className: "bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-smooth overflow-hidden",
      "data-ocid": `creator_dashboard.comic.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: comic.coverImage,
                alt: comic.title,
                className: "w-14 h-20 object-cover rounded-xl",
                onError: (e) => {
                  e.target.src = "/assets/generated/cover-lost-realm.dim_400x600.jpg";
                }
              }
            ),
            comic.isFeatured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1.5 -right-1.5 text-xs", children: "⭐" }),
            comic.isTrending && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-1.5 -right-1.5 text-xs", children: "🔥" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground truncate max-w-[200px]", children: comic.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDropdown, { comic, onChange: onStatusChange })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: comic.genres.slice(0, 3).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs rounded-full py-0",
                children: g
              },
              g
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3" }),
                formatNumber(comic.views)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3 h-3" }),
                formatNumber(comic.likes)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3 h-3" }),
                comic.chapters.length,
                " ch"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-amber-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-3 h-3" }),
                formatNumber(Math.floor(comic.views / 10))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setShowChapters((v) => !v),
                className: "mt-1.5 text-xs text-primary hover:underline",
                "data-ocid": `creator_dashboard.show_chapters_button.${index + 1}`,
                children: showChapters ? "Hide chapters" : "Manage chapters"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "rounded-xl text-xs gap-1 h-8 px-3",
                onClick: () => void navigate({
                  to: "/create",
                  search: { edit: comic.id }
                }),
                "data-ocid": `creator_dashboard.edit_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-3 h-3" }),
                  " Edit"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "rounded-xl text-xs gap-1 h-8 px-3",
                onClick: () => void navigate({
                  to: "/create",
                  search: { edit: comic.id, addChapter: "1" }
                }),
                "data-ocid": `creator_dashboard.add_chapter_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                  " Chapter"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "rounded-xl text-xs gap-1 h-8 px-3 text-destructive hover:bg-destructive/10",
                onClick: () => onDelete(comic.id, comic.title),
                "data-ocid": `creator_dashboard.delete_button.${index + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" }),
                  " Delete"
                ]
              }
            )
          ] })
        ] }),
        showChapters && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChapterList,
          {
            comicId: comic.id,
            backendId,
            currentUser
          }
        ) })
      ]
    }
  );
}
function CreatorDashboardPage() {
  const {
    currentUser,
    comics,
    deleteComic: deleteComicStore,
    updateComic
  } = useAppStore();
  const deleteComicMutation = useDeleteComic();
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const myComics = comics.filter((c) => c.creatorId === (currentUser == null ? void 0 : currentUser.id));
  const totalViews = myComics.reduce((a, c) => a + c.views, 0);
  const totalLikes = myComics.reduce((a, c) => a + c.likes, 0);
  const totalCoins = Math.floor(totalViews / 10);
  const totalChapters = myComics.reduce((a, c) => a + c.chapters.length, 0);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const comic = myComics.find((c) => c.id === deleteTarget.id);
    const backendId = comic == null ? void 0 : comic.backendId;
    deleteComicStore(deleteTarget.id);
    setDeleteTarget(null);
    try {
      if (backendId) await deleteComicMutation.mutateAsync(backendId);
      ue.success(`“${deleteTarget.title}” deleted`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      ue.error(`Delete failed: ${msg}. Please try again.`);
    }
  };
  const handleStatusChange = (id, status) => {
    updateComic(id, { status });
    ue.success(`Status updated to ${status}`);
  };
  if (!currentUser) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-md mx-auto px-4 py-24 text-center",
        "data-ocid": "creator_dashboard.login_prompt",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl mb-4", children: "🔐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-2", children: "Sign in to continue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "You need to be logged in to access your Creator Dashboard." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "gradient-primary text-primary-foreground border-0 rounded-xl", children: "Sign In" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-10",
      "data-ocid": "creator_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground", children: "Creator Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1", children: [
              "Welcome back,",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: currentUser.username })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/create", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "gradient-primary text-primary-foreground border-0 rounded-xl gap-2 shadow-glow",
              "data-ocid": "creator_dashboard.create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                " New Comic"
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: BookOpen,
              label: "Total Comics",
              value: myComics.length,
              index: 0
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: Eye,
              label: "Total Views",
              value: formatNumber(totalViews),
              index: 1
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: Heart,
              label: "Total Likes",
              value: formatNumber(totalLikes),
              index: 2
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: Coins,
              label: "Coins Earned",
              value: formatNumber(totalCoins),
              sub: `${totalChapters} chapters`,
              index: 3
            }
          )
        ] }),
        totalCoins > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            className: "mb-6 p-4 rounded-2xl gradient-primary text-primary-foreground flex items-center gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm", children: [
                  "You've earned ",
                  formatNumber(totalCoins),
                  " coins from your comics!"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary-foreground/70 mt-0.5", children: "Coins are calculated at 1 coin per 10 views." })
              ] })
            ]
          }
        ),
        myComics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.97 },
            animate: { opacity: 1, scale: 1 },
            className: "text-center py-20 bg-card rounded-3xl border border-border",
            "data-ocid": "creator_dashboard.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-5xl mb-4", children: "📚" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-foreground mb-2", children: "No comics yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 max-w-xs mx-auto", children: "Upload your first comic and start growing your audience today." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/create", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  className: "gradient-primary text-primary-foreground border-0 rounded-xl gap-2",
                  "data-ocid": "creator_dashboard.create_first_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                    " Create Your First Comic"
                  ]
                }
              ) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: myComics.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ComicRow,
          {
            comic,
            index: i,
            onDelete: (id, title) => setDeleteTarget({ id, title }),
            onStatusChange: handleStatusChange
          },
          comic.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dialog,
          {
            open: !!deleteTarget,
            onOpenChange: (open) => !open && setDeleteTarget(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DialogContent,
              {
                className: "rounded-3xl max-w-sm",
                "data-ocid": "creator_dashboard.delete_dialog",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Comic?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
                      "Are you sure you want to delete",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                        "“",
                        deleteTarget == null ? void 0 : deleteTarget.title,
                        "”"
                      ] }),
                      "? This action cannot be undone."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        onClick: () => setDeleteTarget(null),
                        className: "rounded-xl",
                        "data-ocid": "creator_dashboard.delete_cancel_button",
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "destructive",
                        onClick: handleDeleteConfirm,
                        disabled: deleteComicMutation.isPending,
                        className: "rounded-xl gap-2",
                        "data-ocid": "creator_dashboard.delete_confirm_button",
                        children: [
                          deleteComicMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }),
                          "Delete"
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}
export {
  CreatorDashboardPage as default
};
