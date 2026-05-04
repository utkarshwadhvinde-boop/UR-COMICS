import List "mo:core/List";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Types "../types/comics";
import Common "../types/common";
import CoreTypes "mo:core/Types";

module {
  public func toPublic(comic : Types.Comic) : Types.ComicPublic {
    {
      id = comic.id;
      title = comic.title;
      description = comic.description;
      author = comic.author;
      genres = comic.genres;
      coverUrl = comic.coverUrl;
      creatorId = comic.creatorId;
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
      imageKeys = chapter.imageKeys;
      imageOrder = chapter.imageOrder;
      creatorId = chapter.creatorId;
      chapterStatus = chapter.chapterStatus;
      publishedAt = chapter.publishedAt;
      createdAt = chapter.createdAt;
      updatedAt = chapter.updatedAt;
    };
  };

  // Returns the first published chapter (lowest chapterNumber) for a comic.
  // Used by Home page "Read" buttons to open the start of a series.
  // Returns the first published chapter (lowest chapterNumber) for a comic.
  // Used by Home page "Read" buttons to open the start of a series.
  public func getFirstPublishedChapter(
    chapters : List.List<Types.Chapter>,
    comicId : Common.ComicId,
  ) : ?Types.ChapterPublic {
    let published = chapters.filter(func(ch : Types.Chapter) : Bool {
      ch.comicId == comicId and ch.chapterStatus == #published and not ch.deleted
    });
    let sorted = published.sort(func(a : Types.Chapter, b : Types.Chapter) : Order.Order {
      if (a.chapterNumber < b.chapterNumber) { #less }
      else if (a.chapterNumber > b.chapterNumber) { #greater }
      else { #equal };
    });
    switch (sorted.first()) {
      case (?ch) { ?chapterToPublic(ch) };
      case null { null };
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
      creatorId = input.creatorId;
      var likesCount = 0;
      var viewsCount = 0;
      var isFeatured = input.isFeatured;
      var isTrending = input.isTrending;
      var isPremium = input.isPremium;
      var isPinned = input.isPinned;
      var ownerUploaded = input.ownerUploaded;
      var deleted = false;
      createdAt = now;
    };
    comics.add(comic);
    comic;
  };

  public func getComic(
    comics : List.List<Types.Comic>,
    id : Common.ComicId,
  ) : ?Types.ComicPublic {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id and not c.deleted })) {
      case (?c) { ?toPublic(c) };
      case null { null };
    };
  };

  public func listComics(comics : List.List<Types.Comic>) : [Types.ComicPublic] {
    comics.filter(func(c : Types.Comic) : Bool {
      not c.deleted and c.coverUrl != ""
    })
      .map<Types.Comic, Types.ComicPublic>(toPublic).toArray();
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
              creatorId = input.creatorId;
              var likesCount = c.likesCount;
              var viewsCount = c.viewsCount;
              var isFeatured = input.isFeatured;
              var isTrending = input.isTrending;
              var isPremium = input.isPremium;
              var isPinned = input.isPinned;
              var ownerUploaded = input.ownerUploaded;
              var deleted = c.deleted;
              createdAt = c.createdAt;
            };
          } else { c };
        });
        true;
      };
      case null { false };
    };
  };

  // Marks comic deleted=true (ownership verified by caller in mixin) and cascade-deletes all its chapters.
  // Returns #notFound if comic does not exist, #unauthorized if caller does not own it, #ok(true) on success.
  public func deleteComic(
    comics : List.List<Types.Comic>,
    chapters : List.List<Types.Chapter>,
    id : Common.ComicId,
    callerId : Text,
  ) : CoreTypes.Result<Bool, Types.ChapterError> {
    switch (comics.find(func(c : Types.Comic) : Bool { c.id == id and not c.deleted })) {
      case null { #err(#notFound) };
      case (?comic) {
        if (comic.creatorId != callerId) { return #err(#unauthorized) };
        // Permanently remove all chapters belonging to this comic
        let keptChapters = chapters.filter(func(ch : Types.Chapter) : Bool { ch.comicId != id });
        chapters.clear();
        chapters.append(keptChapters);
        // Permanently remove the comic record itself (rebuild the list without it)
        // We use retain pattern: replace list contents with filtered version
        let kept = comics.filter(func(c : Types.Comic) : Bool { c.id != id });
        comics.clear();
        comics.append(kept);
        #ok(true);
      };
    };
  };

  public func addChapter(
    chapters : List.List<Types.Chapter>,
    nextId : Nat,
    input : Types.ChapterInput,
    now : Common.Timestamp,
  ) : Types.Chapter {
    let imageCount = if (input.imageKeys.size() > 0) { input.imageKeys.size() } else { input.images.size() };
    let order : [Nat] = if (input.imageOrder.size() == 0) {
      Array.tabulate<Nat>(imageCount, func(i) { i });
    } else {
      // Validate all indices are within bounds
      let validOrder = input.imageOrder.all(func(idx : Nat) : Bool { idx < imageCount });
      if (not validOrder) { Array.tabulate<Nat>(imageCount, func(i) { i }) }
      else { input.imageOrder };
    };
    let chapter : Types.Chapter = {
      id = nextId;
      comicId = input.comicId;
      title = input.title;
      chapterNumber = input.chapterNumber;
      images = input.images;
      imageKeys = input.imageKeys;
      imageOrder = order;
      creatorId = input.creatorId;
      var chapterStatus = input.chapterStatus;
      var publishedAt = switch (input.chapterStatus) {
        case (#published) { ?now };
        case (#draft) { null };
      };
      var deleted = false;
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
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id and not ch.deleted })) {
      case (?ch) { ?chapterToPublic(ch) };
      case null { null };
    };
  };

  // publishedOnly: true => reader (only #published); false => creator dashboard (all)
  // publishedOnly: true => reader (only #published); false => creator dashboard (all)
  public func listChapters(
    chapters : List.List<Types.Chapter>,
    comicId : Common.ComicId,
    publishedOnly : Bool,
  ) : [Types.ChapterPublic] {
    let filtered = chapters.filter(func(ch : Types.Chapter) : Bool {
      if (ch.comicId != comicId) { return false };
      if (ch.deleted) { return false };
      if (publishedOnly) { ch.chapterStatus == #published } else { true };
    });
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
    callerId : Text,
    input : Types.ChapterInput,
    now : Common.Timestamp,
  ) : CoreTypes.Result<Bool, Types.ChapterError> {
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id })) {
      case null { #err(#notFound) };
      case (?ch) {
        if (ch.creatorId != callerId) { return #err(#unauthorized) };
        let imageCount = if (input.imageKeys.size() > 0) { input.imageKeys.size() } else { input.images.size() };
        let order : [Nat] = if (input.imageOrder.size() == 0) {
          ch.imageOrder;
        } else {
          let validOrder = input.imageOrder.all(func(idx : Nat) : Bool { idx < imageCount });
          if (not validOrder) { ch.imageOrder } else { input.imageOrder };
        };
        chapters.mapInPlace(func(c : Types.Chapter) : Types.Chapter {
          if (c.id == id) {
            {
              id = c.id;
              comicId = input.comicId;
              title = input.title;
              chapterNumber = input.chapterNumber;
              images = input.images;
              imageKeys = input.imageKeys;
              imageOrder = order;
              creatorId = input.creatorId;
              var chapterStatus = input.chapterStatus;
              var publishedAt = c.publishedAt;
              var deleted = c.deleted;
              createdAt = c.createdAt;
              var updatedAt = now;
            };
          } else { c };
        });
        #ok(true);
      };
    };
  };

  public func deleteChapter(
    _comics : List.List<Types.Comic>,
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
    callerId : Text,
  ) : CoreTypes.Result<Bool, Types.ChapterError> {
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id and not ch.deleted })) {
      case null { #err(#notFound) };
      case (?ch) {
        if (ch.creatorId != callerId) { return #err(#unauthorized) };
        // Permanently remove the chapter record
        let kept = chapters.filter(func(c : Types.Chapter) : Bool { c.id != id });
        chapters.clear();
        chapters.append(kept);
        #ok(true);
      };
    };
  };

  public func updateChapterOrder(
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
    callerId : Text,
    newImageOrder : [Nat],
    now : Common.Timestamp,
  ) : CoreTypes.Result<Bool, Types.ChapterError> {
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id })) {
      case null { #err(#notFound) };
      case (?ch) {
        if (ch.creatorId != callerId) { return #err(#unauthorized) };
        let imageCount = if (ch.imageKeys.size() > 0) { ch.imageKeys.size() } else { ch.images.size() };
        let validOrder = newImageOrder.all(func(idx : Nat) : Bool { idx < imageCount });
        let order = if (validOrder) { newImageOrder } else { ch.imageOrder };
        chapters.mapInPlace(func(c : Types.Chapter) : Types.Chapter {
          if (c.id == id) {
            {
              id = c.id;
              comicId = c.comicId;
              title = c.title;
              chapterNumber = c.chapterNumber;
              images = c.images;
              imageKeys = c.imageKeys;
              imageOrder = order;
              creatorId = c.creatorId;
              var chapterStatus = c.chapterStatus;
              var publishedAt = c.publishedAt;
              var deleted = c.deleted;
              createdAt = c.createdAt;
              var updatedAt = now;
            };
          } else { c };
        });
        #ok(true);
      };
    };
  };

  public func publishChapter(
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
    callerId : Text,
    now : Common.Timestamp,
  ) : CoreTypes.Result<Bool, Types.ChapterError> {
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id })) {
      case null { #err(#notFound) };
      case (?ch) {
        if (ch.creatorId != callerId) { return #err(#unauthorized) };
        // Validate images: prefer imageKeys, fall back to images
        let urls : [Text] = if (ch.imageKeys.size() > 0) { ch.imageKeys } else { ch.images };
        if (urls.size() == 0) { return #err(#invalidImages) };
        // All entries must be non-empty HTTPS URLs (not blob: or data: or empty)
        let allValid = urls.all(func(url : Text) : Bool {
          url.size() > 0
            and url.startsWith(#text "https://")
            and not url.startsWith(#text "blob:")
        });
        if (not allValid) { return #err(#invalidImages) };
        ch.chapterStatus := #published;
        ch.publishedAt := ?now;
        ch.updatedAt := now;
        #ok(true);
      };
    };
  };

  public func unpublishChapter(
    chapters : List.List<Types.Chapter>,
    id : Common.ChapterId,
    callerId : Text,
    now : Common.Timestamp,
  ) : CoreTypes.Result<Bool, Types.ChapterError> {
    switch (chapters.find(func(ch : Types.Chapter) : Bool { ch.id == id })) {
      case null { #err(#notFound) };
      case (?ch) {
        if (ch.creatorId != callerId) { return #err(#unauthorized) };
        ch.chapterStatus := #draft;
        ch.updatedAt := now;
        #ok(true);
      };
    };
  };

  // Removes orphan/broken records:
  // - chapters whose parent comic no longer exists
  // - chapters still marked deleted=true (legacy soft-delete entries)
  // - comics still marked deleted=true (legacy soft-delete entries)
  // - comics with empty coverUrl
  public func cleanupOrphans(
    comics : List.List<Types.Comic>,
    chapters : List.List<Types.Chapter>,
  ) {
    // Collect valid comic IDs (not deleted, have a cover)
    let validComicIds : [Common.ComicId] = comics
      .filter(func(c : Types.Comic) : Bool { not c.deleted and c.coverUrl != "" })
      .map<Types.Comic, Common.ComicId>(func(c) { c.id })
      .toArray();
    // Remove chapters with no valid parent or legacy deleted flag
    let keptChapters = chapters.filter(func(ch : Types.Chapter) : Bool {
      if (ch.deleted) { return false };
      validComicIds.any(func(cid : Common.ComicId) : Bool { cid == ch.comicId });
    });
    chapters.clear();
    chapters.append(keptChapters);
    // Remove comics with deleted flag or empty cover
    let keptComics = comics.filter(func(c : Types.Comic) : Bool {
      not c.deleted and c.coverUrl != ""
    });
    comics.clear();
    comics.append(keptComics);
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
  // Returns comics sorted by engagement score (likes*50 + views*10), excluding deleted
  // Returns comics sorted by engagement score (likes*50 + views*10), excluding deleted and comics with no published chapters
  public func getTrending(
    comics : List.List<Types.Comic>,
    chapters : List.List<Types.Chapter>,
    limit : Nat,
  ) : [Types.ComicPublic] {
    let active = comics.filter(func(c : Types.Comic) : Bool {
      if (c.deleted or c.coverUrl == "") { return false };
      // Must have at least one published chapter
      chapters.any(func(ch : Types.Chapter) : Bool {
        ch.comicId == c.id and ch.chapterStatus == #published and not ch.deleted
      });
    }).toArray();
    let scored = active.sort(func(a : Types.Comic, b : Types.Comic) : Order.Order {
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
