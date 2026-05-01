import { u as useAppStore, r as reactExports, j as jsxRuntimeExports, L as Link, a as Button, B as BookOpen, f as formatNumber, m as Heart, C as Coins, T as TrendingUp, i as useNavigate, b as Badge } from "./index-BgVxhZ2x.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CK3Mijd_.js";
import { u as ue } from "./index-5IwcxvLb.js";
import { P as Plus } from "./plus-_OKKqmu9.js";
import { E as Eye } from "./eye-BI0bfbT1.js";
import { m as motion } from "./proxy-Dz0zqHZy.js";
import { S as SquarePen } from "./square-pen-DCqGOefw.js";
import { T as Trash2 } from "./trash-2-Cvc_iP1l.js";
import "./index-DzUsK6bF.js";
import "./index-ClD3NfkI.js";
import "./index-Z3-QW_0S.js";
const STATUS_BADGE = {
  ongoing: {
    label: "Ongoing",
    class: "bg-primary/10 text-primary border-primary/20"
  },
  completed: {
    label: "Completed",
    class: "bg-accent/10 text-accent border-accent/20"
  },
  hiatus: {
    label: "Hiatus",
    class: "bg-muted text-muted-foreground border-border"
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
function StatusToggle({
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
        className: `text-xs px-2.5 py-1 rounded-full border font-medium transition-smooth ${STATUS_BADGE[comic.status].class}`,
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
function ComicRow({
  comic,
  index,
  onDelete,
  onStatusChange
}) {
  const navigate = useNavigate();
  const coinsEarned = Math.floor(comic.views / 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -16 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.06, duration: 0.3 },
      className: "flex items-center gap-4 bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-smooth",
      "data-ocid": `creator_dashboard.comic.item.${index + 1}`,
      children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusToggle, { comic, onChange: onStatusChange })
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
              formatNumber(coinsEarned)
            ] })
          ] })
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
      ]
    }
  );
}
function CreatorDashboardPage() {
  const { currentUser, comics, deleteComic, updateComic } = useAppStore();
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const myComics = comics.filter((c) => c.creatorId === (currentUser == null ? void 0 : currentUser.id));
  const totalViews = myComics.reduce((a, c) => a + c.views, 0);
  const totalLikes = myComics.reduce((a, c) => a + c.likes, 0);
  const totalCoins = Math.floor(totalViews / 10);
  const totalChapters = myComics.reduce((a, c) => a + c.chapters.length, 0);
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteComic(deleteTarget.id);
    ue.success(`"${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
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
                        '"',
                        deleteTarget == null ? void 0 : deleteTarget.title,
                        '"'
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "destructive",
                        onClick: handleDeleteConfirm,
                        className: "rounded-xl",
                        "data-ocid": "creator_dashboard.delete_confirm_button",
                        children: "Delete"
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
