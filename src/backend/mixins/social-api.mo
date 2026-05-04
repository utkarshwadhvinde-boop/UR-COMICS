import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import SocialLib "../lib/social";
import Types "../types/users";
import Common "../types/common";

mixin (
  follows : Map.Map<Text, Types.Follow>,
  chapterLikes : Map.Map<Text, Types.ChapterLike>,
  commentReplies : Map.Map<Text, List.List<Types.CommentReply>>,
  nextReplyId : [var Nat],
) {
  public func followUser(followerId : Common.UserId, followeeId : Common.UserId) : async Bool {
    let now = Time.now();
    SocialLib.followUser(follows, followerId, followeeId, now);
  };

  public func unfollowUser(followerId : Common.UserId, followeeId : Common.UserId) : async Bool {
    SocialLib.unfollowUser(follows, followerId, followeeId);
  };

  public query func isFollowing(followerId : Common.UserId, followeeId : Common.UserId) : async Bool {
    SocialLib.isFollowing(follows, followerId, followeeId);
  };

  public query func getFollowers(userId : Common.UserId) : async [Text] {
    SocialLib.getFollowers(follows, userId);
  };

  public query func getFollowing(userId : Common.UserId) : async [Text] {
    SocialLib.getFollowing(follows, userId);
  };

  public func likeChapter(userId : Common.UserId, comicId : Common.ComicId, chapterId : Common.ChapterId) : async Bool {
    let now = Time.now();
    SocialLib.likeChapter(chapterLikes, userId, comicId, chapterId, now);
  };

  public func unlikeChapter(userId : Common.UserId, chapterId : Common.ChapterId) : async Bool {
    SocialLib.unlikeChapter(chapterLikes, userId, chapterId);
  };

  public query func isChapterLiked(userId : Common.UserId, chapterId : Common.ChapterId) : async Bool {
    SocialLib.isChapterLiked(chapterLikes, userId, chapterId);
  };

  public query func getChapterLikeCount(chapterId : Common.ChapterId) : async Nat {
    SocialLib.getChapterLikeCount(chapterLikes, chapterId);
  };

  public func addReply(parentCommentId : Nat, userId : Common.UserId, username : Text, text : Text) : async Types.CommentReply {
    let now = Time.now();
    SocialLib.addReply(commentReplies, nextReplyId, parentCommentId, userId, username, text, now);
  };

  public query func listReplies(parentCommentId : Nat) : async [Types.CommentReply] {
    SocialLib.listReplies(commentReplies, parentCommentId);
  };
};
