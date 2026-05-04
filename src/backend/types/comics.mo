import Common "common";

module {
  public type ChapterStatus = { #draft; #published };
  public type ChapterError = { #notFound; #unauthorized; #invalidImages };


  public type Comic = {
    id : Common.ComicId;
    title : Text;
    description : Text;
    author : Text;
    genres : [Text];
    coverUrl : Text;
    creatorId : Common.UserId;
    var likesCount : Nat;
    var viewsCount : Nat;
    var isFeatured : Bool;
    var isTrending : Bool;
    var isPremium : Bool;
    var isPinned : Bool;
    var ownerUploaded : Bool;
    var deleted : Bool;
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
    creatorId : Common.UserId;
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
    images : [Text]; // legacy image URLs (kept for backward compat)
    imageKeys : [Text]; // object-storage asset keys (permanent, cross-device)
    imageOrder : [Nat]; // explicit ordering of image indices
    creatorId : Common.UserId;
    var chapterStatus : ChapterStatus;
    var publishedAt : ?Common.Timestamp;
    var deleted : Bool;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type ChapterPublic = {
    id : Common.ChapterId;
    comicId : Common.ComicId;
    title : Text;
    chapterNumber : Nat;
    images : [Text];
    imageKeys : [Text]; // object-storage asset keys
    imageOrder : [Nat];
    creatorId : Common.UserId;
    chapterStatus : ChapterStatus;
    publishedAt : ?Common.Timestamp;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type ComicInput = {
    title : Text;
    description : Text;
    author : Text;
    genres : [Text];
    coverUrl : Text;
    creatorId : Common.UserId;
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
    imageKeys : [Text]; // object-storage asset keys
    imageOrder : [Nat];
    creatorId : Common.UserId;
    chapterStatus : ChapterStatus;
  };
};
