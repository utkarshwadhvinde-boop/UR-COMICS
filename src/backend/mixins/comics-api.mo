import List "mo:core/List";
import Time "mo:core/Time";
import ComicsLib "../lib/comics";
import Types "../types/comics";
import Common "../types/common";

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

  public func deleteComic(id : Common.ComicId) : async Bool {
    ComicsLib.deleteComic(comics, id);
  };

  public func createChapter(input : Types.ChapterInput) : async Common.ChapterId {
    let now = Time.now();
    let chapter = ComicsLib.addChapter(chapters, nextChapterId[0], input, now);
    nextChapterId[0] += 1;
    chapter.id;
  };

  public query func getChapter(id : Common.ChapterId) : async ?Types.ChapterPublic {
    ComicsLib.getChapter(chapters, id);
  };

  public query func listChapters(comicId : Common.ComicId) : async [Types.ChapterPublic] {
    ComicsLib.listChapters(chapters, comicId);
  };

  public func updateChapter(id : Common.ChapterId, input : Types.ChapterInput) : async Bool {
    let now = Time.now();
    ComicsLib.updateChapter(chapters, id, input, now);
  };

  public func deleteChapter(id : Common.ChapterId) : async Bool {
    ComicsLib.deleteChapter(chapters, id);
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
    ComicsLib.getTrending(comics, limit);
  };
};
