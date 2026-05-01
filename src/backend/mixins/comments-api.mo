import List "mo:core/List";
import Time "mo:core/Time";
import CommentsLib "../lib/comments";
import UserTypes "../types/users";
import Common "../types/common";

mixin (
  comments : List.List<UserTypes.Comment>,
  nextCommentId : [var Nat],
) {
  public func addComment(
    userId : Common.UserId,
    comicId : Common.ComicId,
    chapterId : ?Common.ChapterId,
    text : Text,
  ) : async Nat {
    let now = Time.now();
    let comment = CommentsLib.addComment(comments, nextCommentId[0], userId, comicId, chapterId, text, now);
    nextCommentId[0] += 1;
    comment.id;
  };

  public query func listComments(comicId : Common.ComicId) : async [UserTypes.Comment] {
    CommentsLib.listComments(comments, comicId);
  };
};
