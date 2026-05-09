import { c as createLucideIcon, u as useAppStore, F as useGetNotifications, G as useMarkAllRead, H as useClearNotifications, r as reactExports, j as jsxRuntimeExports, J as Bell, f as Button, L as Link, a as cn } from "./index-BU3WKumI.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-Cjlj7FJZ.js";
import { T as Trash2 } from "./trash-2-BEpePkRK.js";
import { U as UserPlus } from "./user-plus-BAf2w3M5.js";
import { H as Heart } from "./heart-ouCiw-2K.js";
import { M as MessageCircle } from "./message-circle-BejEN3rj.js";
import "./index-OcAYLIxh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode);
function NotificationsPage() {
  const { currentUser } = useAppStore();
  const userId = (currentUser == null ? void 0 : currentUser.id) ?? null;
  const { data: backendNotifs = [] } = useGetNotifications(userId);
  const markAllReadMutation = useMarkAllRead();
  const clearAllMutation = useClearNotifications();
  const [tab, setTab] = reactExports.useState("all");
  const notifs = backendNotifs;
  const filtered = notifs.filter((n) => {
    if (tab === "all") return true;
    if (tab === "follows") return n.notifType === "follow";
    if (tab === "likes") return n.notifType === "like";
    if (tab === "comments")
      return n.notifType === "comment" || n.notifType === "reply";
    return true;
  });
  const unreadCount = notifs.filter((n) => !n.isRead).length;
  function handleMarkAllRead() {
    if (!userId) return;
    markAllReadMutation.mutate(userId);
  }
  function handleClearAll() {
    if (!userId) return;
    clearAllMutation.mutate(userId);
  }
  function getNotifText(n) {
    switch (n.notifType) {
      case "like":
        return `${n.actorName} liked your chapter`;
      case "follow":
        return `${n.actorName} started following you`;
      case "comment":
        return `${n.actorName} commented on your chapter${n.commentPreview ? `: "${n.commentPreview}"` : ""}`;
      case "reply":
        return `${n.actorName} replied to your comment${n.commentPreview ? `: "${n.commentPreview}"` : ""}`;
      default:
        return `New activity from ${n.actorName}`;
    }
  }
  function getNotifIcon(type) {
    switch (type) {
      case "like":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5 text-rose-500" }) });
      case "follow":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-5 h-5 text-green-500" }) });
      case "comment":
      case "reply":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-5 h-5 text-sky-400" }) });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-primary" }) });
    }
  }
  function getNotifLink(n) {
    if (n.comicId != null && n.chapterId != null)
      return `/read/${String(n.comicId)}/${String(n.chapterId)}`;
    return "/";
  }
  function timeAgo(ts) {
    const diff = Date.now() - Number(ts) / 1e6;
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", "data-ocid": "notifications.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            unreadCount,
            " unread"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "rounded-xl text-xs",
            onClick: handleMarkAllRead,
            "data-ocid": "notifications.mark_all_read_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
              " Mark all read"
            ]
          }
        ),
        notifs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "rounded-xl text-xs text-muted-foreground hover:text-destructive",
            onClick: handleClearAll,
            "data-ocid": "notifications.clear_all_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 mr-1.5" }),
              " Clear all"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        value: tab,
        onValueChange: (v) => setTab(v),
        className: "mb-6",
        "data-ocid": "notifications.filter_tabs",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full rounded-2xl bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "all",
              className: "flex-1 rounded-xl text-xs",
              "data-ocid": "notifications.tab.all",
              children: "All"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "follows",
              className: "flex-1 rounded-xl text-xs",
              "data-ocid": "notifications.tab.follows",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-3.5 h-3.5 mr-1" }),
                " Follows"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "likes",
              className: "flex-1 rounded-xl text-xs",
              "data-ocid": "notifications.tab.likes",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3.5 h-3.5 mr-1" }),
                " Likes"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "comments",
              className: "flex-1 rounded-xl text-xs",
              "data-ocid": "notifications.tab.comments",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "w-3.5 h-3.5 mr-1" }),
                " Comments"
              ]
            }
          )
        ] })
      }
    ),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "notifications.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-12 h-12 mb-4 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-base text-foreground mb-1", children: "No notifications yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: tab === "all" ? "You'll see updates here when people follow you, like your chapters, or leave comments." : `No ${tab} notifications yet.` })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: getNotifLink(n),
        className: cn(
          "relative flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-smooth cursor-pointer",
          !n.isRead && "border-l-2 border-l-primary pl-[14px]"
        ),
        "data-ocid": `notifications.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: getNotifIcon(n.notifType) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground line-clamp-2", children: getNotifText(n) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: timeAgo(n.createdAt) })
          ] }),
          !n.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-4 w-2 h-2 rounded-full bg-primary shrink-0" })
        ]
      },
      String(n.id)
    )) })
  ] });
}
export {
  NotificationsPage as default
};
