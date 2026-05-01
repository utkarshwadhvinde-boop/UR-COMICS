import List "mo:core/List";
import Types "../types/users";
import Common "../types/common";

module {
  public func addComment(
    comments : List.List<Types.Comment>,
    nextId : Nat,
    userId : Common.UserId,
    comicId : Common.ComicId,
    chapterId : ?Common.ChapterId,
    text : Text,
    now : Common.Timestamp,
  ) : Types.Comment {
    let comment : Types.Comment = {
      id = nextId;
      userId = userId;
      comicId = comicId;
      chapterId = chapterId;
      text = text;
      createdAt = now;
    };
    comments.add(comment);
    comment;
  };

  public func listComments(
    comments : List.List<Types.Comment>,
    comicId : Common.ComicId,
  ) : [Types.Comment] {
    comments.filter(func(c : Types.Comment) : Bool { c.comicId == comicId }).toArray();
  };
};
