import List "mo:core/List";
import Time "mo:core/Time";
import ComicsLib "../lib/comics";
import Types "../types/comics";
import Common "../types/common";
import CoreTypes "mo:core/Types";

mixin (
  comics : List.List<Types.Comic>,
  chapters : List.List<Types.Chapter>,
  nextComicId : [var Nat],
  nextChapterId : [var Nat],
) {
  public func createComic(input : Types.ComicInput) : async Common.ComicId {
    let now = Time.now();
    let comic = ComicsLib.addComic(comics, nextComicId[0], input, now);
    nextComicId[0] += 1;
    comic.id;
  };

  public query func getComic(id : Common.ComicId) : async ?Types.ComicPublic {
    ComicsLib.getComic(comics, id);
  };

  public query func listComics() : async [Types.ComicPublic] {
    ComicsLib.listComics(comics);
  };

  public func updateComic(id : Common.ComicId, input : Types.ComicInput) : async Bool {
    let now = Time.now();
    ComicsLib.updateComic(comics, id, input, now);
  };

  public shared ({ caller }) func deleteComic(id : Common.ComicId) : async CoreTypes.Result<Bool, Types.ChapterError> {
    ComicsLib.deleteComic(comics, chapters, id, caller.toText());
  };

  // createChapter uses the IC caller as creatorId so publishChapter ownership check always succeeds
  public shared ({ caller }) func createChapter(input : Types.ChapterInput) : async Common.ChapterId {
    let now = Time.now();
    let callerIdInput : Types.ChapterInput = {
      title = input.title;
      chapterNumber = input.chapterNumber;
      imageKeys = input.imageKeys;
      imageOrder = input.imageOrder;
      // Use caller.toText() so publishChapter's ownership check matches
      creatorId = caller.toText();
      comicId = input.comicId;
      chapterStatus = input.chapterStatus;
      images = input.images;
    };
    let chapter = ComicsLib.addChapter(chapters, nextChapterId[0], callerIdInput, now);
    nextChapterId[0] += 1;
    chapter.id;
  };

  public query func getChapter(id : Common.ChapterId) : async ?Types.ChapterPublic {
    ComicsLib.getChapter(chapters, id);
  };

  // publishedOnly: true for readers (public), false for creator dashboard
  public query func listChapters(comicId : Common.ComicId, publishedOnly : Bool) : async [Types.ChapterPublic] {
    ComicsLib.listChapters(chapters, comicId, publishedOnly);
  };

  public shared ({ caller }) func updateChapter(id : Common.ChapterId, input : Types.ChapterInput) : async CoreTypes.Result<Bool, Types.ChapterError> {
    let now = Time.now();
    // Override creatorId with caller so ownership is always consistent
    let callerIdInput : Types.ChapterInput = {
      title = input.title;
      chapterNumber = input.chapterNumber;
      imageKeys = input.imageKeys;
      imageOrder = input.imageOrder;
      creatorId = caller.toText();
      comicId = input.comicId;
      chapterStatus = input.chapterStatus;
      images = input.images;
    };
    ComicsLib.updateChapter(chapters, id, caller.toText(), callerIdInput, now);
  };

  public shared ({ caller }) func deleteChapter(id : Common.ChapterId) : async CoreTypes.Result<Bool, Types.ChapterError> {
    ComicsLib.deleteChapter(comics, chapters, id, caller.toText());
  };

  public shared ({ caller }) func updateChapterOrder(id : Common.ChapterId, newImageOrder : [Nat]) : async CoreTypes.Result<Bool, Types.ChapterError> {
    let now = Time.now();
    ComicsLib.updateChapterOrder(chapters, id, caller.toText(), newImageOrder, now);
  };

  public shared ({ caller }) func publishChapter(id : Common.ChapterId) : async CoreTypes.Result<Bool, Types.ChapterError> {
    let now = Time.now();
    ComicsLib.publishChapter(chapters, id, caller.toText(), now);
  };

  public shared ({ caller }) func unpublishChapter(id : Common.ChapterId) : async CoreTypes.Result<Bool, Types.ChapterError> {
    let now = Time.now();
    ComicsLib.unpublishChapter(chapters, id, caller.toText(), now);
  };

  public func likeComic(id : Common.ComicId) : async Bool {
    ComicsLib.likeComic(comics, id);
  };

  public func unlikeComic(id : Common.ComicId) : async Bool {
    ComicsLib.unlikeComic(comics, id);
  };

  public func bookmarkComic(_id : Common.ComicId) : async Bool {
    // Bookmarks are tracked client-side (localStorage); backend just acknowledges
    true;
  };

  public func unbookmarkComic(_id : Common.ComicId) : async Bool {
    true;
  };

  public func viewComic(id : Common.ComicId) : async Bool {
    ComicsLib.viewComic(comics, id);
  };

  public query func getLikes(id : Common.ComicId) : async ?Nat {
    switch (ComicsLib.getComic(comics, id)) {
      case (?c) { ?c.likesCount };
      case null { null };
    };
  };

  public query func getViews(id : Common.ComicId) : async ?Nat {
    switch (ComicsLib.getComic(comics, id)) {
      case (?c) { ?c.viewsCount };
      case null { null };
    };
  };

  public query func getTrending(limit : Nat) : async [Types.ComicPublic] {
    ComicsLib.getTrending(comics, chapters, limit);
  };

  // Trigger orphan cleanup manually — also called automatically on canister init
  public func cleanupAllDeletedComics() : async () {
    ComicsLib.cleanupOrphans(comics, chapters);
  };

  // Returns the first published chapter for a comic — used by reader "Start Reading" buttons
  public query func getFirstPublishedChapter(comicId : Common.ComicId) : async ?Types.ChapterPublic {
    ComicsLib.getFirstPublishedChapter(chapters, comicId);
  };
};
