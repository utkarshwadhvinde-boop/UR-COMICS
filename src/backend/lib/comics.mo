import List "mo:core/List";
import Order "mo:core/Order";
import Types "../types/comics";
import Common "../types/common";

module {
  public func toPublic(comic : Types.Comic) : Types.ComicPublic {
    {
      id = comic.id;
      title = comic.title;
      description = comic.description;
      author = comic.author;
      genres = comic.genres;
      coverUrl = comic.coverUrl;
      likesCount = comic.likesCount;
      viewsCount = comic.viewsCount;
      isFeatured = comic.isFeatured;
      isTrending = comic.isTrending;
      isPremium = comic.isPremium;
      isPinned = comic.isPinned;
      ownerUploaded = comic.ownerUploaded;
      createdAt = comic.createdAt;
    };
  };

  public func chapterToPublic(chapter : Types.Chapter) : Types.ChapterPublic {
    {
      id = chapter.id;
      comicId = chapter.comicId;
      title = chapter.title;
      chapterNumber = chapter.chapterNumber;
      images = chapter.images;
      createdAt = chapter.createdAt;
      updatedAt = chapter.updatedAt;
    };
  };

  public func addComic(
    comics : List.List<Types.Comic>,
    nextId : Nat,
    input : Types.ComicInput,
    now : Common.Timestamp,
  ) : Types.Comic {
    let comic : Types.Comic = {
      id = nextId;
      title = input.title;
      description = input.description;
      author = input.author;
      genres = input.genres;
      coverUrl = input.coverUrl;
      var likesCount = 0;
      var viewsCount = 0;
      var isFeatured = input.isFeatured;
      var isTrending = input.isTrending;
      var isPremium = input.isPremium;
      var isPinned = input.isPinned;
      var ownerUploaded = input.ownerUploaded;
      createdAt = now;
    };
    comics.add(comic);
    comic;
  };

  public func getComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
  ) : ?Types.ComicPublic {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id })) {
      case (?c) { ?toPublic(c) };
      case null { null };
    };
  };

  public func listComics(comics : List.List<Types.Comic>) : [Types.ComicPublic] {
    comics.map<Types.Comic, Types.ComicPublic>(toPublic).toArray();
  };

  public func updateComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
    input : Types.ComicInput,
    _now : Common.Timestamp,
  ) : Bool {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id })) {
      case (?_comic) {
        comics.mapInPlace(func(c : Types.Comic) : Types.Comic {
          if (c.id == id) {
            {
              id = c.id;
              title = input.title;
              description = input.description;
              author = input.author;
              genres = input.genres;
              coverUrl = input.coverUrl;
              var likesCount = c.likesCount;
              var viewsCount = c.viewsCount;
              var isFeatured = input.isFeatured;
              var isTrending = input.isTrending;
              var isPremium = input.isPremium;
              var isPinned = input.isPinned;
              var ownerUploaded = input.ownerUploaded;
              createdAt = c.createdAt;
            };
          } else { c };
        });
        true;
      };
      case null { false };
    };
  };

  public func deleteComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
  ) : Bool {
    let sizeBefore = comics.size();
    let filtered = comics.filter(func(c : Types.Comic) : Bool { c.id != id });
    let sizeAfter = filtered.size();
    if (sizeBefore == sizeAfter) { return false };
    comics.clear();
    comics.append(filtered);
    true;
  };

  public func addChapter(
    chapters : List.List<Types.Chapter>,
    nextId : Nat,
    input : Types.ChapterInput,
    now : Common.Timestamp,
  ) : Types.Chapter {
    let chapter : Types.Chapter = {
      id = nextId;
      comicId = input.comicId;
      title = input.title;
      chapterNumber = input.chapterNumber;
      images = input.images;
      createdAt = now;
      var updatedAt = now;
    };
    chapters.add(chapter);
    chapter;
  };

  public func getChapter(
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
  ) : ?Types.ChapterPublic {
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id })) {
      case (?ch) { ?chapterToPublic(ch) };
      case null { null };
    };
  };

  public func listChapters(
    chapters : List.List<Types.Chapter>,
    comicId : Common.ComicId,
  ) : [Types.ChapterPublic] {
    let filtered = chapters.filter(func(ch : Types.Chapter) : Bool { ch.comicId == comicId });
    let sorted = filtered.sort(func(a : Types.Chapter, b : Types.Chapter) : Order.Order {
      if (a.chapterNumber < b.chapterNumber) { #less }
      else if (a.chapterNumber > b.chapterNumber) { #greater }
      else { #equal };
    });
    sorted.map<Types.Chapter, Types.ChapterPublic>(chapterToPublic).toArray();
  };

  public func updateChapter(
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
    input : Types.ChapterInput,
    now : Common.Timestamp,
  ) : Bool {
    var found = false;
    chapters.mapInPlace(func(ch : Types.Chapter) : Types.Chapter {
      if (ch.id == id) {
        found := true;
        {
          id = ch.id;
          comicId = input.comicId;
          title = input.title;
          chapterNumber = input.chapterNumber;
          images = input.images;
          createdAt = ch.createdAt;
          var updatedAt = now;
        };
      } else { ch };
    });
    found;
  };

  public func deleteChapter(
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
  ) : Bool {
    let sizeBefore = chapters.size();
    let filtered = chapters.filter(func(ch : Types.Chapter) : Bool { ch.id != id });
    let sizeAfter = filtered.size();
    if (sizeBefore == sizeAfter) { return false };
    chapters.clear();
    chapters.append(filtered);
    true;
  };

  public func likeComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
  ) : Bool {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id })) {
      case (?comic) {
        comic.likesCount += 1;
        true;
      };
      case null { false };
    };
  };

  public func unlikeComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
  ) : Bool {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id })) {
      case (?comic) {
        if (comic.likesCount > 0) { comic.likesCount -= 1 };
        true;
      };
      case null { false };
    };
  };

  public func viewComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
  ) : Bool {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id })) {
      case (?comic) {
        comic.viewsCount += 1;
        true;
      };
      case null { false };
    };
  };

  // Returns comics sorted by engagement score (likes*50 + views*10)
  public func getTrending(
    comics : List.List<Types.Comic>,
    limit : Nat,
  ) : [Types.ComicPublic] {
    let all = comics.toArray();
    let scored = all.sort(func(a : Types.Comic, b : Types.Comic) : Order.Order {
      let scoreA = a.likesCount * 50 + a.viewsCount * 10;
      let scoreB = b.likesCount * 50 + b.viewsCount * 10;
      if (scoreA > scoreB) { #less }
      else if (scoreA < scoreB) { #greater }
      else { #equal };
    });
    let taken = if (limit == 0 or limit >= scored.size()) {
      scored;
    } else {
      scored.sliceToArray(0, limit);
    };
    taken.map<Types.Comic, Types.ComicPublic>(toPublic);
  };
};
