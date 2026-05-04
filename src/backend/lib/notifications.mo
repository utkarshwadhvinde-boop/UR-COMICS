import List "mo:core/List";
import Order "mo:core/Order";
import Types "../types/users";
import Common "../types/common";

module {
  public func toPublic(n : Types.Notification) : Types.NotificationPublic {
    {
      id = n.id;
      userId = n.userId;
      notifType = n.notifType;
      actorId = n.actorId;
      actorName = n.actorName;
      comicId = n.comicId;
      chapterId = n.chapterId;
      commentPreview = n.commentPreview;
      createdAt = n.createdAt;
      isRead = n.isRead;
    };
  };

  public func createNotification(
    notifications : List.List<Types.Notification>,
    nextId : [var Nat],
    userId : Common.UserId,
    notifType : Types.NotificationType,
    actorId : Common.UserId,
    actorName : Text,
    comicId : ?Common.ComicId,
    chapterId : ?Common.ChapterId,
    commentPreview : ?Text,
    now : Common.Timestamp,
  ) : Types.Notification {
    let notif : Types.Notification = {
      id = nextId[0];
      userId = userId;
      notifType = notifType;
      actorId = actorId;
      actorName = actorName;
      comicId = comicId;
      chapterId = chapterId;
      commentPreview = commentPreview;
      createdAt = now;
      var isRead = false;
    };
    nextId[0] += 1;
    notifications.add(notif);
    notif;
  };

  public func getNotifications(
    notifications : List.List<Types.Notification>,
    userId : Common.UserId,
  ) : [Types.NotificationPublic] {
    let filtered = notifications.filter(func(n : Types.Notification) : Bool {
      n.userId == userId;
    });
    let sorted = filtered.sort(func(a : Types.Notification, b : Types.Notification) : Order.Order {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal };
    });
    sorted.map<Types.Notification, Types.NotificationPublic>(toPublic).toArray();
  };

  public func getUnreadCount(
    notifications : List.List<Types.Notification>,
    userId : Common.UserId,
  ) : Nat {
    var count = 0;
    notifications.forEach(func(n : Types.Notification) {
      if (n.userId == userId and not n.isRead) { count += 1 };
    });
    count;
  };

  public func markRead(
    notifications : List.List<Types.Notification>,
    userId : Common.UserId,
    notificationId : Nat,
  ) : Bool {
    var found = false;
    notifications.forEach(func(n : Types.Notification) {
      if (n.userId == userId and n.id == notificationId) {
        n.isRead := true;
        found := true;
      };
    });
    found;
  };

  public func markAllRead(
    notifications : List.List<Types.Notification>,
    userId : Common.UserId,
  ) {
    notifications.forEach(func(n : Types.Notification) {
      if (n.userId == userId) { n.isRead := true };
    });
  };

  public func clearAll(
    notifications : List.List<Types.Notification>,
    userId : Common.UserId,
  ) {
    let filtered = notifications.filter(func(n : Types.Notification) : Bool {
      n.userId != userId;
    });
    notifications.clear();
    notifications.append(filtered);
  };
};
