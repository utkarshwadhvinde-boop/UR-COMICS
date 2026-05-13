import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type NotificationPublic,
  useGetNotifications,
  useMarkAllRead,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

type FilterTab = "all" | "follows" | "likes" | "comments";

export default function NotificationsPage() {
  const { currentUser } = useAppStore();
  const userId = currentUser?.id ?? null;

  const { data: backendNotifs = [] } = useGetNotifications(userId);
  const markAllReadMutation = useMarkAllRead();
  const clearAllMutation = useClearNotifications();

  const [tab, setTab] = useState<FilterTab>("all");

  // Map NotificationPublic to Notification-like shape for rendering
  const notifs: NotificationPublic[] = backendNotifs;

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

  function getNotifText(n: NotificationPublic): string {
    switch (n.notifType) {
      case "like":
        return `${n.actorName} liked your chapter`;
      case "follow":
        return `${n.actorName} started following you`;
      case "comment":
        return `${n.actorName} commented on your chapter${
          n.commentPreview ? `: "${n.commentPreview}"` : ""
        }`;
      case "reply":
        return `${n.actorName} replied to your comment${
          n.commentPreview ? `: "${n.commentPreview}"` : ""
        }`;
      default:
        return `New activity from ${n.actorName}`;
    }
  }

  function getNotifIcon(type: string) {
    switch (type) {
      case "like":
        return (
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
        );
      case "follow":
        return (
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-green-500" />
          </div>
        );
      case "comment":
      case "reply":
        return (
          <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-sky-400" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
        );
    }
  }

  function getNotifLink(n: NotificationPublic): string {
    if (n.comicId != null && n.chapterId != null)
      return `/read/${String(n.comicId)}/${String(n.chapterId)}`;
    return "/";
  }

  function timeAgo(ts: bigint): string {
    const diff = Date.now() - Number(ts) / 1_000_000;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8" data-ocid="notifications.page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
              onClick={handleMarkAllRead}
              data-ocid="notifications.mark_all_read_button"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Mark all read
            </Button>
          )}
          {notifs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs text-muted-foreground hover:text-destructive"
              onClick={handleClearAll}
              data-ocid="notifications.clear_all_button"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as FilterTab)}
        className="mb-6"
        data-ocid="notifications.filter_tabs"
      >
        <TabsList className="w-full rounded-2xl bg-muted/40">
          <TabsTrigger
            value="all"
            className="flex-1 rounded-xl text-xs"
            data-ocid="notifications.tab.all"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="follows"
            className="flex-1 rounded-xl text-xs"
            data-ocid="notifications.tab.follows"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Follows
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex-1 rounded-xl text-xs"
            data-ocid="notifications.tab.likes"
          >
            <Heart className="w-3.5 h-3.5 mr-1" /> Likes
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="flex-1 rounded-xl text-xs"
            data-ocid="notifications.tab.comments"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> Comments
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="notifications.empty_state"
        >
          <Bell className="w-12 h-12 mb-4 text-muted-foreground/30" />
          <h3 className="font-semibold text-base text-foreground mb-1">
            No notifications yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {tab === "all"
              ? "You'll see updates here when people follow you, like your chapters, or leave comments."
              : `No ${tab} notifications yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n, i) => (
            <Link
              key={String(n.id)}
              to={getNotifLink(n) as "/"}
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/40 transition-smooth cursor-pointer",
                !n.isRead && "border-l-2 border-l-primary pl-[14px]",
              )}
              data-ocid={`notifications.item.${i + 1}`}
            >
              <div className="shrink-0">{getNotifIcon(n.notifType)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2">
                  {getNotifText(n)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
              {!n.isRead && (
                <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
