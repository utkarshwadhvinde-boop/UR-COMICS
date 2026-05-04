import { c as createLucideIcon, u as useAppStore, i as useParams, j as jsxRuntimeExports, r as reactExports, f as Button, I as Input, p as useGetProfile, d as useListComicsQuery, q as useIsFollowing, s as useGetFollowers, t as useGetFollowing, v as useFollowUser, w as useUnfollowUser, S as Skeleton, L as Link, B as BookOpen, k as useNavigate, x as useCreateOrUpdateProfile } from "./index-DQm835mL.js";
import { C as ComicCard } from "./ComicCard-8xhQkcbF.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BeX4prYE.js";
import { L as Label } from "./label-nMtDNFqD.js";
import { S as Separator } from "./separator-DA4aefxj.js";
import { T as Textarea } from "./textarea-CLsHCDHV.js";
import { k as useListComics } from "./useComicBackend-DMAMt6h5.js";
import { u as ue } from "./index-BRQtRT0O.js";
import { m as motion } from "./proxy-9B-g8um5.js";
import { U as UserCheck, C as Calendar } from "./user-check-DtbwVojf.js";
import { U as UserPlus } from "./user-plus-YiMguDXm.js";
import { S as SquarePen } from "./square-pen-5EYdovAP.js";
import { L as LogOut } from "./log-out-BmJkFrWG.js";
import { T as Trash2 } from "./trash-2-Cnh_sq0O.js";
import "./eye-B0pjcWv-.js";
import "./heart-CKlFNQfD.js";
import "./lock-66qTUYAW.js";
import "./bookmark-DS609kzg.js";
import "./star-CI9Tq7-M.js";
import "./index-C0jj4Te_.js";
import "./index-DaC-jt_4.js";
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
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);
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
      "data-ocid": "profile.followers_dialog",
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
              "data-ocid": `profile.follower_item.${i + 1}`,
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
function OwnProfile() {
  var _a;
  const { currentUser, logout, updateUser } = useAppStore();
  const userId = currentUser == null ? void 0 : currentUser.id;
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetProfile(
    userId ?? null
  );
  const { data: allComics = [] } = useListComics();
  const { data: followers = [] } = useGetFollowers(userId ?? null);
  const { data: following = [] } = useGetFollowing(userId ?? null);
  const updateProfile = useCreateOrUpdateProfile();
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const [deleteOpen, setDeleteOpen] = reactExports.useState(false);
  const [followersOpen, setFollowersOpen] = reactExports.useState(false);
  const [followingOpen, setFollowingOpen] = reactExports.useState(false);
  const [editUsername, setEditUsername] = reactExports.useState((currentUser == null ? void 0 : currentUser.username) ?? "");
  const [editBio, setEditBio] = reactExports.useState((currentUser == null ? void 0 : currentUser.bio) ?? "");
  const [newUsername, setNewUsername] = reactExports.useState((currentUser == null ? void 0 : currentUser.username) ?? "");
  const myComics = allComics.filter((c) => c.creatorId === userId);
  const joinDate = (currentUser == null ? void 0 : currentUser.createdAt) ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  }) : "—";
  async function handleSaveProfile() {
    if (!userId) return;
    try {
      await updateProfile.mutateAsync({
        userId,
        username: editUsername.trim() || ((currentUser == null ? void 0 : currentUser.username) ?? ""),
        bio: editBio.trim() || void 0
      });
      updateUser({ username: editUsername.trim(), bio: editBio.trim() });
      ue.success("Profile updated!");
      setEditOpen(false);
    } catch {
      ue.error("Failed to update profile");
    }
  }
  async function handleSaveUsername() {
    if (!userId || !newUsername.trim()) return;
    try {
      await updateProfile.mutateAsync({
        userId,
        username: newUsername.trim()
      });
      updateUser({ username: newUsername.trim() });
      ue.success("Username updated");
      setSettingsOpen(false);
    } catch {
      ue.error("Failed to update username");
    }
  }
  function handleLogout() {
    logout();
    ue.success("Logged out");
    navigate({ to: "/" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", "data-ocid": "profile.page", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow border-4 border-card", children: (((_a = currentUser == null ? void 0 : currentUser.username) == null ? void 0 : _a[0]) ?? "U").toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "rounded-xl",
                    onClick: () => {
                      setEditUsername((currentUser == null ? void 0 : currentUser.username) ?? "");
                      setEditBio((currentUser == null ? void 0 : currentUser.bio) ?? "");
                      setEditOpen(true);
                    },
                    "data-ocid": "profile.edit_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4 mr-1.5" }),
                      " Edit Profile"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "rounded-xl",
                    onClick: () => setSettingsOpen(true),
                    "data-ocid": "profile.settings_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "rounded-xl text-muted-foreground hover:text-destructive",
                    onClick: handleLogout,
                    "data-ocid": "profile.logout_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: currentUser == null ? void 0 : currentUser.username }),
              (currentUser == null ? void 0 : currentUser.bio) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-lg", children: currentUser.bio }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
                "Joined ",
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
          value: Number((profile == null ? void 0 : profile.followerCount) ?? followers.length),
          label: "Followers",
          onClick: () => setFollowersOpen(true),
          delay: 0.05
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatBtn,
        {
          value: Number((profile == null ? void 0 : profile.followingCount) ?? following.length),
          label: "Following",
          onClick: () => setFollowingOpen(true),
          delay: 0.1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatBtn, { value: myComics.length, label: "Series", delay: 0.15 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatBtn,
        {
          value: Number((profile == null ? void 0 : profile.totalLikesReceived) ?? 0),
          label: "Likes",
          delay: 0.2
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-2xl border border-border p-4 mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Creator Studio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage your comics and chapters" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/creator-dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "rounded-xl",
          "data-ocid": "profile.creator_dashboard_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4 mr-2" }),
            " Dashboard"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary" }),
        " My Series"
      ] }),
      profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[3/4] rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 rounded" })
      ] }, k)) }) : myComics.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-12 bg-card rounded-2xl border border-border",
          "data-ocid": "profile.comics_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-10 h-10 mx-auto mb-3 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No series uploaded yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/create", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "mt-4 rounded-xl gradient-primary text-primary-foreground border-0",
                "data-ocid": "profile.upload_cta_button",
                children: "Upload Series"
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: myComics.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "rounded-2xl sm:max-w-md",
        "data-ocid": "profile.edit_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Edit Profile" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium mb-2 block", children: "Username" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: editUsername,
                  onChange: (e) => setEditUsername(e.target.value),
                  placeholder: "Your username",
                  className: "rounded-xl",
                  "data-ocid": "profile.edit_username_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium mb-2 block", children: "Bio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: editBio,
                  onChange: (e) => setEditBio(e.target.value),
                  placeholder: "Tell the world about yourself...",
                  className: "rounded-xl resize-none",
                  rows: 3,
                  "data-ocid": "profile.edit_bio_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 rounded-xl",
                  onClick: () => setEditOpen(false),
                  "data-ocid": "profile.edit_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "flex-1 rounded-xl gradient-primary text-primary-foreground border-0",
                  onClick: handleSaveProfile,
                  disabled: updateProfile.isPending,
                  "data-ocid": "profile.edit_save_button",
                  children: "Save Changes"
                }
              )
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: settingsOpen, onOpenChange: setSettingsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "rounded-2xl sm:max-w-md",
        "data-ocid": "profile.settings_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Account Settings" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-3.5 h-3.5" }),
                " Change Username"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: newUsername,
                    onChange: (e) => setNewUsername(e.target.value),
                    placeholder: "New username",
                    className: "rounded-xl",
                    "data-ocid": "profile.new_username_input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleSaveUsername,
                    className: "rounded-xl gradient-primary text-primary-foreground border-0 shrink-0",
                    disabled: updateProfile.isPending,
                    "data-ocid": "profile.save_username_button",
                    children: "Save"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide", children: "Danger Zone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: deleteOpen, onOpenChange: setDeleteOpen, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10",
                    onClick: () => setDeleteOpen(true),
                    "data-ocid": "profile.delete_account_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                      " Delete Account"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  DialogContent,
                  {
                    className: "rounded-2xl",
                    "data-ocid": "profile.delete_dialog",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-destructive", children: "Delete Account?" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently delete your account and all saved data." }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "outline",
                            className: "flex-1 rounded-xl",
                            onClick: () => setDeleteOpen(false),
                            "data-ocid": "profile.delete_cancel_button",
                            children: "Cancel"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "destructive",
                            className: "flex-1 rounded-xl",
                            onClick: () => {
                              handleLogout();
                              ue.success("Account deleted");
                            },
                            "data-ocid": "profile.delete_confirm_button",
                            children: "Delete"
                          }
                        )
                      ] })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    ) }),
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
  ] });
}
function PublicProfile({ userId }) {
  var _a;
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
    {
      month: "long",
      year: "numeric"
    }
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
        "data-ocid": "profile.page",
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
        "data-ocid": "profile.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Creator not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 rounded-xl", variant: "outline", children: "Go Home" }) })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", "data-ocid": "profile.page", children: [
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: `rounded-xl mt-2 ${effectiveFollowing ? "" : "gradient-primary text-primary-foreground border-0"}`,
                  variant: effectiveFollowing ? "outline" : "default",
                  onClick: handleFollowToggle,
                  disabled: followMut.isPending || unfollowMut.isPending,
                  "data-ocid": "profile.follow_button",
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
                "Joined ",
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
          value: Number(profile.followerCount),
          label: "Followers",
          onClick: () => setFollowersOpen(true),
          delay: 0.05
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatBtn,
        {
          value: Number(profile.followingCount),
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
          "data-ocid": "profile.comics_empty_state",
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
  ] });
}
function ProfilePage() {
  const { currentUser, isLoggedIn, login, logout } = useAppStore();
  const params = useParams({ strict: false });
  const profileUserId = params.userId ?? null;
  const isOwnProfile = !profileUserId || profileUserId === (currentUser == null ? void 0 : currentUser.id) || profileUserId === "me";
  if (!isLoggedIn && isOwnProfile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, { login, logout });
  }
  if (!isOwnProfile && profileUserId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PublicProfile, { userId: profileUserId });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(OwnProfile, {});
}
function LoginPrompt({
  login
}) {
  const [mode, setMode] = reactExports.useState("login");
  const [open, setOpen] = reactExports.useState(false);
  const [username, setUsername] = reactExports.useState("");
  function handleAuth(e) {
    e.preventDefault();
    if (!username.trim()) {
      ue.error("Enter a username");
      return;
    }
    login({
      id: `user-${Date.now()}`,
      username: username.trim(),
      email: "",
      avatar: "",
      coins: 100,
      bookmarks: [],
      likedComics: [],
      readingHistory: [],
      followedCreators: [],
      dailyStreak: 1,
      lastLogin: Date.now(),
      createdAt: Date.now(),
      role: "user",
      bio: "",
      unlockedChapters: []
    });
    ue.success(
      mode === "signup" ? "Account created! 🎉" : "Welcome back! 👋"
    );
    setOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-[70vh] flex flex-col items-center justify-center px-4",
      "data-ocid": "profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4 },
            className: "text-center max-w-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-4xl font-bold mx-auto mb-5 shadow-glow", children: "U" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground mb-2", children: "Your Profile" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Sign in to access bookmarks, reading history, coins, and more." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "gradient-primary text-primary-foreground border-0 rounded-xl px-6",
                    onClick: () => {
                      setMode("login");
                      setOpen(true);
                    },
                    "data-ocid": "profile.login_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 mr-2" }),
                      " Login"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "rounded-xl px-6",
                    onClick: () => {
                      setMode("signup");
                      setOpen(true);
                    },
                    "data-ocid": "profile.signup_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4 mr-2" }),
                      " Sign Up"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "rounded-2xl sm:max-w-md",
            "data-ocid": "profile.login_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-display", children: mode === "login" ? "Welcome Back 👋" : "Join UR Comics 🎉" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAuth, className: "space-y-4 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Username" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: username,
                      onChange: (e) => setUsername(e.target.value),
                      placeholder: "Your username",
                      className: "mt-1 rounded-xl",
                      "data-ocid": "profile.username_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "w-full gradient-primary text-primary-foreground border-0 rounded-xl h-11",
                    "data-ocid": "profile.auth_submit_button",
                    children: mode === "login" ? "Login" : "Create Account"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "w-full text-sm text-primary hover:underline",
                    onClick: () => setMode(mode === "login" ? "signup" : "login"),
                    children: mode === "login" ? "New here? Create an account" : "Already have an account? Login"
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
export {
  ProfilePage as default
};
