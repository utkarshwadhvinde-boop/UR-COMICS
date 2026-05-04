import Common "common";

module {
  public type ReadingProgress = {
    comicId : Common.ComicId;
    chapterId : Common.ChapterId;
    scrollPosition : Nat;
    lastReadAt : Common.Timestamp;
  };

  public type Comment = {
    id : Nat;
    userId : Common.UserId;
    comicId : Common.ComicId;
    chapterId : ?Common.ChapterId;
    text : Text;
    createdAt : Common.Timestamp;
  };

  // Mutable internal user profile
  public type UserProfile = {
    id : Common.UserId;
    var username : Text;
    var avatarUrl : ?Text;
    var bio : ?Text;
    createdAt : Common.Timestamp;
    var followerCount : Nat;
    var followingCount : Nat;
    var totalSeries : Nat;
    var totalLikesReceived : Nat;
    var totalCommentsReceived : Nat;
  };

  // Shared (immutable) version for API boundary
  public type UserProfilePublic = {
    id : Common.UserId;
    username : Text;
    avatarUrl : ?Text;
    bio : ?Text;
    createdAt : Common.Timestamp;
    followerCount : Nat;
    followingCount : Nat;
    totalSeries : Nat;
    totalLikesReceived : Nat;
    totalCommentsReceived : Nat;
  };

  public type Follow = {
    followerId : Common.UserId;
    followeeId : Common.UserId;
    createdAt : Common.Timestamp;
  };

  public type ChapterLike = {
    userId : Common.UserId;
    chapterId : Common.ChapterId;
    comicId : Common.ComicId;
    createdAt : Common.Timestamp;
  };

  public type CommentReply = {
    id : Nat;
    parentCommentId : Nat;
    userId : Common.UserId;
    username : Text;
    text : Text;
    createdAt : Common.Timestamp;
  };

  public type NotificationType = {
    #follow;
    #like;
    #comment;
    #reply;
  };

  public type Notification = {
    id : Nat;
    userId : Common.UserId;
    notifType : NotificationType;
    actorId : Common.UserId;
    actorName : Text;
    comicId : ?Common.ComicId;
    chapterId : ?Common.ChapterId;
    commentPreview : ?Text;
    createdAt : Common.Timestamp;
    var isRead : Bool;
  };

  // Shared (immutable) version for API boundary
  public type NotificationPublic = {
    id : Nat;
    userId : Common.UserId;
    notifType : NotificationType;
    actorId : Common.UserId;
    actorName : Text;
    comicId : ?Common.ComicId;
    chapterId : ?Common.ChapterId;
    commentPreview : ?Text;
    createdAt : Common.Timestamp;
    isRead : Bool;
  };
};
