import { c as createLucideIcon, h as useNavigate, b as useAuth, r as reactExports, j as jsxRuntimeExports, e as Button, q as ue } from "./index-yTllSx9S.js";
import { I as Input } from "./input-B8w6vewP.js";
import { L as Label } from "./label-Br_a15_J.js";
import { S as Skeleton } from "./skeleton-KJO8djK4.js";
import { T as Textarea } from "./textarea-CSHcqIe3.js";
import { u as useProfile, a as useUpdateProfile } from "./useProfile-BQimzoY_.js";
import { m as motion } from "./proxy-iTRpl-31.js";
import "./useMutation-tUJOmKg9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const MAX_DISPLAY_NAME = 100;
const MAX_BIO = 300;
function EditProfileSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 sm:px-6 py-10 max-w-xl mx-auto",
      "data-ocid": "edit_profile.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-40 bg-purple-900/30 mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-midnight-card rounded-2xl p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-20 h-20 rounded-full bg-purple-900/30 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-purple-900/30 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full bg-purple-900/30 rounded-lg" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-purple-900/30 rounded-lg" })
        ] })
      ]
    }
  );
}
function EditProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  const principalText = (principal == null ? void 0 : principal.toText()) ?? "";
  const { data: profile, isLoading } = useProfile(principalText);
  const updateProfile = useUpdateProfile();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [profilePictureUrl, setProfilePictureUrl] = reactExports.useState("");
  const [avatarPreview, setAvatarPreview] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isLoading, navigate]);
  reactExports.useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setBio(profile.bio ?? "");
      setProfilePictureUrl(profile.profile_picture_url ?? "");
      setAvatarPreview(profile.profile_picture_url ?? null);
    }
  }, [profile]);
  const initials = (displayName || (profile == null ? void 0 : profile.display_name) || "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  function handleAvatarUrlChange(url) {
    setProfilePictureUrl(url);
    setAvatarPreview(url.trim() ? url.trim() : null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!displayName.trim()) {
      ue.error("Display name is required.");
      return;
    }
    try {
      const updated = await updateProfile.mutateAsync({
        display_name: displayName.trim(),
        bio: bio.trim() || void 0,
        profile_picture_url: profilePictureUrl.trim() || void 0
      });
      ue.success("Profile updated!");
      navigate({ to: "/profile/$handle", params: { handle: updated.handle } });
    } catch {
      ue.error("Failed to update profile. Please try again.");
    }
  }
  if (!isAuthenticated && !isLoading) return null;
  if (isLoading || !profile) return /* @__PURE__ */ jsxRuntimeExports.jsx(EditProfileSkeleton, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "px-4 sm:px-6 py-10 max-w-xl mx-auto",
      "data-ocid": "edit_profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({
                to: "/profile/$handle",
                params: { handle: profile.handle }
              }),
              className: "w-9 h-9 rounded-lg bg-card/50 border border-border hover:bg-accent/10 hover:border-accent/30 flex items-center justify-center transition-smooth text-muted-foreground hover:text-accent",
              "aria-label": "Go back to profile",
              "data-ocid": "edit_profile.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Edit Profile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Update your public information" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, "data-ocid": "edit_profile.form", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-midnight-card border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-elevated space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3", children: [
                avatarPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: avatarPreview,
                    alt: "Profile avatar preview",
                    className: "w-20 h-20 rounded-full object-cover border-2 border-accent/40 glow-accent-sm",
                    onError: () => setAvatarPreview(null)
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-20 h-20 rounded-full flex items-center justify-center text-xl font-display font-bold text-white border-2 border-accent/40 glow-accent-sm",
                    style: {
                      background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)"
                    },
                    children: initials
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3 h-3" }),
                  "@",
                  profile.handle
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-1.5",
                  "data-ocid": "edit_profile.display_name_field",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Label,
                        {
                          htmlFor: "displayName",
                          className: "text-sm font-medium text-foreground font-body",
                          children: [
                            "Display Name ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: `text-xs font-body ${displayName.length > MAX_DISPLAY_NAME * 0.9 ? "text-destructive" : "text-muted-foreground"}`,
                          children: [
                            displayName.length,
                            "/",
                            MAX_DISPLAY_NAME
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "displayName",
                        type: "text",
                        value: displayName,
                        onChange: (e) => setDisplayName(e.target.value.slice(0, MAX_DISPLAY_NAME)),
                        placeholder: "Your display name",
                        className: "bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 transition-smooth",
                        maxLength: MAX_DISPLAY_NAME,
                        "data-ocid": "edit_profile.display_name_input"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", "data-ocid": "edit_profile.bio_field", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "bio",
                      className: "text-sm font-medium text-foreground font-body",
                      children: "Bio"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `text-xs font-body ${bio.length > MAX_BIO * 0.9 ? "text-destructive" : "text-muted-foreground"}`,
                      children: [
                        bio.length,
                        "/",
                        MAX_BIO
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "bio",
                    value: bio,
                    onChange: (e) => setBio(e.target.value.slice(0, MAX_BIO)),
                    placeholder: "Tell readers a little about yourself…",
                    rows: 4,
                    className: "bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 resize-none transition-smooth",
                    maxLength: MAX_BIO,
                    "data-ocid": "edit_profile.bio_textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "space-y-1.5",
                  "data-ocid": "edit_profile.avatar_url_field",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Label,
                      {
                        htmlFor: "profilePictureUrl",
                        className: "text-sm font-medium text-foreground font-body",
                        children: "Profile Picture URL"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "profilePictureUrl",
                        type: "url",
                        value: profilePictureUrl,
                        onChange: (e) => handleAvatarUrlChange(e.target.value),
                        placeholder: "https://example.com/avatar.jpg",
                        className: "bg-input/40 border-border/60 focus:border-accent focus:ring-1 focus:ring-accent/50 font-body text-foreground placeholder:text-muted-foreground/60 transition-smooth",
                        "data-ocid": "edit_profile.avatar_url_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Paste a direct image URL to set your avatar." })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: updateProfile.isPending || !displayName.trim(),
                    className: "flex-1 bg-accent hover:bg-accent/85 text-white font-body font-semibold gap-2 transition-smooth disabled:opacity-50",
                    "data-ocid": "edit_profile.submit_button",
                    children: updateProfile.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                      "Saving…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                      "Save Changes"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => navigate({
                      to: "/profile/$handle",
                      params: { handle: profile.handle }
                    }),
                    className: "flex-1 border-border/50 text-muted-foreground hover:text-foreground hover:border-border font-body transition-smooth",
                    "data-ocid": "edit_profile.cancel_button",
                    children: "Cancel"
                  }
                )
              ] }),
              updateProfile.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive font-body text-center",
                  "data-ocid": "edit_profile.error_state",
                  children: "Something went wrong. Please try again."
                }
              )
            ] }) })
          }
        )
      ]
    }
  );
}
export {
  EditProfilePage
};
