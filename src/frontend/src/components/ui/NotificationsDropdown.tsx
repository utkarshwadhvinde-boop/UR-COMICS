import { NotificationType } from "@/backend";
import type { NotificationPublic } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from "lucide-react";

function timeAgo(ts: bigint): string {
  const diff = Date.now() - Number(ts) / 1_000_000;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function notifIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.follow:
      return <UserPlus className="w-4 h-4 text-primary" />;
    case NotificationType.like:
      return <Heart className="w-4 h-4 text-rose-500" />;
    case NotificationType.comment:
    case NotificationType.reply:
      return <MessageCircle className="w-4 h-4 text-blue-400" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
}

function notifText(n: NotificationPublic): string {
  switch (n.notifType) {
    case NotificationType.follow:
      return `${n.actorName} followed you`;
    case NotificationType.like:
      return `${n.actorName} liked your chapter`;
    case NotificationType.comment:
      return n.commentPreview
        ? `${n.actorName} commented: "${n.commentPreview.slice(0, 60)}${n.commentPreview.length > 60 ? "…" : ""}"`
        : `${n.actorName} commented on your comic`;
    case NotificationType.reply:
      return n.commentPreview
        ? `${n.actorName} replied: "${n.commentPreview.slice(0, 60)}${n.commentPreview.length > 60 ? "…" : ""}"`
        : `${n.actorName} replied to your comment`;
    default:
      return `${n.actorName} interacted with your content`;
  }
}

function notifLink(n: NotificationPublic): string {
  if (n.notifType === NotificationType.follow) {
    return `/profile/${n.actorId}`;
  }
  if (n.comicId !== undefined && n.chapterId !== undefined) {
    return `/read/${n.comicId}/${n.chapterId}`;
  }
  if (n.comicId !== undefined) {
    return `/read/${n.comicId}`;
  }
  return "/";
}

interface Props {
  notifications: NotificationPublic[];
  onMarkAllRead: () => void;
  onClose: () => void;
}

export function NotificationsDropdown({
  notifications,
  onMarkAllRead,
  onClose,
}: Props) {
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 animate-scale-in"
      data-ocid="notifications.popover"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">
            Notifications
          </h3>
          {unread > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth px-2 py-1 rounded-lg hover:bg-primary/10"
              data-ocid="notifications.mark_all_read_button"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-smooth px-2 py-1 rounded-lg hover:bg-muted/50"
            data-ocid="notifications.view_all_link"
          >
            View all
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            data-ocid="notifications.empty_state"
          >
            <Bell className="w-10 h-10 mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              You'll see updates here when people interact with you.
            </p>
          </div>
        ) : (
          notifications.slice(0, 20).map((n, i) => (
            <Link
              key={String(n.id)}
              to={notifLink(n)}
              onClick={onClose}
              className={cn(
                "flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-smooth border-b border-border/30 last:border-0 cursor-pointer",
                !n.isRead &&
                  "border-l-2 border-l-primary bg-primary/5 pl-[14px]",
              )}
              data-ocid={`notifications.item.${i + 1}`}
            >
              {/* Actor avatar */}
              <div className="shrink-0 w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {n.actorName[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground line-clamp-2">
                  {notifText(n)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
              <div className="shrink-0 mt-0.5">{notifIcon(n.notifType)}</div>
              {!n.isRead && (
                <div className="absolute right-3 top-4 w-2 h-2 rounded-full bg-primary" />
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
