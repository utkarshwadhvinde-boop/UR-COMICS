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
};
