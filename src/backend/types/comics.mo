import Common "common";

module {
  public type Comic = {
    id : Common.ComicId;
    title : Text;
    description : Text;
    author : Text;
    genres : [Text];
    coverUrl : Text;
    var likesCount : Nat;
    var viewsCount : Nat;
    var isFeatured : Bool;
    var isTrending : Bool;
    var isPremium : Bool;
    var isPinned : Bool;
    var ownerUploaded : Bool;
    createdAt : Common.Timestamp;
  };

  // Shared (immutable) version for API boundary
  public type ComicPublic = {
    id : Common.ComicId;
    title : Text;
    description : Text;
    author : Text;
    genres : [Text];
    coverUrl : Text;
    likesCount : Nat;
    viewsCount : Nat;
    isFeatured : Bool;
    isTrending : Bool;
    isPremium : Bool;
    isPinned : Bool;
    ownerUploaded : Bool;
    createdAt : Common.Timestamp;
  };

  public type Chapter = {
    id : Common.ChapterId;
    comicId : Common.ComicId;
    title : Text;
    chapterNumber : Nat;
    images : [Text]; // image URLs
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type ChapterPublic = {
    id : Common.ChapterId;
    comicId : Common.ComicId;
    title : Text;
    chapterNumber : Nat;
    images : [Text];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type ComicInput = {
    title : Text;
    description : Text;
    author : Text;
    genres : [Text];
    coverUrl : Text;
    isFeatured : Bool;
    isTrending : Bool;
    isPremium : Bool;
    isPinned : Bool;
    ownerUploaded : Bool;
  };

  public type ChapterInput = {
    comicId : Common.ComicId;
    title : Text;
    chapterNumber : Nat;
    images : [Text];
  };
};
