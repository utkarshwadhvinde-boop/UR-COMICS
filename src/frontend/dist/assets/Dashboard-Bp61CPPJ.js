import { c as createLucideIcon, b as useAuth, i as useActor, o as useQueryClient, r as reactExports, j as jsxRuntimeExports, e as Button, L as Link, E as ErrorFallback, B as BookOpen, q as ue, m as createActor } from "./index-yTllSx9S.js";
import { T as Trash2, C as ConfirmModal } from "./ConfirmModal-hLaobN6f.js";
import { a as SkeletonCard } from "./SkeletonCard-DZnBV3vF.js";
import { B as Badge } from "./badge-gMMAzD3C.js";
import { u as useComics, C as COMICS_QUERY_KEY } from "./useComics-C6OQouxy.js";
import { u as useProfile } from "./useProfile-BQimzoY_.js";
import { d as deleteComic } from "./comicsService-DtcN4hqc.js";
import { P as Plus } from "./plus-DwDoWbcb.js";
import { m as motion } from "./proxy-iTRpl-31.js";
import { E as Eye } from "./eye-pAWFObfA.js";
import "./x-s5adJLBT.js";
import "./skeleton-KJO8djK4.js";
import "./useMutation-tUJOmKg9.js";
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
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode);
function CreatorDashboardPage() {
  const { data: comics, isLoading, isError, refetch } = useComics();
  const { principal } = useAuth();
  const { actor } = useActor(createActor);
  const principalStr = (principal == null ? void 0 : principal.toString()) ?? "";
  const { data: profile } = useProfile(principalStr);
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const myComics = (comics == null ? void 0 : comics.filter(
    (c) => principal && c.author_id.toString() === principal.toString()
  )) ?? [];
  const handleDelete = async () => {
    if (!deleteTarget || !actor) return;
    setIsDeleting(true);
    const previous = queryClient.getQueryData(COMICS_QUERY_KEY);
    queryClient.setQueryData(
      COMICS_QUERY_KEY,
      (old) => (old ?? []).filter((c) => c.id !== deleteTarget)
    );
    try {
      await deleteComic(actor, deleteTarget);
      await queryClient.invalidateQueries({ queryKey: COMICS_QUERY_KEY });
      ue.success("Comic deleted.");
    } catch {
      queryClient.setQueryData(COMICS_QUERY_KEY, previous);
      ue.error("Failed to delete comic.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10",
      "data-ocid": "creator_dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-foreground", children: "Creator Studio" }),
              (profile == null ? void 0 : profile.is_creator) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "bg-accent text-white text-xs px-3 py-1 rounded-full font-body font-medium",
                  "data-ocid": "creator_dashboard.creator_badge",
                  children: "Creator"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Manage your comics and chapters" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              className: "bg-accent text-accent-foreground hover:bg-accent/90",
              "data-ocid": "creator_dashboard.new_comic_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/creator/comics/new", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                " New Comic"
              ] })
            }
          )
        ] }),
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) }),
        isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ErrorFallback,
          {
            message: "Failed to load your comics.",
            onRetry: () => refetch()
          }
        ),
        !isLoading && !isError && myComics.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            className: "flex flex-col items-center justify-center py-24 gap-4",
            "data-ocid": "creator_dashboard.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-14 h-14 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-base text-muted-foreground", children: "You haven't created any comics yet." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  className: "bg-accent text-accent-foreground hover:bg-accent/90",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/creator/comics/new", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                    " Create your first comic"
                  ] })
                }
              )
            ]
          }
        ),
        !isLoading && !isError && myComics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5", children: myComics.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: {
              delay: i * 0.07,
              type: "spring",
              stiffness: 280,
              damping: 24
            },
            className: "rounded-xl overflow-hidden bg-card border border-purple-900/40 hover:border-accent/60 group flex flex-col",
            "data-ocid": `creator_dashboard.comics.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: comic.cover_blob.getDirectURL(),
                    alt: comic.title,
                    className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      asChild: true,
                      size: "sm",
                      variant: "secondary",
                      className: "w-full text-xs",
                      "data-ocid": `creator_dashboard.view_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/comics/$comicId", params: { comicId: comic.id }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5 mr-1.5" }),
                        " Preview"
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "ghost",
                      onClick: () => setDeleteTarget(comic.id),
                      className: "w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10",
                      "data-ocid": `creator_dashboard.delete_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 mr-1.5" }),
                        " Delete"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm text-foreground line-clamp-2 leading-snug", children: comic.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "text-[10px] px-1.5 py-0 w-fit",
                    children: "Comic"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    asChild: true,
                    size: "sm",
                    className: "w-full mt-1 bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-accent-foreground text-xs transition-colors duration-200",
                    "data-ocid": `creator_dashboard.manage_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/creator/comics/$comicId",
                        params: { comicId: comic.id },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-3.5 h-3.5 mr-1.5" }),
                          " Manage"
                        ]
                      }
                    )
                  }
                )
              ] })
            ]
          },
          comic.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConfirmModal,
          {
            open: deleteTarget !== null,
            title: "Delete comic?",
            description: "This will permanently delete the comic and all its chapters. This cannot be undone.",
            confirmLabel: isDeleting ? "Deleting..." : "Delete Comic",
            onConfirm: handleDelete,
            onCancel: () => setDeleteTarget(null),
            destructive: true
          }
        )
      ]
    }
  );
}
export {
  CreatorDashboardPage
};
