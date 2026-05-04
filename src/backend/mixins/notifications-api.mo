import List "mo:core/List";
import NotificationsLib "../lib/notifications";
import Types "../types/users";
import Common "../types/common";

mixin (
  notifications : List.List<Types.Notification>,
  nextNotificationId : [var Nat],
) {
  public query func getNotifications(userId : Common.UserId) : async [Types.NotificationPublic] {
    NotificationsLib.getNotifications(notifications, userId);
  };

  public query func getUnreadCount(userId : Common.UserId) : async Nat {
    NotificationsLib.getUnreadCount(notifications, userId);
  };

  public func markRead(userId : Common.UserId, notificationId : Nat) : async Bool {
    NotificationsLib.markRead(notifications, userId, notificationId);
  };

  public func markAllRead(userId : Common.UserId) : async () {
    NotificationsLib.markAllRead(notifications, userId);
  };

  public func clearNotifications(userId : Common.UserId) : async () {
    NotificationsLib.clearAll(notifications, userId);
  };
};
