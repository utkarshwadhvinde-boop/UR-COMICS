import { c as createLucideIcon, e as useParams, b as useAuth, g as useNavigate, j as jsxRuntimeExports, d as Button, B as BookOpen, L as Link } from "./index-DBVmmKIh.js";
import { B as Badge } from "./badge-4nQqznig.js";
import { S as Skeleton } from "./skeleton-CkgraJgd.js";
import { u as useComics } from "./useComics-jJvdMud7.js";
import { u as useProfile } from "./useProfile-DHAC_8Hh.js";
import { m as motion } from "./proxy-DJdLu_xi.js";
import { E as Eye } from "./eye-DjE34-AV.js";
import "./comicsService-BozSeBsV.js";
import "./useMutation-CJ4xUsLW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode);
function ProfileSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 sm:px-6 py-10 max-w-4xl mx-auto",
      "data-ocid": "profile.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-24 rounded-full bg-purple-900/30 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex-1 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-48 bg-purple-900/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28 bg-purple-900/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-sm bg-purple-900/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 max-w-xs bg-purple-900/30" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4", children: Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-midnight-card rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[9/14] bg-purple-900/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 bg-purple-900/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 bg-purple-900/30" })
            ] })
          ] }, i)
        )) })
      ]
    }
  );
}
function ComicCard({
  comic,
  index
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: Math.min(index * 0.07, 0.5) },
      "data-ocid": `profile.comic.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/comics/$comicId",
          params: { comicId: comic.id },
          className: "group block bg-midnight-card rounded-xl overflow-hidden border border-purple-900/20 hover:border-accent/40 transition-colors-fast shadow-card",
          "data-ocid": `profile.comic.link.${index + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full aspect-[9/14] overflow-hidden bg-purple-900/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: comic.cover_blob.getDirectURL(),
                  alt: comic.title,
                  className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                  loading: "lazy"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors-fast", children: comic.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body", children: "View comic" })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function ProfilePage() {
  const { handle } = useParams({ strict: false });
  const { data: profile, isLoading, error, refetch } = useProfile(handle);
  const { data: allComics } = useComics();
  const { principal } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = !!profile && !!principal && profile.auth_id === principal.toText();
  const creatorComics = (allComics ?? []).filter(
    (c) => profile && c.author_id.toText() === profile.auth_id
  );
  const initials = (profile == null ? void 0 : profile.display_name) ? profile.display_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : (handle == null ? void 0 : handle.slice(0, 2).toUpperCase()) ?? "??";
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSkeleton, {});
  if (error || !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] px-4",
        "data-ocid": "profile.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-midnight-card border border-purple-900/30 rounded-2xl p-10 max-w-sm w-full text-center shadow-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-12 h-12 text-destructive mx-auto mb-4 opacity-80" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground mb-2", children: "Profile Not Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-sm mb-6", children: [
            "We couldn't find a profile for",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-accent font-medium", children: [
              "@",
              handle
            ] }),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full border-accent/30 text-accent hover:bg-accent/10",
                onClick: () => refetch(),
                "data-ocid": "profile.retry_button",
                children: "Try Again"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                className: "w-full text-muted-foreground hover:text-foreground",
                onClick: () => navigate({ to: "/" }),
                "data-ocid": "profile.home_button",
                children: "Back to Home"
              }
            )
          ] })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 sm:px-6 py-10 max-w-4xl mx-auto",
      "data-ocid": "profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "bg-midnight-card border border-purple-900/30 rounded-2xl p-6 sm:p-8 mb-8 shadow-elevated",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", "data-ocid": "profile.avatar", children: profile.profile_picture_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: profile.profile_picture_url,
                  alt: profile.display_name,
                  className: "w-24 h-24 rounded-full object-cover border-2 border-accent/40 glow-accent-sm"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-24 h-24 rounded-full flex items-center justify-center text-2xl font-display font-bold text-white border-2 border-accent/40 glow-accent-sm",
                  style: {
                    background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)"
                  },
                  children: initials
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-center sm:text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-3xl font-bold text-foreground truncate", children: profile.display_name }),
                  profile.is_creator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-1.5 bg-accent text-white text-xs px-3 py-1 rounded-full font-bold tracking-wide shrink-0",
                      "data-ocid": "profile.creator_badge",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-3 h-3" }),
                        "Creator"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-sm mb-3", children: [
                  "@",
                  profile.handle
                ] }),
                profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/80 font-body text-sm leading-relaxed max-w-lg", children: profile.bio })
              ] }),
              isOwnProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/profile/$handle/edit",
                  params: { handle: profile.handle },
                  "data-ocid": "profile.edit_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      className: "border-accent/30 text-accent hover:bg-accent/10 gap-2 transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" }),
                        "Edit Profile"
                      ]
                    }
                  )
                }
              ) })
            ] })
          }
        ),
        profile.is_creator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.section,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.15 },
            "data-ocid": "profile.comics_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-accent" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Published Comics" }),
                creatorComics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: "bg-accent/15 text-accent border-accent/20 font-body",
                    children: creatorComics.length
                  }
                )
              ] }),
              creatorComics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-midnight-card border border-purple-900/20 rounded-xl p-10 text-center",
                  "data-ocid": "profile.comics.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "No published comics yet." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4",
                  "data-ocid": "profile.comics.list",
                  children: creatorComics.map((comic, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ComicCard, { comic, index: i }, comic.id))
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  ProfilePage
};
