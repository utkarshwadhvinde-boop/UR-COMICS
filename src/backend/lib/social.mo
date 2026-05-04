import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/users";
import Common "../types/common";

module {
  // follow key: "followerId:followeeId"
  func followKey(followerId : Text, followeeId : Text) : Text {
    followerId # ":" # followeeId;
  };

  // chapterLike key: "userId:chapterId"
  func chapterLikeKey(userId : Text, chapterId : Nat) : Text {
    userId # ":" # debug_show(chapterId);
  };

  public func followUser(
    follows : Map.Map<Text, Types.Follow>,
    followerId : Common.UserId,
    followeeId : Common.UserId,
    now : Common.Timestamp,
  ) : Bool {
    let key = followKey(followerId, followeeId);
    switch (follows.get(key)) {
      case (?_) { false }; // already following
      case null {
        let follow : Types.Follow = {
          followerId = followerId;
          followeeId = followeeId;
          createdAt = now;
        };
        follows.add(key, follow);
        true;
      };
    };
  };

  public func unfollowUser(
    follows : Map.Map<Text, Types.Follow>,
    followerId : Common.UserId,
    followeeId : Common.UserId,
  ) : Bool {
    let key = followKey(followerId, followeeId);
    switch (follows.get(key)) {
      case (?_) {
        follows.remove(key);
        true;
      };
      case null { false };
    };
  };

  public func isFollowing(
    follows : Map.Map<Text, Types.Follow>,
    followerId : Common.UserId,
    followeeId : Common.UserId,
  ) : Bool {
    follows.containsKey(followKey(followerId, followeeId));
  };

  public func getFollowers(
    follows : Map.Map<Text, Types.Follow>,
    userId : Common.UserId,
  ) : [Text] {
    let result = List.empty<Text>();
    follows.forEach(func(_k, f) {
      if (f.followeeId == userId) { result.add(f.followerId) };
    });
    result.toArray();
  };

  public func getFollowing(
    follows : Map.Map<Text, Types.Follow>,
    userId : Common.UserId,
  ) : [Text] {
    let result = List.empty<Text>();
    follows.forEach(func(_k, f) {
      if (f.followerId == userId) { result.add(f.followeeId) };
    });
    result.toArray();
  };

  public func likeChapter(
    chapterLikes : Map.Map<Text, Types.ChapterLike>,
    userId : Common.UserId,
    comicId : Common.ComicId,
    chapterId : Common.ChapterId,
    now : Common.Timestamp,
  ) : Bool {
    let key = chapterLikeKey(userId, chapterId);
    switch (chapterLikes.get(key)) {
      case (?_) { false }; // already liked
      case null {
        let like : Types.ChapterLike = {
          userId = userId;
          chapterId = chapterId;
          comicId = comicId;
          createdAt = now;
        };
        chapterLikes.add(key, like);
        true;
      };
    };
  };

  public func unlikeChapter(
    chapterLikes : Map.Map<Text, Types.ChapterLike>,
    userId : Common.UserId,
    chapterId : Common.ChapterId,
  ) : Bool {
    let key = chapterLikeKey(userId, chapterId);
    switch (chapterLikes.get(key)) {
      case (?_) {
        chapterLikes.remove(key);
        true;
      };
      case null { false };
    };
  };

  public func isChapterLiked(
    chapterLikes : Map.Map<Text, Types.ChapterLike>,
    userId : Common.UserId,
    chapterId : Common.ChapterId,
  ) : Bool {
    chapterLikes.containsKey(chapterLikeKey(userId, chapterId));
  };

  public func getChapterLikeCount(
    chapterLikes : Map.Map<Text, Types.ChapterLike>,
    chapterId : Common.ChapterId,
  ) : Nat {
    var count = 0;
    chapterLikes.forEach(func(_k, like) {
      if (like.chapterId == chapterId) { count += 1 };
    });
    count;
  };

  public func addReply(
    commentReplies : Map.Map<Text, List.List<Types.CommentReply>>,
    nextReplyId : [var Nat],
    parentCommentId : Nat,
    userId : Common.UserId,
    username : Text,
    text : Text,
    now : Common.Timestamp,
  ) : Types.CommentReply {
    let key = debug_show(parentCommentId);
    let reply : Types.CommentReply = {
      id = nextReplyId[0];
      parentCommentId = parentCommentId;
      userId = userId;
      username = username;
      text = text;
      createdAt = now;
    };
    nextReplyId[0] += 1;
    switch (commentReplies.get(key)) {
      case (?list) { list.add(reply) };
      case null {
        let list = List.empty<Types.CommentReply>();
        list.add(reply);
        commentReplies.add(key, list);
      };
    };
    reply;
  };

  public func listReplies(
    commentReplies : Map.Map<Text, List.List<Types.CommentReply>>,
    parentCommentId : Nat,
  ) : [Types.CommentReply] {
    let key = debug_show(parentCommentId);
    switch (commentReplies.get(key)) {
      case (?list) { list.toArray() };
      case null { [] };
    };
  };
};
