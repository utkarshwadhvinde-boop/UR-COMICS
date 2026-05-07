import { i as useParams, u as useAppStore, p as useGetProfile, d as useListComicsQuery, q as useIsFollowing, s as useGetFollowers, t as useGetFollowing, v as useFollowUser, w as useUnfollowUser, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link, f as Button, a as cn, B as BookOpen } from "./index-CK63xfI2.js";
import { C as ComicCard } from "./ComicCard-BVcYwUEO.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DCwfDPJb.js";
import { u as ue } from "./index-DEuOM354.js";
import { m as motion } from "./proxy-CpH_T6lT.js";
import { U as UserCheck, C as Calendar } from "./user-check-BcBGpjeY.js";
import { U as UserPlus } from "./user-plus-WUkf3I6s.js";
import "./eye-BIWL6yox.js";
import "./heart-DJn7e0GP.js";
import "./lock-C7N71VmV.js";
import "./bookmark-Dzj7T4_I.js";
import "./star-Dkq_K0ZL.js";
import "./index-BdPONaf0.js";
function StatBtn({
  value,
  label,
  onClick,
  delay = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      type: "button",
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration: 0.3 },
      onClick,
      className: `text-center px-4 py-3 rounded-2xl bg-card border border-border ${onClick ? "hover:border-primary/50 cursor-pointer" : "cursor-default"} transition-smooth`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
      ]
    }
  );
}
function FollowerListModal({
  title,
  userIds,
  open,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "rounded-2xl sm:max-w-sm",
      "data-ocid": "public_profile.followers_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: title }) }),
        userIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No one yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-72 overflow-y-auto", children: userIds.map((uid, i) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/profile/$userId",
              params: { userId: uid },
              onClick: onClose,
              className: "flex items-center gap-3 p-2 rounded-xl hover:bg-muted/40 transition-smooth",
              "data-ocid": `public_profile.follower_item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0", children: ((_a = uid[0]) == null ? void 0 : _a.toUpperCase()) ?? "U" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate", children: uid })
              ]
            },
            uid
          );
        }) })
      ]
    }
  ) });
}
function PublicProfilePage() {
  var _a;
  const { userId } = useParams({ from: "/profile/$userId" });
  const { currentUser } = useAppStore();
  const viewerId = currentUser == null ? void 0 : currentUser.id;
  const { data: profile, isLoading } = useGetProfile(userId);
  const { data: allComics = [] } = useListComicsQuery();
  const { data: isFollowingNow = false } = useIsFollowing(
    viewerId ?? null,
    userId
  );
  const { data: followers = [] } = useGetFollowers(userId);
  const { data: following = [] } = useGetFollowing(userId);
  const followMut = useFollowUser();
  const unfollowMut = useUnfollowUser();
  const [optimisticFollow, setOptimisticFollow] = reactExports.useState(
    null
  );
  const [followersOpen, setFollowersOpen] = reactExports.useState(false);
  const [followingOpen, setFollowingOpen] = reactExports.useState(false);
  const effectiveFollowing = optimisticFollow ?? isFollowingNow;
  const creatorComics = allComics.filter((c) => c.creatorId === userId);
  const joinDate = (profile == null ? void 0 : profile.createdAt) ? new Date(Number(profile.createdAt) / 1e6).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" }
  ) : "—";
  async function handleFollowToggle() {
    if (!viewerId) {
      ue.error("Sign in to follow creators");
      return;
    }
    setOptimisticFollow(!effectiveFollowing);
    try {
      if (effectiveFollowing) {
        await unfollowMut.mutateAsync({
          followerId: viewerId,
          followeeId: userId
        });
        ue.success("Unfollowed");
      } else {
        await followMut.mutateAsync({
          followerId: viewerId,
          followeeId: userId
        });
        ue.success("Following!");
      }
    } catch {
      setOptimisticFollow(null);
      ue.error("Action failed");
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 py-8 space-y-4",
        "data-ocid": "public_profile.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[3/4] rounded-2xl" }, k)) })
        ]
      }
    );
  }
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-4xl mx-auto px-4 py-16 text-center",
        "data-ocid": "public_profile.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Creator not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 rounded-xl", variant: "outline", children: "Go Home" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-4xl mx-auto px-4 py-8",
      "data-ocid": "public_profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "relative rounded-3xl overflow-hidden mb-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gradient-primary h-28 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border border-t-0 rounded-b-3xl px-6 pb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between -mt-10 mb-4", children: [
                  profile.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: profile.avatarUrl,
                      alt: profile.username,
                      className: "w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-glow"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow border-4 border-card", children: ((_a = profile.username[0]) == null ? void 0 : _a.toUpperCase()) ?? "U" }),
                  viewerId && viewerId !== userId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      className: cn(
                        "rounded-xl mt-2",
                        effectiveFollowing ? "" : "gradient-primary text-primary-foreground border-0"
                      ),
                      variant: effectiveFollowing ? "outline" : "default",
                      onClick: handleFollowToggle,
                      disabled: followMut.isPending || unfollowMut.isPending,
                      "data-ocid": "public_profile.follow_button",
                      children: effectiveFollowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 mr-1.5" }),
                        " Following"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4 mr-1.5" }),
                        " Follow"
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: profile.username }),
                  profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-lg", children: profile.bio }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                    " Joined ",
                    joinDate
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatBtn,
            {
              value: followers.length,
              label: "Followers",
              onClick: () => setFollowersOpen(true),
              delay: 0.05
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatBtn,
            {
              value: following.length,
              label: "Following",
              onClick: () => setFollowingOpen(true),
              delay: 0.1
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatBtn, { value: creatorComics.length, label: "Series", delay: 0.15 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatBtn,
            {
              value: Number(profile.totalLikesReceived),
              label: "Likes",
              delay: 0.2
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
            " Published Series"
          ] }),
          creatorComics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12 bg-card rounded-2xl border border-border",
              "data-ocid": "public_profile.comics_empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 mx-auto mb-3 text-muted-foreground/30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No published series yet" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: creatorComics.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ComicCard,
            {
              comic: {
                id: String(c.id),
                title: c.title,
                description: c.description,
                author: c.author,
                coverImage: c.coverUrl,
                genres: c.genres,
                status: "ongoing",
                likes: Number(c.likesCount),
                views: Number(c.viewsCount),
                rating: 0,
                chapters: [],
                createdAt: Number(c.createdAt),
                updatedAt: Number(c.createdAt),
                isFeatured: c.isFeatured,
                isTrending: c.isTrending,
                isPremium: c.isPremium,
                isPinned: c.isPinned,
                creatorId: c.creatorId,
                isOwnerComic: c.ownerUploaded
              },
              index: i
            },
            String(c.id)
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FollowerListModal,
          {
            title: "Followers",
            userIds: followers,
            open: followersOpen,
            onClose: () => setFollowersOpen(false)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FollowerListModal,
          {
            title: "Following",
            userIds: following,
            open: followingOpen,
            onClose: () => setFollowingOpen(false)
          }
        )
      ]
    }
  );
}
export {
  PublicProfilePage as default
};
